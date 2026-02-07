// Script d'import des nouvelles données vers Supabase
// Exécuter avec: node import-supabase.js

const fetch = require('node-fetch');

const SUPABASE_URL = 'https://hwunkojdzodcutewkfet.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh3dW5rb2pkem9kY3V0ZXdrZmV0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgzOTMzNTAsImV4cCI6MjA4Mzk2OTM1MH0.Zpe-QqzKDIpx3pTa6_e9ysfI-Rprl3SXANM8b2pqXU0';

const headers = {
    'apikey': SUPABASE_KEY,
    'Authorization': `Bearer ${SUPABASE_KEY}`,
    'Content-Type': 'application/json',
    'Prefer': 'return=representation'
};

// Nouvelles communes à ajouter (ID 66-90)
const nouvellesCommunes = [
    { id: 66, nom: "Lyon", departement: "Rhône (69)", score: "C", maire_actuel: "Grégory Doucet (EELV)", population: "522 000", detail: "3e ville de France, alliance RN-UDR" },
    { id: 67, nom: "Dijon", departement: "Côte-d'Or (21)", score: "C", maire_actuel: "François Rebsamen (PS)", population: "160 000", detail: "Liste commune UDR-RN" },
    { id: 68, nom: "Clermont-Ferrand", departement: "Puy-de-Dôme (63)", score: "C", maire_actuel: "Olivier Bianchi (PS)", population: "147 000", detail: "Capitale auvergnate, candidat RN désigné" },
    { id: 69, nom: "Meaux", departement: "Seine-et-Marne (77)", score: "D", maire_actuel: "Jean-François Copé (LR)", population: "56 000", detail: "Fief de Copé, députée RN candidate" },
    { id: 70, nom: "Draguignan", departement: "Var (83)", score: "D", maire_actuel: "Richard Strambio (DVD)", population: "42 000", detail: "Var = département le plus RN, liste RN-UDR" },
    { id: 71, nom: "Douai", departement: "Nord (59)", score: "D", maire_actuel: "Frédéric Chéreau (PS)", population: "40 000", detail: "Bassin minier, liste union RN-UDR" },
    { id: 72, nom: "Billy-Montigny", departement: "Pas-de-Calais (62)", score: "D", maire_actuel: "Sylvain Clament (DVG)", population: "8 500", detail: "Lensois, jeune candidat RN" },
    { id: 73, nom: "Antibes", departement: "Alpes-Maritimes (06)", score: "C", maire_actuel: "Jean Leonetti (LR)", population: "74 000", detail: "Côte d'Azur, jeune candidat RN" },
    { id: 74, nom: "Cannes", departement: "Alpes-Maritimes (06)", score: "C", maire_actuel: "David Lisnard (LR)", population: "74 000", detail: "Ville du Festival, candidat RN avocat" },
    { id: 75, nom: "Cagnes-sur-Mer", departement: "Alpes-Maritimes (06)", score: "D", maire_actuel: "Louis Nègre (LR)", population: "52 000", detail: "Député RN candidat" },
    { id: 76, nom: "Grasse", departement: "Alpes-Maritimes (06)", score: "C", maire_actuel: "Jérôme Viaud (LR)", population: "51 000", detail: "Capitale du parfum, candidat RN" },
    { id: 77, nom: "Le Cannet", departement: "Alpes-Maritimes (06)", score: "C", maire_actuel: "Michèle Tabarot (LR)", population: "42 000", detail: "Candidate RN investie" },
    { id: 78, nom: "Marseille 1er/7e", departement: "Bouches-du-Rhône (13)", score: "D", maire_actuel: "Secteur gauche", population: "120 000", detail: "Centre-ville et Vieux-Port" },
    { id: 79, nom: "Marseille 2e/3e", departement: "Bouches-du-Rhône (13)", score: "D", maire_actuel: "Secteur gauche", population: "70 000", detail: "Quartiers Nord" },
    { id: 80, nom: "Marseille 4e/5e", departement: "Bouches-du-Rhône (13)", score: "D", maire_actuel: "Secteur gauche", population: "95 000", detail: "Secteurs populaires" },
    { id: 81, nom: "Marseille 6e/8e", departement: "Bouches-du-Rhône (13)", score: "C", maire_actuel: "Secteur droite", population: "110 000", detail: "Quartiers bourgeois" },
    { id: 82, nom: "Marseille 9e/10e", departement: "Bouches-du-Rhône (13)", score: "D", maire_actuel: "Secteur droite", population: "140 000", detail: "Sud et Mazargues" },
    { id: 83, nom: "Marseille 11e/12e", departement: "Bouches-du-Rhône (13)", score: "D", maire_actuel: "Secteur droite", population: "145 000", detail: "Est marseillais" },
    { id: 84, nom: "Marseille 13e/14e", departement: "Bouches-du-Rhône (13)", score: "D", maire_actuel: "Secteur LR", population: "170 000", detail: "Plus grand secteur, ex-maire RN" },
    { id: 85, nom: "Marseille 15e/16e", departement: "Bouches-du-Rhône (13)", score: "D", maire_actuel: "Secteur gauche", population: "100 000", detail: "Quartiers Nord" },
    { id: 86, nom: "Cholet", departement: "Maine-et-Loire (49)", score: "D", maire_actuel: "Gilles Bourdouleix (DVD)", population: "55 000", detail: "Maire controversé allié RN" },
    { id: 87, nom: "Laval", departement: "Mayenne (53)", score: "C", maire_actuel: "Florian Bercault (Horizons)", population: "53 000", detail: "Préfecture de la Mayenne" },
    { id: 88, nom: "Vannes", departement: "Morbihan (56)", score: "C", maire_actuel: "David Robo (LR)", population: "55 000", detail: "Bretagne Sud, potentiel RN" },
    { id: 89, nom: "La Seyne-sur-Mer", departement: "Var (83)", score: "D", maire_actuel: "Nathalie Bicais (DVD)", population: "65 000", detail: "Rade de Toulon, fort score RN" },
    { id: 90, nom: "Six-Fours-les-Plages", departement: "Var (83)", score: "D", maire_actuel: "Jean-Sébastien Vialatte (LR)", population: "36 000", detail: "Littoral varois, scores RN élevés" }
];

