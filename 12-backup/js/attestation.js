/**
 * Génération d'attestations de domiciliation en format Word
 * Utilise les templates officiels CHU Babinski avec remplacement de placeholders
 */

// Charger JSZip dynamiquement si pas déjà chargé
async function loadJSZip() {
    if (typeof JSZip !== 'undefined') return;

    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'lib/jszip.min.js';
        script.onload = resolve;
        script.onerror = () => {
            const cdnScript = document.createElement('script');
            cdnScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js';
            cdnScript.onload = resolve;
            cdnScript.onerror = reject;
            document.head.appendChild(cdnScript);
        };
        document.head.appendChild(script);
    });
}

/**
 * Formate une date en français (ex: "21 janvier 2026")
 */
function formatDateFr(dateStr) {
    if (!dateStr) return '_______________';
    const date = new Date(dateStr);
    if (isNaN(date)) return dateStr;
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
}

/**
 * Détermine le template à utiliser selon la composition familiale
 */
function getTemplateName(type, isBiparental, nbEnfants) {
    if (type === 'femme_isolee') {
        return 'Attestation d_hébergement femme TEMPLATE.docx';
    }

    // Limiter à 4 enfants max (templates disponibles)
    const nb = Math.min(Math.max(nbEnfants, 1), 4);
    const prefix = isBiparental ? 'BP' : 'MP';
    return `Attestation d_hébergement famille TEMPLATE ${prefix}${nb}E.docx`;
}

/**
 * Remplace les placeholders dans le XML du document
 */
function replacePlaceholders(xml, replacements) {
    let result = xml;
    for (const [placeholder, value] of Object.entries(replacements)) {
        // Remplacer le placeholder (peut être fragmenté par le XML)
        const regex = new RegExp(escapeRegex(placeholder), 'g');
        result = result.replace(regex, escapeXml(value || ''));
    }
    return result;
}

/**
 * Échappe les caractères spéciaux pour regex
 */
function escapeRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Échappe les caractères spéciaux pour XML
 */
function escapeXml(str) {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
}

/**
 * Génère une attestation pour une femme isolée
 */
async function genererAttestationFemmeIsolee(personne) {
    await loadJSZip();

    const dateJour = formatDateFr(new Date().toISOString().split('T')[0]);
    const nom = (personne.nom || '').toUpperCase();
    const prenom = personne.prenom || '';
    const dateNaissance = formatDateFr(personne.dateNaissance || personne.date_naissance);
    const lieuNaissance = personne.lieuNaissance || personne.lieu_naissance || '';
    const dateArrivee = formatDateFr(personne.dateArrivee || personne.date_arrivee);

    const templateName = getTemplateName('femme_isolee');
    const replacements = {
        '{date du jour}': dateJour,
        '{Nom}': nom,
        '{Prénom}': prenom,
        '{Date de naissance}': dateNaissance,
        '{Lieu de naissance}': lieuNaissance,
        '{date d\'arrivée}': dateArrivee
    };

    const filename = `Attestation d'hébergement femme  ${nom} ${prenom}  ${dateJour}.docx`;
    return { templateName, replacements, filename };
}

/**
 * Génère une attestation pour une famille
 */
