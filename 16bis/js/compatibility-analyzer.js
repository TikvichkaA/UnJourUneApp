/**
 * Compatibility Analyzer
 * Analyse la compatibilite amicale, romantique, intime et professionnelle
 */
class CompatibilityAnalyzer {
    constructor() {
        this.patterns = {
            laughEmojis: /[\u{1F600}-\u{1F606}\u{1F923}\u{1F602}\u{1F605}\u{1F604}]/gu,
            laughText: /\b(lol|mdr|ptdr|haha|hihi|xd|mort de rire|ahah|hehe)\b/gi,
            heartEmojis: /[\u{2764}\u{1F495}-\u{1F49F}\u{1F5A4}\u{1F90D}\u{1F90E}\u{1F9E1}\u{2665}\u{1F48B}\u{1F618}\u{1F60D}\u{1F970}\u{1F617}\u{1F619}\u{1F61A}]/gu,
            affectionWords: /\b(je t'aime|love|bisou|bise|calin|mon coeur|ma cherie|mon cheri|bebe|mon amour|miss you|tu me manques|tendresse|adorable|mignon|hate de te voir|pense a toi)\b/gi,
            supportWords: /\b(courage|t'inquiete|ca va aller|je suis la|besoin de rien|compte sur moi|force|fier de toi|bravo|genial|super|impressionnant)\b/gi,
            // Patterns pour l'intimite
            flirtyEmojis: /[\u{1F525}\u{1F608}\u{1F60F}\u{1F61C}\u{1F61D}\u{1F92D}\u{1F917}\u{1F929}\u{1FAE0}\u{1F440}\u{1F445}\u{1F4A6}\u{1F34D}\u{1F351}\u{1F346}]/gu,
            intimateWords: /\b(envie de toi|tu me manques trop|j'ai chaud|sexy|hot|canon|beau gosse|belle gosse|craquant|craquante|attirant|attirante|desir|sensuel|corps|peau|doux|douce|caresse|frisson|nuit blanche|rejoins|viens|seul|seule|lit|reveil|dodo|coucher)\b/gi,
            complimentPhysique: /\b(beau|belle|magnifique|sublime|splendide|yeux|sourire|regard|silhouette|classe|elegant|elegante|sexy|mignon|mignonne|craquant|trop beau|trop belle)\b/gi,
            missingWords: /\b(tu me manques|j'ai hate|vivement|tellement hate|besoin de te voir|envie de te voir|pense a toi|penser a toi)\b/gi,
            // Autres patterns
            questions: /\?/g,
            deepQuestions: /\b(tu penses quoi|ton avis|qu'est-ce que tu ressens|comment tu vas vraiment|ca te dit quoi|tu en penses quoi)\b/gi,
            greetings: /\b(bonjour|bonsoir|salut|hello|hi|hey|coucou|yo)\b/gi,
            thanks: /\b(merci|thanks|thank you|thx|je te remercie)\b/gi,
            politeWords: /\b(s'il vous plait|s'il te plait|svp|stp|please|cordialement|bien a vous|bonne journee|bonne soiree)\b/gi,
            exclamations: /!/g,
            links: /https?:\/\/[^\s]+/gi,
            allEmojis: /[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu
        };
    }

    analyze(data) {
        const { messages, participants } = data;
        const [person1, person2] = participants.slice(0, 2);

        const messages1 = messages.filter(m => m.sender === person1.name);
        const messages2 = messages.filter(m => m.sender === person2.name);

        const metrics = this.calculateMetrics(messages, messages1, messages2, person1, person2);

        const scores = {
            friendship: this.calculateFriendshipScore(metrics),
            romantic: this.calculateRomanticScore(metrics),
            intimate: this.calculateIntimateScore(metrics),
            professional: this.calculateProfessionalScore(metrics)
        };

        const narratives = {
            friendship: this.generateFriendshipNarrative(metrics, scores.friendship),
            romantic: this.generateRomanticNarrative(metrics, scores.romantic),
            intimate: this.generateIntimateNarrative(metrics, scores.intimate),
            professional: this.generateProfessionalNarrative(metrics, scores.professional)
        };

        const synthesis = this.generateSynthesis(metrics, scores, person1, person2);
        const dynamics = this.analyzeDynamics(metrics, person1, person2);

        return { scores, narratives, synthesis, dynamics, metrics, participants: [person1, person2] };
    }

    calculateMetrics(messages, messages1, messages2, person1, person2) {
        const total = messages.length;
        const count1 = messages1.length;
        const count2 = messages2.length;
        const balance = 1 - Math.abs(count1 - count2) / total;

        const avgLength1 = this.averageLength(messages1);
        const avgLength2 = this.averageLength(messages2);
        const avgLength = (avgLength1 + avgLength2) / 2;

        const responseTimes = this.calculateResponseTimes(messages);
        const responseTimes1 = this.calculateResponseTimesFor(messages, person1.name);
        const responseTimes2 = this.calculateResponseTimesFor(messages, person2.name);

        const content1 = messages1.map(m => m.content).join(' ');
        const content2 = messages2.map(m => m.content).join(' ');
        const allContent = content1 + ' ' + content2;

        // Comptages
        const laughCount = this.countPattern(allContent, this.patterns.laughEmojis) +
                          this.countPattern(allContent, this.patterns.laughText);
        const heartCount = this.countPattern(allContent, this.patterns.heartEmojis);
        const affectionCount = this.countPattern(allContent, this.patterns.affectionWords);
        const supportCount = this.countPattern(allContent, this.patterns.supportWords);
        const flirtyEmojiCount = this.countPattern(allContent, this.patterns.flirtyEmojis);
        const intimateWordCount = this.countPattern(allContent, this.patterns.intimateWords);
        const complimentCount = this.countPattern(allContent, this.patterns.complimentPhysique);
        const missingCount = this.countPattern(allContent, this.patterns.missingWords);
        const questionCount = this.countPattern(allContent, this.patterns.questions);
        const deepQuestionCount = this.countPattern(allContent, this.patterns.deepQuestions);
        const exclamationCount = this.countPattern(allContent, this.patterns.exclamations);
        const greetingCount = this.countPattern(allContent, this.patterns.greetings);
        const thanksCount = this.countPattern(allContent, this.patterns.thanks);
        const politeCount = this.countPattern(allContent, this.patterns.politeWords);
        const linkCount = this.countPattern(allContent, this.patterns.links);
        const emojiCount = this.countPattern(allContent, this.patterns.allEmojis);

        const timeAnalysis = this.analyzeMessageTimes(messages);
        const lateNightMessages = this.analyzeLateNightMessages(messages);
        const conversationPatterns = this.analyzeConversationPatterns(messages);

        const dateRange = this.getDateRange(messages);
        const daysSpan = dateRange.days || 1;
        const messagesPerDay = total / daysSpan;

        const initiations = this.analyzeInitiations(messages, person1.name, person2.name);
        const longestStreaks = this.findLongestStreaks(messages, person1.name, person2.name);

        return {
            total, count1, count2, balance,
            avgLength, avgLength1, avgLength2,
            responseTimes, responseTimes1, responseTimes2,
            laughCount, laughRate: laughCount / total,
            heartCount, heartRate: heartCount / total,
            affectionCount, affectionRate: affectionCount / total,
            supportCount, supportRate: supportCount / total,
            flirtyEmojiCount, flirtyEmojiRate: flirtyEmojiCount / total,
            intimateWordCount, intimateWordRate: intimateWordCount / total,
            complimentCount, complimentRate: complimentCount / total,
            missingCount, missingRate: missingCount / total,
            questionCount, questionRate: questionCount / total,
            deepQuestionCount, deepQuestionRate: deepQuestionCount / total,
            exclamationCount, exclamationRate: exclamationCount / total,
            greetingCount, thanksCount, politeCount,
            politeRate: politeCount / total,
            linkCount, emojiCount, emojiRate: emojiCount / total,
            timeAnalysis, lateNightMessages, conversationPatterns,
            daysSpan, messagesPerDay,
            initiations, longestStreaks,
            person1, person2
        };
    }

    averageLength(messages) {
        if (messages.length === 0) return 0;
        return messages.reduce((sum, m) => sum + m.content.length, 0) / messages.length;
    }

    calculateResponseTimes(messages) {
        const times = [];
        for (let i = 1; i < messages.length; i++) {
            if (messages[i].sender !== messages[i-1].sender) {
                const diff = messages[i].datetime - messages[i-1].datetime;
                if (diff > 0 && diff < 24 * 60 * 60 * 1000) times.push(diff);
            }
        }
        if (times.length === 0) return { avg: 0, median: 0 };
        const avg = times.reduce((a, b) => a + b, 0) / times.length;
        times.sort((a, b) => a - b);
        return { avg: avg / (1000 * 60), median: times[Math.floor(times.length / 2)] / (1000 * 60) };
    }

    calculateResponseTimesFor(messages, name) {
        const times = [];
        for (let i = 1; i < messages.length; i++) {
            if (messages[i].sender === name && messages[i-1].sender !== name) {
                const diff = messages[i].datetime - messages[i-1].datetime;
                if (diff > 0 && diff < 24 * 60 * 60 * 1000) times.push(diff);
            }
        }
        if (times.length === 0) return { avg: 0, median: 0 };
        const avg = times.reduce((a, b) => a + b, 0) / times.length;
        times.sort((a, b) => a - b);
        return { avg: avg / (1000 * 60), median: times[Math.floor(times.length / 2)] / (1000 * 60) };
    }

    countPattern(text, pattern) {
        const matches = text.match(pattern);
        return matches ? matches.length : 0;
    }

    analyzeMessageTimes(messages) {
        const hours = messages.map(m => m.datetime.getHours());
        let morning = 0, afternoon = 0, evening = 0, night = 0;

        for (const h of hours) {
            if (h >= 6 && h < 12) morning++;
            else if (h >= 12 && h < 18) afternoon++;
            else if (h >= 18 && h < 23) evening++;
            else night++;
        }

        const total = messages.length;
        return {
            morning: morning / total,
            afternoon: afternoon / total,
            evening: evening / total,
            night: night / total,
            workHours: (morning + afternoon) / total,
            lateHours: (evening + night) / total
        };
    }

    analyzeLateNightMessages(messages) {
        // Messages entre 23h et 4h
        let count = 0;
        let avgLengthLateNight = 0;

        const lateMessages = messages.filter(m => {
            const h = m.datetime.getHours();
            return h >= 23 || h < 4;
        });

        count = lateMessages.length;
        if (count > 0) {
            avgLengthLateNight = lateMessages.reduce((sum, m) => sum + m.content.length, 0) / count;
        }

        return {
            count,
            rate: count / messages.length,
            avgLength: avgLengthLateNight
        };
    }

    analyzeConversationPatterns(messages) {
        let bursts = 0;
        let longConversations = 0;
        let currentBurst = 1;

        for (let i = 1; i < messages.length; i++) {
            const diff = messages[i].datetime - messages[i-1].datetime;
            if (diff < 5 * 60 * 1000) {
                currentBurst++;
            } else {
                if (currentBurst >= 10) longConversations++;
                if (currentBurst >= 3) bursts++;
                currentBurst = 1;
            }
        }

        return { bursts, longConversations };
    }

    getDateRange(messages) {
        if (messages.length === 0) return { days: 0 };
        const dates = messages.map(m => m.datetime.getTime());
        return { days: Math.ceil((Math.max(...dates) - Math.min(...dates)) / (1000 * 60 * 60 * 24)) + 1 };
    }

    analyzeInitiations(messages, name1, name2) {
        let init1 = 0, init2 = 0, lastDate = null;

        for (const msg of messages) {
            const msgDate = msg.datetime.toDateString();
            if (msgDate !== lastDate) {
                if (msg.sender === name1) init1++;
                else if (msg.sender === name2) init2++;
                lastDate = msgDate;
            }
        }

        const total = init1 + init2;
        return { person1: init1, person2: init2, balance: total > 0 ? 1 - Math.abs(init1 - init2) / total : 0.5 };
    }

    findLongestStreaks(messages, name1, name2) {
        let streak1 = 0, streak2 = 0, maxStreak1 = 0, maxStreak2 = 0;

        for (const msg of messages) {
            if (msg.sender === name1) { streak1++; streak2 = 0; maxStreak1 = Math.max(maxStreak1, streak1); }
            else { streak2++; streak1 = 0; maxStreak2 = Math.max(maxStreak2, streak2); }
        }

        return { person1: maxStreak1, person2: maxStreak2 };
    }

    // ==================== SCORES ====================

    calculateFriendshipScore(m) {
        let score = 40; // Base reduite pour plus de differentiation

        // Facteurs positifs amicaux
        score += m.balance * 20;
        score += Math.min(m.laughRate * 120, 18);
        score += Math.min(m.questionRate * 50, 10);
        score += Math.min(m.supportRate * 100, 10);
        if (m.messagesPerDay >= 5) score += 10;
        else if (m.messagesPerDay >= 2) score += 7;
        else if (m.messagesPerDay >= 0.5) score += 4;
        score += Math.min(m.emojiRate * 30, 10);
        score += Math.min(m.linkCount / m.total * 50, 5);
        score += m.initiations.balance * 10;

        // Penalites pour differenciation
        if (m.balance < 0.3) score -= 15;
        // Trop professionnel = moins amical
        if (m.politeRate > 0.1) score -= 10;
        if (m.timeAnalysis.workHours > 0.75) score -= 8;
        // Trop intime = relation differente
        if (m.intimateWordRate > 0.03) score -= 8;
        if (m.flirtyEmojiRate > 0.03) score -= 5;
        // Peu de rire = pas vraiment amical
        if (m.laughRate < 0.02) score -= 10;

        return Math.max(0, Math.min(100, Math.round(score)));
    }

    calculateRomanticScore(m) {
        let score = 20; // Base reduite

        // Facteurs romantiques
        score += Math.min((m.heartRate + m.affectionRate) * 250, 30);
        score += m.timeAnalysis.lateHours * 15;
        if (m.avgLength > 100) score += 12;
        else if (m.avgLength > 50) score += 8;
        else if (m.avgLength > 25) score += 4;
        if (m.responseTimes.median < 5) score += 10;
        else if (m.responseTimes.median < 15) score += 7;
        else if (m.responseTimes.median < 30) score += 4;
        score += m.balance * 10;
        if (m.messagesPerDay >= 20) score += 15;
        else if (m.messagesPerDay >= 10) score += 10;
        else if (m.messagesPerDay >= 5) score += 5;
        score += Math.min(m.emojiRate * 15, 5);
        score += Math.min(m.missingRate * 150, 8);

        // Penalites pour differenciation
        // Trop professionnel = pas romantique
        if (m.politeRate > 0.08) score -= 15;
        if (m.timeAnalysis.workHours > 0.7) score -= 10;
        // Conversation trop rare = peu romantique
        if (m.messagesPerDay < 1) score -= 10;
        // Peu d'emojis = froid
        if (m.emojiRate < 0.05) score -= 8;
        // Pas de marques d'affection
        if (m.heartRate < 0.01 && m.affectionRate < 0.01) score -= 12;

        return Math.max(0, Math.min(100, Math.round(score)));
    }

    calculateIntimateScore(m) {
        let score = 15; // Base basse pour eviter faux positifs

        // Facteurs intimes (bien ponderes)
        score += Math.min(m.flirtyEmojiRate * 600, 18);
        score += Math.min(m.intimateWordRate * 500, 18);
        score += Math.min(m.complimentRate * 300, 15);
        // Messages nocturnes (23h-4h) - important
        score += Math.min(m.lateNightMessages.rate * 180, 15);
        // Messages en soiree = bonus intime
        score += Math.min(m.timeAnalysis.evening * 25, 10);
        // Longueur des messages nocturnes
        if (m.lateNightMessages.avgLength > 60) score += 10;
        else if (m.lateNightMessages.avgLength > 30) score += 5;
        // Expressions de manque
        score += Math.min(m.missingRate * 300, 12);
        // Bonus si beaucoup de coeurs/affection
        score += Math.min((m.heartRate + m.affectionRate) * 100, 12);
        // Frequence elevee
        if (m.messagesPerDay > 10) score += 6;
        else if (m.messagesPerDay > 5) score += 3;

        // PENALITES IMPORTANTES pour formels
        // Trop formel = certainement pas intime
        if (m.politeRate > 0.05) score -= 20;
        if (m.politeRate > 0.1) score -= 15; // Cumulative
        // Messages pendant heures de bureau = professionnel
        if (m.timeAnalysis.workHours > 0.7) score -= 15;
        // Trop de salutations formelles
        const formalRate = (m.greetingCount + m.thanksCount) / m.total;
        if (formalRate > 0.1) score -= 12;
        // Pas d'emojis = communication froide
        if (m.emojiRate < 0.05) score -= 10;
        // Peu de messages nocturnes = pas d'intimite particuliere
        if (m.lateNightMessages.rate < 0.05) score -= 8;
        // Messages courts = utilitaire
        if (m.avgLength < 30) score -= 8;

        return Math.max(0, Math.min(100, Math.round(score)));
    }

    calculateProfessionalScore(m) {
        let score = 35; // Base moderee

        // Facteurs professionnels
        score += m.timeAnalysis.workHours * 25;
        score += Math.min(m.politeRate * 150, 20);
        const formalRate = (m.greetingCount + m.thanksCount) / m.total;
        score += Math.min(formalRate * 80, 15);
        if (m.avgLength < 50) score += 10;
        else if (m.avgLength < 100) score += 5;
        if (m.emojiRate < 0.05) score += 12;
        else if (m.emojiRate < 0.1) score += 8;
        else if (m.emojiRate < 0.2) score += 3;
        if (m.laughRate < 0.03) score += 8;
        else if (m.laughRate < 0.05) score += 4;
        if (m.responseTimes.median < 30) score += 10;
        else if (m.responseTimes.median < 60) score += 5;

        // Penalites fortes pour non-professionnel
        score -= Math.min((m.heartRate + m.affectionRate) * 150, 25);
        score -= Math.min(m.intimateWordRate * 300, 20);
        score -= Math.min(m.flirtyEmojiRate * 250, 15);
        // Messages nocturnes = pas professionnel
        if (m.lateNightMessages.rate > 0.1) score -= 12;
        // Trop d'emojis = informel
        if (m.emojiRate > 0.25) score -= 10;
        // Trop de rire = copains, pas collegues
        if (m.laughRate > 0.1) score -= 10;

        return Math.max(0, Math.min(100, Math.round(score)));
    }

    // ==================== NARRATIVES ====================

    generateFriendshipNarrative(m, score) {
        const narrative = { title: this.getFriendshipTitle(score), description: '', traits: [], chemistry: '' };

        if (score >= 80) {
            narrative.description = "Une complicite rare se degage de vos echanges. Vous avez developpe un langage commun, fait de references partagees et d'une comprehension mutuelle qui ne necessite parfois que quelques mots.";
        } else if (score >= 60) {
            narrative.description = "Vos conversations revelent une belle dynamique amicale. L'equilibre entre ecoute et partage cree un espace ou chacun semble trouver sa place naturellement.";
        } else if (score >= 40) {
            narrative.description = "Une relation cordiale se dessine dans vos echanges. Les bases d'une amitie sont presentes, avec un potentiel de rapprochement si les occasions se multiplient.";
        } else if (score >= 20) {
            narrative.description = "Vos echanges restent pour l'instant en surface. Peut-etre est-ce une question de temps, ou simplement que le contexte n'a pas encore permis d'approfondir la relation.";
        } else {
            narrative.description = "La conversation semble principalement fonctionnelle. Une vraie connexion amicale demanderait probablement des echanges dans un contexte different.";
        }

        if (m.laughRate > 0.1) narrative.traits.push("Le rire ponctue regulierement vos echanges, signe d'une legerte partagee");
        else if (m.laughRate > 0.05) narrative.traits.push("L'humour trouve sa place dans vos conversations");
        if (m.balance > 0.8) narrative.traits.push("L'equilibre des echanges traduit un respect mutuel");
        else if (m.balance < 0.5) narrative.traits.push(`${m.count1 > m.count2 ? m.person1.name : m.person2.name} porte davantage la conversation`);
        if (m.questionRate > 0.15) narrative.traits.push("La curiosite envers l'autre se manifeste par de nombreuses questions");
        if (m.supportRate > 0.02) narrative.traits.push("Des mots de soutien parsement la conversation");
        if (m.linkCount > 10) narrative.traits.push("Le partage frequent de contenus suggere une envie de faire decouvrir son univers");

        if (m.initiations.balance > 0.7 && m.balance > 0.7) narrative.chemistry = "L'envie de se parler semble reciproque et naturelle.";
        else if (m.initiations.balance < 0.4) narrative.chemistry = `${m.initiations.person1 > m.initiations.person2 ? m.person1.name : m.person2.name} prend plus souvent l'initiative du contact.`;

        return narrative;
    }

    generateRomanticNarrative(m, score) {
        const narrative = { title: this.getRomanticTitle(score), description: '', traits: [], chemistry: '' };

        if (score >= 80) {
            narrative.description = "L'intensite emotionnelle de vos echanges est palpable. Les mots choisis, les heures tardives, l'attention portee aux details... tout suggere une connexion qui depasse le simple echange amical.";
        } else if (score >= 60) {
            narrative.description = "Une certaine tendresse se glisse entre les lignes. Sans etre explicite, quelque chose dans la texture de vos conversations evoque plus que de la simple amitie.";
        } else if (score >= 40) {
            narrative.description = "Vos echanges portent les germes d'une possible connexion plus profonde. L'affection transparait par moments, sans encore s'affirmer pleinement.";
        } else if (score >= 20) {
            narrative.description = "La tonalite reste essentiellement amicale. Si des sentiments existent, ils ne se sont pas encore fraye un chemin dans vos conversations.";
        } else {
            narrative.description = "Rien dans vos echanges ne suggere actuellement une dimension romantique. Ce qui ne prejuge en rien de ce qui pourrait se passer hors ecran.";
        }

        if (m.heartRate > 0.05 || m.affectionRate > 0.03) narrative.traits.push("Les marques d'affection explicites emaillent vos conversations");
        if (m.timeAnalysis.night > 0.15) narrative.traits.push("Les messages nocturnes temoignent d'une pensee pour l'autre aux heures tardives");
        else if (m.timeAnalysis.evening > 0.35) narrative.traits.push("Les soirees semblent propices a vos echanges");
        if (m.responseTimes.median < 5) narrative.traits.push("La reactivite traduit une attention particuliere");
        if (m.avgLength > 80) narrative.traits.push("La longueur des messages revele une envie de se livrer");
        if (m.missingRate > 0.01) narrative.traits.push("Les expressions de manque ponctuent vos conversations");

        if (m.messagesPerDay > 15 && m.balance > 0.6) narrative.chemistry = "La frequence et la reciprocite suggerent une place importante dans le quotidien de l'autre.";

        return narrative;
    }

    generateIntimateNarrative(m, score) {
        const narrative = { title: this.getIntimateTitle(score), description: '', traits: [], chemistry: '' };

        if (score >= 80) {
            narrative.description = "Vos echanges laissent transparaitre une tension et une attirance indeniables. Les mots choisis, les heures, les sous-entendus... une intimite particuliere se dessine entre les lignes.";
        } else if (score >= 60) {
            narrative.description = "Une certaine sensualite affleure dans vos conversations. Sans etre omniprésente, elle colore vos echanges d'une teinte particuliere, suggerant une attirance mutuelle.";
        } else if (score >= 40) {
            narrative.description = "Des indices subtils laissent entrevoir une possible dimension intime. Le flirt pointe parfois, sans encore s'affirmer pleinement dans vos echanges.";
        } else if (score >= 20) {
            narrative.description = "Vos conversations restent sur un registre essentiellement amical ou cordial. L'intimite, si elle existe, ne s'exprime pas encore par ecrit.";
        } else {
            narrative.description = "Aucun element de vos echanges ne suggere une dimension intime. La relation semble s'inscrire dans un cadre strictement platonique.";
        }

        if (m.flirtyEmojiRate > 0.02) narrative.traits.push("Des emojis evocateurs ponctuent vos echanges");
        if (m.intimateWordRate > 0.01) narrative.traits.push("Le vocabulaire employe suggere une proximite particuliere");
        if (m.complimentRate > 0.02) narrative.traits.push("Les compliments physiques ne sont pas rares");
        if (m.lateNightMessages.rate > 0.15) narrative.traits.push("Les conversations nocturnes occupent une place significative");
        if (m.lateNightMessages.avgLength > 60) narrative.traits.push("Les messages de nuit sont particulierement developpes");
        if (m.missingRate > 0.02) narrative.traits.push("L'expression du manque revient regulierement");

        if (m.flirtyEmojiRate > 0.01 && m.lateNightMessages.rate > 0.1) {
            narrative.chemistry = "La combinaison d'echanges tardifs et de sous-entendus cree une atmosphere particuliere.";
        } else if (m.complimentRate > 0.03) {
            narrative.chemistry = "L'attention portee au physique de l'autre est notable.";
        }

        return narrative;
    }

    generateProfessionalNarrative(m, score) {
        const narrative = { title: this.getProfessionalTitle(score), description: '', traits: [], chemistry: '' };

        if (score >= 80) {
            narrative.description = "Vos echanges adoptent un registre tres professionnel. La communication est structuree, courtoise et centree sur l'essentiel.";
        } else if (score >= 60) {
            narrative.description = "Un bon equilibre entre professionnalisme et cordialite caracterise vos conversations. L'efficacite n'empeche pas une certaine chaleur humaine.";
        } else if (score >= 40) {
            narrative.description = "Vos echanges melangent registres formel et informel. Cette flexibilite peut etre un atout dans certains contextes collaboratifs.";
        } else if (score >= 20) {
            narrative.description = "La tonalite reste plutot decontractee, ce qui peut convenir a certains environnements mais moins a d'autres.";
        } else {
            narrative.description = "Vos conversations ont une saveur resolument personnelle. Dans un cadre strictement professionnel, un ajustement serait souhaitable.";
        }

        if (m.timeAnalysis.workHours > 0.7) narrative.traits.push("Les echanges se concentrent sur les heures de bureau");
        if (m.politeRate > 0.05) narrative.traits.push("Les formules de politesse structurent la communication");
        if (m.avgLength < 40) narrative.traits.push("La concision favorise l'efficacite");
        else if (m.avgLength > 100) narrative.traits.push("Les messages detailles permettent une communication riche");
        if (m.responseTimes.median < 30) narrative.traits.push("La reactivite contribue a une collaboration fluide");

        if (m.emojiRate < 0.05) narrative.chemistry = "La sobriete maintient un cadre professionnel.";

        return narrative;
    }

    // ==================== SYNTHESIS ====================

    generateSynthesis(m, scores, person1, person2) {
        const synthesis = { headline: '', portrait: '', dynamic: '', rhythm: '' };

        const maxType = this.getMaxScoreType(scores);
        const maxScore = scores[maxType];

        if (maxScore < 40) synthesis.headline = "Une relation encore en construction";
        else if (maxType === 'intimate' && scores.intimate > 60) synthesis.headline = "Une connexion chargee de tension";
        else if (maxType === 'romantic' && scores.romantic > scores.friendship) synthesis.headline = "Une complicite teintee de tendresse";
        else if (maxType === 'friendship' && scores.friendship > scores.romantic + 15) synthesis.headline = "Une belle amitie se dessine";
        else if (maxType === 'professional') synthesis.headline = "Des echanges structures et efficaces";
        else synthesis.headline = "Une relation aux multiples facettes";

        const daysText = m.daysSpan > 365 ? "plus d'un an" : m.daysSpan > 30 ? `${Math.round(m.daysSpan / 30)} mois` : `${m.daysSpan} jours`;
        synthesis.portrait = `Sur ${daysText} de conversation et ${m.total} messages echanges, `;

        if (m.balance > 0.75) {
            synthesis.portrait += `${person1.name} et ${person2.name} ont construit un dialogue equilibre ou chacun donne et recoit de maniere equivalente.`;
        } else {
            const talker = m.count1 > m.count2 ? person1.name : person2.name;
            const ratio = Math.round(Math.max(m.count1, m.count2) / Math.min(m.count1, m.count2) * 10) / 10;
            synthesis.portrait += `${talker} s'exprime environ ${ratio} fois plus, ce qui dessine une dynamique particuliere.`;
        }

        if (m.initiations.balance > 0.7) synthesis.dynamic = "L'initiative du contact est partagee, signe d'une envie reciproque de maintenir le lien.";
        else {
            const initiator = m.initiations.person1 > m.initiations.person2 ? person1.name : person2.name;
            const pct = Math.round(Math.max(m.initiations.person1, m.initiations.person2) / (m.initiations.person1 + m.initiations.person2) * 100);
            synthesis.dynamic = `${initiator} initie ${pct}% des conversations, jouant le role de moteur de la relation.`;
        }

        if (m.messagesPerDay > 20) synthesis.rhythm = "Le rythme est soutenu, suggerant une place centrale dans la vie de l'autre.";
        else if (m.messagesPerDay > 5) synthesis.rhythm = "Un flux regulier maintient la connexion vivante.";
        else if (m.messagesPerDay > 1) synthesis.rhythm = "Les echanges suivent un rythme tranquille.";
        else synthesis.rhythm = "La conversation s'etire dans le temps, avec des silences eloquents.";

        return synthesis;
    }

    // ==================== DYNAMICS ====================

    analyzeDynamics(m, person1, person2) {
        const dynamics = [];

        if (Math.abs(m.responseTimes1.median - m.responseTimes2.median) > 5) {
            const faster = m.responseTimes1.median < m.responseTimes2.median ? person1.name : person2.name;
            dynamics.push({
                type: 'responsiveness',
                text: `${faster} tend a repondre plus rapidement`,
                detail: 'Cela peut refleter differents rythmes de vie ou niveaux d\'attention'
            });
        }

        if (Math.abs(m.avgLength1 - m.avgLength2) > 20) {
            const verbose = m.avgLength1 > m.avgLength2 ? person1.name : person2.name;
            dynamics.push({
                type: 'expression',
                text: `${verbose} s'exprime de facon plus detaillee`,
                detail: 'Chacun a son style de communication'
            });
        }

        if (m.lateNightMessages.rate > 0.15) {
            dynamics.push({
                type: 'timing',
                text: 'Les conversations nocturnes sont frequentes',
                detail: 'Ces moments tardifs revelent souvent une confiance particuliere'
            });
        }

        if (m.longestStreaks.person1 > 8 || m.longestStreaks.person2 > 8) {
            const monologist = m.longestStreaks.person1 > m.longestStreaks.person2 ? person1.name : person2.name;
            dynamics.push({
                type: 'flow',
                text: `${monologist} envoie parfois de longues series de messages`,
                detail: 'Un style de communication en rafales'
            });
        }

        return dynamics;
    }

    // ==================== HELPERS ====================

    getFriendshipTitle(score) {
        if (score >= 85) return "Ames soeurs amicales";
        if (score >= 70) return "Vraie complicite";
        if (score >= 55) return "Belle entente";
        if (score >= 40) return "Bons termes";
        if (score >= 25) return "En decouverte";
        return "Relation naissante";
    }

    getRomanticTitle(score) {
        if (score >= 85) return "Connexion intense";
        if (score >= 70) return "Affinite profonde";
        if (score >= 55) return "Tendresse perceptible";
        if (score >= 40) return "Lueurs de complicite";
        if (score >= 25) return "Terrain amical";
        return "Neutralite affective";
    }

    getIntimateTitle(score) {
        if (score >= 85) return "Tension palpable";
        if (score >= 70) return "Attirance evidente";
        if (score >= 55) return "Flirt en filigrane";
        if (score >= 40) return "Indices subtils";
        if (score >= 25) return "Registre cordial";
        return "Relation platonique";
    }

    getProfessionalTitle(score) {
        if (score >= 85) return "Collaboration exemplaire";
        if (score >= 70) return "Partenariat efficace";
        if (score >= 55) return "Echanges constructifs";
        if (score >= 40) return "Cordialite professionnelle";
        if (score >= 25) return "Style decontracte";
        return "Registre personnel";
    }

    getMaxScoreType(scores) {
        let max = 'friendship';
        if (scores.romantic > scores[max]) max = 'romantic';
        if (scores.intimate > scores[max]) max = 'intimate';
        if (scores.professional > scores[max]) max = 'professional';
        return max;
    }
}

window.CompatibilityAnalyzer = CompatibilityAnalyzer;
