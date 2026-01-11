/**
 * Script d'import des déclarations d'intérêts depuis la HATVP
 * Source: https://www.hatvp.fr/open-data/
 */

import { createClient } from '@supabase/supabase-js';
import fetch from 'node-fetch';
import { createWriteStream } from 'fs';
import { pipeline } from 'stream/promises';
import { readFile, unlink } from 'fs/promises';
import { parseString } from 'xml2js';
import { promisify } from 'util';
import 'dotenv/config';

const parseXML = promisify(parseString);

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
);

const HATVP_CSV = 'https://www.hatvp.fr/livraison/opendata/liste.csv';

// Cache des politiciens
const politicianCache = new Map();

async function loadPoliticianCache() {
    console.log('Chargement des politiciens...');

    const { data, error } = await supabase
        .from('politicians')
        .select('id, first_name, last_name, external_id');

    if (error) {
        console.error('Erreur:', error.message);
        return;
    }

    for (const pol of data) {
        // Index par nom normalisé
        const key = normalizeString(pol.first_name) + '_' + normalizeString(pol.last_name);
        politicianCache.set(key, pol);

        // Index par ID AN si disponible
        if (pol.external_id?.startsWith('an_PA')) {
            const anId = pol.external_id.replace('an_PA', '');
            politicianCache.set('an_' + anId, pol);
        }
    }

    console.log(`${data.length} politiciens chargés`);
}

function normalizeString(str) {
    if (!str) return '';
    return str
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z]/g, '');
}

async function downloadCSV() {
    console.log('Téléchargement de la liste HATVP...');

    const response = await fetch(HATVP_CSV);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const text = await response.text();
    return text;
}

function parseCSVLine(line) {
    const result = [];
    let current = '';
    let inQuotes = false;

    for (const char of line) {
        if (char === '"') {
            inQuotes = !inQuotes;
        } else if (char === ';' && !inQuotes) {
            result.push(current);
            current = '';
        } else {
            current += char;
        }
    }
    result.push(current);

    return result;
}

async function fetchDeclarationXML(xmlPath) {
    const url = `https://www.hatvp.fr/livraison/merge/${xmlPath}`;

    try {
        const response = await fetch(url);
        if (!response.ok) return null;

        const text = await response.text();
        const data = await parseXML(text);
        return data;
    } catch (e) {
        return null;
    }
}

async function processDeclaration(row, headers) {
    const getValue = (name) => row[headers.indexOf(name)] || '';

    const typeMandat = getValue('type_mandat');
    const typeDoc = getValue('type_document');

    // On ne traite que les députés et leurs déclarations d'intérêts
    if (typeMandat !== 'depute') return null;
    if (!['dia', 'diam', 'di'].includes(typeDoc)) return null; // Déclarations d'intérêts

    const prenom = getValue('prenom');
    const nom = getValue('nom');
    const openDataFile = getValue('open_data');
    const anId = getValue('id_origine');

    // Trouver le politicien
    let politician = null;

    // D'abord par ID AN
    if (anId) {
        politician = politicianCache.get('an_' + anId);
    }

    // Sinon par nom
    if (!politician) {
        const key = normalizeString(prenom) + '_' + normalizeString(nom);
        politician = politicianCache.get(key);
    }

    if (!politician || !openDataFile) return null;

    return {
        politicianId: politician.id,
        politicianName: `${prenom} ${nom}`,
        xmlFile: openDataFile,
        type: typeDoc
    };
}

