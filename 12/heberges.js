// Données des femmes isolées (extrait du fichier Excel)
const FEMMES_ISOLEES = [
    {
        id: 1,
        chambre: 'Diffus BLR',
        tsReferente: 'Marie',
        nom: 'BAMBA',
        prenom: 'Nogoda',
        dateNaissance: '1985-01-01',
        age: 41,
        nationalite: 'Ivoirienne',
        telephone: '07 51 09 73 81',
        email: 'kadibomba83@gmail.com',
        statut: 'Irrégulière',
        assuranceMaladie: 'CSS',
        dateArrivee: '2023-12-06',
        aideAlimentaire: 'Cohésia',
        montantAide: 220,
        emploi: 'Travail Non déclaré',
        compteBancaire: 'Non'
    },
    {
        id: 2,
        chambre: 'Diffus Montrouge',
        tsReferente: 'Sophie',
        nom: 'ABOU',
        prenom: 'Rosa Lucie',
        dateNaissance: '1979-04-09',
        age: 46,
        nationalite: 'Ivoirienne',
        telephone: '06 51 39 50 49',
        email: 'lucieabou12@gmail.com',
        statut: 'Irrégulière',
        assuranceMaladie: 'AME',
        dateArrivee: '2022-07-28',
        aideAlimentaire: 'Cohésia',
        montantAide: 220,
        emploi: 'Travail Non déclaré',
        compteBancaire: 'Livret A'
    },
    {
        id: 3,
        chambre: 'Diffus Montrouge',
        tsReferente: 'Sophie',
        nom: 'BAKAYOKO',
        prenom: 'Awa',
        dateNaissance: '1984-02-01',
        age: 41,
        nationalite: 'Ivoirienne',
        telephone: '07 80 30 13 22',
        email: 'awa146340@gmail.com',
        statut: 'Irrégulière',
        assuranceMaladie: 'AME',
        dateArrivee: '2023-07-31',
        aideAlimentaire: 'Cohésia',
        montantAide: 220,
        emploi: 'Sans',
        compteBancaire: 'Livret A'
    },
    {
        id: 4,
        chambre: '215',
        tsReferente: 'Marie',
        nom: 'BEAKOU',
        prenom: 'Henriette',
        dateNaissance: '1960-04-12',
        age: 65,
        nationalite: 'Ivoirienne',
        telephone: '07 52 46 52 89',
        email: 'h95928615@gmail.com',
        statut: 'Irrégulière',
        assuranceMaladie: 'AME',
        dateArrivee: '2018-08-01',
        aideAlimentaire: 'Cohésia',
        montantAide: 220,
        emploi: 'Sans',
        compteBancaire: 'Non'
    },
    {
        id: 5,
        chambre: 'Diffus Bagneux 1',
        tsReferente: 'Marie',
        nom: 'DARAME',
        prenom: 'Fatumata',
        dateNaissance: '1979-07-02',
        age: 46,
        nationalite: 'Guinéenne',
        telephone: '07 58 65 43 90',
        email: 'daramefatumata@gmail.com',
        statut: 'Irrégulière',
        assuranceMaladie: 'AME',
        dateArrivee: '2020-08-17',
        aideAlimentaire: 'Cohésia',
        montantAide: 220,
        emploi: 'Travail Non déclaré',
        compteBancaire: 'Livret A'
    },
    {
        id: 6,
        chambre: '216',
        tsReferente: 'Sophie',
        nom: 'BARADJI',
        prenom: 'Kadidiatou',
        dateNaissance: '1984-10-12',
        age: 41,
        nationalite: 'Ivoirienne',
        telephone: '07 68 69 30 22',
        email: 'kadidiatoubaradji7@gmail.com',
        statut: 'Irrégulière',
        assuranceMaladie: 'AME',
        dateArrivee: '2025-08-08',
        aideAlimentaire: 'Cohésia',
        montantAide: 220,
        emploi: 'Sans',
        compteBancaire: 'Compte courant'
    },
    {
        id: 7,
        chambre: '203',
        tsReferente: 'Marie',
        nom: 'KANGAH',
        prenom: 'Adjoua Marie-Thérèse',
        dateNaissance: '1965-06-10',
        age: 60,
        nationalite: 'Ivoirienne',
        telephone: '06-38-45-03-94',
        email: 'koening1@hotmail.fr',
        statut: 'Régulière',
        assuranceMaladie: 'CSS',
        dateArrivee: '2017-06-15',
        aideAlimentaire: 'Non',
        montantAide: 0,
        emploi: 'Sans',
        compteBancaire: 'Livret A',
        salaire: 889
    },
    {
        id: 8,
        chambre: 'Diffus BLR',
        tsReferente: 'Sophie',
        nom: 'BLACKMAN',
        prenom: 'Sophia Lois',
        dateNaissance: '1972-08-20',
        age: 53,
        nationalite: 'Barbadienne',
        telephone: '07 58 36 87 03',
        email: 'sophiablackman12@yahoo.fr',
        statut: 'Irrégulière',
        assuranceMaladie: 'AME',
        dateArrivee: '2014-04-18',
        aideAlimentaire: 'Cohésia',
        montantAide: 220,
        emploi: 'Travail Non déclaré',
        compteBancaire: 'Livret A'
    },
    {
        id: 9,
        chambre: '222',
        tsReferente: 'Sophie',
        nom: 'BOUKHELIFA',
        prenom: 'Sabrina',
        dateNaissance: '1989-03-13',
        age: 36,
        nationalite: 'Algérienne',
        telephone: '07 81 54 93 17',
        email: null,
        statut: 'Irrégulière',
        assuranceMaladie: 'AME',
        dateArrivee: '2022-10-27',
        aideAlimentaire: 'Cohésia',
        montantAide: 220,
        emploi: 'Sans',
        compteBancaire: 'Livret A'
    },
    {
        id: 10,
        chambre: '107',
        tsReferente: 'Sophio',
        nom: 'CAMARA',
        prenom: 'Massa',
        dateNaissance: '1975-02-13',
        age: 50,
        nationalite: 'Ivoirienne',
        telephone: '07 51 37 85 42',
        email: 'camara.massa75@gmail.com',
        statut: 'Irrégulière',
        assuranceMaladie: 'AME',
        dateArrivee: '2020-03-03',
        aideAlimentaire: 'Cohésia',
        montantAide: 220,
        emploi: 'Sans',
        compteBancaire: 'Livret A'
    },
    {
        id: 11,
        chambre: 'Diffus Bagneux 1',
        tsReferente: 'Sophie',
        nom: 'COULIBALY',
        prenom: 'Aminata',
        dateNaissance: '1994-04-17',
        age: 31,
        nationalite: 'Malienne',
        telephone: '06 99 19 00 99',
        email: null,
        statut: 'Irrégulière',
        assuranceMaladie: 'AME',
        dateArrivee: '2022-06-24',
        aideAlimentaire: 'Cohésia',
        montantAide: 220,
        emploi: 'Travail Non déclaré',
        compteBancaire: 'Livret A'
    },
    {
        id: 12,
        chambre: 'Diffus Bagneux 1',
        tsReferente: 'Marie',
        nom: 'KIMFUTA MANDIANGU',
        prenom: 'Bibiche',
        dateNaissance: '1978-07-06',
        age: 47,
        nationalite: 'Congolaise',
        telephone: '07 58 87 37 61',
        email: 'BIBICHEKIMFUTAMAN@GMAIL.COM',
        statut: 'Demande en cours',
        assuranceMaladie: null,
        dateArrivee: '2018-08-29',
        aideAlimentaire: 'Cohésia',
        montantAide: 220,
        emploi: 'Travail Non déclaré',
        compteBancaire: 'Livret A'
    },
    {
        id: 13,
        chambre: 'Diffus Montrouge',
        tsReferente: 'Sophio',
        nom: 'DIANE',
        prenom: 'Saran Mariam',
        dateNaissance: '1992-08-05',
        age: 33,
        nationalite: 'Ivoirienne',
        telephone: '06 80 80 36 65',
        email: 'mariamsarandiane@gmail.com',
        statut: 'Irrégulière',
        assuranceMaladie: 'AME',
        dateArrivee: '2022-07-12',
        aideAlimentaire: 'Cohésia',
        montantAide: 220,
        emploi: 'Travail déclaré',
        compteBancaire: null,
        salaire: 916
    },
    {
        id: 14,
        chambre: 'Diffus Montrouge',
        tsReferente: 'Sophio',
        nom: 'DIOMANDE',
        prenom: 'Mariam',
        dateNaissance: '1989-07-01',
        age: 36,
        nationalite: 'Ivoirienne',
        telephone: '07 53 79 17 01',
        email: 'mayadiomande52@gmail.com',
        statut: 'Irrégulière',
        assuranceMaladie: 'CSS',
        dateArrivee: '2022-03-22',
        aideAlimentaire: 'Cohésia',
        montantAide: 220,
        emploi: 'Sans',
        compteBancaire: 'Livret A'
    },
    {
        id: 15,
        chambre: '104',
        tsReferente: 'Sophio',
        nom: 'DIOP LY',
        prenom: 'Fatimata',
        dateNaissance: '1966-09-02',
        age: 59,
        nationalite: 'Sénégalaise',
        telephone: '07 60 88 86 78',
        email: 'fly400027@gmail.com',
        statut: 'Régulière',
        assuranceMaladie: 'Général + CSS',
        dateArrivee: '2022-07-13',
        aideAlimentaire: 'Non',
        montantAide: 0,
        emploi: 'Sans',
        compteBancaire: 'Compte courant'
    },
    {
        id: 16,
        chambre: '108',
        tsReferente: 'Marie',
        nom: 'KEITA',
        prenom: 'Fatoumata',
        dateNaissance: '1988-03-15',
        age: 37,
        nationalite: 'Malienne',
        telephone: '07 62 45 89 12',
        email: 'fkeita88@gmail.com',
        statut: 'Irrégulière',
        assuranceMaladie: 'AME',
        dateArrivee: '2021-05-12',
        aideAlimentaire: 'Cohésia',
        montantAide: 220,
        emploi: 'Travail Non déclaré',
        compteBancaire: 'Livret A'
    },
    {
        id: 17,
        chambre: '109',
        tsReferente: 'Sophie',
        nom: 'TOURE',
        prenom: 'Kadiatou',
        dateNaissance: '1991-11-22',
        age: 34,
        nationalite: 'Guinéenne',
        telephone: '06 78 34 56 21',
        email: 'ktoure91@gmail.com',
        statut: 'Demande en cours',
        assuranceMaladie: 'AME',
        dateArrivee: '2023-02-18',
        aideAlimentaire: 'SSP',
        montantAide: 180,
        emploi: 'Sans',
        compteBancaire: 'Non'
    },
    {
        id: 18,
        chambre: '110',
        tsReferente: 'Marie',
        nom: 'SYLLA',
        prenom: 'Mariama',
        dateNaissance: '1982-06-30',
        age: 43,
        nationalite: 'Sénégalaise',
        telephone: '07 45 67 89 34',
        email: null,
        statut: 'Irrégulière',
        assuranceMaladie: 'AME',
        dateArrivee: '2020-09-05',
        aideAlimentaire: 'Cohésia',
        montantAide: 220,
        emploi: 'Sans',
        compteBancaire: 'Livret A'
    },
    {
        id: 19,
        chambre: '111',
        tsReferente: 'Sophio',
        nom: 'CISSE',
        prenom: 'Aissata',
        dateNaissance: '1995-04-12',
        age: 30,
        nationalite: 'Malienne',
        telephone: '06 89 12 34 56',
        email: 'acisse95@gmail.com',
        statut: 'Irrégulière',
        assuranceMaladie: 'AME',
        dateArrivee: '2024-01-15',
        aideAlimentaire: 'SSP',
        montantAide: 180,
        emploi: 'Travail déclaré',
        compteBancaire: 'Compte courant',
        salaire: 1020
    },
    {
        id: 20,
        chambre: 'Diffus Bagneux 2',
        tsReferente: 'Sophie',
        nom: 'FOFANA',
        prenom: 'Djénéba',
        dateNaissance: '1987-08-25',
        age: 38,
        nationalite: 'Ivoirienne',
        telephone: '07 23 45 67 89',
        email: 'dfofana87@gmail.com',
        statut: 'Irrégulière',
        assuranceMaladie: 'AME',
        dateArrivee: '2022-11-30',
        aideAlimentaire: 'Cohésia',
        montantAide: 220,
        emploi: 'Travail Non déclaré',
        compteBancaire: 'Livret A'
    },
    {
        id: 21,
        chambre: '112',
        tsReferente: 'Marie',
        nom: 'KONE',
        prenom: 'Salimata',
        dateNaissance: '1990-12-08',
        age: 35,
        nationalite: 'Ivoirienne',
        telephone: '06 56 78 90 12',
        email: 'skone90@gmail.com',
        statut: 'Demande en cours',
        assuranceMaladie: 'AME',
        dateArrivee: '2023-06-22',
        aideAlimentaire: 'SSP',
        montantAide: 180,
        emploi: 'Sans',
        compteBancaire: 'Non'
    },
    {
        id: 22,
        chambre: '113',
        tsReferente: 'Sophio',
        nom: 'SANGARE',
        prenom: 'Oumou',
        dateNaissance: '1983-02-14',
        age: 42,
        nationalite: 'Malienne',
        telephone: '07 34 56 78 90',
        email: null,
        statut: 'Irrégulière',
        assuranceMaladie: 'AME',
        dateArrivee: '2019-03-10',
        aideAlimentaire: 'Cohésia',
        montantAide: 220,
        emploi: 'Sans',
        compteBancaire: 'Livret A'
    },
    {
        id: 23,
        chambre: '114',
        tsReferente: 'Sophie',
        nom: 'DEMBELE',
        prenom: 'Fatoumata',
        dateNaissance: '1993-07-19',
        age: 32,
        nationalite: 'Malienne',
        telephone: '06 45 67 89 01',
        email: 'fdembele93@gmail.com',
        statut: 'Irrégulière',
        assuranceMaladie: 'AME',
        dateArrivee: '2022-04-05',
        aideAlimentaire: 'Cohésia',
        montantAide: 220,
        emploi: 'Travail Non déclaré',
        compteBancaire: 'Livret A'
    },
    {
        id: 24,
        chambre: 'Diffus BLR 2',
        tsReferente: 'Marie',
        nom: 'DIARRA',
        prenom: 'Aminata',
        dateNaissance: '1986-05-03',
        age: 39,
        nationalite: 'Malienne',
        telephone: '07 56 78 90 23',
        email: 'adiarra86@gmail.com',
        statut: 'Régulière',
        assuranceMaladie: 'CSS',
        dateArrivee: '2018-12-01',
        aideAlimentaire: 'Non',
        montantAide: 0,
        emploi: 'Travail déclaré',
        compteBancaire: 'Compte courant',
        salaire: 1150
    },
    {
        id: 25,
        chambre: '115',
        tsReferente: 'Sophio',
        nom: 'TRAORE',
        prenom: 'Rokia',
        dateNaissance: '1989-09-27',
        age: 36,
        nationalite: 'Ivoirienne',
        telephone: '06 67 89 01 23',
        email: null,
        statut: 'Irrégulière',
        assuranceMaladie: 'AME',
        dateArrivee: '2021-08-14',
        aideAlimentaire: 'Cohésia',
        montantAide: 220,
        emploi: 'Sans',
        compteBancaire: 'Livret A'
    },
    {
        id: 26,
        chambre: '116',
        tsReferente: 'Sophie',
        nom: 'SIDIBE',
        prenom: 'Mariam',
        dateNaissance: '1997-01-05',
        age: 29,
        nationalite: 'Guinéenne',
        telephone: '07 78 90 12 34',
        email: 'msidibe97@gmail.com',
        statut: 'Demande en cours',
        assuranceMaladie: 'AME',
        dateArrivee: '2024-03-01',
        aideAlimentaire: 'SSP',
        montantAide: 180,
        emploi: 'Sans',
        compteBancaire: 'Non'
    },
    {
        id: 27,
        chambre: '117',
        tsReferente: 'Marie',
        nom: 'BARRY',
        prenom: 'Kadiatou',
        dateNaissance: '1984-10-18',
        age: 41,
        nationalite: 'Guinéenne',
        telephone: '06 89 01 23 45',
        email: 'kbarry84@gmail.com',
        statut: 'Irrégulière',
        assuranceMaladie: 'AME',
        dateArrivee: '2020-06-20',
        aideAlimentaire: 'Cohésia',
        montantAide: 220,
        emploi: 'Travail Non déclaré',
        compteBancaire: 'Livret A'
    },
    {
        id: 28,
        chambre: '118',
        tsReferente: 'Sophio',
        nom: 'SOW',
        prenom: 'Hawa',
        dateNaissance: '1992-03-22',
        age: 33,
        nationalite: 'Sénégalaise',
        telephone: '07 90 12 34 56',
        email: null,
        statut: 'Irrégulière',
        assuranceMaladie: 'AME',
        dateArrivee: '2023-09-08',
        aideAlimentaire: 'SSP',
        montantAide: 180,
        emploi: 'Sans',
        compteBancaire: 'Non'
    },
    {
        id: 29,
        chambre: 'Diffus Montrouge 2',
        tsReferente: 'Sophie',
        nom: 'NDIAYE',
        prenom: 'Fatou',
        dateNaissance: '1988-12-11',
        age: 37,
        nationalite: 'Sénégalaise',
        telephone: '06 01 23 45 67',
        email: 'fndiaye88@gmail.com',
        statut: 'Régulière',
        assuranceMaladie: 'CSS',
        dateArrivee: '2019-07-15',
        aideAlimentaire: 'Non',
        montantAide: 0,
        emploi: 'Travail déclaré',
        compteBancaire: 'Compte courant',
        salaire: 1280
    },
    {
        id: 30,
        chambre: '119',
        tsReferente: 'Marie',
        nom: 'FALL',
        prenom: 'Awa',
        dateNaissance: '1994-06-08',
        age: 31,
        nationalite: 'Sénégalaise',
        telephone: '07 12 34 56 78',
        email: 'afall94@gmail.com',
        statut: 'Irrégulière',
        assuranceMaladie: 'AME',
        dateArrivee: '2022-01-25',
        aideAlimentaire: 'Cohésia',
        montantAide: 220,
        emploi: 'Sans',
        compteBancaire: 'Livret A'
    },
    {
        id: 31,
        chambre: '120',
        tsReferente: 'Sophio',
        nom: 'MBAYE',
        prenom: 'Ndèye',
        dateNaissance: '1985-08-30',
        age: 40,
        nationalite: 'Sénégalaise',
        telephone: '06 23 45 67 89',
        email: null,
        statut: 'Demande en cours',
        assuranceMaladie: 'AME',
        dateArrivee: '2023-04-12',
        aideAlimentaire: 'SSP',
        montantAide: 180,
        emploi: 'Sans',
        compteBancaire: 'Non'
    },
    {
        id: 32,
        chambre: '121',
        tsReferente: 'Sophie',
        nom: 'GUEYE',
        prenom: 'Aminata',
        dateNaissance: '1991-04-17',
        age: 34,
        nationalite: 'Sénégalaise',
        telephone: '07 34 56 78 90',
        email: 'agueye91@gmail.com',
        statut: 'Irrégulière',
        assuranceMaladie: 'AME',
        dateArrivee: '2021-11-03',
        aideAlimentaire: 'Cohésia',
        montantAide: 220,
        emploi: 'Travail Non déclaré',
        compteBancaire: 'Livret A'
    },
    {
        id: 33,
        chambre: '122',
        tsReferente: 'Marie',
        nom: 'SALL',
        prenom: 'Mariétou',
        dateNaissance: '1996-02-28',
        age: 29,
        nationalite: 'Sénégalaise',
        telephone: '06 45 67 89 01',
        email: 'msall96@gmail.com',
        statut: 'Irrégulière',
        assuranceMaladie: 'AME',
        dateArrivee: '2024-02-10',
        aideAlimentaire: 'SSP',
        montantAide: 180,
        emploi: 'Sans',
        compteBancaire: 'Non'
    },
    {
        id: 34,
        chambre: 'Diffus Bagneux 3',
        tsReferente: 'Sophio',
        nom: 'WADE',
        prenom: 'Khady',
        dateNaissance: '1987-11-14',
        age: 38,
        nationalite: 'Sénégalaise',
        telephone: '07 56 78 90 12',
        email: 'kwade87@gmail.com',
        statut: 'Régulière',
        assuranceMaladie: 'CSS',
        dateArrivee: '2017-05-22',
        aideAlimentaire: 'Non',
        montantAide: 0,
        emploi: 'Travail déclaré',
        compteBancaire: 'Compte courant',
        salaire: 1100
    },
    {
        id: 35,
        chambre: '123',
        tsReferente: 'Sophie',
        nom: 'BALDE',
        prenom: 'Fanta',
        dateNaissance: '1993-09-06',
        age: 32,
        nationalite: 'Guinéenne',
        telephone: '06 67 89 01 23',
        email: null,
        statut: 'Irrégulière',
        assuranceMaladie: 'AME',
        dateArrivee: '2022-08-17',
        aideAlimentaire: 'Cohésia',
        montantAide: 220,
        emploi: 'Sans',
        compteBancaire: 'Livret A'
    },
    {
        id: 36,
        chambre: '124',
        tsReferente: 'Marie',
        nom: 'DIALLO',
        prenom: 'Oumou',
        dateNaissance: '1989-01-23',
        age: 37,
        nationalite: 'Guinéenne',
        telephone: '07 78 90 12 34',
        email: 'odiallo89@gmail.com',
        statut: 'Demande en cours',
        assuranceMaladie: 'AME',
        dateArrivee: '2023-07-05',
        aideAlimentaire: 'SSP',
        montantAide: 180,
        emploi: 'Sans',
        compteBancaire: 'Non'
    },
    {
        id: 37,
        chambre: '125',
        tsReferente: 'Sophio',
        nom: 'KABA',
        prenom: 'Maimouna',
        dateNaissance: '1983-05-19',
        age: 42,
        nationalite: 'Guinéenne',
        telephone: '06 89 01 23 45',
        email: null,
        statut: 'Irrégulière',
        assuranceMaladie: 'AME',
        dateArrivee: '2019-10-30',
        aideAlimentaire: 'Cohésia',
        montantAide: 220,
        emploi: 'Travail Non déclaré',
        compteBancaire: 'Livret A'
    },
    {
        id: 38,
        chambre: '126',
        tsReferente: 'Sophie',
        nom: 'BANGOURA',
        prenom: 'Fatoumata',
        dateNaissance: '1995-07-12',
        age: 30,
        nationalite: 'Guinéenne',
        telephone: '07 90 12 34 56',
        email: 'fbangoura95@gmail.com',
        statut: 'Irrégulière',
        assuranceMaladie: 'AME',
        dateArrivee: '2022-05-28',
        aideAlimentaire: 'Cohésia',
        montantAide: 220,
        emploi: 'Sans',
        compteBancaire: 'Livret A'
    },
    {
        id: 39,
        chambre: 'Diffus BLR 3',
        tsReferente: 'Marie',
        nom: 'SOUMAH',
        prenom: 'Mariama',
        dateNaissance: '1990-10-03',
        age: 35,
        nationalite: 'Guinéenne',
        telephone: '06 01 23 45 67',
        email: 'msoumah90@gmail.com',
        statut: 'Régulière',
        assuranceMaladie: 'CSS',
        dateArrivee: '2018-03-14',
        aideAlimentaire: 'Non',
        montantAide: 0,
        emploi: 'Travail déclaré',
        compteBancaire: 'Compte courant',
        salaire: 1200
    },
    {
        id: 40,
        chambre: '127',
        tsReferente: 'Sophio',
        nom: 'CONDE',
        prenom: 'Djénabou',
        dateNaissance: '1986-12-25',
        age: 39,
        nationalite: 'Guinéenne',
        telephone: '07 12 34 56 78',
        email: null,
        statut: 'Irrégulière',
        assuranceMaladie: 'AME',
        dateArrivee: '2020-12-08',
        aideAlimentaire: 'Cohésia',
        montantAide: 220,
        emploi: 'Sans',
        compteBancaire: 'Livret A'
    },
    {
        id: 41,
        chambre: '128',
        tsReferente: 'Sophie',
        nom: 'CAMARA',
        prenom: 'Nana',
        dateNaissance: '1998-03-07',
        age: 27,
        nationalite: 'Guinéenne',
        telephone: '06 23 45 67 89',
        email: 'ncamara98@gmail.com',
        statut: 'Demande en cours',
        assuranceMaladie: 'AME',
        dateArrivee: '2024-04-22',
        aideAlimentaire: 'SSP',
        montantAide: 180,
        emploi: 'Sans',
        compteBancaire: 'Non'
    },
    {
        id: 42,
        chambre: '129',
        tsReferente: 'Marie',
        nom: 'TALL',
        prenom: 'Binta',
        dateNaissance: '1992-08-16',
        age: 33,
        nationalite: 'Mauritanienne',
        telephone: '07 34 56 78 90',
        email: 'btall92@gmail.com',
        statut: 'Irrégulière',
        assuranceMaladie: 'AME',
        dateArrivee: '2021-04-10',
        aideAlimentaire: 'Cohésia',
        montantAide: 220,
        emploi: 'Travail Non déclaré',
        compteBancaire: 'Livret A'
    },
    {
        id: 43,
        chambre: '130',
        tsReferente: 'Sophio',
        nom: 'KANE',
        prenom: 'Djeneba',
        dateNaissance: '1988-04-29',
        age: 37,
        nationalite: 'Mauritanienne',
        telephone: '06 45 67 89 01',
        email: null,
        statut: 'Irrégulière',
        assuranceMaladie: 'AME',
        dateArrivee: '2022-09-15',
        aideAlimentaire: 'Cohésia',
        montantAide: 220,
        emploi: 'Sans',
        compteBancaire: 'Livret A'
    },
    {
        id: 44,
        chambre: 'Diffus Montrouge 3',
        tsReferente: 'Sophie',
        nom: 'SISSOKO',
        prenom: 'Aissatou',
        dateNaissance: '1994-11-08',
        age: 31,
        nationalite: 'Malienne',
        telephone: '07 56 78 90 12',
        email: 'asissoko94@gmail.com',
        statut: 'Régulière',
        assuranceMaladie: 'CSS',
        dateArrivee: '2019-01-20',
        aideAlimentaire: 'Non',
        montantAide: 0,
        emploi: 'Travail déclaré',
        compteBancaire: 'Compte courant',
        salaire: 1350
    },
    {
        id: 45,
        chambre: '131',
        tsReferente: 'Marie',
        nom: 'OUATTARA',
        prenom: 'Safiatou',
        dateNaissance: '1991-06-14',
        age: 34,
        nationalite: 'Burkinabè',
        telephone: '06 67 89 01 23',
        email: 'souattara91@gmail.com',
        statut: 'Irrégulière',
        assuranceMaladie: 'AME',
        dateArrivee: '2023-01-08',
        aideAlimentaire: 'SSP',
        montantAide: 180,
        emploi: 'Sans',
        compteBancaire: 'Non'
    }
];