async function genererAttestationFamille(famille, adultes, enfants) {
    await loadJSZip();

    const dateJour = formatDateFr(new Date().toISOString().split('T')[0]);
    const dateArrivee = formatDateFr(famille.dateArrivee || famille.date_arrivee);

    // Trouver la mère et le père
    const mere = adultes.find(a => a.sexe === 'F') || adultes[0];
    const pere = adultes.find(a => a.sexe === 'M');
    const isBiparental = !!pere;
    const nbEnfants = enfants ? enfants.length : 0;

    const templateName = getTemplateName('famille', isBiparental, nbEnfants);

    // Préparer les remplacements
    const replacements = {
        '{date du jour}': dateJour,
        '{date d\'arrivée}': dateArrivee
    };

    // Mère
    if (mere) {
        const nomMere = (mere.nom || '').toUpperCase();
        const prenomMere = mere.prenom || '';
        const dateNaissanceMere = formatDateFr(mere.dateNaissance || mere.date_naissance);
        const lieuNaissanceMere = mere.lieuNaissance || mere.lieu_naissance || '';
        const naissanceMere = `${dateNaissanceMere}${lieuNaissanceMere ? ' - ' + lieuNaissanceMere : ''}`;

        replacements['{Nom mère}'] = `${nomMere} ${prenomMere}`;
        replacements['{Naissance mère}'] = naissanceMere;
    }

    // Père (si biparental)
    if (pere) {
        const nomPere = (pere.nom || '').toUpperCase();
        const prenomPere = pere.prenom || '';
        const dateNaissancePere = formatDateFr(pere.dateNaissance || pere.date_naissance);
        const lieuNaissancePere = pere.lieuNaissance || pere.lieu_naissance || '';
        const naissancePere = `${dateNaissancePere}${lieuNaissancePere ? ' - ' + lieuNaissancePere : ''}`;

        replacements['{Nom père}'] = `${nomPere} ${prenomPere}`;
        replacements['{Naissance père}'] = naissancePere;
    }

    // Enfants (jusqu'à 4)
    for (let i = 0; i < Math.min(nbEnfants, 4); i++) {
        const enfant = enfants[i];
        const nomEnfant = (enfant.nom || '').toUpperCase();
        const prenomEnfant = enfant.prenom || '';
        const sexeEnfant = enfant.sexe === 'M' ? 'H' : 'F';
        const dateNaissanceEnfant = formatDateFr(enfant.dateNaissance || enfant.date_naissance);
        const lieuNaissanceEnfant = enfant.lieuNaissance || enfant.lieu_naissance || '';
        const naissanceEnfant = `${dateNaissanceEnfant}${lieuNaissanceEnfant ? ' - ' + lieuNaissanceEnfant : ''}`;

        const num = i + 1;
        replacements[`{Nom enfants ${num}}`] = `${nomEnfant} ${prenomEnfant}`;
        replacements[`{Sexe enfant ${num}}`] = sexeEnfant;
        replacements[`{Naissance enfant ${num}}`] = naissanceEnfant;
    }

    const nomFamille = mere ? (mere.nom || '').toUpperCase() + ' ' + (mere.prenom || '') : 'Famille';
    const filename = `Attestation d'hébergement famille  ${nomFamille}  ${dateJour}.docx`;

    return { templateName, replacements, filename };
}

/**
 * Charge le template, remplace les placeholders et télécharge
 */
async function processTemplate(templateName, replacements, filename) {
    // Charger le template
    const response = await fetch(`templates/${templateName}`);
    if (!response.ok) {
        throw new Error(`Template non trouvé: ${templateName}`);
    }
    const templateBlob = await response.arrayBuffer();

    // Ouvrir le ZIP (docx = zip)
    const zip = await JSZip.loadAsync(templateBlob);

    // Modifier le document.xml
    const documentXml = await zip.file('word/document.xml').async('string');
    const modifiedXml = replacePlaceholders(documentXml, replacements);
    zip.file('word/document.xml', modifiedXml);

    // Générer le nouveau fichier
    const blob = await zip.generateAsync({ type: 'blob', mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });

    // Télécharger
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

/**
 * Génère et télécharge une attestation pour un hébergé
 */
async function genererAttestation(personne, type, famille = null, adultes = [], enfants = []) {
    try {
        let result;

        if (type === 'femme_isolee') {
            result = await genererAttestationFemmeIsolee(personne);
        } else {
            result = await genererAttestationFamille(famille || personne, adultes, enfants);
        }

        await processTemplate(result.templateName, result.replacements, result.filename);

        if (typeof showToast === 'function') {
            showToast('Attestation téléchargée: ' + result.filename);
        }

        return true;
    } catch (error) {
        console.error('Erreur génération attestation:', error);
        if (typeof showToast === 'function') {
            showToast('Erreur lors de la génération: ' + error.message);
        }
        return false;
    }
}