async function extractInterestsFromXML(xmlData) {
    // Structure des déclarations d'intérêts HATVP
    const interests = {
        companies: [],      // Participations financières
        activities: [],     // Activités professionnelles
        mandates: [],       // Autres mandats
        participations: []  // Participations aux organes dirigeants
    };

    try {
        const declaration = xmlData?.declaration;
        if (!declaration) return interests;

        // Extraire les participations financières
        const participations = declaration.participation || [];
        for (const part of participations) {
            if (part.denominationSociete?.[0]) {
                interests.companies.push({
                    name: part.denominationSociete[0],
                    sector: part.secteurActivite?.[0] || 'Non précisé',
                    role: part.typeParticipation?.[0] || 'Participation',
                    stake: part.nombreParts?.[0] || null
                });
            }
        }

        // Extraire les activités professionnelles
        const activites = declaration.activite || [];
        for (const act of activites) {
            if (act.employeur?.[0]) {
                interests.activities.push({
                    employer: act.employeur[0],
                    description: act.descriptionActivite?.[0] || '',
                    remuneration: act.remunerationPercue?.[0] || null
                });
            }
        }

        // Extraire les autres mandats électifs
        const mandats = declaration.mandat || [];
        for (const mandat of mandats) {
            if (mandat.descriptionMandat?.[0]) {
                interests.mandates.push({
                    description: mandat.descriptionMandat[0],
                    collectivite: mandat.collectiviteTerritoriale?.[0] || ''
                });
            }
        }

    } catch (e) {
        // Ignorer les erreurs de parsing
    }

    return interests;
}

async function saveCompanyInterests(politicianId, companies) {
    let saved = 0;

    for (const company of companies) {
        // Créer ou trouver l'entreprise
        let companyId;

        const { data: existing } = await supabase
            .from('companies')
            .select('id')
            .eq('name', company.name)
            .limit(1)
            .single();

        if (existing) {
            companyId = existing.id;
        } else {
            const { data: inserted, error } = await supabase
                .from('companies')
                .insert({
                    name: company.name,
                    sector: company.sector,
                    description: `Déclaré par un député - ${company.role}`
                })
                .select('id')
                .single();

            if (error) continue;
            companyId = inserted.id;
        }

        // Lier le politicien à l'entreprise
        const { error: linkError } = await supabase
            .from('politician_companies')
            .upsert({
                politician_id: politicianId,
                company_id: companyId,
                role: company.role,
                stake_percentage: company.stake ? parseFloat(company.stake) : null,
                source: 'hatvp'
            }, { onConflict: 'politician_id,company_id' });

        if (!linkError) saved++;
    }

    return saved;
}

async function main() {
    console.log('=== Import des déclarations HATVP ===\n');

    try {
        await loadPoliticianCache();

        const csvContent = await downloadCSV();
        const lines = csvContent.split('\n');
        const headers = parseCSVLine(lines[0]);

        console.log(`\n${lines.length - 1} entrées dans le fichier HATVP`);

        // Filtrer les déclarations de députés
        const deputeDeclarations = [];

        for (let i = 1; i < lines.length; i++) {
            if (!lines[i].trim()) continue;

            const row = parseCSVLine(lines[i]);
            const decl = await processDeclaration(row, headers);

            if (decl) {
                // Éviter les doublons (garder la plus récente)
                const existing = deputeDeclarations.find(d => d.politicianId === decl.politicianId);
                if (!existing) {
                    deputeDeclarations.push(decl);
                }
            }
        }

        console.log(`${deputeDeclarations.length} déclarations de députés trouvées\n`);

        // Traiter chaque déclaration
        const limit = parseInt(process.argv[2]) || 50;
        let processed = 0;
        let totalCompanies = 0;

        for (const decl of deputeDeclarations.slice(0, limit)) {
            try {
                // Télécharger et parser le XML
                const xmlData = await fetchDeclarationXML(decl.xmlFile);

                if (xmlData) {
                    const interests = await extractInterestsFromXML(xmlData);

                    if (interests.companies.length > 0) {
                        const saved = await saveCompanyInterests(decl.politicianId, interests.companies);
                        totalCompanies += saved;
                        console.log(`${decl.politicianName}: ${saved} participations`);
                    }
                }

                processed++;
                if (processed % 20 === 0) {
                    console.log(`\n${processed} déclarations traitées...\n`);
                }

            } catch (e) {
                // Ignorer les erreurs individuelles
            }
        }

        console.log(`\n=== Import terminé ===`);
        console.log(`Déclarations traitées: ${processed}`);
        console.log(`Participations importées: ${totalCompanies}`);

    } catch (err) {
        console.error('Erreur:', err);
        process.exit(1);
    }
}

main();