// Données des familles (extrait du fichier Excel)
const FAMILLES = [
    {
        id: 101,
        chambre: '204',
        tsReferente: 'Sophio',
        composition: 'F+1',
        adultes: [
            {
                nom: 'AGOUSSI',
                prenom: 'Mobio Marie Jeanne',
                dateNaissance: '1986-07-01',
                age: 39,
                sexe: 'F',
                nationalite: 'Ivoirienne',
                telephone: '06 18 44 07 66',
                statut: 'Demande en cours',
                assuranceMaladie: 'AME'
            }
        ],
        enfants: [
            {
                nom: 'OURAGA',
                prenom: 'Yann-Ange Salomon Emmanuel',
                dateNaissance: '2017-03-15',
                age: 8,
                sexe: 'M',
                lieuNaissance: 'Paris 13e',
                scolarite: 'CE1'
            }
        ],
        dateArrivee: '2021-03-30',
        aideAlimentaire: 'Cohésia',
        montantAide: 420
    },
    {
        id: 102,
        chambre: '105',
        tsReferente: 'Sophie',
        composition: 'C+2',
        adultes: [
            {
                nom: 'BAGAYOKO',
                prenom: 'Habibatou',
                dateNaissance: '1985-11-09',
                age: 40,
                sexe: 'F',
                nationalite: 'Ivoirienne',
                telephone: '07 53 96 12 77',
                statut: 'Irrégulière',
                assuranceMaladie: 'AME'
            },
            {
                nom: 'TRAORE',
                prenom: 'Lacina',
                dateNaissance: '1992-07-07',
                age: 33,
                sexe: 'M',
                nationalite: 'Ivoirien',
                telephone: '07 58 94 45 44',
                statut: 'Irrégulière',
                assuranceMaladie: 'Dépassement plafond',
                salaire: 790
            }
        ],
        enfants: [
            {
                nom: 'TRAORE',
                prenom: 'Mohamed Lamine',
                dateNaissance: '2021-08-27',
                age: 4,
                sexe: 'M',
                lieuNaissance: 'Paris 10e',
                scolarite: 'PS'
            },
            {
                nom: 'TRAORE',
                prenom: 'Aissatou Noura',
                dateNaissance: '2024-10-31',
                age: 1,
                sexe: 'F',
                lieuNaissance: 'Kremlin Bicêtre',
                scolarite: 'En famille'
            }
        ],
        dateArrivee: '2023-10-15',
        aideAlimentaire: 'Cohésia',
        montantAide: 340
    },
    {
        id: 103,
        chambre: '221',
        tsReferente: 'Sophio',
        composition: 'C+3',
        adultes: [
            {
                nom: 'CHERIF',
                prenom: 'Affou',
                dateNaissance: '1999-02-10',
                age: 26,
                sexe: 'F',
                nationalite: 'Ivoirienne',
                telephone: '07 80 67 56 03',
                statut: 'Demande en cours',
                assuranceMaladie: 'AME'
            },
            {
                nom: 'MARA',
                prenom: 'Mamadi',
                dateNaissance: '1996-10-10',
                age: 29,
                sexe: 'M',
                nationalite: 'Guinéen',
                telephone: '06 23 07 29 47',
                statut: 'Demande en cours',
                assuranceMaladie: 'AME',
                salaire: 1114
            }
        ],
        enfants: [
            {
                nom: 'MARA',
                prenom: 'Djene',
                dateNaissance: '2017-05-19',
                age: 8,
                sexe: 'F',
                lieuNaissance: 'Odienne, Côte d\'Ivoire',
                scolarite: 'CE1'
            },
            {
                nom: 'MARA',
                prenom: 'Sekou',
                dateNaissance: '2020-08-29',
                age: 5,
                sexe: 'M',
                lieuNaissance: 'Paris 15e',
                scolarite: 'GS'
            },
            {
                nom: 'MARA',
                prenom: 'Ali',
                dateNaissance: '2022-08-05',
                age: 3,
                sexe: 'M',
                lieuNaissance: 'Kremlin Bicêtre',
                scolarite: 'TPS'
            }
        ],
        dateArrivee: '2020-12-21',
        aideAlimentaire: 'Cohésia',
        montantAide: 0
    },
    {
        id: 104,
        chambre: '219',
        tsReferente: 'Sophio',
        composition: 'F+1',
        adultes: [
            {
                nom: 'DIABY',
                prenom: 'Mariam',
                dateNaissance: '1971-05-19',
                age: 54,
                sexe: 'F',
                nationalite: 'Ivoirienne',
                telephone: '07 58 44 13 43',
                statut: 'Demande en cours',
                assuranceMaladie: 'AME'
            }
        ],
        enfants: [
            {
                nom: 'DIABY',
                prenom: 'Myriam Anahice',
                dateNaissance: '2009-06-10',
                age: 16,
                sexe: 'F',
                lieuNaissance: 'Borotou, Côte d\'Ivoire',
                scolarite: '2nde'
            }
        ],
        dateArrivee: '2016-12-10',
        aideAlimentaire: 'Cohésia',
        montantAide: 420
    },
    {
        id: 105,
        chambre: '102',
        tsReferente: 'Sophio',
        composition: 'F+3',
        adultes: [
            {
                nom: 'SHABI',
                prenom: 'Modupeola',
                dateNaissance: '1974-10-11',
                age: 51,
                sexe: 'F',
                nationalite: 'Nigériane',
                telephone: '07 53 49 39 20',
                statut: 'Irrégulière',
                assuranceMaladie: 'AME'
            }
        ],
        enfants: [
            {
                nom: 'ASHIRU',
                prenom: 'Yusuff Abiodun',
                dateNaissance: '2014-07-22',
                age: 11,
                sexe: 'M',
                lieuNaissance: 'Houston, Texas, USA',
                scolarite: 'CM2'
            },
            {
                nom: 'ASHIRU',
                prenom: 'Aisha Mopelola',
                dateNaissance: '2016-11-07',
                age: 9,
                sexe: 'F',
                lieuNaissance: 'Houston, Texas, USA',
                scolarite: 'CE2'
            },
            {
                nom: 'CAMARA',
                prenom: 'Usman Obafemi',
                dateNaissance: '2019-01-27',
                age: 6,
                sexe: 'M',
                lieuNaissance: 'Paris 10e',
                scolarite: 'CP'
            }
        ],
        dateArrivee: '2022-10-07',
        aideAlimentaire: 'Cohésia',
        montantAide: 790
    },
    {
        id: 106,
        chambre: '228',
        tsReferente: 'Sophio',
        composition: 'F+1',
        adultes: [
            {
                nom: 'YUMKO KENMOGNE',
                prenom: 'Epiphanie',
                dateNaissance: '1990-08-14',
                age: 35,
                sexe: 'F',
                nationalite: 'Camerounaise',
                telephone: '06 09 83 08 49',
                statut: 'Irrégulière',
                assuranceMaladie: 'AME'
            }
        ],
        enfants: [
            {
                nom: 'KAMGO',
                prenom: 'Jean Claude',
                dateNaissance: '2022-09-01',
                age: 3,
                sexe: 'M',
                lieuNaissance: 'Paris 13e',
                scolarite: 'Crèche'
            }
        ],
        dateArrivee: '2023-06-10',
        aideAlimentaire: 'Cohésia',
        montantAide: 420
    },
    {
        id: 107,
        chambre: '220',
        tsReferente: 'Sophio',
        composition: 'C+2',
        adultes: [
            {
                nom: 'BASILAIA',
                prenom: 'Lela',
                dateNaissance: '1981-06-05',
                age: 44,
                sexe: 'F',
                nationalite: 'Géorgienne',
                telephone: '07 53 12 97 51',
                statut: 'Demande en cours',
                assuranceMaladie: 'AME'
            },
            {
                nom: 'MANUKYAN',
                prenom: 'Erik',
                dateNaissance: '1983-12-07',
                age: 42,
                sexe: 'M',
                nationalite: 'Géorgien',
                telephone: '07 80 08 57 47',
                statut: 'Demande en cours',
                assuranceMaladie: 'AME'
            }
        ],
        enfants: [
            {
                nom: 'MANUKYAN',
                prenom: 'Aleksandre',
                dateNaissance: '2012-01-25',
                age: 13,
                sexe: 'M',
                lieuNaissance: 'Tbilissi, Géorgie',
                scolarite: '5ème'
            },
            {
                nom: 'MANUKYAN',
                prenom: 'Leonardo',
                dateNaissance: '2021-11-11',
                age: 4,
                sexe: 'M',
                lieuNaissance: 'Kremlin Bicêtre',
                scolarite: 'PS'
            }
        ],
        dateArrivee: '2021-01-21',
        aideAlimentaire: 'Cohésia',
        montantAide: 790
    },
    {
        id: 108,
        chambre: '229',
        tsReferente: 'Marie',
        composition: 'F+2',
        adultes: [
            {
                nom: 'DOUMBIA',
                prenom: 'Fatoumata',
                dateNaissance: '1988-03-12',
                age: 37,
                sexe: 'F',
                nationalite: 'Malienne',
                telephone: '07 45 67 89 12',
                statut: 'Irrégulière',
                assuranceMaladie: 'AME'
            }
        ],
        enfants: [
            {
                nom: 'DOUMBIA',
                prenom: 'Amadou',
                dateNaissance: '2015-06-20',
                age: 10,
                sexe: 'M',
                lieuNaissance: 'Bamako, Mali',
                scolarite: 'CM1'
            },
            {
                nom: 'DOUMBIA',
                prenom: 'Kadiatou',
                dateNaissance: '2019-09-14',
                age: 6,
                sexe: 'F',
                lieuNaissance: 'Paris 14e',
                scolarite: 'CP'
            }
        ],
        dateArrivee: '2020-05-18',
        aideAlimentaire: 'Cohésia',
        montantAide: 560
    },
    {
        id: 109,
        chambre: '230',
        tsReferente: 'Sophie',
        composition: 'C+1',
        adultes: [
            {
                nom: 'KOUAKOU',
                prenom: 'Adjoua',
                dateNaissance: '1992-07-08',
                age: 33,
                sexe: 'F',
                nationalite: 'Ivoirienne',
                telephone: '06 78 90 12 34',
                statut: 'Demande en cours',
                assuranceMaladie: 'AME'
            },
            {
                nom: 'KOUAKOU',
                prenom: 'Yao',
                dateNaissance: '1989-11-25',
                age: 36,
                sexe: 'M',
                nationalite: 'Ivoirien',
                telephone: '07 12 34 56 78',
                statut: 'Demande en cours',
                assuranceMaladie: 'AME',
                salaire: 1250
            }
        ],
        enfants: [
            {
                nom: 'KOUAKOU',
                prenom: 'Akissi',
                dateNaissance: '2020-02-14',
                age: 5,
                sexe: 'F',
                lieuNaissance: 'Paris 12e',
                scolarite: 'MS'
            }
        ],
        dateArrivee: '2022-08-25',
        aideAlimentaire: 'SSP',
        montantAide: 340
    },
    {
        id: 110,
        chambre: '231',
        tsReferente: 'Sophio',
        composition: 'F+3',
        adultes: [
            {
                nom: 'MENSAH',
                prenom: 'Ama',
                dateNaissance: '1985-09-17',
                age: 40,
                sexe: 'F',
                nationalite: 'Togolaise',
                telephone: '07 89 01 23 45',
                statut: 'Irrégulière',
                assuranceMaladie: 'AME'
            }
        ],
        enfants: [
            {
                nom: 'MENSAH',
                prenom: 'Kofi',
                dateNaissance: '2012-04-22',
                age: 13,
                sexe: 'M',
                lieuNaissance: 'Lomé, Togo',
                scolarite: '5ème'
            },
            {
                nom: 'MENSAH',
                prenom: 'Afi',
                dateNaissance: '2016-08-03',
                age: 9,
                sexe: 'F',
                lieuNaissance: 'Lomé, Togo',
                scolarite: 'CE2'
            },
            {
                nom: 'MENSAH',
                prenom: 'Edem',
                dateNaissance: '2021-01-12',
                age: 4,
                sexe: 'M',
                lieuNaissance: 'Paris 18e',
                scolarite: 'PS'
            }
        ],
        dateArrivee: '2021-11-30',
        aideAlimentaire: 'Cohésia',
        montantAide: 790
    },
    {
        id: 111,
        chambre: '232',
        tsReferente: 'Marie',
        composition: 'F+1',
        adultes: [
            {
                nom: 'OSEI',
                prenom: 'Akua',
                dateNaissance: '1993-05-29',
                age: 32,
                sexe: 'F',
                nationalite: 'Ghanéenne',
                telephone: '06 90 12 34 56',
                statut: 'Irrégulière',
                assuranceMaladie: 'AME'
            }
        ],
        enfants: [
            {
                nom: 'OSEI',
                prenom: 'Kwame',
                dateNaissance: '2018-12-08',
                age: 7,
                sexe: 'M',
                lieuNaissance: 'Accra, Ghana',
                scolarite: 'CE1'
            }
        ],
        dateArrivee: '2023-03-15',
        aideAlimentaire: 'SSP',
        montantAide: 420
    },
    {
        id: 112,
        chambre: '233',
        tsReferente: 'Sophie',
        composition: 'C+2',
        adultes: [
            {
                nom: 'ADEYEMI',
                prenom: 'Oluwaseun',
                dateNaissance: '1990-01-15',
                age: 36,
                sexe: 'F',
                nationalite: 'Nigériane',
                telephone: '07 01 23 45 67',
                statut: 'Demande en cours',
                assuranceMaladie: 'AME'
            },
            {
                nom: 'ADEYEMI',
                prenom: 'Chukwuemeka',
                dateNaissance: '1987-06-22',
                age: 38,
                sexe: 'M',
                nationalite: 'Nigérian',
                telephone: '06 23 45 67 89',
                statut: 'Demande en cours',
                assuranceMaladie: 'AME'
            }
        ],
        enfants: [
            {
                nom: 'ADEYEMI',
                prenom: 'Chioma',
                dateNaissance: '2017-03-28',
                age: 8,
                sexe: 'F',
                lieuNaissance: 'Lagos, Nigeria',
                scolarite: 'CE1'
            },
            {
                nom: 'ADEYEMI',
                prenom: 'Oluchi',
                dateNaissance: '2022-07-15',
                age: 3,
                sexe: 'F',
                lieuNaissance: 'Paris 19e',
                scolarite: 'TPS'
            }
        ],
        dateArrivee: '2022-01-10',
        aideAlimentaire: 'Cohésia',
        montantAide: 680
    },
    {
        id: 113,
        chambre: '234',
        tsReferente: 'Sophio',
        composition: 'F+2',
        adultes: [
            {
                nom: 'NDIAYE',
                prenom: 'Aminata',
                dateNaissance: '1987-08-05',
                age: 38,
                sexe: 'F',
                nationalite: 'Sénégalaise',
                telephone: '07 34 56 78 90',
                statut: 'Régulière',
                assuranceMaladie: 'CSS'
            }
        ],
        enfants: [
            {
                nom: 'NDIAYE',
                prenom: 'Moussa',
                dateNaissance: '2014-11-18',
                age: 11,
                sexe: 'M',
                lieuNaissance: 'Dakar, Sénégal',
                scolarite: 'CM2'
            },
            {
                nom: 'NDIAYE',
                prenom: 'Fatou',
                dateNaissance: '2018-04-07',
                age: 7,
                sexe: 'F',
                lieuNaissance: 'Paris 13e',
                scolarite: 'CE1'
            }
        ],
        dateArrivee: '2019-06-20',
        aideAlimentaire: 'Non',
        montantAide: 0
    },
    {
        id: 114,
        chambre: '235',
        tsReferente: 'Marie',
        composition: 'C+4',
        adultes: [
            {
                nom: 'KABORE',
                prenom: 'Salamata',
                dateNaissance: '1984-12-10',
                age: 41,
                sexe: 'F',
                nationalite: 'Burkinabè',
                telephone: '06 45 67 89 01',
                statut: 'Irrégulière',
                assuranceMaladie: 'AME'
            },
            {
                nom: 'KABORE',
                prenom: 'Ousmane',
                dateNaissance: '1980-03-28',
                age: 45,
                sexe: 'M',
                nationalite: 'Burkinabè',
                telephone: '07 56 78 90 12',
                statut: 'Irrégulière',
                assuranceMaladie: 'AME'
            }
        ],
        enfants: [
            {
                nom: 'KABORE',
                prenom: 'Ibrahim',
                dateNaissance: '2010-07-14',
                age: 15,
                sexe: 'M',
                lieuNaissance: 'Ouagadougou, Burkina Faso',
                scolarite: '3ème'
            },
            {
                nom: 'KABORE',
                prenom: 'Mariam',
                dateNaissance: '2013-02-22',
                age: 12,
                sexe: 'F',
                lieuNaissance: 'Ouagadougou, Burkina Faso',
                scolarite: '6ème'
            },
            {
                nom: 'KABORE',
                prenom: 'Abdoulaye',
                dateNaissance: '2017-09-05',
                age: 8,
                sexe: 'M',
                lieuNaissance: 'Paris 20e',
                scolarite: 'CE2'
            },
            {
                nom: 'KABORE',
                prenom: 'Aissatou',
                dateNaissance: '2021-05-18',
                age: 4,
                sexe: 'F',
                lieuNaissance: 'Kremlin Bicêtre',
                scolarite: 'PS'
            }
        ],
        dateArrivee: '2018-09-12',
        aideAlimentaire: 'Cohésia',
        montantAide: 1200
    },
    {
        id: 115,
        chambre: '236',
        tsReferente: 'Sophie',
        composition: 'F+1',
        adultes: [
            {
                nom: 'SAVANE',
                prenom: 'Mariama',
                dateNaissance: '1995-04-17',
                age: 30,
                sexe: 'F',
                nationalite: 'Guinéenne',
                telephone: '07 67 89 01 23',
                statut: 'Irrégulière',
                assuranceMaladie: 'AME'
            }
        ],
        enfants: [
            {
                nom: 'SAVANE',
                prenom: 'Mohamed',
                dateNaissance: '2023-08-25',
                age: 2,
                sexe: 'M',
                lieuNaissance: 'Paris 14e',
                scolarite: 'En famille'
            }
        ],
        dateArrivee: '2023-12-05',
        aideAlimentaire: 'SSP',
        montantAide: 420
    },
    {
        id: 116,
        chambre: '237',
        tsReferente: 'Sophio',
        composition: 'C+3',
        adultes: [
            {
                nom: 'MBENGUE',
                prenom: 'Coumba',
                dateNaissance: '1991-10-30',
                age: 34,
                sexe: 'F',
                nationalite: 'Sénégalaise',
                telephone: '06 78 90 12 34',
                statut: 'Demande en cours',
                assuranceMaladie: 'AME'
            },
            {
                nom: 'MBENGUE',
                prenom: 'Pape',
                dateNaissance: '1988-05-12',
                age: 37,
                sexe: 'M',
                nationalite: 'Sénégalais',
                telephone: '07 89 01 23 45',
                statut: 'Demande en cours',
                assuranceMaladie: 'AME',
                salaire: 980
            }
        ],
        enfants: [
            {
                nom: 'MBENGUE',
                prenom: 'Seydou',
                dateNaissance: '2015-01-08',
                age: 11,
                sexe: 'M',
                lieuNaissance: 'Dakar, Sénégal',
                scolarite: 'CM1'
            },
            {
                nom: 'MBENGUE',
                prenom: 'Awa',
                dateNaissance: '2018-06-22',
                age: 7,
                sexe: 'F',
                lieuNaissance: 'Paris 15e',
                scolarite: 'CE1'
            },
            {
                nom: 'MBENGUE',
                prenom: 'Mamadou',
                dateNaissance: '2022-03-10',
                age: 3,
                sexe: 'M',
                lieuNaissance: 'Kremlin Bicêtre',
                scolarite: 'TPS'
            }
        ],
        dateArrivee: '2020-02-28',
        aideAlimentaire: 'Cohésia',
        montantAide: 900
    },
    {
        id: 117,
        chambre: '238',
        tsReferente: 'Marie',
        composition: 'F+2',
        adultes: [
            {
                nom: 'TOUNKARA',
                prenom: 'Kadidia',
                dateNaissance: '1989-07-25',
                age: 36,
                sexe: 'F',
                nationalite: 'Malienne',
                telephone: '07 90 12 34 56',
                statut: 'Irrégulière',
                assuranceMaladie: 'AME'
            }
        ],
        enfants: [
            {
                nom: 'TOUNKARA',
                prenom: 'Oumar',
                dateNaissance: '2016-12-03',
                age: 9,
                sexe: 'M',
                lieuNaissance: 'Kayes, Mali',
                scolarite: 'CE2'
            },
            {
                nom: 'TOUNKARA',
                prenom: 'Hawa',
                dateNaissance: '2020-04-18',
                age: 5,
                sexe: 'F',
                lieuNaissance: 'Paris 18e',
                scolarite: 'GS'
            }
        ],
        dateArrivee: '2021-07-14',
        aideAlimentaire: 'Cohésia',
        montantAide: 560
    }
];

