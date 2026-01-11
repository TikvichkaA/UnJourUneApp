/**
 * SubVeille - Routes IA
 * Endpoints pour les fonctionnalites OpenAI
 */

const express = require('express');
const router = express.Router();
const openaiService = require('../services/openai');

// Middleware pour verifier que l'API key est configuree
function checkApiKey(req, res, next) {
  if (!process.env.OPENAI_API_KEY) {
    return res.status(503).json({
      error: 'Service IA non configure',
      message: 'La cle API OpenAI n\'est pas configuree sur le serveur'
    });
  }
  next();
}

router.use(checkApiKey);

/**
 * POST /api/ai/match
 * Analyse le matching entre un profil et un AAP
 */
router.post('/match', async (req, res) => {
  try {
    const { profile, aap } = req.body;

    if (!profile || !aap) {
      return res.status(400).json({ error: 'Profil et AAP requis' });
    }

    const result = await openaiService.analyzeMatch(profile, aap);
    res.json(result);

  } catch (error) {
    console.error('[AI Match Error]', error);
    res.status(500).json({ error: 'Erreur analyse IA', message: error.message });
  }
});

/**
 * POST /api/ai/batch-score
 * Score plusieurs AAP pour un profil (plus economique)
 */
router.post('/batch-score', async (req, res) => {
  try {
    const { profile, aaps } = req.body;

    if (!profile || !aaps || !Array.isArray(aaps)) {
      return res.status(400).json({ error: 'Profil et liste AAP requis' });
    }

    const result = await openaiService.batchScore(profile, aaps);
    res.json({ aaps: result });

  } catch (error) {
    console.error('[AI Batch Score Error]', error);
    res.status(500).json({ error: 'Erreur scoring IA', message: error.message });
  }
});

/**
 * POST /api/ai/generate-draft
 * Genere un brouillon de candidature
 */
router.post('/generate-draft', async (req, res) => {
  try {
    const { profile, aap, sections } = req.body;

    if (!profile || !aap) {
      return res.status(400).json({ error: 'Profil et AAP requis' });
    }

    const result = await openaiService.generateDraft(profile, aap, sections);
    res.json(result);

  } catch (error) {
    console.error('[AI Generate Draft Error]', error);
    res.status(500).json({ error: 'Erreur generation IA', message: error.message });
  }
});

/**
 * POST /api/ai/summarize
 * Resume un AAP
 */
router.post('/summarize', async (req, res) => {
  try {
    const { aap } = req.body;

    if (!aap) {
      return res.status(400).json({ error: 'AAP requis' });
    }

    const result = await openaiService.summarizeAAP(aap);
    res.json(result);

  } catch (error) {
    console.error('[AI Summarize Error]', error);
    res.status(500).json({ error: 'Erreur resume IA', message: error.message });
  }
});

/**
 * POST /api/ai/profile-suggestions
 * Suggere des ameliorations pour le profil
 */
router.post('/profile-suggestions', async (req, res) => {
  try {
    const { profile } = req.body;

    if (!profile) {
      return res.status(400).json({ error: 'Profil requis' });
    }

    const result = await openaiService.suggestProfileImprovements(profile);
    res.json(result);

  } catch (error) {
    console.error('[AI Profile Suggestions Error]', error);
    res.status(500).json({ error: 'Erreur suggestions IA', message: error.message });
  }
});

/**
 * POST /api/ai/smart-recommendations
 * Recommandations intelligentes : prefiltre + scoring semantique
 */
router.post('/smart-recommendations', async (req, res) => {
  try {
    const { profile, prefilteredAaps } = req.body;

    if (!profile || !prefilteredAaps || !Array.isArray(prefilteredAaps)) {
      return res.status(400).json({ error: 'Profil et liste AAP prefiltres requis' });
    }

    const result = await openaiService.getSmartRecommendations(profile, prefilteredAaps);
    res.json(result);

  } catch (error) {
    console.error('[AI Smart Recommendations Error]', error);
    res.status(500).json({ error: 'Erreur recommandations IA', message: error.message });
  }
});

module.exports = router;
