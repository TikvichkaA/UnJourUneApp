// Netlify Function: Correction IA pour MathOral
// Utilise OpenAI GPT-4o pour corriger les reponses des eleves

exports.handler = async (event, context) => {
    // CORS headers
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Content-Type': 'application/json'
    };

    // Handle preflight
    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers, body: '' };
    }

    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            headers,
            body: JSON.stringify({ error: 'Method not allowed' })
        };
    }

    try {
        const { exercice, reponse, image } = JSON.parse(event.body);

        if (!exercice || (!reponse && !image)) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Exercice et reponse (texte ou image) requis' })
            };
        }

        const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
        if (!OPENAI_API_KEY) {
            return {
                statusCode: 500,
                headers,
                body: JSON.stringify({ error: 'API key not configured' })
            };
        }

        // Build the prompt
        const systemPrompt = `Tu es un correcteur de mathematiques pour les oraux de concours (X, ENS, Centrale).
Tu dois corriger la reponse de l'eleve de maniere pedagogique et bienveillante.

Format de ta reponse (JSON strict):
{
    "score": <nombre de 0 a 100>,
    "verdict": "correct" | "partiel" | "incorrect",
    "points_positifs": ["point 1", "point 2", ...],
    "erreurs": [
        {"type": "calcul|raisonnement|notation|oubli", "description": "...", "correction": "..."}
    ],
    "conseil": "conseil global pour s'ameliorer",
    "solution_complete": "solution detaillee si necessaire (en LaTeX)"
}

Sois precis sur les erreurs mathematiques. Utilise la notation LaTeX pour les formules.`;

        const userPrompt = `EXERCICE:
${exercice.title}

ENONCE:
${exercice.enonce}

REPONSE DE L'ELEVE:
${reponse || "(voir image jointe)"}

Corrige cette reponse.`;

        // Build messages array
        const messages = [
            { role: 'system', content: systemPrompt }
        ];

        if (image) {
            // With image (GPT-4o vision)
            messages.push({
                role: 'user',
                content: [
                    { type: 'text', text: userPrompt },
                    { type: 'image_url', image_url: { url: image } }
                ]
            });
        } else {
            // Text only
            messages.push({ role: 'user', content: userPrompt });
        }

        // Call OpenAI API
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${OPENAI_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'gpt-4o',
                messages: messages,
                max_tokens: 2000,
                temperature: 0.3
            })
        });

        if (!response.ok) {
            const error = await response.text();
            console.error('OpenAI API error:', error);
            return {
                statusCode: response.status,
                headers,
                body: JSON.stringify({ error: 'Erreur API OpenAI', details: error })
            };
        }

        const data = await response.json();
        const content = data.choices[0]?.message?.content;

        // Try to parse JSON from response
        let correction;
        try {
            // Extract JSON from markdown code blocks if present
            const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/) ||
                              content.match(/```\s*([\s\S]*?)\s*```/) ||
                              [null, content];
            correction = JSON.parse(jsonMatch[1] || content);
        } catch (e) {
            // If parsing fails, return raw content
            correction = {
                score: null,
                verdict: 'unknown',
                points_positifs: [],
                erreurs: [],
                conseil: content,
                solution_complete: ''
            };
        }

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                success: true,
                correction: correction,
                usage: data.usage
            })
        };

    } catch (error) {
        console.error('Function error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: 'Erreur serveur', details: error.message })
        };
    }
};