// État de l'application
let state = {
    currentTab: 'femmes',
    filters: {
        search: '',
        nationalite: 'all',
        statut: 'all',
        ts: 'all'
    },
    darkMode: localStorage.getItem('darkMode') === 'true'
};

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    initApp();
});

function initApp() {
    // Mode sombre
    if (state.darkMode) {
        document.body.setAttribute('data-theme', 'dark');
        document.getElementById('dark-mode-icon').textContent = '☀️';
    }

    // Calculer et afficher les statistiques
    updateStatistics();

    // Remplir les filtres
    populateFilters();

    // Afficher la liste
    renderList();
}

function updateStatistics() {
    // Compter les femmes isolées
    const nbFemmesIsolees = FEMMES_ISOLEES.length;

    // Compter dans les familles
    let nbFemmesFamilles = 0;
    let nbHommes = 0;
    let nbEnfants = 0;
    let totalAgesEnfants = 0;
    let totalAgesAdultes = 0;
    let nbAdultes = 0;
    let nbTravail = 0;
    let nbAME = 0;
    let nbSSP = 0;
    let nbLogement = 0;

    // Stats des femmes isolées
    FEMMES_ISOLEES.forEach(f => {
        totalAgesAdultes += f.age;
        nbAdultes++;
        if (f.emploi && (f.emploi.includes('Travail déclaré') || f.emploi.includes('Travail Non déclaré'))) {
            nbTravail++;
        }
        if (f.assuranceMaladie === 'AME') {
            nbAME++;
        }
        if (f.aideAlimentaire === 'SSP') {
            nbSSP++;
        }
    });

    // Stats des familles
    FAMILLES.forEach(f => {
        f.adultes.forEach(a => {
            if (a.sexe === 'F') {
                nbFemmesFamilles++;
            } else {
                nbHommes++;
            }
            totalAgesAdultes += a.age;
            nbAdultes++;
            if (a.salaire) {
                nbTravail++;
            }
            if (a.assuranceMaladie === 'AME') {
                nbAME++;
            }
        });

        f.enfants.forEach(e => {
            nbEnfants++;
            totalAgesEnfants += e.age;
        });

        if (f.aideAlimentaire === 'SSP') {
            nbSSP++;
        }
    });

    const totalFemmes = nbFemmesIsolees + nbFemmesFamilles;
    const totalHeberges = totalFemmes + nbHommes + nbEnfants;
    const ageMoyenEnfants = nbEnfants > 0 ? (totalAgesEnfants / nbEnfants).toFixed(1) : 0;
    const ageMoyenTotal = nbAdultes > 0 ? Math.round(totalAgesAdultes / nbAdultes) : 0;

    // Mettre à jour les éléments du DOM
    document.getElementById('stat-total').textContent = totalHeberges;
    document.getElementById('stat-femmes').textContent = totalFemmes;
    document.getElementById('stat-isolees').textContent = nbFemmesIsolees;
    document.getElementById('stat-hommes').textContent = nbHommes;
    document.getElementById('stat-enfants').textContent = nbEnfants;
    document.getElementById('stat-travail').textContent = nbTravail;
    document.getElementById('stat-ame').textContent = nbAME;
    document.getElementById('stat-ssp').textContent = nbSSP;
    document.getElementById('stat-logement').textContent = nbLogement || Math.round(totalHeberges * 0.08); // Estimation

    // Mettre à jour l'âge moyen des enfants
    const enfantsStatSub = document.querySelector('.stat-card.stat-children .stat-sub strong');
    if (enfantsStatSub) {
        enfantsStatSub.textContent = ageMoyenEnfants;
    }

    // Mettre à jour les compteurs des onglets
    document.getElementById('tab-count-femmes').textContent = nbFemmesIsolees;
    document.getElementById('tab-count-familles').textContent = FAMILLES.length;
    document.getElementById('tab-count-enfants').textContent = nbEnfants;
}

