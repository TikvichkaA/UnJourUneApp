// Script d'initialisation des données
// À exécuter UNE SEULE FOIS dans la console du navigateur (F12 > Console)
// après avoir ouvert index.html

async function initData() {
    // Liste des utilisateurs
    const users = ['Emmanuel', 'Sami', 'Louis', 'Paul', 'Abel', 'Julie', 'JB', 'Canot'];

    // Ajouter les utilisateurs
    console.log('Ajout des utilisateurs...');
    for (const name of users) {
        try {
            await db.collection('users').add({ name, createdAt: new Date() });
            console.log('  + ' + name);
        } catch (e) {
            console.log('  Erreur pour ' + name);
        }
    }

    // Liste des prédictions avec votes
    const predictions = [
        {
            text: "Trump envahit le Venezuela",
            author: "Emmanuel",
            votes: { Sami: true, Emmanuel: true, Louis: false, Paul: false }
        },
        {
            text: "Trump envahit le Nigeria",
            author: "Emmanuel",
            votes: { Emmanuel: true }
        },
        {
            text: "Trump envahit le Groenland",
            author: "Emmanuel",
            votes: { Emmanuel: true }
        },
        {
            text: "Bulle de l'IA éclate",
            author: "Emmanuel",
            votes: { Sami: true, Emmanuel: true }
        },
        {
            text: "Fin de la guerre en Ukraine",
            author: "Emmanuel",
            votes: { Abel: true }
        },
        {
            text: "Fin du règne Netanyahou",
            author: "Emmanuel",
            votes: { Sami: true }
        },
        {
            text: "Macron assassiné",
            author: "Emmanuel",
            votes: { Paul: true }
        },
        {
            text: "JB quitte l'armée",
            author: "Emmanuel",
            votes: { Sami: true, Paul: true, Louis: true }
        },
        {
            text: "Canot a un deuxième bébé",
            author: "Emmanuel",
            votes: { Paul: true, Julie: true, Sami: true, Louis: true }
        },
        {
            text: "Paul dépasse 80k€ en un mois",
            author: "Emmanuel",
            votes: { Abel: true, Paul: true, Sami: true }
        },
        {
            text: "Sami quitte son nouveau job",
            author: "Emmanuel",
            votes: { Paul: true }
        },
        {
            text: "Gilets jaunes 2 en France",
            author: "Emmanuel",
            votes: { Emmanuel: true }
        },
        {
            text: "Inflation à plus de 10% en France",
            author: "Emmanuel",
            votes: { Paul: true, Louis: true, Abel: true }
        },
        {
            text: "Mort de Depardieu",
            author: "Emmanuel",
            votes: {}
        },
        {
            text: "Attentat terroriste à Paris",
            author: "Emmanuel",
            votes: { Paul: true, Emmanuel: true, Abel: true }
        },
        {
            text: "Invasion de Taiwan par la Chine",
            author: "Emmanuel",
            votes: { Emmanuel: true, Louis: true }
        },
        {
            text: "Bitcoin atteint 150k$",
            author: "Emmanuel",
            votes: { Paul: true }
        },
        {
            text: "Joyaux du Louvre retrouvés",
            author: "Louis",
            votes: { Louis: true }
        },
        {
            text: "Netflix rachète Warner Bros",
            author: "Emmanuel",
            votes: { Paul: true, Emmanuel: true }
        }
    ];

    // Ajouter les prédictions
    console.log('Ajout des prédictions...');
    for (const pred of predictions) {
        try {
            await db.collection('predictions').add({
                text: pred.text,
                author: pred.author,
                votes: pred.votes,
                createdAt: new Date()
            });
            console.log('  + ' + pred.text);
        } catch (e) {
            console.log('  Erreur pour: ' + pred.text);
        }
    }

    console.log('Terminé ! Recharge la page.');
}

// Lancer l'initialisation
initData();
