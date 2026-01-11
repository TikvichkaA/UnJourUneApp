// Script d'administration Firebase
// Utilisation: node firebase-admin.js [--group=nom] [commande] [args...]

const PROJECT_ID = 'cc-forecast-88580';
const BASE_URL = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents`;

// Récupérer le groupe depuis les arguments
const args = process.argv.slice(2);
let currentGroup = null;
let commandArgs = args;

// Chercher l'argument --group
const groupArg = args.find(a => a.startsWith('--group='));
if (groupArg) {
    currentGroup = groupArg.split('=')[1];
    commandArgs = args.filter(a => !a.startsWith('--group='));
}

const command = commandArgs[0];

// === MÉTHODES UTILITAIRES ===

function getCollectionPath(name) {
    if (currentGroup) {
        return `groups/${currentGroup}/${name}`;
    }
    return name;
}

async function updateDoc(collection, docId, updates) {
    const fields = {};
    for (const [key, value] of Object.entries(updates)) {
        if (typeof value === 'string') {
            fields[key] = { stringValue: value };
        } else if (typeof value === 'boolean') {
            fields[key] = { booleanValue: value };
        } else if (typeof value === 'number') {
            fields[key] = { integerValue: value.toString() };
        } else if (value === null) {
            fields[key] = { nullValue: null };
        }
    }

    const updateMask = Object.keys(updates).map(k => `updateMask.fieldPaths=${k}`).join('&');
    const collPath = getCollectionPath(collection);
    const url = `${BASE_URL}/${collPath}/${docId}?${updateMask}`;

    const response = await fetch(url, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fields })
    });

    if (!response.ok) {
        throw new Error(`Erreur ${response.status}: ${await response.text()}`);
    }

    return await response.json();
}

async function addDoc(collection, data) {
    const fields = {};
    for (const [key, value] of Object.entries(data)) {
        if (typeof value === 'string') {
            fields[key] = { stringValue: value };
        } else if (typeof value === 'boolean') {
            fields[key] = { booleanValue: value };
        } else if (typeof value === 'number') {
            fields[key] = { integerValue: value.toString() };
        } else if (value instanceof Date) {
            fields[key] = { timestampValue: value.toISOString() };
        } else if (value === null) {
            fields[key] = { nullValue: null };
        } else if (typeof value === 'object') {
            fields[key] = { mapValue: { fields: {} } };
        }
    }

    const collPath = getCollectionPath(collection);
    const url = `${BASE_URL}/${collPath}`;

    const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fields })
    });

    if (!response.ok) {
        throw new Error(`Erreur ${response.status}: ${await response.text()}`);
    }

    return await response.json();
}

async function listDocs(collection) {
    const collPath = getCollectionPath(collection);
    const response = await fetch(`${BASE_URL}/${collPath}`);
    const data = await response.json();
    return data.documents || [];
}

// === COMMANDES PRÉDICTIONS ===

async function listPredictions() {
    const docs = await listDocs('predictions');
    const predictions = docs.map(doc => ({
        id: doc.name.split('/').pop(),
        text: doc.fields?.text?.stringValue || '',
        category: doc.fields?.category?.stringValue || 'autre',
        resolution: doc.fields?.resolution?.stringValue || null,
        author: doc.fields?.author?.stringValue || ''
    }));

    console.log(`\n=== PRÉDICTIONS ${currentGroup ? `(groupe: ${currentGroup})` : '(global)'} ===\n`);
    predictions.forEach((p, i) => {
        const res = p.resolution ? (p.resolution === 'realized' ? '✓' : '✗') : '⏳';
        console.log(`${i + 1}. [${p.category.padEnd(10)}] ${res} ${p.text}`);
        console.log(`   ID: ${p.id}`);
    });
    console.log(`\nTotal: ${predictions.length} prédictions`);
    return predictions;
}

async function setCategory(docId, category) {
    await updateDoc('predictions', docId, { category });
    console.log(`✓ Catégorie mise à jour: ${category}`);
}

async function setResolution(docId, resolution) {
    await updateDoc('predictions', docId, { resolution });
    console.log(`✓ Résolution mise à jour: ${resolution}`);
}

// === COMMANDES UTILISATEURS ===

async function listUsers() {
    const docs = await listDocs('users');
    const users = docs.map(doc => ({
        id: doc.name.split('/').pop(),
        name: doc.fields?.name?.stringValue || ''
    }));

    console.log(`\n=== UTILISATEURS ${currentGroup ? `(groupe: ${currentGroup})` : '(global)'} ===\n`);
    users.forEach((u, i) => {
        console.log(`${i + 1}. ${u.name} (${u.id})`);
    });
    console.log(`\nTotal: ${users.length} utilisateurs`);
    return users;
}

async function addUser(name) {
    await addDoc('users', { name, createdAt: new Date() });
    console.log(`✓ Utilisateur ajouté: ${name}`);
}

// === COMMANDES GROUPES ===

async function initGroup(groupName) {
    console.log(`\nInitialisation du groupe "${groupName}"...`);
    console.log('Le groupe sera créé automatiquement quand des données y seront ajoutées.');
    console.log(`\nLien à partager: https://TON-APP.netlify.app/?group=${groupName}`);
    console.log(`\nCommandes admin pour ce groupe:`);
    console.log(`  node firebase-admin.js --group=${groupName} list`);
    console.log(`  node firebase-admin.js --group=${groupName} users`);
    console.log(`  node firebase-admin.js --group=${groupName} adduser "Prénom"`);
}