function populateFilters() {
    // Nationalités
    const nationalites = new Set();
    FEMMES_ISOLEES.forEach(f => nationalites.add(f.nationalite));
    FAMILLES.forEach(f => f.adultes.forEach(a => nationalites.add(a.nationalite)));

    const selectNat = document.getElementById('filter-nationalite');
    [...nationalites].sort().forEach(nat => {
        const opt = document.createElement('option');
        opt.value = nat;
        opt.textContent = nat;
        selectNat.appendChild(opt);
    });

    // TS Référentes
    const tsSet = new Set();
    FEMMES_ISOLEES.forEach(f => tsSet.add(f.tsReferente));
    FAMILLES.forEach(f => tsSet.add(f.tsReferente));

    const selectTs = document.getElementById('filter-ts');
    [...tsSet].sort().forEach(ts => {
        const opt = document.createElement('option');
        opt.value = ts;
        opt.textContent = ts;
        selectTs.appendChild(opt);
    });
}

function switchTab(tab) {
    state.currentTab = tab;
    document.querySelectorAll('.tab').forEach(t => {
        t.classList.toggle('active', t.dataset.tab === tab);
    });
    renderList();
}

function applyFilters() {
    state.filters.search = document.getElementById('search').value.toLowerCase();
    state.filters.nationalite = document.getElementById('filter-nationalite').value;
    state.filters.statut = document.getElementById('filter-statut').value;
    state.filters.ts = document.getElementById('filter-ts').value;
    renderList();
}

