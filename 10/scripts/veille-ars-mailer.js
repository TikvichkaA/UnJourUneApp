/**
 * Veille ARS - Script d'alertes email quotidiennes
 *
 * Ce script scanne les flux RSS de toutes les ARS de France,
 * filtre les appels à projets liés aux soins palliatifs,
 * et envoie un digest par email avec les nouveautés.
 *
 * Configuration requise:
 * - RESEND_API_KEY: clé API Resend (gratuit: https://resend.com)
 * - ALERT_EMAIL: adresse email destinataire
 *
 * Utilisation:
 * - Manuellement: node veille-ars-mailer.js
 * - Automatiquement: ajouter au cron (Linux) ou Task Scheduler (Windows)
 *   Exemple cron: 0 8 * * * cd /path/to/scripts && node veille-ars-mailer.js
 */

require('dotenv').config({ path: '../server/.env' });
const https = require('https');
const http = require('http');
const { DOMParser } = require('@xmldom/xmldom');

// Configuration
const CONFIG = {
    resendApiKey: process.env.RESEND_API_KEY,
    alertEmail: process.env.ALERT_EMAIL || 'votre@email.com',
    fromEmail: 'Veille ARS <veille@resend.dev>', // Email par défaut Resend
    keywords: [
        'palliatif', 'palliative', 'fin de vie', 'accompagnement',
        'soins de support', 'douleur chronique', 'HAD', 'EMSP', 'USP', 'LISP',
        'soins palliatifs', 'unité de soins palliatifs', 'équipe mobile'
    ],
    maxAgeDays: 7 // Ne récupérer que les AAP des 7 derniers jours
};

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
async function sendEmail(html, itemCount) {
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
        to: CONFIG.alertEmail,
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
                    console.log(`✅ Email envoyé à ${CONFIG.alertEmail}`);
                    resolve(true);
                } else {
                    console.log(`❌ Erreur envoi email: ${data}`);
                    resolve(false);
                }
            });
        });

        req.on('error', (err) => {
            console.log(`❌ Erreur réseau: ${err.message}`);
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
    console.log(`📧 Destinataire: ${CONFIG.alertEmail}`);
    console.log(`🔍 Mots-clés: ${CONFIG.keywords.length}`);
    console.log(`📆 Période: ${CONFIG.maxAgeDays} derniers jours\n`);

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

    // Générer et envoyer l'email
    const emailHTML = generateEmailHTML(allItems, { scanned: scannedCount });
    await sendEmail(emailHTML, allItems.length);

    console.log('\n========================================\n');
}

// Exécuter
main().catch(console.error);