// Nouveaux candidats
const nouveauxCandidats = [
    { commune_id: 66, nom: "Alexandre Humbert Dupalais", role: "tete", parti: "RN", detail: "Avocat, 39 ans, liste 'Retrouver Lyon' RN-UDR", twitter: "" },
    { commune_id: 67, nom: "Thierry Coudert", role: "tete", parti: "UDR", detail: "Tête de liste UDR-RN", twitter: "" },
    { commune_id: 68, nom: "Antoine Darbois", role: "tete", parti: "RN", detail: "Ingénieur retraité Michelin, 71 ans, ex-LR rallié RN 2024", twitter: "" },
    { commune_id: 69, nom: "Béatrice Roullaud", role: "tete", parti: "RN", detail: "Députée RN, candidate annoncée dès mai 2025", twitter: "" },
    { commune_id: 70, nom: "Philippe Schreck", role: "tete", parti: "RN", detail: "Tête de liste RN-UDR", twitter: "" },
    { commune_id: 71, nom: "Thierry Tesson", role: "tete", parti: "RN", detail: "Tête de liste RN-UDR", twitter: "" },
    { commune_id: 72, nom: "Yanis Gaudillat", role: "tete", parti: "RN", detail: "27 ans, tête de liste RN", twitter: "" },
    { commune_id: 73, nom: "Hugo Muriel", role: "tete", parti: "RN", detail: "25 ans, tête de liste RN", twitter: "" },
    { commune_id: 74, nom: "Lucas Mussio", role: "tete", parti: "RN", detail: "Avocat, tête de liste RN", twitter: "" },
    { commune_id: 75, nom: "Bryan Masson", role: "tete", parti: "RN", detail: "Député RN, tête de liste", twitter: "" },
    { commune_id: 76, nom: "Jean-Paul Camerano", role: "tete", parti: "RN", detail: "Tête de liste RN", twitter: "" },
    { commune_id: 77, nom: "Franck Galbert", role: "tete", parti: "RN", detail: "Tête de liste RN", twitter: "" },
    { commune_id: 78, nom: "Clémence Parodi", role: "tete", parti: "RN", detail: "Tête de liste secteur 1er/7e", twitter: "" },
    { commune_id: 79, nom: "Marie Bermejo", role: "tete", parti: "RN", detail: "Tête de liste secteur 2e/3e", twitter: "" },
    { commune_id: 80, nom: "Thomas Battesti", role: "tete", parti: "RN", detail: "Tête de liste secteur 4e/5e", twitter: "" },
    { commune_id: 81, nom: "Jean-Baptiste Rivoallan", role: "tete", parti: "RN", detail: "Tête de liste secteur 6e/8e", twitter: "" },
    { commune_id: 82, nom: "Eléonore Bez", role: "tete", parti: "RN", detail: "Conseillère municipale, tête de liste secteur 9e/10e", twitter: "" },
    { commune_id: 83, nom: "Olivier Rioult", role: "tete", parti: "RN", detail: "Ex-cabinet Vassal, tête de liste secteur 11e/12e", twitter: "" },
    { commune_id: 84, nom: "Sandrine d'Angio", role: "tete", parti: "RN", detail: "Ex-maire de secteur 2017-2020, tête de liste 13e/14e", twitter: "" },
    { commune_id: 85, nom: "Thibault Charpentier", role: "tete", parti: "RN", detail: "Tête de liste secteur 15e/16e", twitter: "" },
    { commune_id: 86, nom: "Gilles Bourdouleix", role: "tete", parti: "DVD-RN", detail: "Maire sortant, allié RN aux municipales", twitter: "" }
];