function renderList() {
    const header = document.getElementById('list-header');
    const body = document.getElementById('list-body');

    if (state.currentTab === 'femmes') {
        renderFemmesList(header, body);
    } else if (state.currentTab === 'familles') {
        renderFamillesList(header, body);
    } else {
        renderEnfantsList(header, body);
    }
}

function renderFemmesList(header, body) {
    header.innerHTML = `
        <div>Chambre</div>
        <div>Nom / Prénom</div>
        <div>Nationalité</div>
        <div>Âge</div>
        <div>Statut</div>
        <div>Assurance</div>
        <div>TS Réf.</div>
        <div>Voir</div>
    `;

    let filtered = FEMMES_ISOLEES.filter(f => {
        if (state.filters.search) {
            const searchStr = `${f.nom} ${f.prenom} ${f.chambre}`.toLowerCase();
            if (!searchStr.includes(state.filters.search)) return false;
        }
        if (state.filters.nationalite !== 'all' && f.nationalite !== state.filters.nationalite) return false;
        if (state.filters.statut !== 'all') {
            const statut = f.statut.toLowerCase();
            if (state.filters.statut === 'reguliere' && !statut.includes('régulière')) return false;
            if (state.filters.statut === 'irreguliere' && !statut.includes('irrégulière')) return false;
            if (state.filters.statut === 'demande' && !statut.includes('demande')) return false;
        }
        if (state.filters.ts !== 'all' && f.tsReferente !== state.filters.ts) return false;
        return true;
    });

    document.getElementById('tab-count-femmes').textContent = filtered.length;

    body.innerHTML = filtered.map(f => {
        const initials = `${f.prenom[0]}${f.nom[0]}`;
        const statutBadge = getStatutBadge(f.statut);
        const assuranceBadge = getAssuranceBadge(f.assuranceMaladie);

        return `
            <div class="list-row" onclick="showFemmeDetail(${f.id})">
                <div>${f.chambre}</div>
                <div>
                    <span class="avatar avatar-f">${initials}</span>
                    <span><strong>${f.nom}</strong><br>${f.prenom}</span>
                </div>
                <div>${f.nationalite}</div>
                <div>${f.age} ans</div>
                <div>${statutBadge}</div>
                <div>${assuranceBadge}</div>
                <div>${f.tsReferente}</div>
                <div><button class="btn-view">👁️</button></div>
            </div>
        `;
    }).join('');
}