async function listGroups() {
    const response = await fetch(`${BASE_URL}/groups`);
    const data = await response.json();
    const groups = (data.documents || []).map(doc => doc.name.split('/').pop());

    console.log('\n=== GROUPES ===\n');
    if (groups.length === 0) {
        console.log('Aucun groupe créé.');
        console.log('\nGroupe par défaut (sans ?group=): données globales');
    } else {
        groups.forEach((g, i) => {
            console.log(`${i + 1}. ${g} → ?group=${g}`);
        });
    }
    console.log('\nPour créer un nouveau groupe: node firebase-admin.js init <nom>');
}

// === COPIER DONNÉES VERS UN GROUPE ===

async function copyToGroup(targetGroup) {
    console.log(`\nCopie des données globales vers le groupe "${targetGroup}"...\n`);

    // Copier les utilisateurs
    const users = await listDocs('users');
    console.log(`Copie de ${users.length} utilisateurs...`);
    for (const doc of users) {
        const name = doc.fields?.name?.stringValue;
        if (name) {
            const collPath = `groups/${targetGroup}/users`;
            await fetch(`${BASE_URL}/${collPath}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ fields: doc.fields })
            });
            console.log(`  + ${name}`);
        }
    }

    // Copier les prédictions
    const predictions = await listDocs('predictions');
    console.log(`\nCopie de ${predictions.length} prédictions...`);
    for (const doc of predictions) {
        const text = doc.fields?.text?.stringValue;
        if (text) {
            const collPath = `groups/${targetGroup}/predictions`;
            await fetch(`${BASE_URL}/${collPath}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ fields: doc.fields })
            });
            console.log(`  + ${text.substring(0, 40)}...`);
        }
    }

    console.log(`\n✓ Copie terminée!`);
    console.log(`Lien: https://TON-APP.netlify.app/?group=${targetGroup}`);
}

// === MAIN ===

async function main() {
    if (currentGroup) {
        console.log(`\n🔹 Groupe actif: ${currentGroup}`);
    }

    switch (command) {
        case 'list':
        case 'ls':
            await listPredictions();
            break;

        case 'users':
            await listUsers();
            break;

        case 'adduser':
            if (commandArgs.length < 2) {
                console.log('Usage: node firebase-admin.js [--group=X] adduser "Prénom"');
                return;
            }
            await addUser(commandArgs[1]);
            break;

        case 'cat':
        case 'category':
            if (commandArgs.length < 3) {
                console.log('Usage: node firebase-admin.js [--group=X] cat <docId> <category>');
                console.log('Categories: politique, sport, tech, perso, autre');
                return;
            }
            await setCategory(commandArgs[1], commandArgs[2]);
            break;

        case 'resolve':
            if (commandArgs.length < 3) {
                console.log('Usage: node firebase-admin.js [--group=X] resolve <docId> <realized|not-realized>');
                return;
            }
            await setResolution(commandArgs[1], commandArgs[2]);
            break;

        case 'groups':
            await listGroups();
            break;

        case 'init':
            if (commandArgs.length < 2) {
                console.log('Usage: node firebase-admin.js init <nom-du-groupe>');
                return;
            }
            await initGroup(commandArgs[1]);
            break;

        case 'copy':
            if (commandArgs.length < 2) {
                console.log('Usage: node firebase-admin.js copy <nom-du-groupe>');
                console.log('Copie les données globales vers un nouveau groupe');
                return;
            }
            await copyToGroup(commandArgs[1]);
            break;

        default:
            console.log(`
Firebase Admin Script
=====================

Commandes disponibles:

  DONNÉES GLOBALES (sans groupe):
  node firebase-admin.js list              Liste les prédictions
  node firebase-admin.js users             Liste les utilisateurs

  DONNÉES D'UN GROUPE:
  node firebase-admin.js --group=X list    Liste les prédictions du groupe X
  node firebase-admin.js --group=X users   Liste les utilisateurs du groupe X
  node firebase-admin.js --group=X adduser "Nom"   Ajoute un utilisateur

  GESTION DES GROUPES:
  node firebase-admin.js groups            Liste tous les groupes
  node firebase-admin.js init <nom>        Initialise un nouveau groupe
  node firebase-admin.js copy <nom>        Copie les données globales vers un groupe

  MODIFICATIONS:
  node firebase-admin.js [--group=X] cat <id> <category>
  node firebase-admin.js [--group=X] resolve <id> <realized|not-realized>

Catégories: politique, sport, tech, perso, autre
            `);
    }
}

main().catch(console.error);