// Nouvelles dingueries (structure adaptée à Supabase)
const nouvellesDingueries = [
    {
        auteur: "Jérôme Buisson",
        commune_id: null,
        citation: "Défense du blackface et des contrôles au faciès",
        type: "racisme",
        date_declaration: "2024-01-01",
        source_url: "https://lesjours.fr/obsessions/rn-derniere-marche-2/ep6-buisson-melin-joubert/",
        source_media: "Les Jours",
        contexte: "Député RN de l'Ain. Propos défendant des pratiques discriminatoires.",
        est_condamnation: false
    },
    {
        auteur: "Florence Joubert",
        commune_id: null,
        citation: "Réhabilitation du concept de race humaine",
        type: "racisme",
        date_declaration: "2024-01-01",
        source_url: "https://lesjours.fr/obsessions/rn-derniere-marche-2/ep6-buisson-melin-joubert/",
        source_media: "Les Jours",
        contexte: "Députée RN de Dordogne. Propos pseudo-scientifiques racialistes.",
        est_condamnation: false
    },
    {
        auteur: "Joëlle Mélin",
        commune_id: null,
        citation: "Les migrants apportent des maladies infectieuses en France",
        type: "racisme",
        date_declaration: "2024-01-01",
        source_url: "https://lesjours.fr/obsessions/rn-derniere-marche-2/ep6-buisson-melin-joubert/",
        source_media: "Les Jours",
        contexte: "Députée européenne RN des Bouches-du-Rhône. Théorie complotiste médicale anti-migrants.",
        est_condamnation: false
    },
    {
        auteur: "Emmanuelle Darles",
        commune_id: null,
        citation: "Vaccination des enfants assimilée à un viol",
        type: "autre",
        date_declaration: "2022-05-01",
        source_url: "https://basta.media/racistes-homophobes-complotistes-pro-poutine-antisemites-candidats-rn",
        source_media: "Basta Media",
        contexte: "Candidate RN de la Vienne, anti-vax. Fréquente milieux complotistes (Reinfocovid).",
        est_condamnation: false
    },
    {
        auteur: "Jacques Myard",
        commune_id: null,
        citation: "J'adore parler avec le diable parce qu'il est intelligent (sur Assad)",
        type: "autre",
        date_declaration: "2015-01-01",
        source_url: "https://basta.media/racistes-homophobes-complotistes-pro-poutine-antisemites-candidats-rn",
        source_media: "Basta Media",
        contexte: "Ex-député LR des Yvelines rallié ED. Voyage en Syrie avec Assad, membre think tank pro-Russie CF2R, visite Crimée 2016.",
        est_condamnation: false
    },
    {
        auteur: "Pierre Gentillet",
        commune_id: null,
        citation: "En 20 ans, la Russie s'est redressée économiquement",
        type: "autre",
        date_declaration: "2020-01-01",
        source_url: "https://basta.media/racistes-homophobes-complotistes-pro-poutine-antisemites-candidats-rn",
        source_media: "Basta Media",
        contexte: "Candidat RN du Cher. Fondateur du Cercle Pouchkine (think tank pro-Poutine) en 2015. Trois voyages en Russie.",
        est_condamnation: false
    },
    {
        auteur: "Laurent Gnaedig",
        commune_id: null,
        citation: "Chambres à gaz : un très mauvais choix de mots mais pas une remarque antisémite",
        type: "antisemitisme",
        date_declaration: "2024-06-01",
        source_url: "https://fr.timesofisrael.com/les-candidats-du-rn-qui-font-tache-leurs-propos-antisemites-racistes-et-complotistes/",
        source_media: "Times of Israel",
        contexte: "Candidat RN du Haut-Rhin. Minimisation des propos de Le Pen sur les chambres à gaz. Convoqué par commission des conflits RN.",
        est_condamnation: false
    },
    {
        auteur: "Ludivine Daoudi",
        commune_id: null,
        citation: "Photo avec casquette nazie de la Luftwaffe ornée d'une croix gammée",
        type: "autre",
        date_declaration: "2024-06-01",
        source_url: "https://www.francebleu.fr/infos/politique/legislatives-2024-casquette-nazie-propos-racistes-ces-candidatures-du-rassemblement-national-qui-font-polemique-8443504",
        source_media: "France Bleu",
        contexte: "Candidate RN du Calvados. A retiré sa candidature après diffusion de la photo.",
        est_condamnation: false
    },
    {
        auteur: "Philippe Fontana",
        commune_id: null,
        citation: "Avocat conseillant Pékin et entreprises chinoises étatiques contre intérêts français",
        type: "autre",
        date_declaration: "2024-01-01",
        source_url: "https://basta.media/racistes-homophobes-complotistes-pro-poutine-antisemites-candidats-rn",
        source_media: "Basta Media",
        contexte: "Candidat RN de Seine-et-Marne. Connexions avec le gouvernement chinois.",
        est_condamnation: false
    },
    {
        auteur: "Rémy Berthonneau",
        commune_id: null,
        citation: "Militait pour la levée des sanctions et la livraison des missiles Mistral à la Russie",
        type: "autre",
        date_declaration: "2015-01-01",
        source_url: "https://basta.media/racistes-homophobes-complotistes-pro-poutine-antisemites-candidats-rn",
        source_media: "Basta Media",
        contexte: "Candidat RN de Gironde. Fondateur du site 'Français Libres' pour porter la voix des Français de Russie.",
        est_condamnation: false
    }
];