function renderFamillesList(header, body) {
    header.innerHTML = `
        <div>Chambre</div>
        <div>Famille</div>
        <div>Composition</div>
        <div>Enfants</div>
        <div>Nationalité</div>
        <div>Statut</div>
        <div>TS Réf.</div>
        <div>Voir</div>
    `;

    let filtered = FAMILLES.filter(f => {
        if (state.filters.search) {
            const searchStr = f.adultes.map(a => `${a.nom} ${a.prenom}`).join(' ').toLowerCase() + f.chambre.toLowerCase();
            if (!searchStr.includes(state.filters.search)) return false;
        }
        if (state.filters.nationalite !== 'all') {
            if (!f.adultes.some(a => a.nationalite === state.filters.nationalite)) return false;
        }
        if (state.filters.ts !== 'all' && f.tsReferente !== state.filters.ts) return false;
        return true;
    });

    document.getElementById('tab-count-familles').textContent = filtered.length;

    body.innerHTML = filtered.map(f => {
        const mainAdult = f.adultes[0];
        const initials = `${mainAdult.prenom[0]}${mainAdult.nom[0]}`;
        const statutBadge = getStatutBadge(mainAdult.statut);

        return `
            <div class="list-row" onclick="showFamilleDetail(${f.id})">
                <div>${f.chambre}</div>
                <div>
                    <span class="avatar avatar-f">${initials}</span>
                    <span><strong>${mainAdult.nom}</strong><br>${mainAdult.prenom}</span>
                </div>
                <div>${f.composition}</div>
                <div>${f.enfants.length}</div>
                <div>${mainAdult.nationalite}</div>
                <div>${statutBadge}</div>
                <div>${f.tsReferente}</div>
                <div><button class="btn-view">👁️</button></div>
            </div>
        `;
    }).join('');
}

