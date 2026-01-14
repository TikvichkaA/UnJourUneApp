// =====================================================
// DONNÉES DE DÉMONSTRATION - VERSION PUBLIQUE
// Les vraies données sont dans le dossier 12-backup
// =====================================================

// Données fictives des femmes isolées (démonstration)
const FEMMES_ISOLEES = [
    {
        id: 1,
        chambre: '101',
        tsReferente: 'Marie',
        nom: 'DEMO',
        prenom: 'Alice',
        dateNaissance: '1985-03-15',
        age: 40,
        nationalite: 'Française',
        telephone: '06 00 00 00 01',
        email: 'demo1@example.com',
        statut: 'Régulière',
        assuranceMaladie: 'CSS',
        dateArrivee: '2024-01-15',
        aideAlimentaire: 'Oui',
        montantAide: 200,
        emploi: 'En recherche',
        compteBancaire: 'Oui'
    },
    {
        id: 2,
        chambre: '102',
        tsReferente: 'Sophie',
        nom: 'EXEMPLE',
        prenom: 'Marie',
        dateNaissance: '1990-07-22',
        age: 35,
        nationalite: 'Française',
        telephone: '06 00 00 00 02',
        email: 'demo2@example.com',
        statut: 'Régulière',
        assuranceMaladie: 'AME',
        dateArrivee: '2024-03-01',
        aideAlimentaire: 'Oui',
        montantAide: 180,
        emploi: 'CDD',
        compteBancaire: 'Oui'
    },
    {
        id: 3,
        chambre: '103',
        tsReferente: 'Marie',
        nom: 'TEST',
        prenom: 'Sophie',
        dateNaissance: '1978-11-30',
        age: 47,
        nationalite: 'Française',
        telephone: '06 00 00 00 03',
        email: 'demo3@example.com',
        statut: 'Régulière',
        assuranceMaladie: 'CSS',
        dateArrivee: '2023-09-10',
        aideAlimentaire: 'Non',
        montantAide: 0,
        emploi: 'CDI',
        compteBancaire: 'Oui'
    }
];

// Données fictives des familles (démonstration)
const FAMILLES = [
    {
        id: 1,
        chambre: '201',
        tsReferente: 'Sophie',
        nomMere: 'FAMILLE',
        prenomMere: 'Nadia',
        dateNaissanceMere: '1988-05-12',
        ageMere: 37,
        nationaliteMere: 'Française',
        telephoneMere: '06 00 00 00 10',
        emailMere: 'famille1@example.com',
        statutMere: 'Régulière',
        assuranceMaladieMere: 'CSS',
        dateArrivee: '2024-02-01',
        aideAlimentaire: 'Oui',
        montantAide: 350,
        emploiMere: 'Temps partiel',
        compteBancaireMere: 'Oui',
        enfants: [
            {
                prenom: 'Lucas',
                dateNaissance: '2015-08-20',
                age: 10,
                ecole: 'École primaire Demo',
                classe: 'CM2'
            },
            {
                prenom: 'Emma',
                dateNaissance: '2018-03-14',
                age: 7,
                ecole: 'École primaire Demo',
                classe: 'CE1'
            }
        ]
    },
    {
        id: 2,
        chambre: '202',
        tsReferente: 'Marie',
        nomMere: 'MODELE',
        prenomMere: 'Fatou',
        dateNaissanceMere: '1992-09-25',
        ageMere: 33,
        nationaliteMere: 'Française',
        telephoneMere: '06 00 00 00 11',
        emailMere: 'famille2@example.com',
        statutMere: 'Régulière',
        assuranceMaladieMere: 'AME',
        dateArrivee: '2024-04-15',
        aideAlimentaire: 'Oui',
        montantAide: 280,
        emploiMere: 'En recherche',
        compteBancaireMere: 'Oui',
        enfants: [
            {
                prenom: 'Adam',
                dateNaissance: '2020-01-10',
                age: 5,
                ecole: 'Maternelle Demo',
                classe: 'Grande section'
            }
        ]
    }
];

// Note: Cette version contient uniquement des données fictives pour démonstration.
// Les statistiques affichées sur la page d'accueil sont également fictives.
console.log('⚠️ Version démo - Données fictives chargées');
