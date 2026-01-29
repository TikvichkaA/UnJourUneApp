// Netlify Function pour envoyer les modifications par email
// Utilise l'API Resend (https://resend.com)

exports.handler = async (event, context) => {
    // CORS headers
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
    };

    // Handle preflight
    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers, body: '' };
    }

    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, headers, body: 'Method Not Allowed' };
    }

    try {
        const { content, date, nbModifications } = JSON.parse(event.body);

        // Créer le contenu du fichier
        const fileContent = `// MODIFICATIONS BETA-TRAJ
// Généré le ${date}
// Nombre de modifications: ${nbModifications}

${content}`;

        // Encoder en base64 pour la pièce jointe
        const base64Content = Buffer.from(fileContent).toString('base64');
        const filename = `betatraj-modifications-${new Date().toISOString().slice(0, 10)}.txt`;

        // Envoyer avec Resend API
        const response = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                from: 'Beta-Traj <onboarding@resend.dev>',
                to: ['em.pinglier@gmail.com'],
                subject: 'modifications code Trajectoire',
                html: `
                    <h2>Modifications Beta-Traj</h2>
                    <p><strong>Date:</strong> ${date}</p>
                    <p><strong>Nombre de modifications:</strong> ${nbModifications}</p>
                    <p>Le fichier JavaScript contenant les modifications est en pièce jointe.</p>
                    <p>Pour appliquer les modifications, remplacez les sections correspondantes dans <code>app.js</code>.</p>
                `,
                attachments: [
                    {
                        filename: filename,
                        content: base64Content
                    }
                ]
            })
        });

        if (!response.ok) {
            const error = await response.text();
            console.error('Resend error:', error);
            return {
                statusCode: 500,
                headers,
                body: JSON.stringify({ error: 'Erreur envoi email', details: error })
            };
        }

        const result = await response.json();
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ success: true, id: result.id })
        };

    } catch (error) {
        console.error('Function error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: error.message })
        };
    }
};
