// ===== DONNÉES DE L'APPLICATION TS COMPAGNON =====

// ===== DONNÉES DES HÉBERGÉES (depuis projet 12) =====
// Ces données seront synchronisées avec la base réelle
const HEBERGEES = {
    // Liste des TS disponibles
    ts: ['Marie', 'Sophie', 'Julie', 'Laura'],

    // Femmes isolées
    femmesIsolees: [
        {
            id: 'fi-1',
            type: 'femme_isolee',
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
            compteBancaire: 'Oui',
            notes: ''
        },
        {
            id: 'fi-2',
            type: 'femme_isolee',
            chambre: '102',
            tsReferente: 'Sophie',
            nom: 'EXEMPLE',
            prenom: 'Marie',
            dateNaissance: '1990-07-22',
            age: 35,
            nationalite: 'Congolaise',
            telephone: '06 00 00 00 02',
            email: 'demo2@example.com',
            statut: 'Demandeur d\'asile',
            assuranceMaladie: 'AME',
            dateArrivee: '2024-03-01',
            aideAlimentaire: 'Oui',
            montantAide: 180,
            emploi: 'Sans',
            compteBancaire: 'Non',
            notes: ''
        },
        {
            id: 'fi-3',
            type: 'femme_isolee',
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
            compteBancaire: 'Oui',
            notes: ''
        },
        {
            id: 'fi-4',
            type: 'femme_isolee',
            chambre: '104',
            tsReferente: 'Sophie',
            nom: 'MARTIN',
            prenom: 'Léa',
            dateNaissance: '1995-06-18',
            age: 30,
            nationalite: 'Française',
            telephone: '06 00 00 00 04',
            email: 'demo4@example.com',
            statut: 'Régulière',
            assuranceMaladie: 'Aucune',
            dateArrivee: '2024-06-01',
            aideAlimentaire: 'Oui',
            montantAide: 150,
            emploi: 'En recherche',
            compteBancaire: 'Oui',
            notes: ''
        },
        {
            id: 'fi-5',
            type: 'femme_isolee',
            chambre: '105',
            tsReferente: 'Marie',
            nom: 'KONÉ',
            prenom: 'Aminata',
            dateNaissance: '1988-02-28',
            age: 37,
            nationalite: 'Ivoirienne',
            telephone: '06 00 00 00 05',
            email: '',
            statut: 'Irrégulière',
            assuranceMaladie: 'Aucune',
            dateArrivee: '2024-05-15',
            aideAlimentaire: 'Oui',
            montantAide: 200,
            emploi: 'Sans',
            compteBancaire: 'Non',
            notes: ''
        }
    ],

    // Familles
    familles: [
        {
            id: 'fam-1',
            type: 'famille',
            chambre: '201',
            tsReferente: 'Sophie',
            nom: 'FAMILLE',
            prenom: 'Nadia',
            dateNaissance: '1988-05-12',
            age: 37,
            nationalite: 'Française',
            telephone: '06 00 00 00 10',
            email: 'famille1@example.com',
            statut: 'Régulière',
            assuranceMaladie: 'CSS',
            dateArrivee: '2024-02-01',
            aideAlimentaire: 'Oui',
            montantAide: 350,
            emploi: 'Temps partiel',
            compteBancaire: 'Oui',
            enfants: [
                { prenom: 'Lucas', age: 10, ecole: 'École primaire Demo', classe: 'CM2' },
                { prenom: 'Emma', age: 7, ecole: 'École primaire Demo', classe: 'CE1' }
            ],
            notes: ''
        },
        {
            id: 'fam-2',
            type: 'famille',
            chambre: '202',
            tsReferente: 'Marie',
            nom: 'MODELE',
            prenom: 'Fatou',
            dateNaissance: '1992-09-25',
            age: 33,
            nationalite: 'Sénégalaise',
            telephone: '06 00 00 00 11',
            email: 'famille2@example.com',
            statut: 'Demandeur d\'asile',
            assuranceMaladie: 'AME',
            dateArrivee: '2024-04-15',
            aideAlimentaire: 'Oui',
            montantAide: 280,
            emploi: 'En recherche',
            compteBancaire: 'Oui',
            enfants: [
                { prenom: 'Adam', age: 5, ecole: 'Maternelle Demo', classe: 'Grande section' }
            ],
            notes: ''
        },
        {
            id: 'fam-3',
            type: 'famille',
            chambre: '203',
            tsReferente: 'Sophie',
            nom: 'DIALLO',
            prenom: 'Mariama',
            dateNaissance: '1990-12-03',
            age: 35,
            nationalite: 'Guinéenne',
            telephone: '06 00 00 00 12',
            email: '',
            statut: 'Irrégulière',
            assuranceMaladie: 'Aucune',
            dateArrivee: '2024-07-01',
            aideAlimentaire: 'Oui',
            montantAide: 400,
            emploi: 'Sans',
            compteBancaire: 'Non',
            enfants: [
                { prenom: 'Fatoumata', age: 8, ecole: 'École primaire Demo', classe: 'CE2' },
                { prenom: 'Mamadou', age: 4, ecole: 'Maternelle Demo', classe: 'Moyenne section' },
                { prenom: 'Aïssatou', age: 1, ecole: '', classe: '' }
            ],
            notes: ''
        }
    ],

    // Méthode pour obtenir tous les hébergés
    getAll() {
        return [...this.femmesIsolees, ...this.familles];
    },

    // Méthode pour obtenir les suivis d'une TS
    getByTS(tsName) {
        return this.getAll().filter(p => p.tsReferente === tsName);
    },

    // Méthode pour obtenir un hébergé par ID
    getById(id) {
        return this.getAll().find(p => p.id === id);
    }
};