async function insertData(table, data) {
    try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
            method: 'POST',
            headers: {
                ...headers,
                'Prefer': 'return=minimal,resolution=ignore-duplicates'
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            const error = await response.text();
            console.error(`Erreur ${table}:`, error);
            return false;
        }
        return true;
    } catch (err) {
        console.error(`Erreur ${table}:`, err.message);
        return false;
    }
}

async function upsertData(table, data) {
    try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
            method: 'POST',
            headers: {
                ...headers,
                'Prefer': 'return=minimal,resolution=merge-duplicates'
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            const error = await response.text();
            console.error(`Erreur upsert ${table}:`, error);
            return false;
        }
        return true;
    } catch (err) {
        console.error(`Erreur upsert ${table}:`, err.message);
        return false;
    }
}

async function main() {
    console.log('=== Import Supabase - Veille Municipales 2026 ===\n');

    // 1. Insérer les nouvelles communes
    console.log(`Insertion de ${nouvellesCommunes.length} communes...`);
    const communesOk = await upsertData('communes', nouvellesCommunes);
    console.log(communesOk ? '✓ Communes insérées' : '✗ Erreur communes');

    // 2. Insérer les nouveaux candidats
    console.log(`\nInsertion de ${nouveauxCandidats.length} candidats...`);
    const candidatsOk = await insertData('candidats', nouveauxCandidats);
    console.log(candidatsOk ? '✓ Candidats insérés' : '✗ Erreur candidats');

    // 3. Insérer les nouvelles dingueries
    console.log(`\nInsertion de ${nouvellesDingueries.length} dingueries...`);
    const dingueriesOk = await insertData('dingueries', nouvellesDingueries);
    console.log(dingueriesOk ? '✓ Dingueries insérées' : '✗ Erreur dingueries');

    console.log('\n=== Import terminé ===');
    console.log(`Communes: ${communesOk ? 'OK' : 'ERREUR'}`);
    console.log(`Candidats: ${candidatsOk ? 'OK' : 'ERREUR'}`);
    console.log(`Dingueries: ${dingueriesOk ? 'OK' : 'ERREUR'}`);
}

main().catch(console.error);
