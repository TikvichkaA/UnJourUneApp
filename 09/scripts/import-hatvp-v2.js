/**
 * Script d'import des déclarations d'intérêts depuis la HATVP v2
 * Utilise le fichier XML fusionné et le traitement en streaming
 */

import { createClient } from '@supabase/supabase-js';
import fetch from 'node-fetch';
import { createWriteStream, createReadStream, existsSync } from 'fs';
import { pipeline } from 'stream/promises';
import sax from 'sax';
import 'dotenv/config';

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
);

const HATVP_XML = 'https://www.hatvp.fr/livraison/merge/declarations.xml';
const LOCAL_XML = './temp_hatvp_declarations.xml';

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
        const key = normalizeString(pol.first_name) + '_' + normalizeString(pol.last_name);
        politicianCache.set(key, pol);

        const key2 = normalizeString(pol.last_name) + '_' + normalizeString(pol.first_name);
        if (!politicianCache.has(key2)) {
            politicianCache.set(key2, pol);
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

function findPolitician(prenom, nom) {
    const key1 = normalizeString(prenom) + '_' + normalizeString(nom);
    if (politicianCache.has(key1)) return politicianCache.get(key1);

    const key2 = normalizeString(nom) + '_' + normalizeString(prenom);
    if (politicianCache.has(key2)) return politicianCache.get(key2);

    return null;
}

async function downloadXML() {
    if (existsSync(LOCAL_XML)) {
        console.log('Fichier XML déjà téléchargé');
        return;
    }

    console.log('Téléchargement du fichier XML fusionné HATVP...');
    console.log('(Cela peut prendre plusieurs minutes)');

    const response = await fetch(HATVP_XML);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const fileStream = createWriteStream(LOCAL_XML);
    await pipeline(response.body, fileStream);

    console.log('Téléchargement terminé');
}

async function parseXMLStreaming() {
    return new Promise((resolve, reject) => {
        const parser = sax.createStream(true, { trim: true });
        const declarations = [];

        // État simplifié
        let inDeclaration = false;
        let inParticipationDirigeant = false;
        let inParticipationFinanciere = false;
        let inDeclarant = false;
        let currentDeclaration = null;
        let currentParticipation = null;
        let currentTag = '';
        let textBuffer = '';
        let itemsDepth = 0;  // Track nested items depth

        let deputeCount = 0;
        let totalDeclarations = 0;
        let participationsFound = 0;  // Debug counter

        parser.on('opentag', (node) => {
            const tagName = node.name.toLowerCase();
            currentTag = tagName;
            textBuffer = '';

            if (tagName === 'declaration') {
                inDeclaration = true;
                currentDeclaration = {
                    prenom: '',
                    nom: '',
                    typeMandat: '',
                    participations: []
                };
                totalDeclarations++;
            }

            if (inDeclaration) {
                if (tagName === 'participationdirigeantdto') {
                    inParticipationDirigeant = true;
                    itemsDepth = 0;
                }
                if (tagName === 'participationfinanceredto') {
                    inParticipationFinanciere = true;
                    itemsDepth = 0;
                }
                if (tagName === 'declarant') {
                    inDeclarant = true;
                }

                // Dans participationDirigeant ou participationFinanciere, les items niveau 2 contiennent les participations
                if (tagName === 'items' && (inParticipationDirigeant || inParticipationFinanciere)) {
                    itemsDepth++;
                    if (itemsDepth === 2) {  // Niveau 2 = une participation
                        currentParticipation = {
                            nomSociete: '',
                            activite: '',
                            secteur: ''
                        };
                    }
                }
            }
        });

        parser.on('text', (text) => {
            textBuffer += text;
        });

        parser.on('closetag', (name) => {
            const tagName = name.toLowerCase();
            const text = textBuffer.trim();

            if (inDeclaration && currentDeclaration) {
                // Infos déclarant
                if (inDeclarant) {
                    if (tagName === 'nom' && text && !currentDeclaration.nom) {
                        currentDeclaration.nom = text;
                    }
                    if (tagName === 'prenom' && text && !currentDeclaration.prenom) {
                        currentDeclaration.prenom = text;
                    }
                }

                // Type de mandat
                if (tagName === 'codtypemandatfichier' && text) {
                    currentDeclaration.typeMandat = text.toLowerCase();
                }

                // Données participation
                if (currentParticipation && itemsDepth >= 2) {
                    if (tagName === 'nomsociete' && text) {
                        currentParticipation.nomSociete = text;
                        participationsFound++;
                        if (participationsFound <= 5) {
                            console.log(`  DEBUG: Found nomSociete: ${text.substring(0, 50)}`);
                        }
                    }
                    if (tagName === 'activite' && text) {
                        currentParticipation.activite = text;
                    }
                    if (tagName === 'secteuractivite' && text) {
                        currentParticipation.secteur = text;
                    }
                }

                // Fin d'items (participation)
                if (tagName === 'items' && (inParticipationDirigeant || inParticipationFinanciere)) {
                    if (itemsDepth === 2 && currentParticipation && currentParticipation.nomSociete) {
                        currentDeclaration.participations.push({ ...currentParticipation });
                        if (participationsFound <= 5) {
                            console.log(`  DEBUG: Pushed participation`);
                        }
                    }
                    if (itemsDepth === 2) {
                        currentParticipation = null;
                    }
                    itemsDepth--;
                }

                // Fin des sections
                if (tagName === 'participationdirigeantdto') {
                    inParticipationDirigeant = false;
                }
                if (tagName === 'participationfinanceredto') {
                    inParticipationFinanciere = false;
                }
                if (tagName === 'declarant') {
                    inDeclarant = false;
                }
            }

            // Fin de déclaration
            if (tagName === 'declaration' && currentDeclaration) {
                inDeclaration = false;

                if (currentDeclaration.typeMandat === 'depute') {
                    deputeCount++;
                    if (currentDeclaration.participations.length > 0) {
                        declarations.push({ ...currentDeclaration });
                    }
                    if (deputeCount % 100 === 0) {
                        console.log(`  ${deputeCount} députés traités...`);
                    }
                }
                currentDeclaration = null;
            }

            textBuffer = '';
        });

        parser.on('error', (err) => {
            console.error('Erreur parsing:', err.message);
            parser.resume();
        });

        parser.on('end', () => {
            console.log(`\nParsing terminé:`);
            console.log(`  - ${totalDeclarations} déclarations totales`);
            console.log(`  - ${deputeCount} députés`);
            console.log(`  - ${declarations.length} avec participations`);
            console.log(`  - ${participationsFound} nomSociete trouvés`);
            resolve(declarations);
        });

        const stream = createReadStream(LOCAL_XML);
        stream.pipe(parser);
    });
}

async function saveCompanyInterests(politicianId, participations) {
    let saved = 0;
    let firstError = true;

    for (const part of participations) {
        try {
            let companyId;
            const companyName = part.nomSociete.substring(0, 255);

            const { data: existing, error: selectError } = await supabase
                .from('companies')
                .select('id')
                .eq('name', companyName)
                .limit(1);

            if (selectError && firstError) {
                console.error(`  Erreur SELECT companies: ${selectError.message}`);
                firstError = false;
                continue;
            }

            if (existing && existing.length > 0) {
                companyId = existing[0].id;
            } else {
                const { data: inserted, error } = await supabase
                    .from('companies')
                    .insert({
                        name: companyName,
                        sector: part.secteur || 'Non précisé',
                        description: `Participation déclarée - ${part.activite || 'Dirigeant'}`
                    })
                    .select('id')
                    .single();

                if (error) {
                    if (firstError) {
                        console.error(`  Erreur INSERT companies: ${error.message}`);
                        firstError = false;
                    }
                    continue;
                }
                companyId = inserted.id;
            }

            const { error: linkError } = await supabase
                .from('politician_companies')
                .upsert({
                    politician_id: politicianId,
                    company_id: companyId,
                    role: part.activite || 'Participation',
                    source: 'hatvp'
                }, { onConflict: 'politician_id,company_id' });

            if (linkError && firstError) {
                console.error(`  Erreur UPSERT politician_companies: ${linkError.message}`);
                firstError = false;
            }

            if (!linkError) {
                saved++;
            }
        } catch (e) {
            if (firstError) {
                console.error(`  Exception: ${e.message}`);
                firstError = false;
            }
        }
    }

    return saved;
}

async function main() {
    console.log('=== Import HATVP v2 ===\n');

    try {
        await loadPoliticianCache();
        await downloadXML();

        console.log('\nAnalyse du fichier XML...');
        const declarations = await parseXMLStreaming();

        console.log(`\nTraitement de ${declarations.length} déclarations...\n`);

        let processed = 0;
        let matched = 0;
        let totalCompanies = 0;

        for (const decl of declarations) {
            const politician = findPolitician(decl.prenom, decl.nom);

            if (politician) {
                const saved = await saveCompanyInterests(politician.id, decl.participations);
                if (saved > 0) {
                    console.log(`✓ ${decl.prenom} ${decl.nom}: ${saved} participation(s)`);
                    totalCompanies += saved;
                }
                matched++;
            }

            processed++;
        }

        console.log(`\n=== Import terminé ===`);
        console.log(`Déclarations: ${processed}`);
        console.log(`Matchés: ${matched}`);
        console.log(`Participations: ${totalCompanies}`);

    } catch (err) {
        console.error('Erreur:', err);
        process.exit(1);
    }
}

main();
