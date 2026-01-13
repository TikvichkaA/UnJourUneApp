/**
 * Veille ARS - Script d'alertes email quotidiennes
 *
 * Ce script scanne les flux RSS de toutes les ARS de France,
 * filtre les appels à projets liés aux soins palliatifs,
 * et envoie un digest par email aux abonnés SubVeille.
 *
 * Configuration requise:
 * - RESEND_API_KEY: clé API Resend (gratuit: https://resend.com)
 * - SUPABASE_SERVICE_KEY: clé service Supabase (pour récupérer les abonnés)
 * - ALERT_EMAIL: adresse email de fallback si pas d'abonnés
 *
 * Utilisation:
 * - Manuellement: node veille-ars-mailer.js
 * - Via GitHub Actions: automatique chaque jour à 8h
 */

require('dotenv').config({ path: '../server/.env' });
const https = require('https');
const http = require('http');
const { DOMParser } = require('@xmldom/xmldom');
const { createClient } = require('@supabase/supabase-js');

// Configuration
const CONFIG = {
    resendApiKey: process.env.RESEND_API_KEY,
    alertEmail: process.env.ALERT_EMAIL || 'votre@email.com',
    fromEmail: 'Veille ARS <veille@resend.dev>',
    supabaseUrl: process.env.SUPABASE_URL || 'https://zstisdptwxynshftqdln.supabase.co',
    supabaseServiceKey: process.env.SUPABASE_SERVICE_KEY,
    keywords: [
        'palliatif', 'palliative', 'fin de vie', 'accompagnement',
        'soins de support', 'douleur chronique', 'HAD', 'EMSP', 'USP', 'LISP',
        'soins palliatifs', 'unité de soins palliatifs', 'équipe mobile'
    ],
    maxAgeDays: 7
};

// Client Supabase admin (avec service key pour bypass RLS)
let supabaseAdmin = null;
if (CONFIG.supabaseServiceKey) {
    supabaseAdmin = createClient(CONFIG.supabaseUrl, CONFIG.supabaseServiceKey, {
        auth: { persistSession: false }
    });
}

/**
 * Récupère tous les abonnés actifs à la veille ARS
 */
async function fetchSubscribers() {
    if (!supabaseAdmin) {
        console.log('   ⚠️  Pas de SUPABASE_SERVICE_KEY - envoi à ALERT_EMAIL uniquement');
        return [{ email: CONFIG.alertEmail }];
    }

    try {
        // Récupérer les subscriptions actives
        const { data: subscriptions, error: subError } = await supabaseAdmin
            .from('subscriptions')
            .select('user_id')
            .eq('type', 'veille_ars')
            .eq('is_active', true);

        if (subError) throw subError;

        if (!subscriptions || subscriptions.length === 0) {
            console.log('   Aucun abonné actif - envoi à ALERT_EMAIL');
            return [{ email: CONFIG.alertEmail }];
        }

        // Récupérer les emails des utilisateurs via l'API admin
        const subscribers = [];
        for (const sub of subscriptions) {
            try {
                const { data: { user }, error: userError } = await supabaseAdmin.auth.admin.getUserById(sub.user_id);
                if (!userError && user?.email) {
                    subscribers.push({ email: user.email });
                }
            } catch (e) {
                console.log(`   ⚠️  Impossible de récupérer l'email pour user ${sub.user_id}`);
            }
        }

        if (subscribers.length === 0) {
            console.log('   Aucun email récupéré - envoi à ALERT_EMAIL');
            return [{ email: CONFIG.alertEmail }];
        }

        console.log(`   ${subscribers.length} abonné(s) trouvé(s)`);
        return subscribers;

    } catch (error) {
        console.error('   Erreur fetch subscribers:', error.message);
        return [{ email: CONFIG.alertEmail }];
    }
}

// Liste des ARS
const ARS_LIST = [
    { id: 'auvergne-rhone-alpes', name: 'Auvergne-Rhône-Alpes' },
    { id: 'bourgogne-franche-comte', name: 'Bourgogne-Franche-Comté' },
    { id: 'bretagne', name: 'Bretagne' },
    { id: 'centre-val-de-loire', name: 'Centre-Val de Loire' },
    { id: 'corse', name: 'Corse' },
    { id: 'grand-est', name: 'Grand Est' },
    { id: 'guadeloupe', name: 'Guadeloupe' },
    { id: 'guyane', name: 'Guyane' },
    { id: 'hauts-de-france', name: 'Hauts-de-France' },
    { id: 'iledefrance', name: 'Île-de-France' },
    { id: 'martinique', name: 'Martinique' },
    { id: 'mayotte', name: 'Mayotte' },
    { id: 'normandie', name: 'Normandie' },
    { id: 'nouvelle-aquitaine', name: 'Nouvelle-Aquitaine' },
    { id: 'occitanie', name: 'Occitanie' },
    { id: 'pays-de-la-loire', name: 'Pays de la Loire' },
    { id: 'provence-alpes-cote-dazur', name: "Provence-Alpes-Côte d'Azur" },
    { id: 'la-reunion', name: 'La Réunion' },
    { id: 'national', name: 'National', isNational: true }
];