const DATA = {
    version: "2026.01",
    updated_at: "2026-01-26",

    // ===== DISPOSITIFS SOCIAUX =====
    dispositifs: [
        {
            id: "rsa",
            title: "RSA",
            fullTitle: "Revenu de Solidarité Active",
            category: "ressources",
            tags: ["frequent", "ressources"],
            icon: "💰",
            summary: "Revenu minimum pour les personnes sans ressources ou avec de faibles revenus.",
            eligibility: `**Conditions principales :**
- Avoir plus de 25 ans (ou moins avec enfant à charge, ou entre 18-25 ans si 2 ans d'activité)
- Résider en France de manière stable
- Avoir des ressources inférieures au montant du RSA
- Ne pas être étudiant (sauf exceptions)
- Ne pas être en congé parental/sabbatique/sans solde

**Exclusions fréquentes :**
- Étudiants (sauf parent isolé ou activité significative)
- Étrangers sans titre de séjour autorisant le travail
- Personnes en congé parental à taux plein`,
            steps: [
                "Vérifier l'éligibilité sur caf.fr ou msa.fr (simulateur)",
                "Créer ou se connecter à l'espace CAF/MSA",
                "Remplir la demande en ligne ou télécharger le formulaire",
                "Joindre les pièces justificatives",
                "Envoyer la demande",
                "Attendre l'instruction (réponse sous 2 mois max)"
            ],
            documents: [
                "Pièce d'identité (CNI, passeport, titre de séjour)",
                "Justificatif de domicile de moins de 3 mois",
                "RIB",
                "Déclaration de ressources des 3 derniers mois",
                "Avis d'imposition N-1 ou N-2",
                "Pour les étrangers : titre de séjour en cours de validité"
            ],
            documentsAlternatives: "Sans domicile : attestation de domiciliation. Sans RIB : le conseiller peut aider à ouvrir un compte.",
            timelines: "Instruction : 2 mois maximum. Versement : généralement le 5 du mois suivant.",
            commonRefusals: [
                "Ressources supérieures au plafond",
                "Statut étudiant",
                "Titre de séjour ne permettant pas de travailler",
                "Dossier incomplet",
                "Non-respect des obligations (rendez-vous manqués)"
            ],
            whatIfRefused: `**En cas de refus :**
1. Demander la notification écrite de refus
2. Vérifier le motif précis
3. Si contestable : recours amiable auprès de la CAF (dans les 2 mois)
4. Puis recours contentieux au Tribunal administratif si besoin

**En cas de rupture :**
- Vérifier la raison (changement de situation non déclaré ?)
- Demander un rendez-vous CAF rapidement
- Si suspension pour non-respect des obligations : se remettre en conformité`,
            fieldTips: [
                "Toujours garder une copie datée de la demande",
                "La déclaration trimestrielle est OBLIGATOIRE même sans revenus",
                "Attention aux ressources du conjoint/concubin",
                "L'hébergement gratuit peut être considéré comme un avantage en nature"
            ],
            relatedIds: ["prime-activite", "css", "ass"],
            sources: [
                { label: "Service-public.fr - RSA", url: "https://www.service-public.fr/particuliers/vosdroits/N19775" },
                { label: "CAF - RSA", url: "https://www.caf.fr/allocataires/droits-et-prestations/s-informer-sur-les-aides/solidarite-et-insertion/le-revenu-de-solidarite-active-rsa" }
            ]
        },
        {
            id: "aah",
            title: "AAH",
            fullTitle: "Allocation aux Adultes Handicapés",
            category: "ressources",
            tags: ["frequent", "ressources"],
            icon: "♿",
            summary: "Allocation garantissant un revenu minimum aux personnes en situation de handicap.",
            eligibility: `**Conditions principales :**
- Avoir un taux d'incapacité ≥ 80% OU entre 50% et 79% avec restriction substantielle d'accès à l'emploi
- Avoir plus de 20 ans (ou 16 ans si plus à charge)
- Résider en France de manière stable
- Ne pas percevoir de pension > AAH

**Points d'attention :**
- Le taux d'incapacité est évalué par la MDPH
- La RSDAE (restriction substantielle) doit être reconnue par la CDAPH`,
            steps: [
                "Retirer le formulaire MDPH (cerfa 15692) ou le télécharger",
                "Remplir le formulaire avec le projet de vie",
                "Obtenir le certificat médical (cerfa 15695) de moins de 6 mois",
                "Déposer le dossier à la MDPH du département",
                "Attendre l'évaluation et la décision CDAPH",
                "Si accordé : la CAF/MSA verse automatiquement"
            ],
            documents: [
                "Formulaire MDPH (cerfa 15692*01)",
                "Certificat médical MDPH de moins de 6 mois (cerfa 15695*01)",
                "Photocopie recto/verso de la pièce d'identité",
                "Justificatif de domicile",
                "Avis d'imposition ou de non-imposition"
            ],
            documentsAlternatives: "Le certificat médical peut être rempli par le médecin traitant ou un spécialiste.",
            timelines: "Délai moyen MDPH : 4 à 6 mois. Durée d'attribution : 1 à 10 ans selon la situation.",
            commonRefusals: [
                "Taux d'incapacité jugé insuffisant",
                "Certificat médical incomplet ou périmé",
                "RSDAE non reconnue pour les taux entre 50-79%",
                "Ressources du foyer dépassant le plafond"
            ],
            whatIfRefused: `**En cas de refus MDPH :**
1. Demander le détail de la décision
2. Recours gracieux auprès de la MDPH (dans les 2 mois)
3. OU saisir le Tribunal judiciaire (pôle social) sans avocat obligatoire
4. Possibilité de déposer une nouvelle demande avec éléments complémentaires

**Conseil :** Bien documenter l'impact du handicap sur la vie quotidienne et l'accès à l'emploi`,
            fieldTips: [
                "Le projet de vie est crucial : décrire les difficultés concrètes",
                "Depuis 2023 : déconjugalisation de l'AAH (ressources du conjoint non prises en compte)",
                "L'AAH est cumulable partiellement avec un salaire",
                "Aide au remplissage possible en MDPH ou via associations"
            ],
            relatedIds: ["mdph", "rqth", "pch"],
            sources: [
                { label: "Service-public.fr - AAH", url: "https://www.service-public.fr/particuliers/vosdroits/F12242" },
                { label: "CNSA - MDPH", url: "https://www.cnsa.fr/outils-methodes-et-territoires/mdph" }
            ]
        },
        {
            id: "ass",
            title: "ASS",
            fullTitle: "Allocation de Solidarité Spécifique",
            category: "ressources",
            tags: ["ressources"],
            icon: "📋",
            summary: "Allocation pour les demandeurs d'emploi ayant épuisé leurs droits au chômage.",
            eligibility: `**Conditions principales :**
- Être inscrit comme demandeur d'emploi
- Avoir épuisé ses droits à l'ARE (chômage)
- Justifier de 5 ans d'activité salariée dans les 10 ans précédant la fin du contrat
- Avoir des ressources inférieures au plafond
- Être apte au travail

**Plafonds de ressources (2026) :**
- Personne seule : environ 1 272€/mois
- Couple : environ 2 000€/mois`,
            steps: [
                "France Travail envoie généralement un dossier automatiquement en fin de droits",
                "Sinon, demander le formulaire auprès de France Travail",
                "Remplir le dossier avec les justificatifs",
                "Retourner le dossier à France Travail",
                "Attendre la décision"
            ],
            documents: [
                "Attestation fin de droits ARE",
                "Déclaration de ressources",
                "Justificatifs d'activité passée (5 ans sur 10 ans)",
                "Avis d'imposition",
                "RIB"
            ],
            documentsAlternatives: "Les bulletins de salaire anciens peuvent être demandés à l'URSSAF si perdus.",
            timelines: "Instruction : environ 1 mois. Versement mensuel.",
            commonRefusals: [
                "Durée d'activité insuffisante",
                "Ressources trop élevées",
                "Refus d'offre raisonnable d'emploi",
                "Non-inscription à France Travail"
            ],
            whatIfRefused: `**En cas de refus :**
1. Contester auprès de France Travail (recours gracieux)
2. Puis médiateur régional de France Travail
3. En dernier recours : Tribunal administratif`,
            fieldTips: [
                "L'ASS n'est pas cumulable intégralement avec une activité",
                "Attention : pas de trimestres retraite validés avec l'ASS",
                "Penser au RSA si l'ASS est refusée",
                "L'ASS peut être cumulée avec d'autres prestations (APL, etc.)"
            ],
            relatedIds: ["rsa", "prime-activite"],
            sources: [
                { label: "France Travail - ASS", url: "https://www.francetravail.fr/candidat/mes-droits-aux-aides-et-allegements/lallocation-de-solidarite-specif.html" }
            ]
        },
        {
            id: "css",
            title: "CSS (ex-CMU-C)",
            fullTitle: "Complémentaire Santé Solidaire",
            category: "sante",
            tags: ["frequent", "sante"],
            icon: "🏥",
            summary: "Complémentaire santé gratuite ou à faible coût pour les personnes à revenus modestes.",
            eligibility: `**Conditions principales :**
- Résider en France de manière stable et régulière
- Avoir des ressources inférieures aux plafonds

**Plafonds mensuels (2026, métropole) :**
- CSS gratuite : ~810€/mois (1 personne)
- CSS avec participation : ~1 093€/mois (1 personne)
- Ajouter ~243€ par personne supplémentaire

**Donne droit à :**
- Prise en charge à 100% sans avance de frais
- Tiers payant intégral
- Exonération des franchises médicales`,
            steps: [
                "Faire une simulation sur ameli.fr",
                "Télécharger le formulaire ou le demander à la CPAM",
                "Remplir le formulaire avec les ressources des 12 derniers mois",
                "Joindre les justificatifs",
                "Envoyer à la CPAM",
                "Attendre la décision (2 mois max)"
            ],
            documents: [
                "Formulaire cerfa 12504 (ou demande en ligne)",
                "Pièce d'identité",
                "Justificatif de domicile",
                "RIB (si participation financière)",
                "Justificatifs de ressources des 12 derniers mois",
                "Avis d'imposition"
            ],
            documentsAlternatives: "Pour les bénéficiaires du RSA : l'attribution peut être automatique.",
            timelines: "Décision sous 2 mois. Droits ouverts pour 1 an renouvelable.",
            commonRefusals: [
                "Ressources supérieures aux plafonds",
                "Dossier incomplet",
                "Titre de séjour insuffisant"
            ],
            whatIfRefused: `**En cas de refus :**
1. Recours amiable auprès de la CPAM (Commission de recours amiable)
2. Puis Tribunal judiciaire (pôle social)

**Alternative :** Si légèrement au-dessus des plafonds, vérifier l'éligibilité à l'ACS.`,
            fieldTips: [
                "Les bénéficiaires du RSA y ont droit automatiquement (cocher la case)",
                "Le renouvellement n'est PAS automatique : anticiper 2 mois avant",
                "En cas de changement de situation, prévenir la CPAM",
                "La CSS couvre aussi les dépassements d'honoraires limités"
            ],
            relatedIds: ["puma", "ame", "rsa"],
            sources: [
                { label: "Ameli - CSS", url: "https://www.ameli.fr/assure/droits-demarches/difficultes-acces-droits-soins/complementaire-sante-solidaire" }
            ]
        },
        {
            id: "puma",
            title: "PUMA",
            fullTitle: "Protection Universelle Maladie",
            category: "sante",
            tags: ["sante", "frequent"],
            icon: "🛡️",
            summary: "Prise en charge des frais de santé pour toute personne résidant en France de façon stable.",
            eligibility: `**Conditions principales :**
- Résider en France de manière stable (+ de 3 mois) ET régulière
- Ne pas avoir de droit ouvert à un autre titre (salarié, ayant droit, etc.)

**Qui est concerné :**
- Personnes sans activité professionnelle
- Personnes en rupture de droits
- Étudiants
- Retraités étrangers résidant en France`,
            steps: [
                "Vérifier que la personne n'a pas déjà de droits ouverts (check ameli)",
                "Télécharger le formulaire cerfa 15763",
                "Rassembler les justificatifs d'identité et de résidence stable",
                "Envoyer à la CPAM du lieu de résidence",
                "Attendre l'affiliation"
            ],
            documents: [
                "Formulaire cerfa 15763*02",
                "Pièce d'identité",
                "Titre de séjour (pour étrangers)",
                "Justificatif de résidence stable en France (+ de 3 mois)",
                "Attestation sur l'honneur de résidence en France à titre principal"
            ],
            documentsAlternatives: "La preuve de résidence peut être : factures, attestation hébergement, quittances...",
            timelines: "Affiliation sous 1 à 2 mois généralement.",
            commonRefusals: [
                "Résidence non stable (moins de 3 mois)",
                "Droits déjà ouverts à un autre titre",
                "Séjour irrégulier (orienter vers AME)"
            ],
            whatIfRefused: `**En cas de refus :**
- Vérifier si la personne peut être ayant droit d'un assuré
- Vérifier les conditions AME si séjour irrégulier
- Recours CRA puis Tribunal judiciaire`,
            fieldTips: [
                "La PUMA couvre les soins de base (70% du tarif sécu)",
                "Ne dispense pas d'une complémentaire santé",
                "Pas de délai de carence",
                "Attention : ne couvre pas les personnes en séjour irrégulier"
            ],
            relatedIds: ["css", "ame"],
            sources: [
                { label: "Ameli - PUMA", url: "https://www.ameli.fr/assure/droits-demarches/principes/protection-universelle-maladie" }
            ]
        },
        {
            id: "ame",
            title: "AME",
            fullTitle: "Aide Médicale de l'État",
            category: "sante",
            tags: ["sante", "urgence"],
            icon: "🆘",
            summary: "Prise en charge des soins pour les personnes en situation irrégulière résidant en France depuis plus de 3 mois.",
            eligibility: `**Conditions principales :**
- Résider en France de façon ininterrompue depuis plus de 3 mois
- Être en situation irrégulière au regard du séjour
- Avoir des ressources inférieures au plafond CSS

**Points importants :**
- Pas de régularisation du séjour liée à l'AME
- Confidentialité des données vis-à-vis de la préfecture`,
            steps: [
                "Réunir les preuves de présence en France depuis 3 mois",
                "Remplir le formulaire cerfa 11573",
                "Déposer le dossier à la CPAM (guichet dédié souvent)",
                "Attendre l'instruction",
                "Récupérer l'attestation AME"
            ],
            documents: [
                "Formulaire cerfa 11573*06",
                "Document d'identité (passeport, ou tout document)",
                "Preuves de présence en France depuis 3 mois",
                "Justificatif de domicile ou attestation de domiciliation",
                "Justificatifs de ressources"
            ],
            documentsAlternatives: "Preuves de présence : factures, attestations associations, bons alimentaires datés, billets de transport...",
            timelines: "Instruction : 2 mois max. Droits ouverts pour 1 an.",
            commonRefusals: [
                "Présence de moins de 3 mois non prouvée",
                "Ressources supérieures au plafond",
                "Dossier incomplet"
            ],
            whatIfRefused: `**En cas de refus :**
- Recours gracieux auprès de la CPAM
- Puis recours contentieux au Tribunal administratif

**En urgence :** Les soins urgents sont pris en charge même sans AME (dispositif soins urgents).`,
            fieldTips: [
                "L'AME n'a aucun impact sur la situation administrative",
                "Les données AME ne sont PAS transmises à la préfecture",
                "Accompagner la personne au guichet peut aider",
                "Anticiper le renouvellement (non automatique)"
            ],
            relatedIds: ["puma", "css", "domiciliation"],
            sources: [
                { label: "Ameli - AME", url: "https://www.ameli.fr/assure/droits-demarches/situations-particulieres/situation-irreguliere-ame" }
            ]
        },
        {
            id: "allocations-familiales",
            title: "Allocations familiales",
            fullTitle: "Allocations familiales (AF)",
            category: "famille",
            tags: ["famille", "frequent"],
            icon: "👨‍👩‍👧‍👦",
            summary: "Prestations versées aux familles ayant au moins 2 enfants à charge de moins de 20 ans.",
            eligibility: `**Conditions principales :**
- Avoir au moins 2 enfants de moins de 20 ans à charge
- Résider en France
- Les enfants doivent vivre au foyer

**Montant (2026) :**
- Variable selon les ressources (modulé depuis 2015)
- Majoré à partir de 14 ans pour chaque enfant`,
            steps: [
                "Se connecter à l'espace CAF ou créer un compte",
                "Déclarer la composition du foyer",
                "Joindre les justificatifs si première demande",
                "Les AF sont ensuite versées automatiquement si éligible"
            ],
            documents: [
                "Déclaration de situation (en ligne)",
                "Livret de famille ou actes de naissance",
                "Pièce d'identité",
                "Justificatif de domicile",
                "Titre de séjour pour étrangers"
            ],
            documentsAlternatives: "",
            timelines: "Versement automatique le 5 du mois si éligible.",
            commonRefusals: [
                "Moins de 2 enfants à charge",
                "Enfant de plus de 20 ans",
                "Enfant ne vivant plus au foyer"
            ],
            whatIfRefused: `Vérifier la situation familiale déclarée à la CAF et mettre à jour si nécessaire.`,
            fieldTips: [
                "Penser à déclarer les changements de situation",
                "En cas de séparation : les AF peuvent être partagées",
                "L'allocation de rentrée scolaire (ARS) est distincte"
            ],
            relatedIds: ["asf", "paje", "rsa"],
            sources: [
                { label: "CAF - Allocations familiales", url: "https://www.caf.fr/allocataires/droits-et-prestations/s-informer-sur-les-aides/petite-enfance/les-allocations-familiales" }
            ]
        },
        {
            id: "asf",
            title: "ASF",
            fullTitle: "Allocation de Soutien Familial",
            category: "famille",
            tags: ["famille"],
            icon: "👤",
            summary: "Aide pour les parents isolés ou lorsque l'un des parents ne participe pas à l'entretien de l'enfant.",
            eligibility: `**Conditions principales :**
- Élever seul(e) un enfant dont l'autre parent :
  - Ne verse pas de pension alimentaire, ou
  - Verse une pension inférieure à l'ASF, ou
  - Est décédé, ou
  - Est inconnu
- L'enfant doit avoir moins de 20 ans

**Montant (2026) :** environ 195€/mois/enfant`,
            steps: [
                "Faire la demande sur caf.fr ou avec le formulaire",
                "Joindre les justificatifs de situation",
                "Si pension impayée : la CAF peut engager des recours"
            ],
            documents: [
                "Formulaire de demande ASF",
                "Justificatif de parent isolé",
                "Jugement fixant la pension alimentaire (le cas échéant)",
                "Preuves de non-versement de la pension"
            ],
            documentsAlternatives: "Sans jugement : une attestation sur l'honneur peut suffire initialement.",
            timelines: "Versement le 5 du mois suivant la demande.",
            commonRefusals: [
                "Vie maritale / PACS / concubinage",
                "Pension alimentaire versée et suffisante",
                "Enfant de plus de 20 ans"
            ],
            whatIfRefused: `Vérifier le statut d'isolement. Contester si la situation est mal évaluée.`,
            fieldTips: [
                "L'ASF est récupérable : la CAF peut poursuivre le parent défaillant",
                "Peut être versée en complément d'une pension insuffisante",
                "Penser à l'intermédiation financière des pensions alimentaires (IFPA)"
            ],
            relatedIds: ["allocations-familiales", "rsa"],
            sources: [
                { label: "CAF - ASF", url: "https://www.caf.fr/allocataires/droits-et-prestations/s-informer-sur-les-aides/solidarite-et-insertion/l-allocation-de-soutien-familial-asf" }
            ]
        },
        {
            id: "aides-exceptionnelles",
            title: "Aides exceptionnelles",
            fullTitle: "Aides exceptionnelles CAF / CCAS",
            category: "urgence",
            tags: ["urgence"],
            icon: "🆘",
            summary: "Aides ponctuelles pour faire face à des difficultés financières urgentes.",
            eligibility: `**Types d'aides :**
- **Secours CAF** : aide d'urgence ponctuelle
- **Aide alimentaire CCAS** : bons alimentaires, épicerie sociale
- **Aide au paiement factures** : énergie, eau (FSL)
- **Prêts d'honneur** : prêts à taux zéro

**Conditions :**
- Situation de difficulté avérée
- Généralement sous conditions de ressources
- Souvent attribuées sur évaluation sociale`,
            steps: [
                "Identifier l'aide adaptée à la situation",
                "Contacter le CCAS ou le service social",
                "Constituer un dossier avec justificatifs de situation",
                "Entretien avec un travailleur social souvent nécessaire",
                "Attendre la décision de la commission"
            ],
            documents: [
                "Pièce d'identité",
                "Justificatif de domicile",
                "Justificatifs de ressources",
                "Factures impayées (si aide au paiement)",
                "Tout justificatif de la situation d'urgence"
            ],
            documentsAlternatives: "",
            timelines: "Variable selon l'organisme. Urgences traitées en priorité.",
            commonRefusals: [
                "Ressources jugées suffisantes",
                "Aide déjà attribuée récemment",
                "Situation ne relevant pas de l'urgence"
            ],
            whatIfRefused: `Explorer les autres dispositifs : associations, Fondations (Abbé Pierre, Secours Catholique, etc.), CPAM (action sociale).`,
            fieldTips: [
                "Le CCAS est accessible à tous les habitants de la commune",
                "Ne pas hésiter à solliciter même pour de petits montants",
                "L'évaluation sociale permet souvent de découvrir d'autres droits",
                "Les délais peuvent être courts en cas d'urgence avérée"
            ],
            relatedIds: ["fsl", "rsa"],
            sources: [
                { label: "Service-public - CCAS", url: "https://www.service-public.fr/particuliers/vosdroits/F1312" }
            ]
        },
        {
            id: "domiciliation",
            title: "Domiciliation",
            fullTitle: "Domiciliation administrative",
            category: "urgence",
            tags: ["urgence", "administratif", "frequent"],
            icon: "📬",
            summary: "Adresse administrative pour les personnes sans domicile stable permettant l'accès aux droits.",
            eligibility: `**Qui peut en bénéficier :**
- Personnes sans domicile stable (SDF, hébergées chez des tiers, en squat, à l'hôtel, en habitat mobile...)
- Pour : demandeurs d'asile, bénéficiaires de l'AME, ou toute personne

**Organismes domiciliataires :**
- CCAS/CIAS (obligation légale)
- Associations agréées (SIAO, Secours Catholique, etc.)`,
            steps: [
                "Se rendre au CCAS ou à une association agréée",
                "Justifier de l'absence de domicile stable",
                "Remplir le formulaire de demande",
                "Fournir une pièce d'identité",
                "Attendre la décision (sous 2 mois)",
                "Récupérer l'attestation de domiciliation"
            ],
            documents: [
                "Pièce d'identité (ou récépissé de demande d'asile)",
                "Tout document prouvant le lien avec la commune",
                "Attestation sur l'honneur d'absence de domicile stable"
            ],
            documentsAlternatives: "Sans papiers d'identité : l'entretien peut suffire dans certains cas.",
            timelines: "Décision sous 2 mois max. Attestation valable 1 an renouvelable.",
            commonRefusals: [
                "Pas de lien avéré avec la commune",
                "Domiciliation déjà active ailleurs",
                "Capacités de l'organisme saturées"
            ],
            whatIfRefused: `**En cas de refus CCAS :**
- Le refus doit être motivé par écrit
- Recours devant le Tribunal administratif possible
- Essayer une association agréée

**Conseil :** Le CCAS ne peut refuser sans motif valable.`,
            fieldTips: [
                "La domiciliation est un DROIT, pas une faveur",
                "Elle permet d'obtenir : RSA, CSS, carte d'identité, inscription France Travail...",
                "Obligation de passer chercher le courrier régulièrement",
                "Prévenir si changement de situation ou déménagement"
            ],
            relatedIds: ["rsa", "css", "ame"],
            sources: [
                { label: "Service-public - Domiciliation", url: "https://www.service-public.fr/particuliers/vosdroits/F17317" }
            ]
        },
        {
            id: "prime-activite",
            title: "Prime d'activité",
            fullTitle: "Prime d'activité",
            category: "ressources",
            tags: ["ressources", "frequent"],
            icon: "💼",
            summary: "Complément de revenus pour les travailleurs aux revenus modestes.",
            eligibility: `**Conditions principales :**
- Avoir plus de 18 ans
- Exercer une activité professionnelle (salariée ou non)
- Avoir des revenus modestes (environ < 1,5 SMIC pour une personne seule)
- Résider en France de façon stable et régulière

**Qui est concerné :**
- Salariés, indépendants, étudiants salariés, apprentis (sous conditions)`,
            steps: [
                "Faire la simulation sur caf.fr",
                "Si éligible, créer ou se connecter au compte CAF",
                "Remplir la demande en ligne",
                "Déclarer ses ressources trimestriellement"
            ],
            documents: [
                "RIB",
                "Justificatifs de revenus (bulletins de salaire)",
                "Avis d'imposition"
            ],
            documentsAlternatives: "",
            timelines: "Versement le 5 du mois. Déclaration trimestrielle obligatoire.",
            commonRefusals: [
                "Revenus trop élevés",
                "Pas d'activité professionnelle",
                "Étudiant sans activité suffisante"
            ],
            whatIfRefused: `Vérifier les revenus déclarés. La prime peut varier chaque trimestre selon les ressources.`,
            fieldTips: [
                "Cumulable avec le RSA dans certains cas",
                "La déclaration trimestrielle est OBLIGATOIRE",
                "Les étudiants doivent avoir un revenu > 1 082€/mois sur le trimestre",
                "Penser à déclarer les changements de situation"
            ],
            relatedIds: ["rsa", "css"],
            sources: [
                { label: "CAF - Prime d'activité", url: "https://www.caf.fr/allocataires/droits-et-prestations/s-informer-sur-les-aides/solidarite-et-insertion/la-prime-d-activite" }
            ]
        },
        {
            id: "fsl",
            title: "FSL",
            fullTitle: "Fonds de Solidarité pour le Logement",
            category: "urgence",
            tags: ["urgence", "logement"],
            icon: "🏠",
            summary: "Aides financières pour accéder ou se maintenir dans un logement.",
            eligibility: `**Types d'aides FSL :**
- Aide à l'accès : dépôt de garantie, premier loyer, frais d'agence
- Aide au maintien : dette de loyer, impayés
- Aide aux factures : énergie, eau, téléphone

**Conditions :**
- Ressources modestes
- Critères variables selon les départements`,
            steps: [
                "Contacter un travailleur social ou le service FSL du département",
                "Constituer le dossier avec justificatifs",
                "Déposer la demande",
                "Passage en commission FSL",
                "Décision et versement direct au créancier souvent"
            ],
            documents: [
                "Formulaire de demande FSL",
                "Pièce d'identité",
                "Justificatif de domicile / bail",
                "3 derniers bulletins de salaire ou justificatifs de ressources",
                "Factures impayées ou devis (selon la demande)",
                "Avis d'imposition"
            ],
            documentsAlternatives: "",
            timelines: "Variable selon département : 1 à 3 mois généralement.",
            commonRefusals: [
                "Ressources trop élevées",
                "Dossier incomplet",
                "Aide déjà accordée récemment"
            ],
            whatIfRefused: `Explorer : Fonds d'urgence CCAS, associations (Secours Catholique, Croix-Rouge), Action Logement si salarié.`,
            fieldTips: [
                "Faire la demande AVANT la coupure d'énergie",
                "Un travailleur social peut accompagner le dossier",
                "Le FSL peut être une aide ou un prêt selon les cas",
                "Chaque département a son règlement intérieur FSL"
            ],
            relatedIds: ["aides-exceptionnelles", "domiciliation"],
            sources: [
                { label: "Service-public - FSL", url: "https://www.service-public.fr/particuliers/vosdroits/F1334" }
            ]
        },
        {
            id: "mdph",
            title: "Dossier MDPH",
            fullTitle: "Dossier Maison Départementale des Personnes Handicapées",
            category: "sante",
            tags: ["sante", "administratif"],
            icon: "📁",
            summary: "Dossier unique pour toutes les demandes liées au handicap (AAH, RQTH, carte, PCH...).",
            eligibility: `**Le dossier MDPH permet de demander :**
- AAH (allocation)
- RQTH (reconnaissance travailleur handicapé)
- Carte mobilité inclusion
- PCH (prestation de compensation)
- Orientation professionnelle ou médico-sociale
- AEEH (pour les enfants)`,
            steps: [
                "Télécharger ou retirer le formulaire cerfa 15692",
                "Obtenir le certificat médical MDPH récent",
                "Rédiger le projet de vie (très important)",
                "Joindre toutes les pièces demandées",
                "Déposer à la MDPH du département de résidence",
                "Attendre l'évaluation puis la décision CDAPH"
            ],
            documents: [
                "Formulaire cerfa 15692*01",
                "Certificat médical MDPH cerfa 15695 (< 6 mois)",
                "Pièce d'identité",
                "Justificatif de domicile",
                "Photo d'identité (si demande de carte)"
            ],
            documentsAlternatives: "Comptes-rendus médicaux, bilans de spécialistes : à joindre au dossier.",
            timelines: "Délai moyen : 4 à 6 mois (parfois plus).",
            commonRefusals: [
                "Certificat médical insuffisant ou périmé",
                "Projet de vie absent ou peu détaillé",
                "Handicap non reconnu au taux demandé"
            ],
            whatIfRefused: `**Recours :**
1. Recours gracieux MDPH (2 mois)
2. Tribunal judiciaire pôle social

**Conseil :** Demander les motivations détaillées du refus.`,
            fieldTips: [
                "Le projet de vie fait souvent la différence",
                "Décrire les difficultés concrètes au quotidien",
                "Possibilité de se faire aider par une association",
                "Conserver une copie complète du dossier"
            ],
            relatedIds: ["aah", "rqth", "pch"],
            sources: [
                { label: "MDPH", url: "https://mdphenligne.cnsa.fr/" }
            ]
        },
        {
            id: "rqth",
            title: "RQTH",
            fullTitle: "Reconnaissance de la Qualité de Travailleur Handicapé",
            category: "sante",
            tags: ["sante", "emploi"],
            icon: "💼",
            summary: "Reconnaissance permettant d'accéder à des dispositifs d'aide à l'emploi.",
            eligibility: `**Conditions :**
- Avoir une altération d'une ou plusieurs fonctions (physique, sensorielle, mentale, psychique)
- Cette altération réduit les possibilités d'obtenir ou conserver un emploi

**La RQTH permet :**
- Accès à l'obligation d'emploi (entreprises > 20 salariés)
- Aide Agefiph/Fiphfp
- Aménagement de poste
- Accès à des formations adaptées`,
            steps: [
                "Remplir le dossier MDPH (cerfa 15692)",
                "Cocher la case RQTH",
                "Joindre le certificat médical",
                "Déposer à la MDPH",
                "Attendre la décision CDAPH"
            ],
            documents: [
                "Formulaire MDPH",
                "Certificat médical MDPH",
                "CV si orientation professionnelle demandée"
            ],
            documentsAlternatives: "",
            timelines: "4 à 6 mois. Durée d'attribution : 1 à 10 ans.",
            commonRefusals: [
                "Handicap jugé sans impact sur l'emploi",
                "Dossier médical insuffisant"
            ],
            whatIfRefused: `Contester avec des éléments complémentaires sur l'impact professionnel.`,
            fieldTips: [
                "La RQTH n'oblige pas à informer l'employeur",
                "Utile même en emploi (aménagements possibles)",
                "Peut être demandée seule ou avec l'AAH",
                "À mentionner à France Travail pour un meilleur accompagnement"
            ],
            relatedIds: ["aah", "mdph"],
            sources: [
                { label: "Agefiph - RQTH", url: "https://www.agefiph.fr/articles/conseil-pratiques/tout-savoir-sur-la-reconnaissance-de-la-qualite-de-travailleur-handicape" }
            ]
        },
        {
            id: "pch",
            title: "PCH",
            fullTitle: "Prestation de Compensation du Handicap",
            category: "sante",
            tags: ["sante"],
            icon: "🤲",
            summary: "Aide financière pour compenser les besoins liés au handicap (aide humaine, technique, aménagement...).",
            eligibility: `**Conditions :**
- Difficulté absolue pour 1 activité OU difficulté grave pour 2 activités
- Moins de 60 ans (ou handicap reconnu avant 60 ans)
- Résider en France

**La PCH couvre :**
- Aide humaine
- Aides techniques
- Aménagement du logement/véhicule
- Charges spécifiques`,
            steps: [
                "Déposer un dossier MDPH",
                "Demander explicitement la PCH",
                "Évaluation à domicile par l'équipe pluridisciplinaire",
                "Plan personnalisé de compensation proposé",
                "Décision CDAPH"
            ],
            documents: [
                "Formulaire MDPH",
                "Certificat médical",
                "Devis pour aménagements si demandés"
            ],
            documentsAlternatives: "",
            timelines: "4 à 6 mois. Peut être rétroactive.",
            commonRefusals: [
                "Critères de difficultés non atteints",
                "Évaluation insuffisante des besoins"
            ],
            whatIfRefused: `Demander une nouvelle évaluation avec éléments complémentaires.`,
            fieldTips: [
                "L'évaluation à domicile est importante : bien préparer",
                "Décrire une journée type avec les difficultés",
                "La PCH peut être en nature ou en espèces",
                "Cumulable avec l'AAH"
            ],
            relatedIds: ["aah", "mdph"],
            sources: [
                { label: "Service-public - PCH", url: "https://www.service-public.fr/particuliers/vosdroits/F14202" }
            ]
        },
        {
            id: "paje",
            title: "PAJE",
            fullTitle: "Prestation d'Accueil du Jeune Enfant",
            category: "famille",
            tags: ["famille"],
            icon: "👶",
            summary: "Ensemble de prestations pour l'arrivée et l'accueil d'un enfant.",
            eligibility: `**La PAJE comprend :**
- Prime à la naissance/adoption
- Allocation de base (sous conditions de ressources)
- Complément libre choix du mode de garde (CMG)
- Complément libre choix d'activité (PreParE)

**Conditions :** Grossesse déclarée, enfant de moins de 3 ans, résidence en France.`,
            steps: [
                "Déclarer la grossesse à la CAF et CPAM avant 14 semaines",
                "La CAF examine automatiquement les droits",
                "Pour le CMG : déclarer le mode de garde"
            ],
            documents: [
                "Déclaration de grossesse",
                "Livret de famille ou acte de naissance",
                "Justificatif du mode de garde pour le CMG"
            ],
            documentsAlternatives: "",
            timelines: "Prime naissance : 7ème mois de grossesse. Allocation de base : mensuelle.",
            commonRefusals: [
                "Déclaration tardive",
                "Ressources supérieures au plafond (allocation de base)"
            ],
            whatIfRefused: `Vérifier les ressources. Le CMG est moins restrictif.`,
            fieldTips: [
                "La déclaration précoce de grossesse est importante",
                "Le CMG aide même les familles non éligibles à l'allocation de base",
                "Penser à actualiser le mode de garde"
            ],
            relatedIds: ["allocations-familiales"],
            sources: [
                { label: "CAF - PAJE", url: "https://www.caf.fr/allocataires/droits-et-prestations/s-informer-sur-les-aides/petite-enfance/la-prestation-d-accueil-du-jeune-enfant-paje" }
            ]
        },
        {
            id: "apl",
            title: "APL / AL",
            fullTitle: "Aides au Logement (APL, ALF, ALS)",
            category: "ressources",
            tags: ["ressources", "logement", "frequent"],
            icon: "🏠",
            summary: "Aides pour réduire le montant du loyer ou de la mensualité d'emprunt immobilier.",
            eligibility: `**Types d'aides :**
- APL : logements conventionnés
- ALF : familles avec enfants ou ascendants
- ALS : autres situations

**Conditions communes :**
- Locataire ou accédant à la propriété
- Logement décent et résidence principale
- Ressources inférieures aux plafonds`,
            steps: [
                "Faire une simulation sur caf.fr",
                "Créer ou se connecter au compte CAF",
                "Déclarer le logement et le bail",
                "Transmettre l'attestation de loyer au bailleur",
                "L'aide est versée au bailleur (tiers payant) généralement"
            ],
            documents: [
                "Bail / contrat de location",
                "Attestation de loyer (remplie par le bailleur)",
                "RIB"
            ],
            documentsAlternatives: "",
            timelines: "Calculée au réel. Versée mensuellement.",
            commonRefusals: [
                "Logement non décent",
                "Propriétaire de la famille",
                "Ressources trop élevées"
            ],
            whatIfRefused: `Vérifier les critères du logement. Un logement non décent peut être mis aux normes.`,
            fieldTips: [
                "L'APL est calculée sur les ressources N-2 puis en temps réel",
                "Déclarer tout changement (revenus, colocation, déménagement)",
                "En colocation : chaque colocataire fait sa demande",
                "L'aide peut être versée directement au bailleur"
            ],
            relatedIds: ["fsl", "rsa"],
            sources: [
                { label: "CAF - Aides au logement", url: "https://www.caf.fr/allocataires/droits-et-prestations/s-informer-sur-les-aides/logement-et-cadre-de-vie/les-aides-au-logement" }
            ]
        },
        {
            id: "aspa",
            title: "ASPA",
            fullTitle: "Allocation de Solidarité aux Personnes Âgées",
            category: "ressources",
            tags: ["ressources"],
            icon: "👴",
            summary: "Minimum vieillesse pour les personnes âgées à faibles ressources.",
            eligibility: `**Conditions :**
- 65 ans ou plus (62 ans si inapte au travail)
- Résider en France au moins 9 mois/an
- Ressources inférieures au plafond ASPA
- Avoir demandé toutes ses retraites

**Montant 2026 (environ) :**
- Personne seule : ~1 012€/mois
- Couple : ~1 571€/mois`,
            steps: [
                "Demander toutes ses retraites d'abord",
                "Faire la demande auprès de la caisse de retraite principale",
                "Ou à la Carsat/MSA selon le régime",
                "Joindre les justificatifs"
            ],
            documents: [
                "Formulaire de demande ASPA",
                "Pièce d'identité",
                "Justificatif de domicile",
                "Relevé de toutes les pensions",
                "Avis d'imposition"
            ],
            documentsAlternatives: "",
            timelines: "2 à 3 mois d'instruction.",
            commonRefusals: [
                "Ressources trop élevées",
                "Résidence en France insuffisante",
                "Retraites non demandées"
            ],
            whatIfRefused: `Vérifier que toutes les retraites sont liquidées. Contester si erreur de calcul.`,
            fieldTips: [
                "L'ASPA est récupérable sur succession (> 100 000€)",
                "Informer la personne de cette récupération",
                "Les ressources du couple sont prises en compte",
                "Penser à la CSS en complément"
            ],
            relatedIds: ["css"],
            sources: [
                { label: "Service-public - ASPA", url: "https://www.service-public.fr/particuliers/vosdroits/F16871" }
            ]
        },
        {
            id: "garantie-jeunes",
            title: "CEJ",
            fullTitle: "Contrat d'Engagement Jeune (ex-Garantie Jeunes)",
            category: "ressources",
            tags: ["ressources", "emploi"],
            icon: "🎓",
            summary: "Accompagnement intensif et allocation pour les jeunes en difficulté d'insertion.",
            eligibility: `**Conditions :**
- 16 à 25 ans (30 ans si RQTH)
- Ni en emploi, ni en études, ni en formation (NEET)
- Difficultés d'accès à l'emploi
- Volonté de s'engager dans un parcours intensif

**L'allocation (~500€/mois) est conditionnée au respect des engagements.`,
            steps: [
                "S'inscrire à la Mission Locale",
                "Entretien de diagnostic",
                "Si éligible : signature du contrat d'engagement",
                "Parcours intensif (ateliers, immersions, accompagnement)",
                "Versement de l'allocation mensuelle"
            ],
            documents: [
                "Pièce d'identité",
                "Justificatif de domicile",
                "CV (si disponible)"
            ],
            documentsAlternatives: "",
            timelines: "Contrat de 6 à 12 mois renouvelable jusqu'à 18 mois.",
            commonRefusals: [
                "Déjà en emploi ou formation",
                "Non-respect des engagements pendant le parcours"
            ],
            whatIfRefused: `Essayer un autre parcours Mission Locale ou dispositif France Travail.`,
            fieldTips: [
                "L'accompagnement est intensif : plusieurs RDV par semaine",
                "Les immersions en entreprise sont un bon levier",
                "L'allocation est dégressive si reprise d'activité",
                "Bonne porte d'entrée pour les jeunes les plus éloignés"
            ],
            relatedIds: ["rsa", "prime-activite"],
            sources: [
                { label: "1jeune1solution - CEJ", url: "https://www.1jeune1solution.gouv.fr/contrat-engagement-jeune" }
            ]
        }
    ],

    // ===== DISPOSITIFS BANCAIRES =====
    bancaire: [
        {
            id: "droit-au-compte",
            title: "Droit au compte",
            fullTitle: "Droit au compte - Banque de France",
            category: "compte",
            tags: ["bancaire", "frequent"],
            icon: "🏦",
            summary: "Droit d'obtenir un compte bancaire même après refus d'une banque.",
            eligibility: `**Qui peut en bénéficier :**
- Toute personne physique résidant en France
- Ayant essuyé un refus d'ouverture de compte

**Pas de conditions de ressources ni de régularité du séjour.`,
            steps: [
                "Demander une attestation de refus à la banque (obligatoire)",
                "Se rendre à la Banque de France ou faire la demande en ligne",
                "Remplir le formulaire de demande de droit au compte",
                "Joindre l'attestation de refus + pièces",
                "La BdF désigne une banque sous 1 jour ouvré",
                "La banque désignée ouvre le compte sous 3 jours ouvrés"
            ],
            documents: [
                "Attestation de refus de la banque (ou demande restée sans réponse 15 jours)",
                "Pièce d'identité valide",
                "Justificatif de domicile (ou attestation de domiciliation)"
            ],
            documentsAlternatives: "Sans pièce d'identité : un récépissé de demande peut suffire.",
            timelines: "Désignation en 1 jour ouvré, ouverture en 3 jours ouvrés après.",
            commonRefusals: [
                "Dossier incomplet",
                "Déjà titulaire d'un compte (rare)"
            ],
            whatIfRefused: `La banque désignée ne peut PAS refuser. Si problème : contacter la BdF ou le médiateur bancaire.`,
            fieldTips: [
                "La banque peut limiter aux services bancaires de base (SBB)",
                "Les SBB sont gratuits",
                "Penser à l'accompagnement pour les démarches en ligne",
                "Le droit au compte est opposable et effectif"
            ],
            relatedIds: ["compte-paiement", "interdit-bancaire"],
            sources: [
                { label: "Banque de France - Droit au compte", url: "https://www.banque-france.fr/particuliers/inclusion-financiere/exercer-son-droit-au-compte" }
            ]
        },
        {
            id: "compte-paiement",
            title: "Compte de paiement",
            fullTitle: "Compte de paiement (alternative au compte bancaire)",
            category: "compte",
            tags: ["bancaire"],
            icon: "💳",
            summary: "Alternative au compte bancaire classique via des établissements de paiement.",
            eligibility: `**Avantages :**
- Ouverture simplifiée
- Pas de vérification d'antécédents bancaires
- Permet de recevoir des virements, payer, retirer

**Exemples :**
- Nickel (buralistes)
- Compte en ligne (N26, Revolut...)
- La Banque Postale (offre spécifique)`,
            steps: [
                "Se rendre chez un buraliste (Nickel) ou en ligne",
                "Fournir une pièce d'identité",
                "Recevoir la carte et les identifiants",
                "Activer le compte"
            ],
            documents: [
                "Pièce d'identité",
                "Téléphone mobile"
            ],
            documentsAlternatives: "Certains néobanques acceptent les titres de séjour.",
            timelines: "Ouverture immédiate à quelques jours selon l'établissement.",
            commonRefusals: [
                "Pièce d'identité non acceptée",
                "Personne mineure sans accord parental"
            ],
            whatIfRefused: `Essayer un autre établissement ou utiliser le droit au compte.`,
            fieldTips: [
                "Nickel est accessible sans condition bancaire",
                "Frais à vérifier selon les établissements",
                "Pas de découvert ni chèque généralement",
                "Permet de recevoir salaire et prestations"
            ],
            relatedIds: ["droit-au-compte"],
            sources: [
                { label: "Compte Nickel", url: "https://www.compte-nickel.fr/" }
            ]
        },
        {
            id: "interdit-bancaire",
            title: "Interdit bancaire",
            fullTitle: "Interdit bancaire et fichage Banque de France",
            category: "fichage",
            tags: ["bancaire", "frequent"],
            icon: "⛔",
            summary: "Comprendre et gérer une inscription au FCC ou FICP.",
            eligibility: `**Types de fichage :**
- **FCC** (Fichier Central des Chèques) : chèques sans provision, retraits de carte
- **FICP** (Fichier des Incidents de Crédits aux Particuliers) : incidents de remboursement de crédit

**Durée :**
- FCC : 5 ans (ou régularisation)
- FICP incidents : 5 ans
- FICP surendettement : durée du plan (max 7 ans)`,
            steps: [
                "Vérifier son fichage : demande écrite ou en ligne à la BdF",
                "Identifier la cause (banque à contacter)",
                "Régulariser si possible (payer le chèque, rembourser l'incident)",
                "Demander la levée du fichage à la banque",
                "Vérifier la radiation effective"
            ],
            documents: [
                "Demande écrite à la Banque de France",
                "Pièce d'identité",
                "Preuve de régularisation (si applicable)"
            ],
            documentsAlternatives: "",
            timelines: "Radiation sous 2 jours ouvrés après régularisation.",
            commonRefusals: [],
            whatIfRefused: `Si la banque refuse de radier après régularisation : saisir le médiateur bancaire ou la Banque de France.`,
            fieldTips: [
                "Le fichage n'interdit pas d'avoir un compte (droit au compte)",
                "Vérifier son fichage est gratuit",
                "Le FICP limite l'accès au crédit mais pas au compte",
                "Anticiper les fins de plan de surendettement"
            ],
            relatedIds: ["droit-au-compte", "surendettement"],
            sources: [
                { label: "Banque de France - FCC/FICP", url: "https://www.banque-france.fr/particuliers/fichiers-dincidents-bancaires" }
            ]
        },
        {
            id: "frais-bancaires",
            title: "Frais bancaires",
            fullTitle: "Contestation et plafonnement des frais bancaires",
            category: "frais",
            tags: ["bancaire"],
            icon: "💸",
            summary: "Connaître ses droits pour limiter et contester les frais abusifs.",
            eligibility: `**Plafonnements légaux :**
- Commission d'intervention : max 8€/opération, 80€/mois
- Clientèle fragile : max 4€/opération, 20€/mois
- Offre spécifique clientèle fragile : max 3€/mois tout compris

**Contestation possible si :**
- Frais non prévus au contrat
- Frais disproportionnés
- Défaut d'information`,
            steps: [
                "Relever les frais contestés sur les relevés",
                "Écrire une réclamation à la banque (courrier recommandé)",
                "En cas de non-réponse sous 2 mois : saisir le médiateur bancaire",
                "Possibilité d'action en justice pour frais abusifs"
            ],
            documents: [
                "Relevés de compte montrant les frais",
                "Convention de compte",
                "Courrier de réclamation"
            ],
            documentsAlternatives: "",
            timelines: "Réponse de la banque attendue sous 2 mois.",
            commonRefusals: [
                "Frais conformes au contrat"
            ],
            whatIfRefused: `Saisir le médiateur bancaire (coordonnées sur les relevés). En dernier recours : juge de proximité.`,
            fieldTips: [
                "Demander l'offre clientèle fragile si éligible",
                "Les services bancaires de base sont gratuits",
                "Garder tous les relevés comme preuve",
                "Certaines associations aident aux contestations (CLCV, UFC)"
            ],
            relatedIds: ["droit-au-compte"],
            sources: [
                { label: "Service-public - Frais bancaires", url: "https://www.service-public.fr/particuliers/vosdroits/F31475" }
            ]
        },
        {
            id: "microcredit",
            title: "Microcrédit personnel",
            fullTitle: "Microcrédit personnel accompagné",
            category: "credit",
            tags: ["bancaire"],
            icon: "🤝",
            summary: "Petit prêt pour les personnes exclues du crédit bancaire classique.",
            eligibility: `**Pour qui :**
- Personnes exclues du crédit classique
- Projet d'insertion : mobilité, formation, logement, santé...

**Montants :** 300€ à 8 000€
**Durée :** 6 mois à 7 ans
**Taux :** réduit (souvent < 5%)`,
            steps: [
                "Contacter un accompagnateur agréé (CCAS, association, ADIE...)",
                "Présenter le projet et la situation financière",
                "Monter le dossier avec l'accompagnateur",
                "Transmission à la banque partenaire",
                "Décision et déblocage des fonds"
            ],
            documents: [
                "Pièce d'identité",
                "Justificatifs de ressources",
                "Devis ou descriptif du projet",
                "RIB"
            ],
            documentsAlternatives: "",
            timelines: "1 à 2 mois entre demande et déblocage.",
            commonRefusals: [
                "Projet non viable",
                "Surendettement en cours",
                "Capacité de remboursement insuffisante"
            ],
            whatIfRefused: `Retravailler le projet avec l'accompagnateur. Explorer d'autres aides (FSL, aides CCAS).`,
            fieldTips: [
                "L'accompagnement est OBLIGATOIRE et gratuit",
                "Le microcrédit peut aider à sortir d'un cercle de crédit revolving",
                "Bien calibrer les mensualités pour éviter l'incident",
                "Certains microcrédits sont garantis par l'État"
            ],
            relatedIds: ["aides-exceptionnelles"],
            sources: [
                { label: "France Microcrédit", url: "https://www.france-microcredit.fr/" }
            ]
        },
        {
            id: "surendettement",
            title: "Surendettement",
            fullTitle: "Procédure de surendettement",
            category: "fichage",
            tags: ["bancaire"],
            icon: "📉",
            summary: "Procédure pour traiter une situation de surendettement auprès de la Banque de France.",
            eligibility: `**Conditions :**
- Être de bonne foi
- Être dans l'impossibilité manifeste de faire face à l'ensemble de ses dettes
- Dettes personnelles (pas professionnelles)

**Ce que permet la procédure :**
- Gel des poursuites
- Rééchelonnement des dettes
- Effacement partiel ou total possible`,
            steps: [
                "Télécharger le dossier sur le site de la BdF",
                "Remplir avec la liste complète des dettes et ressources",
                "Déposer à la BdF (en ligne, courrier ou sur place)",
                "Attente de la décision de recevabilité",
                "Si recevable : orientation vers plan ou procédure"
            ],
            documents: [
                "Formulaire de déclaration de surendettement",
                "Pièces d'identité",
                "Justificatifs de ressources et charges",
                "Liste des dettes avec justificatifs",
                "Avis d'imposition"
            ],
            documentsAlternatives: "",
            timelines: "Recevabilité : 3 mois max. Puis plan ou procédure sur plusieurs mois/années.",
            commonRefusals: [
                "Mauvaise foi avérée",
                "Dettes professionnelles uniquement",
                "Patrimoine permettant de désintéresser les créanciers"
            ],
            whatIfRefused: `Contester la décision d'irrecevabilité. Représenter le dossier si changement de situation.`,
            fieldTips: [
                "La procédure suspend les saisies (sauf alimentaire)",
                "Fichage FICP pendant la durée du plan",
                "L'effacement de dette est possible en dernier recours",
                "Un accompagnement social est recommandé"
            ],
            relatedIds: ["interdit-bancaire"],
            sources: [
                { label: "Banque de France - Surendettement", url: "https://www.banque-france.fr/particuliers/surendettement/deposer-un-dossier-de-surendettement" }
            ]
        }
    ],

    // ===== MODÈLES =====
    modeles: [
        {
            id: "modele-contestation-frais",
            title: "Contestation frais bancaires",
            type: "courrier",
            category: "bancaire",
            icon: "📝",
            usage: "À envoyer en recommandé avec AR à votre banque pour contester des frais.",
            content: `[Votre nom et prénom]
[Votre adresse]
[Code postal et ville]
[Téléphone]
[Email]

[Nom de la banque]
[Service réclamations]
[Adresse de la banque]

À [Ville], le [Date]

Objet : Contestation de frais bancaires
N° de compte : [Votre numéro de compte]

Madame, Monsieur,

Je me permets de contester les frais suivants prélevés sur mon compte :

- [Date] : [Nature du frais] - [Montant]€
- [Date] : [Nature du frais] - [Montant]€

[Choisir le motif approprié :]
- Ces frais ne correspondent pas à la tarification prévue dans ma convention de compte.
- Ces frais me semblent disproportionnés au regard de l'incident concerné.
- Je n'ai pas été préalablement informé(e) de ces frais.
- Ma situation financière me permet de bénéficier du plafonnement des frais pour clientèle fragile.

Je vous demande donc le remboursement de ces frais à hauteur de [montant total]€.

À défaut de réponse favorable sous 30 jours, je me réserve le droit de saisir le médiateur bancaire.

Veuillez agréer, Madame, Monsieur, l'expression de mes salutations distinguées.

[Signature]

PJ : Copies des relevés de compte concernés`,
            relatedIds: ["frais-bancaires"]
        },
        {
            id: "modele-droit-compte",
            title: "Demande droit au compte",
            type: "courrier",
            category: "bancaire",
            icon: "📝",
            usage: "À joindre à la demande de droit au compte auprès de la Banque de France.",
            content: `[Votre nom et prénom]
[Votre adresse ou adresse de domiciliation]
[Code postal et ville]

Banque de France
[Adresse de la succursale de votre département]

À [Ville], le [Date]

Objet : Demande d'exercice du droit au compte (article L.312-1 du Code monétaire et financier)

Madame, Monsieur,

N'étant actuellement titulaire d'aucun compte de dépôt et ayant fait l'objet d'un refus d'ouverture de compte de la part de [Nom de la banque] en date du [Date du refus], je sollicite l'exercice de mon droit au compte.

Vous trouverez ci-joint :
- L'attestation de refus d'ouverture de compte délivrée par [Nom de la banque]
- La copie de ma pièce d'identité
- Un justificatif de domicile [ou attestation de domiciliation]

Je vous remercie de bien vouloir désigner un établissement de crédit qui sera tenu de m'ouvrir un compte avec accès aux services bancaires de base.

Veuillez agréer, Madame, Monsieur, l'expression de mes salutations distinguées.

[Signature]

PJ :
- Attestation de refus
- Copie pièce d'identité
- Justificatif de domicile`,
            relatedIds: ["droit-au-compte"]
        },
        {
            id: "modele-recours-caf",
            title: "Recours amiable CAF",
            type: "courrier",
            category: "social",
            icon: "📝",
            usage: "Modèle pour contester une décision de la CAF auprès de la Commission de recours amiable.",
            content: `[Votre nom et prénom]
[Votre adresse]
[Code postal et ville]
[N° allocataire : XXXXXXXXX]

CAF de [Département]
Commission de Recours Amiable
[Adresse de votre CAF]

À [Ville], le [Date]

Objet : Recours amiable contre la décision du [date de la décision]

Madame, Monsieur,

Je conteste la décision de la CAF en date du [date] concernant [préciser : refus de RSA, suspension d'allocation, trop-perçu réclamé, etc.].

[Exposer les faits et les motifs de contestation :]
- [Motif 1]
- [Motif 2]

[Si demande de remise de dette :]
Ma situation financière actuelle ne me permet pas de rembourser la somme réclamée. Je sollicite une remise totale/partielle de cette dette.

Je joins à ce courrier les pièces justificatives suivantes :
- [Liste des documents joints]

Je vous remercie de bien vouloir réexaminer ma situation et vous prie d'agréer, Madame, Monsieur, l'expression de mes salutations distinguées.

[Signature]

PJ : [Liste des pièces jointes]`,
            relatedIds: ["rsa", "apl"]
        },
        {
            id: "modele-recours-mdph",
            title: "Recours gracieux MDPH",
            type: "courrier",
            category: "social",
            icon: "📝",
            usage: "Modèle pour contester une décision MDPH dans les 2 mois suivant la notification.",
            content: `[Votre nom et prénom]
[Votre adresse]
[Code postal et ville]
[N° de dossier MDPH : XXXXXXXX]

MDPH de [Département]
[Adresse de la MDPH]

À [Ville], le [Date]

Objet : Recours gracieux contre la décision CDAPH du [date]

Madame, Monsieur,

Je conteste la décision de la CDAPH notifiée le [date de réception] concernant [préciser : refus d'AAH, taux d'incapacité attribué, refus de RQTH, etc.].

[Exposer les motifs de contestation :]
Ma situation de handicap a les conséquences suivantes sur ma vie quotidienne et/ou professionnelle :
- [Décrire les difficultés concrètes]
- [Impact sur l'emploi si RQTH ou AAH avec RSDAE]

Je demande le réexamen de ma situation et l'attribution de [préciser la demande].

Je joins à ce recours les éléments complémentaires suivants :
- [Certificats médicaux complémentaires]
- [Attestations de proches ou professionnels]
- [Autres justificatifs]

Dans l'attente de votre réponse, veuillez agréer, Madame, Monsieur, l'expression de mes salutations distinguées.

[Signature]

PJ : [Liste des pièces jointes]`,
            relatedIds: ["aah", "mdph", "rqth"]
        }
    ],

    // ===== GLOSSAIRE =====
    glossaire: [
        { id: "aah", term: "AAH", expanded: "Allocation aux Adultes Handicapés", definition_short: "Allocation garantissant un revenu minimum aux personnes en situation de handicap.", definition_field: "Prestation MDPH versée par la CAF. Taux d'incapacité ≥80% ou 50-79% avec restriction d'accès à l'emploi.", tags: ["social"], relatedIds: ["aah"] },
        { id: "aeeh", term: "AEEH", expanded: "Allocation d'Éducation de l'Enfant Handicapé", definition_short: "Allocation pour les parents d'enfants handicapés de moins de 20 ans.", definition_field: "Versée par la CAF sur décision MDPH. Compléments possibles selon le niveau de handicap.", tags: ["social"], relatedIds: ["mdph"] },
        { id: "ame", term: "AME", expanded: "Aide Médicale de l'État", definition_short: "Couverture santé pour les personnes en situation irrégulière.", definition_field: "Condition : résider en France depuis +3 mois, ressources sous plafond CSS. Confidentialité garantie.", tags: ["sante"], relatedIds: ["ame"] },
        { id: "apl", term: "APL", expanded: "Aide Personnalisée au Logement", definition_short: "Aide au paiement du loyer pour les logements conventionnés.", definition_field: "Versée par la CAF, calculée selon ressources et loyer. Souvent versée directement au bailleur.", tags: ["social"], relatedIds: ["apl"] },
        { id: "are", term: "ARE", expanded: "Allocation de Retour à l'Emploi", definition_short: "Allocation chômage pour les demandeurs d'emploi.", definition_field: "Versée par France Travail. Durée et montant selon l'historique de cotisation.", tags: ["social"], relatedIds: ["ass"] },
        { id: "asf", term: "ASF", expanded: "Allocation de Soutien Familial", definition_short: "Aide pour les parents élevant seuls leur(s) enfant(s).", definition_field: "Versée si l'autre parent ne paie pas ou peu de pension alimentaire. Env. 195€/mois/enfant.", tags: ["social"], relatedIds: ["asf"] },
        { id: "aspa", term: "ASPA", expanded: "Allocation de Solidarité aux Personnes Âgées", definition_short: "Minimum vieillesse pour les personnes de 65 ans et plus.", definition_field: "Récupérable sur succession si actif >100 000€. Env. 1 012€/mois personne seule.", tags: ["social"], relatedIds: ["aspa"] },
        { id: "ass", term: "ASS", expanded: "Allocation de Solidarité Spécifique", definition_short: "Allocation pour les chômeurs en fin de droits ARE.", definition_field: "Condition : 5 ans d'activité sur les 10 dernières années. Versée par France Travail.", tags: ["social"], relatedIds: ["ass"] },
        { id: "caf", term: "CAF", expanded: "Caisse d'Allocations Familiales", definition_short: "Organisme versant les prestations familiales et sociales.", definition_field: "Gère RSA, APL, allocations familiales, prime d'activité... Compte en ligne sur caf.fr.", tags: ["social"], relatedIds: [] },
        { id: "ccas", term: "CCAS", expanded: "Centre Communal d'Action Sociale", definition_short: "Service municipal d'aide sociale.", definition_field: "Aide d'urgence, domiciliation, accompagnement social. Présent dans chaque commune.", tags: ["social"], relatedIds: ["domiciliation", "aides-exceptionnelles"] },
        { id: "cdaph", term: "CDAPH", expanded: "Commission des Droits et de l'Autonomie des Personnes Handicapées", definition_short: "Commission qui décide des droits liés au handicap.", definition_field: "Siège à la MDPH. Décide AAH, RQTH, orientation, PCH, carte mobilité inclusion...", tags: ["social"], relatedIds: ["mdph"] },
        { id: "cej", term: "CEJ", expanded: "Contrat d'Engagement Jeune", definition_short: "Parcours intensif d'accompagnement pour les jeunes NEET.", definition_field: "Remplace la Garantie Jeunes. 16-25 ans (30 si RQTH). Allocation ~500€/mois.", tags: ["social"], relatedIds: ["garantie-jeunes"] },
        { id: "cmg", term: "CMG", expanded: "Complément de libre choix du Mode de Garde", definition_short: "Aide pour financer la garde d'enfant.", definition_field: "Composante de la PAJE. Aide pour assistante maternelle, garde à domicile, micro-crèche.", tags: ["social"], relatedIds: ["paje"] },
        { id: "cpam", term: "CPAM", expanded: "Caisse Primaire d'Assurance Maladie", definition_short: "Organisme gérant l'assurance maladie obligatoire.", definition_field: "Affiliation sécu, remboursements, CSS, PUMA. Compte en ligne sur ameli.fr.", tags: ["sante"], relatedIds: ["css", "puma"] },
        { id: "cra", term: "CRA", expanded: "Commission de Recours Amiable", definition_short: "Instance de recours interne à la CAF ou CPAM.", definition_field: "Première étape de contestation d'une décision. Délai : 2 mois après notification.", tags: ["social"], relatedIds: [] },
        { id: "css", term: "CSS", expanded: "Complémentaire Santé Solidaire", definition_short: "Mutuelle gratuite ou à faible coût pour revenus modestes.", definition_field: "Remplace la CMU-C et l'ACS. Tiers payant intégral, pas de franchise médicale.", tags: ["sante"], relatedIds: ["css"] },
        { id: "fcc", term: "FCC", expanded: "Fichier Central des Chèques", definition_short: "Fichier des interdits bancaires (chèques, cartes).", definition_field: "Géré par la Banque de France. Consultation gratuite sur demande.", tags: ["bancaire"], relatedIds: ["interdit-bancaire"] },
        { id: "ficp", term: "FICP", expanded: "Fichier des Incidents de remboursement des Crédits aux Particuliers", definition_short: "Fichier des incidents de crédit et surendettement.", definition_field: "Inscription suite à incidents de paiement crédit. Limite l'accès aux nouveaux crédits.", tags: ["bancaire"], relatedIds: ["interdit-bancaire", "surendettement"] },
        { id: "fsl", term: "FSL", expanded: "Fonds de Solidarité pour le Logement", definition_short: "Aide financière pour accéder ou se maintenir dans un logement.", definition_field: "Géré par le Département. Aide au dépôt de garantie, dettes de loyer, factures énergie.", tags: ["social"], relatedIds: ["fsl"] },
        { id: "mdph", term: "MDPH", expanded: "Maison Départementale des Personnes Handicapées", definition_short: "Guichet unique pour les démarches liées au handicap.", definition_field: "Évalue le handicap, oriente vers les droits (AAH, RQTH, PCH, carte...). Dossier unique.", tags: ["social"], relatedIds: ["mdph", "aah"] },
        { id: "msa", term: "MSA", expanded: "Mutualité Sociale Agricole", definition_short: "Sécurité sociale du monde agricole.", definition_field: "Équivalent de la CAF+CPAM pour les salariés et exploitants agricoles.", tags: ["social"], relatedIds: [] },
        { id: "neet", term: "NEET", expanded: "Not in Education, Employment or Training", definition_short: "Jeune ni en emploi, ni en études, ni en formation.", definition_field: "Cible prioritaire des dispositifs d'insertion jeunes (CEJ, Mission Locale).", tags: ["social"], relatedIds: ["garantie-jeunes"] },
        { id: "paje", term: "PAJE", expanded: "Prestation d'Accueil du Jeune Enfant", definition_short: "Ensemble d'aides pour l'accueil d'un enfant de moins de 3 ans.", definition_field: "Comprend : prime de naissance, allocation de base, CMG, PreParE.", tags: ["social"], relatedIds: ["paje"] },
        { id: "pch", term: "PCH", expanded: "Prestation de Compensation du Handicap", definition_short: "Aide financière pour les besoins liés au handicap.", definition_field: "Aide humaine, technique, aménagement logement/véhicule. Décidée par la MDPH.", tags: ["social"], relatedIds: ["pch"] },
        { id: "puma", term: "PUMA", expanded: "Protection Universelle Maladie", definition_short: "Couverture maladie de base pour tous les résidents stables.", definition_field: "Remplace la CMU de base. Couvre les frais de santé à hauteur du tarif sécu.", tags: ["sante"], relatedIds: ["puma"] },
        { id: "rqth", term: "RQTH", expanded: "Reconnaissance de la Qualité de Travailleur Handicapé", definition_short: "Reconnaissance facilitant l'accès à l'emploi.", definition_field: "Permet : obligation d'emploi, aides Agefiph, aménagement de poste. Décidée par MDPH.", tags: ["social"], relatedIds: ["rqth"] },
        { id: "rsa", term: "RSA", expanded: "Revenu de Solidarité Active", definition_short: "Revenu minimum pour personnes sans ou à faibles ressources.", definition_field: "Versé par la CAF. Conditions : +25 ans, ressources sous plafond, résidence stable.", tags: ["social"], relatedIds: ["rsa"] },
        { id: "rsdae", term: "RSDAE", expanded: "Restriction Substantielle et Durable pour l'Accès à l'Emploi", definition_short: "Critère d'attribution de l'AAH pour les taux 50-79%.", definition_field: "La MDPH doit reconnaître que le handicap limite durablement l'accès à l'emploi.", tags: ["social"], relatedIds: ["aah"] },
        { id: "sbb", term: "SBB", expanded: "Services Bancaires de Base", definition_short: "Services bancaires gratuits pour les bénéficiaires du droit au compte.", definition_field: "Comprend : compte, carte, virements, prélèvements, RIB, relevés. Pas de découvert.", tags: ["bancaire"], relatedIds: ["droit-au-compte"] },
        { id: "siao", term: "SIAO", expanded: "Service Intégré d'Accueil et d'Orientation", definition_short: "Guichet unique pour l'hébergement d'urgence.", definition_field: "Gère les demandes d'hébergement, oriente vers les structures disponibles. Appeler le 115.", tags: ["social"], relatedIds: [] },
        { id: "ta", term: "TA", expanded: "Tribunal Administratif", definition_short: "Juridiction pour contester les décisions administratives.", definition_field: "Recours contre CAF, préfecture, MDPH... Délai : 2 mois après décision définitive.", tags: ["social"], relatedIds: [] },
        { id: "tj", term: "TJ", expanded: "Tribunal Judiciaire", definition_short: "Juridiction de droit commun (ex-TGI + TI).", definition_field: "Le pôle social traite les litiges sécu (AAH, CSS, CPAM...). Sans avocat obligatoire.", tags: ["social"], relatedIds: [] },
        { id: "urssaf", term: "URSSAF", expanded: "Union de Recouvrement des cotisations de Sécurité sociale et d'Allocations Familiales", definition_short: "Organisme collectant les cotisations sociales.", definition_field: "Peut fournir les attestations d'activité passée pour certaines aides.", tags: ["social"], relatedIds: [] },
        { id: "oqtf", term: "OQTF", expanded: "Obligation de Quitter le Territoire Français", definition_short: "Mesure d'éloignement pour étrangers en situation irrégulière.", definition_field: "Peut être contestée devant le TA. Ne supprime pas le droit à l'AME.", tags: ["social"], relatedIds: ["ame"] },
        { id: "dalo", term: "DALO", expanded: "Droit Au Logement Opposable", definition_short: "Recours pour les personnes mal logées ou sans logement.", definition_field: "Commission DALO puis recours TA. Si reconnu prioritaire : l'État doit reloger.", tags: ["social"], relatedIds: [] },
        { id: "apa", term: "APA", expanded: "Allocation Personnalisée d'Autonomie", definition_short: "Aide pour les personnes âgées en perte d'autonomie.", definition_field: "Versée par le Département. À domicile ou en établissement. Selon niveau GIR.", tags: ["social"], relatedIds: [] }
    ],

    // ===== FICHES RÉFLEXES =====
    fiches: [
        {
            id: "fiche-rupture-droits-caf",
            title: "Rupture de droits CAF",
            category: "urgence",
            icon: "🚨",
            context: "L'usager n'a plus de versement CAF (RSA, APL, allocations...) et ne comprend pas pourquoi.",
            checklist: [
                "Vérifier le compte CAF en ligne (notifications, courriers)",
                "Identifier la cause : déclaration trimestrielle manquante ? Changement de situation non déclaré ?",
                "Si suspension : régulariser immédiatement (déclaration, justificatifs manquants)",
                "Si radiation : comprendre le motif et engager un recours si contestable",
                "Contacter la CAF (téléphone ou RDV) pour accélérer le traitement",
                "En attendant : orienter vers aide d'urgence CCAS si besoin alimentaire"
            ],
            warnings: [
                "La déclaration trimestrielle RSA est obligatoire même avec 0€ de ressources",
                "Toujours garder une trace écrite des échanges avec la CAF",
                "Le recours doit être fait dans les 2 mois suivant la notification"
            ],
            relatedIds: ["rsa", "apl", "aides-exceptionnelles"],
            updated_at: "2026-01-26"
        },
        {
            id: "fiche-sans-ressources",
            title: "Personne sans ressources immédiates",
            category: "urgence",
            icon: "🆘",
            context: "L'usager n'a aucune ressource et a besoin d'aide immédiate pour les besoins essentiels.",
            checklist: [
                "Évaluer l'urgence : alimentation, hébergement, santé",
                "Orienter vers le CCAS pour aide alimentaire d'urgence (bons, épicerie sociale)",
                "Si sans hébergement : appeler le 115 (SIAO)",
                "Vérifier les droits potentiels : RSA ? AAH ? ASS ? ARE ?",
                "Si droits ouverts mais pas versés : identifier le blocage",
                "Faire une demande d'aide exceptionnelle CAF si allocataire",
                "Mobiliser les associations locales (Restos du Cœur, Secours Populaire, Croix-Rouge)"
            ],
            warnings: [
                "Ne pas attendre pour les besoins vitaux : mobiliser l'urgence sociale",
                "Un dossier RSA peut prendre 2 mois : prévoir l'entre-deux",
                "L'aide alimentaire n'est pas conditionnée à des papiers en règle"
            ],
            relatedIds: ["rsa", "aides-exceptionnelles", "domiciliation"],
            updated_at: "2026-01-26"
        },
        {
            id: "fiche-sans-rib",
            title: "Usager sans RIB / sans compte bancaire",
            category: "administratif",
            icon: "🏦",
            context: "L'usager n'a pas de compte bancaire et ne peut donc pas recevoir les prestations.",
            checklist: [
                "Proposer l'ouverture d'un compte Nickel (buraliste) : rapide, sans conditions",
                "Alternative : compte en ligne (N26, etc.) si smartphone disponible",
                "Si refus de banque : utiliser le droit au compte Banque de France",
                "Accompagner physiquement si nécessaire",
                "Une fois le RIB obtenu : le transmettre immédiatement à la CAF/CPAM",
                "Vérifier que le compte est bien enregistré dans les 15 jours"
            ],
            warnings: [
                "Sans RIB, aucune prestation ne peut être versée",
                "Le droit au compte est un droit absolu, même pour interdits bancaires",
                "Les services bancaires de base sont GRATUITS avec le droit au compte"
            ],
            relatedIds: ["droit-au-compte", "compte-paiement"],
            updated_at: "2026-01-26"
        },
        {
            id: "fiche-sans-adresse",
            title: "Usager sans adresse (domiciliation)",
            category: "administratif",
            icon: "📬",
            context: "L'usager n'a pas d'adresse stable et ne peut pas faire de démarches administratives.",
            checklist: [
                "Identifier le CCAS de la commune de rattachement",
                "Vérifier le lien avec la commune (présence, attaches)",
                "Rassembler les documents : pièce d'identité, tout élément prouvant le lien",
                "Accompagner au CCAS pour la demande de domiciliation",
                "Alternative : associations agréées (Secours Catholique, SIAO...)",
                "Une fois l'attestation obtenue : lancer les démarches (RSA, CSS, France Travail...)",
                "Rappeler l'obligation de relever le courrier régulièrement"
            ],
            warnings: [
                "La domiciliation est un DROIT, le CCAS ne peut pas refuser sans motif valable",
                "L'attestation est valable 1 an et doit être renouvelée",
                "Sans domiciliation : pas de RSA, pas de CSS, pas d'inscription France Travail"
            ],
            relatedIds: ["domiciliation", "rsa", "css"],
            updated_at: "2026-01-26"
        },
        {
            id: "fiche-ouverture-droits-sante",
            title: "Ouverture rapide droits santé",
            category: "sante",
            icon: "🏥",
            context: "L'usager a besoin de soins mais n'a pas de couverture maladie.",
            checklist: [
                "Vérifier le statut : régulier → PUMA/CSS | irrégulier depuis +3 mois → AME",
                "Si urgence médicale immédiate : orienter vers les urgences (soins dispensés)",
                "Réunir les pièces : identité, résidence, ressources",
                "Pour la PUMA : dossier CPAM (cerfa 15763)",
                "Pour la CSS : demande CPAM (cerfa 12504) ou via caf.fr si RSA",
                "Pour l'AME : dossier CPAM (cerfa 11573), preuves de présence +3 mois",
                "En attendant : orienter vers les PASS hospitalières ou centres gratuits"
            ],
            warnings: [
                "Les soins urgents sont toujours dispensés, même sans couverture",
                "L'AME n'impacte PAS la situation administrative (confidentialité)",
                "La CSS ouvre le tiers payant : pas d'avance de frais"
            ],
            relatedIds: ["puma", "css", "ame"],
            updated_at: "2026-01-26"
        },
        {
            id: "fiche-endettement",
            title: "Situation d'endettement : premiers gestes",
            category: "urgence",
            icon: "📉",
            context: "L'usager est submergé par les dettes et ne sait pas par où commencer.",
            checklist: [
                "Rassurer : des solutions existent, ne pas rester isolé",
                "Lister TOUTES les dettes : crédits, loyers, factures, amendes...",
                "Identifier les créanciers prioritaires : loyer, énergie (risque de coupure/expulsion)",
                "Contacter les créanciers pour demander des délais ou échéanciers",
                "Orienter vers un Point Conseil Budget (gratuit) ou une association",
                "Si situation irrémédiable : évoquer le dossier de surendettement Banque de France",
                "Prévenir les saisies : connaître les revenus insaisissables (RSA, minima)"
            ],
            warnings: [
                "Ne JAMAIS ignorer les courriers de mise en demeure ou huissiers",
                "Certaines dettes sont prioritaires (loyer, pension alimentaire)",
                "Le RSA, l'AAH et les APL sont insaisissables (solde bancaire insaisissable)"
            ],
            relatedIds: ["surendettement", "fsl", "frais-bancaires"],
            updated_at: "2026-01-26"
        },
        {
            id: "fiche-refus-aah",
            title: "Refus AAH : que faire ?",
            category: "sante",
            icon: "♿",
            context: "L'usager a reçu un refus d'AAH de la MDPH et souhaite contester.",
            checklist: [
                "Demander la notification complète avec les motivations détaillées",
                "Analyser le motif : taux insuffisant ? RSDAE non reconnue ? Ressources ?",
                "Rassembler des éléments complémentaires : certificats médicaux récents, attestations",
                "Enrichir le projet de vie : décrire l'impact concret du handicap au quotidien",
                "Déposer un recours gracieux à la MDPH sous 2 mois",
                "Si rejet du recours gracieux : saisir le Tribunal judiciaire (pôle social)",
                "Alternative : déposer une nouvelle demande avec un dossier enrichi"
            ],
            warnings: [
                "Le délai de recours est de 2 MOIS à compter de la notification",
                "Le recours au Tribunal est gratuit et sans avocat obligatoire",
                "Le projet de vie est souvent déterminant : ne pas le négliger"
            ],
            relatedIds: ["aah", "mdph", "modele-recours-mdph"],
            updated_at: "2026-01-26"
        },
        {
            id: "fiche-primo-rsa",
            title: "Première demande RSA",
            category: "ressources",
            icon: "💰",
            context: "Accompagner une première demande de RSA de A à Z.",
            checklist: [
                "Vérifier l'éligibilité : +25 ans (ou exception), ressources, résidence stable",
                "Faire la simulation sur caf.fr pour estimer le montant",
                "Créer un compte CAF si inexistant",
                "Rassembler les pièces : identité, domicile, RIB, ressources 3 derniers mois",
                "Remplir la demande en ligne ou télécharger le formulaire",
                "Transmettre TOUTES les pièces demandées (dossier incomplet = retard)",
                "Après acceptation : rappeler l'obligation de déclaration trimestrielle",
                "Orienter vers l'accompagnement socio-professionnel (référent RSA)"
            ],
            warnings: [
                "Sans déclaration trimestrielle : suspension automatique",
                "Les ressources du conjoint/concubin sont prises en compte",
                "Les étudiants sont généralement exclus sauf exceptions"
            ],
            relatedIds: ["rsa", "prime-activite", "css"],
            updated_at: "2026-01-26"
        },
        {
            id: "fiche-jeune-sans-ressources",
            title: "Jeune 18-25 ans sans ressources",
            category: "ressources",
            icon: "🎓",
            context: "Un jeune de moins de 25 ans sans ressources et sans emploi demande de l'aide.",
            checklist: [
                "Orienter vers la Mission Locale (accompagnement dédié)",
                "Évaluer l'éligibilité au CEJ (Contrat d'Engagement Jeune) : ~500€/mois",
                "Si enfant à charge : RSA possible avant 25 ans",
                "Si travail passé significatif : vérifier droits ARE ou RSA jeune actif",
                "Si étudiant boursier : vérifier la bourse, aide d'urgence CROUS",
                "Aide alimentaire : CROUS, associations, épiceries solidaires",
                "Garantie Visale pour le logement si recherche d'appartement"
            ],
            warnings: [
                "Le RSA est quasi-inaccessible avant 25 ans (sauf exceptions)",
                "Le CEJ demande un engagement réel (présence, ateliers, immersions)",
                "La Mission Locale peut débloquer des aides ponctuelles (FAJ)"
            ],
            relatedIds: ["garantie-jeunes", "rsa", "aides-exceptionnelles"],
            updated_at: "2026-01-26"
        },
        {
            id: "fiche-expulsion-locative",
            title: "Menace d'expulsion locative",
            category: "urgence",
            icon: "🏠",
            context: "L'usager a reçu un commandement de payer ou une assignation au tribunal pour expulsion.",
            checklist: [
                "Identifier le stade de la procédure : impayés ? commandement ? assignation ? jugement ?",
                "Ne JAMAIS ignorer les courriers : des délais sont possibles à chaque étape",
                "Contacter immédiatement le bailleur pour négocier un plan d'apurement",
                "Saisir le FSL pour aide au maintien (dette de loyer)",
                "Demander un accompagnement social (CCAS, service social du Département)",
                "Si assignation : se présenter au tribunal, demander des délais au juge",
                "Activer la procédure DALO si logement indécent ou suroccupé",
                "Pendant la trêve hivernale (1er nov - 31 mars) : pas d'expulsion avec force publique"
            ],
            warnings: [
                "L'expulsion n'est pas immédiate : plusieurs mois de procédure",
                "Se présenter au tribunal permet souvent d'obtenir des délais",
                "La trêve hivernale ne suspend PAS la procédure, seulement l'exécution"
            ],
            relatedIds: ["fsl", "apl", "aides-exceptionnelles"],
            updated_at: "2026-01-26"
        },
        {
            id: "fiche-etranger-sans-papiers",
            title: "Étranger sans titre de séjour",
            category: "urgence",
            icon: "🌍",
            context: "Accompagner une personne en situation irrégulière pour l'accès aux droits essentiels.",
            checklist: [
                "Rassurer sur la confidentialité des démarches sociales et médicales",
                "Santé : orienter vers l'AME si présence en France depuis +3 mois",
                "En attendant l'AME : orienter vers les PASS hospitalières, médecins solidaires",
                "Domiciliation : possible via associations agréées (même sans papiers)",
                "Scolarisation des enfants : DROIT absolu, aucun papier exigé",
                "Aide alimentaire : accessible sans condition de séjour",
                "Accompagnement juridique : association spécialisée (GISTI, Cimade, etc.)"
            ],
            warnings: [
                "L'AME et les démarches CPAM sont CONFIDENTIELLES (pas de transmission à la préfecture)",
                "Les enfants DOIVENT être scolarisés quelle que soit la situation des parents",
                "Ne pas promettre de régularisation : orientation vers associations spécialisées"
            ],
            relatedIds: ["ame", "domiciliation"],
            updated_at: "2026-01-26"
        },
        {
            id: "fiche-sortie-prison",
            title: "Sortie de détention",
            category: "urgence",
            icon: "🔓",
            context: "Accompagner une personne à sa sortie de prison pour la réinsertion.",
            checklist: [
                "Anticiper AVANT la sortie si possible (SPIP, CPIP)",
                "Hébergement : 115, associations de réinsertion, hébergement d'urgence",
                "Domiciliation : demander au CCAS ou association",
                "Santé : vérifier les droits sécu, relancer CSS si suspendue",
                "Ressources : RSA dès que possible (domiciliation nécessaire)",
                "Compte bancaire : Nickel ou droit au compte",
                "Emploi : France Travail, structures IAE (insertion par l'activité économique)",
                "Accompagnement : SPIP post-peine, associations de réinsertion"
            ],
            warnings: [
                "Les droits sociaux sont souvent suspendus pendant l'incarcération",
                "Prévoir plusieurs semaines avant le premier versement RSA",
                "Certains casiers judiciaires limitent l'accès à certains emplois"
            ],
            relatedIds: ["rsa", "domiciliation", "droit-au-compte"],
            updated_at: "2026-01-26"
        }
    ]
};