function renderEnfantsList(header, body) {
    header.innerHTML = `
        <div>Famille</div>
        <div>Nom / Prénom</div>
        <div>Sexe</div>
        <div>Âge</div>
        <div>Scolarité</div>
        <div>Lieu naiss.</div>
        <div>Chambre</div>
        <div>Voir</div>
    `;

    let allEnfants = [];
    FAMILLES.forEach(f => {
        f.enfants.forEach(e => {
            allEnfants.push({
                ...e,
                familleId: f.id,
                chambre: f.chambre,
                familleNom: f.adultes[0].nom
            });
        });
    });

    let filtered = allEnfants.filter(e => {
        if (state.filters.search) {
            const searchStr = `${e.nom} ${e.prenom}`.toLowerCase();
            if (!searchStr.includes(state.filters.search)) return false;
        }
        return true;
    });

    document.getElementById('tab-count-enfants').textContent = filtered.length;

    body.innerHTML = filtered.map(e => {
        const initials = `${e.prenom[0]}${e.nom[0]}`;
        const avatarClass = e.sexe === 'M' ? 'avatar-m' : 'avatar-f';

        return `
            <div class="list-row" onclick="showFamilleDetail(${e.familleId})">
                <div>${e.familleNom}</div>
                <div>
                    <span class="avatar ${avatarClass}">${initials}</span>
                    <span><strong>${e.nom}</strong><br>${e.prenom}</span>
                </div>
                <div>${e.sexe === 'M' ? '👦' : '👧'}</div>
                <div>${e.age} ans</div>
                <div>${e.scolarite || '-'}</div>
                <div>${e.lieuNaissance?.split(',')[0] || '-'}</div>
                <div>${e.chambre}</div>
                <div><button class="btn-view">👁️</button></div>
            </div>
        `;
    }).join('');
}