// Fetch une URL avec timeout
function fetchUrl(url, timeout = 15000) {
    return new Promise((resolve, reject) => {
        const protocol = url.startsWith('https') ? https : http;

        const req = protocol.get(url, { timeout }, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => resolve(data));
        });

        req.on('error', reject);
        req.on('timeout', () => {
            req.destroy();
            reject(new Error('Timeout'));
        });
    });
}

// Parser un flux RSS
function parseRSS(xmlText, ars) {
    const items = [];

    try {
        const parser = new DOMParser();
        const doc = parser.parseFromString(xmlText, 'text/xml');
        const itemElements = doc.getElementsByTagName('item');

        const now = new Date();
        const maxAge = new Date(now - CONFIG.maxAgeDays * 24 * 60 * 60 * 1000);

        for (let i = 0; i < itemElements.length; i++) {
            const item = itemElements[i];

            const getTagContent = (tagName) => {
                const el = item.getElementsByTagName(tagName)[0];
                return el ? el.textContent : '';
            };

            const title = getTagContent('title');
            const link = getTagContent('link');
            const description = getTagContent('description').replace(/<[^>]*>/g, '');
            const pubDateStr = getTagContent('pubDate');
            const pubDate = pubDateStr ? new Date(pubDateStr) : null;

            // Filtrer par date
            if (pubDate && pubDate < maxAge) continue;

            // Vérifier les mots-clés
            const fullText = `${title} ${description}`.toLowerCase();
            const matchedKeywords = CONFIG.keywords.filter(kw =>
                fullText.includes(kw.toLowerCase())
            );

            if (matchedKeywords.length > 0) {
                items.push({
                    title,
                    link,
                    description: description.slice(0, 300),
                    pubDate,
                    ars,
                    matchedKeywords
                });
            }
        }
    } catch (error) {
        console.error(`Erreur parsing RSS ${ars.name}:`, error.message);
    }

    return items;
}

// Scanner une ARS
async function scanARS(ars) {
    const baseUrl = ars.isNational
        ? 'https://www.ars.sante.fr'
        : `https://www.${ars.id}.ars.sante.fr`;

    const feedUrl = `${baseUrl}/rss.xml?type=ars_appel_projet_ou_candidature`;

    try {
        console.log(`  Scan ${ars.name}...`);
        const xmlText = await fetchUrl(feedUrl);
        return parseRSS(xmlText, ars);
    } catch (error) {
        console.log(`  ❌ ${ars.name}: ${error.message}`);
        return [];
    }
}

// URL de la veille ARS (à adapter selon le déploiement)
const VEILLE_URL = 'https://music2music.music2music.workers.dev/10/veille-ars.html';