// ===== ARBRE DÉCISIONNEL ASSISTANT SITUATION =====
// Structure préparée pour intégration avec la base des suivis (projet 12)

const DECISION_TREE = {
    // Métadonnées
    version: "1.0",

    // Structure de profil pour intégration future avec projet 12
    // Compatible avec FEMMES_ISOLEES et FAMILLES
    profileMapping: {
        statut: "situation_sejour",           // Régulière, Irrégulière, Demandeur d'asile
        assuranceMaladie: "couverture_sante", // CSS, AME, PUMA, Aucune
        compteBancaire: "compte_bancaire",    // Oui, Non
        emploi: "situation_emploi",           // CDI, CDD, Intérim, En recherche, Sans
        aideAlimentaire: "aide_alimentaire"   // Oui, Non
    },

    // Questions de l'arbre décisionnel
    questions: {
        // Question de départ
        "start": {
            id: "start",
            icon: "🎯",
            text: "Quelle est la problématique principale ?",
            hint: "Sélectionnez le besoin le plus urgent",
            answers: [
                { label: "Pas de ressources / revenus insuffisants", value: "ressources", next: "q_age" },
                { label: "Problème de santé / couverture maladie", value: "sante", next: "q_sejour_sante" },
                { label: "Problème bancaire (compte, dettes, frais)", value: "bancaire", next: "q_bancaire" },
                { label: "Pas d'adresse / besoin de domiciliation", value: "adresse", next: "q_domiciliation" },
                { label: "Urgence alimentaire / hébergement", value: "urgence", next: "q_urgence" }
            ],
            tags: ["problematique"]
        },

        // ===== BRANCHE RESSOURCES =====
        "q_age": {
            id: "q_age",
            icon: "🎂",
            text: "Quel est l'âge de la personne ?",
            hint: "",
            answers: [
                { label: "Moins de 25 ans", value: "moins_25", next: "q_jeune_situation" },
                { label: "Entre 25 et 62 ans", value: "25_62", next: "q_activite" },
                { label: "Plus de 62 ans", value: "plus_62", next: "q_retraite" }
            ],
            tags: ["age"]
        },

        "q_jeune_situation": {
            id: "q_jeune_situation",
            icon: "🎓",
            text: "Quelle est la situation du jeune ?",
            hint: "",
            answers: [
                { label: "Étudiant", value: "etudiant", next: "result_jeune_etudiant" },
                { label: "En recherche d'emploi / NEET", value: "neet", next: "result_jeune_neet" },
                { label: "Parent avec enfant à charge", value: "parent", next: "q_activite" },
                { label: "A travaillé au moins 2 ans", value: "travaille", next: "q_activite" }
            ],
            tags: ["situation_jeune"]
        },

        "q_activite": {
            id: "q_activite",
            icon: "💼",
            text: "La personne a-t-elle une activité professionnelle ?",
            hint: "",
            answers: [
                { label: "Oui, avec revenus modestes", value: "activite_modeste", next: "result_prime_activite" },
                { label: "Non, sans emploi", value: "sans_emploi", next: "q_chomage" },
                { label: "Non, en situation de handicap", value: "handicap", next: "q_handicap" }
            ],
            tags: ["activite"]
        },

        "q_chomage": {
            id: "q_chomage",
            icon: "📋",
            text: "La personne a-t-elle des droits au chômage ?",
            hint: "",
            answers: [
                { label: "Oui, droits ARE en cours", value: "are", next: "result_are" },
                { label: "Fin de droits ARE", value: "fin_are", next: "q_historique_travail" },
                { label: "Non, jamais travaillé ou pas assez", value: "jamais", next: "q_sejour_rsa" }
            ],
            tags: ["chomage"]
        },

        "q_historique_travail": {
            id: "q_historique_travail",
            icon: "📊",
            text: "La personne a-t-elle travaillé 5 ans sur les 10 dernières années ?",
            hint: "Condition pour l'ASS",
            answers: [
                { label: "Oui", value: "oui_5ans", next: "result_ass" },
                { label: "Non", value: "non_5ans", next: "q_sejour_rsa" }
            ],
            tags: ["historique_travail"]
        },

        "q_sejour_rsa": {
            id: "q_sejour_rsa",
            icon: "🛂",
            text: "Quelle est la situation administrative ?",
            hint: "",
            answers: [
                { label: "Situation régulière (titre de séjour valide ou français)", value: "regulier", next: "result_rsa" },
                { label: "Demandeur d'asile", value: "asile", next: "result_ada" },
                { label: "Situation irrégulière", value: "irregulier", next: "result_urgence_social" }
            ],
            tags: ["sejour"]
        },

        "q_handicap": {
            id: "q_handicap",
            icon: "♿",
            text: "Le handicap est-il reconnu par la MDPH ?",
            hint: "",
            answers: [
                { label: "Oui, taux ≥ 80%", value: "taux_80", next: "result_aah" },
                { label: "Oui, taux entre 50% et 79%", value: "taux_50_79", next: "q_rsdae" },
                { label: "Non, pas de reconnaissance MDPH", value: "non_mdph", next: "result_mdph" }
            ],
            tags: ["handicap"]
        },

        "q_rsdae": {
            id: "q_rsdae",
            icon: "💼",
            text: "Le handicap empêche-t-il durablement l'accès à l'emploi ?",
            hint: "Critère RSDAE pour AAH entre 50-79%",
            answers: [
                { label: "Oui", value: "oui_rsdae", next: "result_aah" },
                { label: "Non ou pas sûr", value: "non_rsdae", next: "result_rqth" }
            ],
            tags: ["rsdae"]
        },

        "q_retraite": {
            id: "q_retraite",
            icon: "👴",
            text: "La personne perçoit-elle une retraite ?",
            hint: "",
            answers: [
                { label: "Oui, mais insuffisante", value: "retraite_faible", next: "result_aspa" },
                { label: "Non, pas encore de retraite", value: "pas_retraite", next: "q_activite" }
            ],
            tags: ["retraite"]
        },

        // ===== BRANCHE SANTÉ =====
        "q_sejour_sante": {
            id: "q_sejour_sante",
            icon: "🛂",
            text: "Quelle est la situation administrative ?",
            hint: "",
            answers: [
                { label: "Situation régulière", value: "regulier", next: "q_couverture_actuelle" },
                { label: "Situation irrégulière depuis + de 3 mois", value: "irregulier_3mois", next: "result_ame" },
                { label: "Situation irrégulière depuis - de 3 mois", value: "irregulier_recent", next: "result_soins_urgents" }
            ],
            tags: ["sejour"]
        },

        "q_couverture_actuelle": {
            id: "q_couverture_actuelle",
            icon: "🏥",
            text: "La personne a-t-elle une couverture santé ?",
            hint: "",
            answers: [
                { label: "Aucune couverture", value: "aucune", next: "result_puma_css" },
                { label: "Sécu de base uniquement", value: "base_seule", next: "q_ressources_css" },
                { label: "Sécu + mutuelle trop chère", value: "mutuelle_chere", next: "q_ressources_css" }
            ],
            tags: ["couverture_sante"]
        },

        "q_ressources_css": {
            id: "q_ressources_css",
            icon: "💰",
            text: "Les ressources sont-elles inférieures à ~810€/mois (personne seule) ?",
            hint: "Plafond CSS gratuite",
            answers: [
                { label: "Oui", value: "sous_plafond", next: "result_css" },
                { label: "Non mais < 1100€/mois", value: "entre_plafonds", next: "result_css_participation" },
                { label: "Non, revenus supérieurs", value: "au_dessus", next: "result_mutuelle" }
            ],
            tags: ["ressources"]
        },

        // ===== BRANCHE BANCAIRE =====
        "q_bancaire": {
            id: "q_bancaire",
            icon: "🏦",
            text: "Quel est le problème bancaire ?",
            hint: "",
            answers: [
                { label: "Pas de compte bancaire", value: "pas_compte", next: "q_refus_banque" },
                { label: "Interdit bancaire / fiché", value: "fichage", next: "result_fichage" },
                { label: "Frais bancaires excessifs", value: "frais", next: "result_frais" },
                { label: "Surendettement", value: "surendettement", next: "result_surendettement" }
            ],
            tags: ["probleme_bancaire"]
        },

        "q_refus_banque": {
            id: "q_refus_banque",
            icon: "❌",
            text: "Y a-t-il eu un refus d'ouverture de compte ?",
            hint: "",
            answers: [
                { label: "Oui, refus d'une banque", value: "refus", next: "result_droit_compte" },
                { label: "Non, pas encore essayé", value: "pas_essaye", next: "result_compte_facile" }
            ],
            tags: ["refus_banque"]
        },

        // ===== BRANCHE DOMICILIATION =====
        "q_domiciliation": {
            id: "q_domiciliation",
            icon: "📬",
            text: "Quelle est la situation de logement ?",
            hint: "",
            answers: [
                { label: "Sans domicile fixe (rue, squat)", value: "sdf", next: "result_domiciliation" },
                { label: "Hébergé chez un tiers", value: "heberge", next: "q_attestation_hebergement" },
                { label: "Hôtel / hébergement d'urgence", value: "hotel", next: "result_domiciliation" },
                { label: "Habitat mobile (camping-car, caravane)", value: "mobile", next: "result_domiciliation" }
            ],
            tags: ["logement"]
        },

        "q_attestation_hebergement": {
            id: "q_attestation_hebergement",
            icon: "📄",
            text: "L'hébergeant peut-il fournir une attestation ?",
            hint: "Attestation d'hébergement + justificatif de domicile de l'hébergeant",
            answers: [
                { label: "Oui", value: "oui_attestation", next: "result_pas_domiciliation" },
                { label: "Non ou situation instable", value: "non_attestation", next: "result_domiciliation" }
            ],
            tags: ["attestation"]
        },

        // ===== BRANCHE URGENCE =====
        "q_urgence": {
            id: "q_urgence",
            icon: "🆘",
            text: "Quelle est l'urgence principale ?",
            hint: "",
            answers: [
                { label: "Besoin alimentaire immédiat", value: "alimentaire", next: "result_urgence_alimentaire" },
                { label: "Sans hébergement ce soir", value: "hebergement", next: "result_115" },
                { label: "Expulsion imminente", value: "expulsion", next: "result_expulsion" },
                { label: "Coupure d'énergie", value: "energie", next: "result_fsl" }
            ],
            tags: ["type_urgence"]
        }
    },

    // Résultats avec recommandations de dispositifs
    results: {
        // Ressources
        "result_jeune_etudiant": {
            title: "Aides pour étudiant",
            icon: "🎓",
            summary: "Étudiant de moins de 25 ans",
            recommendations: [
                { id: "bourse", priority: "high", note: "Vérifier les droits à bourse CROUS" },
                { id: "apl", priority: "high", note: "APL possible même étudiant" },
                { id: "css", priority: "medium", note: "CSS si ressources faibles" }
            ],
            tips: [
                "Les étudiants boursiers peuvent avoir des aides d'urgence CROUS",
                "La prime d'activité est possible si revenus > ~1000€/mois",
                "Certains CCAS proposent des aides spécifiques jeunes"
            ],
            relatedFiches: ["fiche-jeune-sans-ressources"]
        },

        "result_jeune_neet": {
            title: "Accompagnement jeune NEET",
            icon: "🧭",
            summary: "Jeune ni en emploi, ni en études, ni en formation",
            recommendations: [
                { id: "garantie-jeunes", priority: "high", note: "CEJ via Mission Locale : ~500€/mois + accompagnement intensif" },
                { id: "css", priority: "high", note: "CSS pour la couverture santé" },
                { id: "aides-exceptionnelles", priority: "medium", note: "FAJ (Fonds d'Aide aux Jeunes) via Mission Locale" }
            ],
            tips: [
                "La Mission Locale est le point d'entrée principal",
                "Le CEJ demande un engagement fort (rendez-vous réguliers)",
                "Possibilité d'aides ponctuelles avant le premier versement"
            ],
            relatedFiches: ["fiche-jeune-sans-ressources"]
        },

        "result_prime_activite": {
            title: "Prime d'activité",
            icon: "💼",
            summary: "Travailleur avec revenus modestes",
            recommendations: [
                { id: "prime-activite", priority: "high", note: "Complément de revenus pour travailleurs modestes" },
                { id: "css", priority: "medium", note: "CSS si revenus sous plafond" },
                { id: "apl", priority: "medium", note: "APL si locataire" }
            ],
            tips: [
                "La prime d'activité se déclare trimestriellement",
                "Elle peut se cumuler partiellement avec le RSA",
                "Faire la simulation sur caf.fr"
            ],
            relatedFiches: []
        },

        "result_are": {
            title: "Chômage ARE en cours",
            icon: "📋",
            summary: "Droits ARE en cours - vérifier les compléments",
            recommendations: [
                { id: "apl", priority: "high", note: "APL pour réduire le loyer" },
                { id: "css", priority: "medium", note: "CSS si revenus sous plafond" }
            ],
            tips: [
                "Anticiper la fin de droits ARE",
                "Vérifier l'éligibilité à l'ASS avant la fin des droits",
                "France Travail peut proposer des formations rémunérées"
            ],
            relatedFiches: []
        },

        "result_ass": {
            title: "ASS - Fin de droits chômage",
            icon: "📋",
            summary: "Éligible à l'Allocation de Solidarité Spécifique",
            recommendations: [
                { id: "ass", priority: "high", note: "ASS pour les fins de droits ARE avec 5 ans d'activité" },
                { id: "css", priority: "high", note: "CSS automatique si ASS" },
                { id: "apl", priority: "medium", note: "APL maintenue" }
            ],
            tips: [
                "L'ASS est versée par France Travail",
                "Attention : pas de trimestres retraite avec l'ASS",
                "Le RSA peut être plus avantageux dans certains cas"
            ],
            relatedFiches: []
        },

        "result_rsa": {
            title: "RSA",
            icon: "💰",
            summary: "Éligible au Revenu de Solidarité Active",
            recommendations: [
                { id: "rsa", priority: "high", note: "RSA - revenu minimum garanti" },
                { id: "css", priority: "high", note: "CSS automatique avec le RSA" },
                { id: "apl", priority: "high", note: "APL cumulable" }
            ],
            tips: [
                "Déclaration trimestrielle OBLIGATOIRE",
                "Cocher la case CSS dans la demande RSA",
                "Accompagnement socio-professionnel obligatoire"
            ],
            relatedFiches: ["fiche-primo-rsa"]
        },

        "result_ada": {
            title: "Demandeur d'asile",
            icon: "🛂",
            summary: "Allocation pour Demandeur d'Asile",
            recommendations: [
                { id: "puma", priority: "high", note: "PUMA pour la couverture santé de base" },
                { id: "css", priority: "high", note: "CSS possible selon ressources" }
            ],
            tips: [
                "L'ADA est gérée par l'OFII",
                "Orientation vers le dispositif national d'accueil",
                "Domiciliation possible via la plateforme d'accueil"
            ],
            relatedFiches: []
        },

        "result_urgence_social": {
            title: "Situation irrégulière - Aides d'urgence",
            icon: "🆘",
            summary: "Accès limité aux droits mais aides d'urgence possibles",
            recommendations: [
                { id: "ame", priority: "high", note: "AME pour la santé si présence > 3 mois" },
                { id: "aides-exceptionnelles", priority: "high", note: "Aide alimentaire sans condition de séjour" },
                { id: "domiciliation", priority: "medium", note: "Domiciliation via associations" }
            ],
            tips: [
                "L'aide alimentaire est accessible à tous",
                "Les enfants doivent être scolarisés (droit absolu)",
                "Orienter vers associations spécialisées (Cimade, GISTI)"
            ],
            relatedFiches: ["fiche-etranger-sans-papiers"]
        },

        "result_aah": {
            title: "AAH",
            icon: "♿",
            summary: "Éligible à l'Allocation aux Adultes Handicapés",
            recommendations: [
                { id: "aah", priority: "high", note: "AAH - allocation handicap" },
                { id: "css", priority: "high", note: "CSS automatique" },
                { id: "pch", priority: "medium", note: "PCH si besoins de compensation" }
            ],
            tips: [
                "L'AAH est déconjugalisée depuis 2023",
                "Cumulable partiellement avec un salaire",
                "Le projet de vie est crucial dans le dossier MDPH"
            ],
            relatedFiches: ["fiche-refus-aah"]
        },

        "result_mdph": {
            title: "Constitution dossier MDPH",
            icon: "📁",
            summary: "Nécessité de faire reconnaître le handicap",
            recommendations: [
                { id: "mdph", priority: "high", note: "Dossier MDPH à constituer" },
                { id: "rsa", priority: "medium", note: "RSA en attendant la décision MDPH" }
            ],
            tips: [
                "Délai MDPH : 4 à 6 mois en moyenne",
                "Bien documenter l'impact du handicap au quotidien",
                "Aide au remplissage possible en MDPH ou associations"
            ],
            relatedFiches: []
        },

        "result_rqth": {
            title: "RQTH",
            icon: "💼",
            summary: "Reconnaissance travailleur handicapé prioritaire",
            recommendations: [
                { id: "rqth", priority: "high", note: "RQTH pour faciliter l'accès à l'emploi" },
                { id: "rsa", priority: "medium", note: "RSA si sans ressources" }
            ],
            tips: [
                "La RQTH n'oblige pas à informer l'employeur",
                "Ouvre droit aux aides Agefiph",
                "AAH possible en recours si impact sur l'emploi prouvé"
            ],
            relatedFiches: []
        },

        "result_aspa": {
            title: "ASPA",
            icon: "👴",
            summary: "Minimum vieillesse",
            recommendations: [
                { id: "aspa", priority: "high", note: "ASPA - complément de retraite" },
                { id: "css", priority: "high", note: "CSS automatique" }
            ],
            tips: [
                "L'ASPA est récupérable sur succession > 100 000€",
                "Toutes les retraites doivent être liquidées avant",
                "Demande auprès de la caisse de retraite principale"
            ],
            relatedFiches: []
        },

        // Santé
        "result_ame": {
            title: "AME",
            icon: "🏥",
            summary: "Aide Médicale de l'État",
            recommendations: [
                { id: "ame", priority: "high", note: "AME pour couverture santé complète" }
            ],
            tips: [
                "L'AME est confidentielle (pas de transmission préfecture)",
                "Renouvellement annuel non automatique",
                "En attendant : PASS hospitalière pour soins"
            ],
            relatedFiches: ["fiche-ouverture-droits-sante"]
        },

        "result_soins_urgents": {
            title: "Soins urgents",
            icon: "🚨",
            summary: "Pas encore éligible à l'AME",
            recommendations: [
                { id: "ame", priority: "medium", note: "AME dans 3 mois" }
            ],
            tips: [
                "Les soins urgents sont pris en charge (dispositif soins urgents)",
                "Orienter vers les PASS hospitalières",
                "Garder les preuves de présence pour l'AME"
            ],
            relatedFiches: ["fiche-ouverture-droits-sante"]
        },

        "result_puma_css": {
            title: "PUMA + CSS",
            icon: "🛡️",
            summary: "Affiliation sécu + complémentaire solidaire",
            recommendations: [
                { id: "puma", priority: "high", note: "PUMA pour la couverture de base" },
                { id: "css", priority: "high", note: "CSS pour la complémentaire" }
            ],
            tips: [
                "La PUMA est automatique après 3 mois de résidence",
                "La CSS peut être demandée en même temps",
                "Tiers payant intégral avec la CSS"
            ],
            relatedFiches: ["fiche-ouverture-droits-sante"]
        },

        "result_css": {
            title: "CSS gratuite",
            icon: "🏥",
            summary: "Éligible à la CSS sans participation",
            recommendations: [
                { id: "css", priority: "high", note: "CSS gratuite - 100% pris en charge" }
            ],
            tips: [
                "Renouvellement à anticiper (non automatique)",
                "Exonération des franchises médicales",
                "Attribution automatique si RSA"
            ],
            relatedFiches: []
        },

        "result_css_participation": {
            title: "CSS avec participation",
            icon: "🏥",
            summary: "Éligible à la CSS avec participation financière",
            recommendations: [
                { id: "css", priority: "high", note: "CSS avec participation (< 1€/jour)" }
            ],
            tips: [
                "Moins cher qu'une mutuelle classique",
                "Mêmes avantages que la CSS gratuite",
                "Participation déduite du compte bancaire"
            ],
            relatedFiches: []
        },

        "result_mutuelle": {
            title: "Mutuelle classique",
            icon: "🏥",
            summary: "Non éligible CSS - mutuelle recommandée",
            recommendations: [],
            tips: [
                "Comparer les mutuelles sur ufc-choisir-ensemble.org",
                "Certains employeurs proposent des mutuelles obligatoires",
                "Possibilité d'aide employeur (versement santé)"
            ],
            relatedFiches: []
        },

        // Bancaire
        "result_droit_compte": {
            title: "Droit au compte",
            icon: "🏦",
            summary: "Refus de banque - activer le droit au compte",
            recommendations: [
                { id: "droit-au-compte", priority: "high", note: "Droit au compte Banque de France" }
            ],
            tips: [
                "Demander l'attestation de refus à la banque",
                "La Banque de France désigne une banque en 1 jour",
                "Services bancaires de base GRATUITS"
            ],
            relatedFiches: ["fiche-sans-rib"]
        },

        "result_compte_facile": {
            title: "Ouverture compte facile",
            icon: "💳",
            summary: "Compte de paiement accessible",
            recommendations: [
                { id: "compte-paiement", priority: "high", note: "Nickel ou néobanque - ouverture immédiate" }
            ],
            tips: [
                "Nickel : ouverture en bureau de tabac",
                "Pas de vérification d'antécédents",
                "Permet de recevoir salaires et prestations"
            ],
            relatedFiches: ["fiche-sans-rib"]
        },

        "result_fichage": {
            title: "Interdit bancaire",
            icon: "⛔",
            summary: "Fichage FCC/FICP",
            recommendations: [
                { id: "interdit-bancaire", priority: "high", note: "Comprendre et gérer le fichage" },
                { id: "droit-au-compte", priority: "medium", note: "Droit au compte toujours possible" }
            ],
            tips: [
                "Le fichage n'empêche pas d'avoir un compte",
                "Régulariser permet de lever le fichage",
                "Vérifier son fichage gratuitement à la BdF"
            ],
            relatedFiches: []
        },

        "result_frais": {
            title: "Frais bancaires",
            icon: "💸",
            summary: "Contestation et plafonnement",
            recommendations: [
                { id: "frais-bancaires", priority: "high", note: "Connaître ses droits sur les frais" }
            ],
            tips: [
                "Demander l'offre clientèle fragile si éligible",
                "Plafond : 25€/mois pour clientèle fragile",
                "Contester par courrier recommandé"
            ],
            relatedFiches: []
        },

        "result_surendettement": {
            title: "Surendettement",
            icon: "📉",
            summary: "Procédure de surendettement",
            recommendations: [
                { id: "surendettement", priority: "high", note: "Dossier Banque de France" }
            ],
            tips: [
                "La procédure suspend les poursuites",
                "Accompagnement social recommandé",
                "Effacement de dette possible en dernier recours"
            ],
            relatedFiches: ["fiche-endettement"]
        },

        // Domiciliation
        "result_domiciliation": {
            title: "Domiciliation nécessaire",
            icon: "📬",
            summary: "Besoin d'une adresse administrative",
            recommendations: [
                { id: "domiciliation", priority: "high", note: "Domiciliation CCAS ou association" }
            ],
            tips: [
                "Le CCAS ne peut pas refuser sans motif valable",
                "La domiciliation est un DROIT",
                "Permet d'ouvrir tous les autres droits"
            ],
            relatedFiches: ["fiche-sans-adresse"]
        },

        "result_pas_domiciliation": {
            title: "Attestation d'hébergement",
            icon: "📄",
            summary: "Pas besoin de domiciliation",
            recommendations: [],
            tips: [
                "L'attestation d'hébergement suffit pour les démarches",
                "Modèle disponible sur service-public.fr",
                "L'hébergeant fournit aussi son justificatif de domicile"
            ],
            relatedFiches: []
        },

        // Urgences
        "result_urgence_alimentaire": {
            title: "Aide alimentaire urgente",
            icon: "🍽️",
            summary: "Besoin alimentaire immédiat",
            recommendations: [
                { id: "aides-exceptionnelles", priority: "high", note: "CCAS, épiceries sociales, associations" }
            ],
            tips: [
                "Aide alimentaire sans condition de papiers",
                "Restos du Cœur, Secours Populaire, Banque Alimentaire",
                "CCAS : bons alimentaires possibles le jour même"
            ],
            relatedFiches: ["fiche-sans-ressources"]
        },

        "result_115": {
            title: "Hébergement d'urgence",
            icon: "🏠",
            summary: "Appeler le 115",
            recommendations: [
                { id: "domiciliation", priority: "medium", note: "Domiciliation pour ouvrir les droits" }
            ],
            tips: [
                "115 : numéro gratuit 24h/24",
                "SIAO gère les places d'hébergement",
                "Trêve hivernale : pas de mise à la rue du 1er nov au 31 mars"
            ],
            relatedFiches: ["fiche-sans-ressources"]
        },

        "result_expulsion": {
            title: "Menace d'expulsion",
            icon: "🚨",
            summary: "Procédure d'expulsion en cours",
            recommendations: [
                { id: "fsl", priority: "high", note: "FSL pour aide au maintien" },
                { id: "aides-exceptionnelles", priority: "high", note: "Aides CCAS en urgence" }
            ],
            tips: [
                "Se présenter au tribunal pour obtenir des délais",
                "Trêve hivernale protège de l'expulsion forcée",
                "Activer le DALO si besoin"
            ],
            relatedFiches: ["fiche-expulsion-locative"]
        },

        "result_fsl": {
            title: "FSL - Aide énergie",
            icon: "⚡",
            summary: "Aide pour impayés d'énergie",
            recommendations: [
                { id: "fsl", priority: "high", note: "FSL pour aide aux factures" }
            ],
            tips: [
                "Faire la demande AVANT la coupure",
                "Chèque énergie automatique si revenus faibles",
                "Trêve hivernale : pas de coupure du 1er nov au 31 mars"
            ],
            relatedFiches: []
        }
    }
};