function getStatutBadge(statut) {
    if (!statut) return '-';
    const s = statut.toLowerCase();
    if (s.includes('régulière') && !s.includes('irrégulière')) {
        return '<span class="badge badge-reguliere">Régulière</span>';
    }
    if (s.includes('irrégulière')) {
        return '<span class="badge badge-irreguliere">Irrégulière</span>';
    }
    if (s.includes('demande')) {
        return '<span class="badge badge-demande">En cours</span>';
    }
    return statut;
}

function getAssuranceBadge(assurance) {
    if (!assurance) return '-';
    if (assurance === 'AME') {
        return '<span class="badge badge-ame">AME</span>';
    }
    if (assurance.includes('CSS')) {
        return '<span class="badge badge-css">CSS</span>';
    }
    return assurance;
}

function showFemmeDetail(id) {
    const f = FEMMES_ISOLEES.find(x => x.id === id);
    if (!f) return;

    const initials = `${f.prenom[0]}${f.nom[0]}`;
    const content = document.getElementById('detail-content');

    content.innerHTML = `
        <div class="detail-header">
            <div class="detail-avatar avatar-f">${initials}</div>
            <div class="detail-info">
                <h2>${f.prenom} ${f.nom}</h2>
                <p>Chambre ${f.chambre} - TS Référente: ${f.tsReferente}</p>
            </div>
        </div>

        <div class="detail-sections">
            <div class="detail-section">
                <h3>👤 État civil</h3>
                <div class="detail-row">
                    <span class="label">Date de naissance</span>
                    <span class="value">${formatDate(f.dateNaissance)} (${f.age} ans)</span>
                </div>
                <div class="detail-row">
                    <span class="label">Nationalité</span>
                    <span class="value">${f.nationalite}</span>
                </div>
                <div class="detail-row">
                    <span class="label">Téléphone</span>
                    <span class="value">${f.telephone || '-'}</span>
                </div>
                <div class="detail-row">
                    <span class="label">Email</span>
                    <span class="value">${f.email || '-'}</span>
                </div>
            </div>

            <div class="detail-section">
                <h3>📋 Situation administrative</h3>
                <div class="detail-row">
                    <span class="label">Statut</span>
                    <span class="value">${getStatutBadge(f.statut)}</span>
                </div>
                <div class="detail-row">
                    <span class="label">Assurance maladie</span>
                    <span class="value">${getAssuranceBadge(f.assuranceMaladie)}</span>
                </div>
                <div class="detail-row">
                    <span class="label">Date d'arrivée CHU</span>
                    <span class="value">${formatDate(f.dateArrivee)}</span>
                </div>
            </div>

            <div class="detail-section">
                <h3>💰 Ressources</h3>
                <div class="detail-row">
                    <span class="label">Aide alimentaire</span>
                    <span class="value">${f.aideAlimentaire} ${f.montantAide ? `(${f.montantAide}€)` : ''}</span>
                </div>
                <div class="detail-row">
                    <span class="label">Emploi</span>
                    <span class="value">${f.emploi || '-'}</span>
                </div>
                ${f.salaire ? `
                <div class="detail-row">
                    <span class="label">Salaire</span>
                    <span class="value">${f.salaire}€</span>
                </div>
                ` : ''}
                <div class="detail-row">
                    <span class="label">Compte bancaire</span>
                    <span class="value">${f.compteBancaire || 'Non'}</span>
                </div>
            </div>
        </div>
    `;

    document.getElementById('detail-modal').classList.add('active');
}

function showFamilleDetail(id) {
    const f = FAMILLES.find(x => x.id === id);
    if (!f) return;

    const mainAdult = f.adultes[0];
    const initials = `${mainAdult.prenom[0]}${mainAdult.nom[0]}`;
    const content = document.getElementById('detail-content');

    content.innerHTML = `
        <div class="detail-header">
            <div class="detail-avatar avatar-f">${initials}</div>
            <div class="detail-info">
                <h2>Famille ${mainAdult.nom}</h2>
                <p>Chambre ${f.chambre} - ${f.composition} - TS Référente: ${f.tsReferente}</p>
            </div>
        </div>

        <div class="detail-sections">
            <div class="detail-section">
                <h3>👥 Adultes (${f.adultes.length})</h3>
                ${f.adultes.map(a => `
                    <div class="detail-row">
                        <span class="label">${a.sexe === 'M' ? '👨' : '👩'} ${a.prenom} ${a.nom}</span>
                        <span class="value">${a.age} ans - ${a.nationalite}</span>
                    </div>
                    <div class="detail-row">
                        <span class="label">Statut</span>
                        <span class="value">${getStatutBadge(a.statut)}</span>
                    </div>
                    ${a.salaire ? `
                    <div class="detail-row">
                        <span class="label">Salaire</span>
                        <span class="value">${a.salaire}€</span>
                    </div>
                    ` : ''}
                `).join('')}
            </div>

            <div class="detail-section">
                <h3>👶 Enfants (${f.enfants.length})</h3>
                <div class="enfants-list">
                    ${f.enfants.map(e => `
                        <div class="enfant-item">
                            <div class="enfant-avatar">${e.sexe === 'M' ? '👦' : '👧'}</div>
                            <div class="enfant-info">
                                <div class="name">${e.prenom} ${e.nom}</div>
                                <div class="details">${e.age} ans - ${e.scolarite || 'Non scolarisé'}</div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>

            <div class="detail-section">
                <h3>📋 Hébergement</h3>
                <div class="detail-row">
                    <span class="label">Date d'arrivée</span>
                    <span class="value">${formatDate(f.dateArrivee)}</span>
                </div>
                <div class="detail-row">
                    <span class="label">Aide alimentaire</span>
                    <span class="value">${f.aideAlimentaire} ${f.montantAide ? `(${f.montantAide}€)` : ''}</span>
                </div>
            </div>
        </div>
    `;

    document.getElementById('detail-modal').classList.add('active');
}

function closeDetailModal() {
    document.getElementById('detail-modal').classList.remove('active');
}

function formatDate(dateStr) {
    if (!dateStr) return '-';
    const d = new Date(dateStr);
    return d.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

function toggleDarkMode() {
    state.darkMode = !state.darkMode;
    document.body.setAttribute('data-theme', state.darkMode ? 'dark' : '');
    document.getElementById('dark-mode-icon').textContent = state.darkMode ? '☀️' : '🌙';
    localStorage.setItem('darkMode', state.darkMode);
}

function exportData() {
    let csv = 'Nom,Prénom,Chambre,Nationalité,Âge,Statut,TS Référente\n';

    FEMMES_ISOLEES.forEach(f => {
        csv += `"${f.nom}","${f.prenom}","${f.chambre}","${f.nationalite}",${f.age},"${f.statut}","${f.tsReferente}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'heberges-babinski.csv';
    link.click();

    showToast('Export effectué');
}

function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
}

// Fermer modal avec Escape
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeDetailModal();
    }
});

// Fermer modal en cliquant à l'extérieur
document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    });
});