// Générer le HTML de l'email (version détaillée)
function generateEmailHTML(items, stats) {
    if (items.length === 0) {
        return null; // Pas d'email si rien de nouveau
    }

    const itemsHTML = items.map(item => {
        const dateStr = item.pubDate
            ? item.pubDate.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
            : '';
        const keywords = item.matchedKeywords.slice(0, 3).join(', ');

        return `
        <div style="border: 1px solid #e5e7eb; border-radius: 8px; padding: 16px; margin-bottom: 12px; background: #fafafa;">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
                <span style="background: #7c3aed; color: white; padding: 2px 8px; border-radius: 4px; font-size: 11px; font-weight: 600;">
                    ${item.ars.name}
                </span>
                <span style="color: #666; font-size: 12px;">${dateStr}</span>
            </div>
            <h3 style="margin: 0 0 8px; font-size: 14px; color: #1a1a1a; line-height: 1.4;">
                <a href="${item.link}" style="color: #1a1a1a; text-decoration: none;">${item.title}</a>
            </h3>
            <p style="margin: 0 0 8px; font-size: 13px; color: #666; line-height: 1.5;">
                ${item.description}...
            </p>
            <div style="font-size: 11px; color: #7c3aed;">
                🏷️ ${keywords}
            </div>
        </div>`;
    }).join('');

    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 20px; background: #f5f5f5;">
    <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
        <div style="background: linear-gradient(135deg, #7c3aed, #5b21b6); color: white; padding: 24px; text-align: center;">
            <h1 style="margin: 0; font-size: 20px;">🔔 Veille Soins Palliatifs</h1>
            <p style="margin: 8px 0 0; opacity: 0.9; font-size: 14px;">
                ${items.length} appel${items.length > 1 ? 's' : ''} à projets détecté${items.length > 1 ? 's' : ''}
            </p>
        </div>

        <div style="padding: 24px;">
            <p style="margin: 0 0 16px; color: #666; font-size: 14px;">
                📊 ${stats.scanned} ARS scannées • 🔍 ${CONFIG.keywords.length} mots-clés surveillés
            </p>

            ${itemsHTML}

            <div style="text-align: center; margin-top: 20px;">
                <a href="${VEILLE_URL}" style="display: inline-block; background: #7c3aed; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600;">
                    Voir tous les appels →
                </a>
            </div>
        </div>

        <div style="padding: 16px; background: #f9fafb; text-align: center; font-size: 12px; color: #999;">
            Veille automatique SubVeille • <a href="${VEILLE_URL}" style="color: #7c3aed;">Gérer mes alertes</a>
        </div>
    </div>
</body>
</html>`;
}

// Envoyer l'email via Resend
async function sendEmail(html, itemCount, recipientEmail) {
    if (!CONFIG.resendApiKey) {
        console.log('\n⚠️  Pas de clé API Resend configurée.');
        console.log('   Pour activer les emails, ajoutez RESEND_API_KEY dans .env');
        console.log('   Créez un compte gratuit sur https://resend.com\n');
        return false;
    }

    const subject = itemCount > 0
        ? `🔔 ${itemCount} nouvel${itemCount > 1 ? 's' : ''} appel${itemCount > 1 ? 's' : ''} à projet - Soins Palliatifs`
        : '✅ Veille Soins Palliatifs - Aucune nouveauté';

    const payload = JSON.stringify({
        from: CONFIG.fromEmail,
        to: recipientEmail,
        subject,
        html
    });

    return new Promise((resolve) => {
        const req = https.request({
            hostname: 'api.resend.com',
            path: '/emails',
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${CONFIG.resendApiKey}`,
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(payload)
            }
        }, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                if (res.statusCode === 200) {
                    console.log(`   ✅ Email envoyé à ${recipientEmail}`);
                    resolve(true);
                } else {
                    console.log(`   ❌ Erreur envoi à ${recipientEmail}: ${data}`);
                    resolve(false);
                }
            });
        });

        req.on('error', (err) => {
            console.log(`   ❌ Erreur réseau: ${err.message}`);
            resolve(false);
        });

        req.write(payload);
        req.end();
    });
}

// Programme principal
async function main() {
    console.log('\n========================================');
    console.log('  🔔 Veille ARS - Soins Palliatifs');
    console.log('========================================\n');
    console.log(`📅 ${new Date().toLocaleString('fr-FR')}`);
    console.log(`🔍 Mots-clés: ${CONFIG.keywords.length}`);
    console.log(`📆 Période: ${CONFIG.maxAgeDays} derniers jours\n`);

    // Récupérer les abonnés
    console.log('Récupération des abonnés...');
    const subscribers = await fetchSubscribers();
    console.log(`📧 Destinataires: ${subscribers.length}\n`);

    console.log('Scan des ARS en cours...\n');

    let allItems = [];
    let scannedCount = 0;

    for (const ars of ARS_LIST) {
        const items = await scanARS(ars);
        allItems.push(...items);
        scannedCount++;
    }

    // Trier par date
    allItems.sort((a, b) => (b.pubDate || 0) - (a.pubDate || 0));

    console.log(`\n📊 Résultats:`);
    console.log(`   ${scannedCount} ARS scannées`);
    console.log(`   ${allItems.length} appels à projets trouvés\n`);

    if (allItems.length > 0) {
        console.log('Appels trouvés:');
        allItems.forEach(item => {
            console.log(`  • [${item.ars.name}] ${item.title.slice(0, 60)}...`);
        });
        console.log('');
    }

    // Générer l'email
    const emailHTML = generateEmailHTML(allItems, { scanned: scannedCount });

    if (!emailHTML) {
        console.log('Aucun résultat - pas d\'email envoyé');
        console.log('\n========================================\n');
        return;
    }

    // Envoyer aux abonnés
    console.log('Envoi des emails...');
    let successCount = 0;
    for (const subscriber of subscribers) {
        const success = await sendEmail(emailHTML, allItems.length, subscriber.email);
        if (success) successCount++;
    }

    console.log(`\n✅ ${successCount}/${subscribers.length} email(s) envoyé(s)`);
    console.log('\n========================================\n');
}

// Exécuter
main().catch(console.error);