// ===== STRUCTURE POUR INTÉGRATION BASE SUIVIS =====
// Interface pour connecter avec le projet 12 (FEMMES_ISOLEES, FAMILLES)

const PersonSuivieAdapter = {
    // Convertit une personne du projet 12 en profil pour l'assistant
    fromProjet12(person, type = 'femme_isolee') {
        if (type === 'femme_isolee') {
            return {
                id: person.id,
                nom: `${person.prenom} ${person.nom}`,
                chambre: person.chambre,
                referente: person.tsReferente,
                profil: {
                    age: person.age,
                    situation_sejour: this.mapStatut(person.statut),
                    couverture_sante: this.mapAssuranceMaladie(person.assuranceMaladie),
                    compte_bancaire: person.compteBancaire === 'Oui',
                    situation_emploi: this.mapEmploi(person.emploi),
                    aide_alimentaire: person.aideAlimentaire === 'Oui'
                }
            };
        } else if (type === 'famille') {
            return {
                id: person.id,
                nom: `${person.prenomMere} ${person.nomMere}`,
                chambre: person.chambre,
                referente: person.tsReferente,
                nbEnfants: person.enfants?.length || 0,
                profil: {
                    age: person.ageMere,
                    situation_sejour: this.mapStatut(person.statutMere),
                    couverture_sante: this.mapAssuranceMaladie(person.assuranceMaladieMere),
                    compte_bancaire: person.compteBancaireMere === 'Oui',
                    situation_emploi: this.mapEmploi(person.emploiMere),
                    aide_alimentaire: person.aideAlimentaire === 'Oui',
                    famille: true
                }
            };
        }
    },

    mapStatut(statut) {
        const mapping = {
            'Régulière': 'regulier',
            'Irrégulière': 'irregulier',
            'Demandeur d\'asile': 'asile'
        };
        return mapping[statut] || 'regulier';
    },

    mapAssuranceMaladie(assurance) {
        const mapping = {
            'CSS': 'css',
            'AME': 'ame',
            'PUMA': 'puma',
            'Aucune': 'aucune',
            'Mutuelle': 'mutuelle'
        };
        return mapping[assurance] || 'aucune';
    },

    mapEmploi(emploi) {
        const mapping = {
            'CDI': 'cdi',
            'CDD': 'cdd',
            'Intérim': 'interim',
            'Temps partiel': 'temps_partiel',
            'En recherche': 'recherche',
            'Sans': 'sans'
        };
        return mapping[emploi] || 'sans';
    },

    // Pré-remplit les réponses de l'assistant selon le profil
    prefillAnswers(profil) {
        const answers = {};

        // Mapping profil -> réponses de l'arbre
        if (profil.age) {
            if (profil.age < 25) answers.q_age = 'moins_25';
            else if (profil.age >= 62) answers.q_age = 'plus_62';
            else answers.q_age = '25_62';
        }

        if (profil.situation_sejour) {
            answers.q_sejour_rsa = profil.situation_sejour;
            answers.q_sejour_sante = profil.situation_sejour === 'irregulier' ? 'irregulier_3mois' : 'regulier';
        }

        if (profil.compte_bancaire === false) {
            answers.q_bancaire = 'pas_compte';
        }

        return answers;
    }
};
