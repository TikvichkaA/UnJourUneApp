/**
 * ReVie - Serveur Backend
 * Proxy pour l'API OpenAI et serveur de fichiers statiques
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const OpenAI = require('openai');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3026;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Configuration OpenAI
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

// Prompt système pour l'assistant
const SYSTEM_PROMPT = `Tu es ReVie, un assistant conversationnel expert en économie circulaire. Tu aides les utilisateurs à trouver des solutions pour leurs objets : réparer, donner, recycler ou acheter d'occasion.

CONTEXTE :
- Tu utilises les données ouvertes de l'ADEME (Agence de l'Environnement et de la Maîtrise de l'Énergie)
- Tu connais les acteurs de l'économie circulaire en France
- Tu privilégies toujours la réparation avant le don, et le don avant le recyclage

RÈGLES :
1. Réponds de manière concise (2-3 phrases max sauf si on te demande plus)
2. Sois chaleureux et encourageant sur les gestes écologiques
3. Guide l'utilisateur vers une action concrète
4. Si l'utilisateur mentionne un objet, propose les options dans cet ordre : réparer > donner > recycler
5. N'invente pas d'adresses ou de numéros de téléphone
6. Utilise des emojis avec parcimonie (1-2 max par message)

EXEMPLES DE RÉPONSES :
- "Super initiative ! 🔧 Pour réparer votre grille-pain, je vous conseille de chercher un Repair Café près de chez vous. Voulez-vous que je filtre la carte ?"
- "Donner vos vêtements est un excellent geste ! 🎁 Emmaüs, Le Relais ou les associations locales les acceptent généralement."

Si l'utilisateur pose une question hors sujet, ramène-le gentiment vers l'économie circulaire.`;

// Endpoint API pour le chatbot
app.post('/api/chat', async (req, res) => {
    try {
        const { message, context } = req.body;

        if (!message) {
            return res.status(400).json({ error: 'Message requis' });
        }

        // Construire le contexte de la conversation
        const messages = [
            { role: 'system', content: SYSTEM_PROMPT }
        ];

        // Ajouter le contexte de localisation si disponible
        if (context?.location) {
            messages.push({
                role: 'system',
                content: `L'utilisateur est localisé près de : ${context.location}. Rayon de recherche : ${context.distance || 20} km.`
            });
        }

        // Ajouter les filtres actifs
        if (context?.filters) {
            const filtersInfo = [];
            if (context.filters.action && context.filters.action !== 'all') {
                filtersInfo.push(`Action souhaitée : ${context.filters.action}`);
            }
            if (context.filters.object && context.filters.object !== 'all') {
                filtersInfo.push(`Type d'objet : ${context.filters.object}`);
            }
            if (filtersInfo.length > 0) {
                messages.push({
                    role: 'system',
                    content: `Filtres actifs : ${filtersInfo.join(', ')}`
                });
            }
        }

        // Ajouter l'historique de conversation si disponible
        if (context?.history && Array.isArray(context.history)) {
            context.history.slice(-6).forEach(msg => {
                messages.push({
                    role: msg.role,
                    content: msg.content
                });
            });
        }

        // Ajouter le message actuel
        messages.push({ role: 'user', content: message });

        // Appel à OpenAI
        const completion = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: messages,
            max_tokens: 300,
            temperature: 0.7,
            presence_penalty: 0.1,
            frequency_penalty: 0.1
        });

        const reply = completion.choices[0]?.message?.content || "Désolé, je n'ai pas pu générer de réponse.";

        // Analyser la réponse pour détecter des actions suggérées
        const suggestedAction = detectSuggestedAction(reply, message);

        res.json({
            reply: reply,
            suggestedAction: suggestedAction,
            usage: completion.usage
        });

    } catch (error) {
        console.error('Erreur OpenAI:', error);

        if (error.code === 'insufficient_quota') {
            return res.status(429).json({
                error: 'Quota API dépassé',
                reply: "Désolé, le service est temporairement indisponible. Utilisez les boutons ci-dessus pour naviguer ! 🔧"
            });
        }

        res.status(500).json({
            error: 'Erreur serveur',
            reply: "Oups, une erreur s'est produite. Réessayez ou utilisez les boutons de navigation."
        });
    }
});

// Fonction pour détecter les actions suggérées dans la réponse
function detectSuggestedAction(reply, userMessage) {
    const lowerReply = reply.toLowerCase();
    const lowerMessage = userMessage.toLowerCase();

    // Détecter le type d'action
    let action = null;
    if (lowerReply.includes('réparer') || lowerReply.includes('réparation') || lowerReply.includes('repair café')) {
        action = 'reparer';
    } else if (lowerReply.includes('donner') || lowerReply.includes('don') || lowerReply.includes('emmaüs')) {
        action = 'donner';
    } else if (lowerReply.includes('recycler') || lowerReply.includes('recyclage') || lowerReply.includes('déchèterie')) {
        action = 'recycler';
    } else if (lowerReply.includes('occasion') || lowerReply.includes('seconde main') || lowerReply.includes('acheter')) {
        action = 'acheter';
    }

    // Détecter le type d'objet
    let object = null;
    const objectKeywords = {
        'electromenager': ['électroménager', 'machine à laver', 'lave-linge', 'frigo', 'réfrigérateur', 'grille-pain', 'aspirateur', 'micro-ondes'],
        'textile': ['vêtement', 'textile', 'habits', 'chaussure', 'linge'],
        'mobilier': ['meuble', 'mobilier', 'chaise', 'table', 'armoire', 'canapé'],
        'velo': ['vélo', 'bicyclette', 'cycle'],
        'numerique': ['téléphone', 'ordinateur', 'tablette', 'électronique', 'smartphone', 'laptop']
    };

    const combined = lowerReply + ' ' + lowerMessage;
    for (const [key, keywords] of Object.entries(objectKeywords)) {
        if (keywords.some(kw => combined.includes(kw))) {
            object = key;
            break;
        }
    }

    if (action || object) {
        return { action, object };
    }
    return null;
}

// Route de santé
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', service: 'ReVie API' });
});

// Démarrer le serveur
app.listen(PORT, () => {
    console.log(`🌱 ReVie serveur démarré sur http://localhost:${PORT}`);
    console.log(`📍 Assistant IA activé avec OpenAI`);
});
