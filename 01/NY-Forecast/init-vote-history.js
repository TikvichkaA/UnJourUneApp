// Script pour initialiser l'historique des votes pour les prédictions existantes
// Usage: node init-vote-history.js [groupe]

const admin = require('firebase-admin');
const serviceAccount = require('./firebase-service-account.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function initVoteHistory(groupName = null) {
    console.log(`\nInitialisation de l'historique des votes${groupName ? ` pour le groupe "${groupName}"` : ''}...\n`);

    // Récupérer la collection appropriée
    const predictionsRef = groupName
        ? db.collection('groups').doc(groupName).collection('predictions')
        : db.collection('predictions');

    const historyRef = groupName
        ? db.collection('groups').doc(groupName).collection('voteHistory')
        : db.collection('voteHistory');

    const usersRef = groupName
        ? db.collection('groups').doc(groupName).collection('users')
        : db.collection('users');

    // Charger les utilisateurs pour la map
    const usersSnapshot = await usersRef.get();
    const usersMap = {};
    const userNames = [];
    usersSnapshot.docs.forEach(doc => {
        usersMap[doc.id] = doc.data().name;
        userNames.push(doc.data().name);
    });

    // Charger toutes les prédictions
    const predictionsSnapshot = await predictionsRef.get();
    console.log(`Trouvé ${predictionsSnapshot.docs.length} prédictions`);

    let initialized = 0;
    let skipped = 0;

    for (const predDoc of predictionsSnapshot.docs) {
        const pred = predDoc.data();
        const predId = predDoc.id;

        // Vérifier si l'historique existe déjà
        const existingHistory = await historyRef.doc(predId).get();
        if (existingHistory.exists && existingHistory.data().history?.length > 0) {
            console.log(`  [SKIP] "${pred.text.substring(0, 40)}..." - historique existant`);
            skipped++;
            continue;
        }

        // Calculer le prix actuel
        const votes = pred.votes || {};
        let yesCount = 0;
        let totalCount = 0;

        for (const [voter, voteData] of Object.entries(votes)) {
            const voterName = usersMap[voter] || voter;
            if (!userNames.includes(voterName)) continue;

            let vote;
            if (typeof voteData === 'boolean') {
                vote = voteData;
            } else if (typeof voteData === 'object' && voteData !== null) {
                vote = voteData.vote;
            }

            if (vote !== undefined) {
                totalCount++;
                if (vote === true) yesCount++;
            }
        }

        const currentPrice = totalCount > 0 ? Math.round((yesCount / totalCount) * 100) : 50;

        // Créer un historique initial avec plusieurs points pour avoir des graphiques
        const createdAt = pred.createdAt?.toDate?.() || new Date();
        const now = Date.now();
        const duration = now - createdAt.getTime();

        // Générer des points d'historique simulés (variation réaliste)
        const history = [];
        const numPoints = Math.min(10, Math.max(3, Math.floor(duration / (1000 * 60 * 60 * 24)))); // 1 point par jour max

        for (let i = 0; i < numPoints; i++) {
            const progress = i / (numPoints - 1);
            const timestamp = createdAt.getTime() + (duration * progress);

            // Simuler une évolution vers le prix actuel avec un peu de bruit
            const basePrice = 50; // Prix de départ
            const targetPrice = currentPrice;
            const noise = (Math.random() - 0.5) * 15; // +/- 7.5 points
            let price = basePrice + (targetPrice - basePrice) * progress + noise;
            price = Math.max(0, Math.min(100, Math.round(price)));

            // Le dernier point est le prix actuel exact
            if (i === numPoints - 1) {
                price = currentPrice;
            }

            history.push({
                price,
                timestamp,
                volume: Math.round(totalCount * progress) || 1
            });
        }

        // Sauvegarder l'historique
        await historyRef.doc(predId).set({ history });
        console.log(`  [OK] "${pred.text.substring(0, 40)}..." - ${history.length} points, prix: ${currentPrice}`);
        initialized++;
    }

    console.log(`\nTerminé:`);
    console.log(`  - ${initialized} historiques initialisés`);
    console.log(`  - ${skipped} déjà existants (ignorés)`);
}

// Groupes à traiter
const groups = ['cc', 'kenopotes', 'famille', 'linkee'];

async function main() {
    const targetGroup = process.argv[2];

    if (targetGroup) {
        // Traiter un groupe spécifique
        await initVoteHistory(targetGroup);
    } else {
        // Traiter tous les groupes
        console.log('Traitement de tous les groupes...\n');

        // D'abord la collection globale
        await initVoteHistory(null);

        // Puis chaque groupe
        for (const group of groups) {
            await initVoteHistory(group);
        }
    }

    console.log('\nFini !');
    process.exit(0);
}

main().catch(err => {
    console.error('Erreur:', err);
    process.exit(1);
});
