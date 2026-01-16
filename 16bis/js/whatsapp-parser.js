/**
 * WhatsApp Chat Parser
 * Parse les fichiers de conversation WhatsApp exportes
 */
class WhatsAppParser {
    constructor() {
        // Patterns pour differents formats de date/heure WhatsApp
        this.patterns = [
            // Format: [DD/MM/YYYY, HH:MM:SS] Name: Message
            /^\[(\d{1,2}\/\d{1,2}\/\d{2,4}),?\s*(\d{1,2}:\d{2}(?::\d{2})?)\]\s*([^:]+):\s*(.*)$/,
            // Format: DD/MM/YYYY, HH:MM - Name: Message
            /^(\d{1,2}\/\d{1,2}\/\d{2,4}),?\s*(\d{1,2}:\d{2}(?::\d{2})?(?:\s*[AP]M)?)\s*[-–]\s*([^:]+):\s*(.*)$/,
            // Format: DD/MM/YYYY HH:MM - Name: Message (sans virgule)
            /^(\d{1,2}\/\d{1,2}\/\d{2,4})\s+(\d{1,2}:\d{2}(?::\d{2})?(?:\s*[AP]M)?)\s*[-–]\s*([^:]+):\s*(.*)$/,
            // Format US: MM/DD/YY, HH:MM AM/PM - Name: Message
            /^(\d{1,2}\/\d{1,2}\/\d{2,4}),?\s*(\d{1,2}:\d{2}\s*[AP]M)\s*[-–]\s*([^:]+):\s*(.*)$/,
        ];

        // Messages systeme a ignorer
        this.systemPatterns = [
            /Les messages et les appels sont chiffr/i,
            /Messages and calls are end-to-end encrypted/i,
            /a change le code de securite/i,
            /security code changed/i,
            /a ete ajoute/i,
            /was added/i,
            /a quitte/i,
            /left/i,
            /a cree le groupe/i,
            /created group/i,
            /a modifie/i,
            /changed/i,
            /Fichier multimedia omis/i,
            /Media omitted/i,
            /image omise/i,
            /video omise/i,
            /Message supprime/i,
            /This message was deleted/i,
            /Vous avez supprime ce message/i,
        ];
    }

    /**
     * Parse le contenu d'un fichier WhatsApp
     * @param {string} content - Contenu du fichier
     * @returns {Object} Donnees parsees
     */
    parse(content) {
        const lines = content.split(/\r?\n/);
        const messages = [];
        let currentMessage = null;

        for (const line of lines) {
            const parsed = this.parseLine(line);

            if (parsed) {
                // Nouvelle ligne de message
                if (currentMessage) {
                    messages.push(currentMessage);
                }
                currentMessage = parsed;
            } else if (currentMessage && line.trim()) {
                // Continuation du message precedent (message multi-ligne)
                currentMessage.content += '\n' + line;
            }
        }

        // Ajouter le dernier message
        if (currentMessage) {
            messages.push(currentMessage);
        }

        // Filtrer les messages systeme
        const filteredMessages = messages.filter(msg => !this.isSystemMessage(msg.content));

        // Extraire les participants
        const participants = this.extractParticipants(filteredMessages);

        // Valider qu'on a exactement 2 participants pour l'analyse
        if (participants.length < 2) {
            throw new Error('Cette conversation doit contenir au moins 2 participants pour analyser la compatibilite.');
        }

        return {
            messages: filteredMessages,
            participants,
            totalMessages: filteredMessages.length,
            dateRange: this.getDateRange(filteredMessages),
            rawLineCount: lines.length
        };
    }

    /**
     * Parse une ligne individuelle
     */
    parseLine(line) {
        for (const pattern of this.patterns) {
            const match = line.match(pattern);
            if (match) {
                const [, date, time, sender, content] = match;
                const datetime = this.parseDateTime(date, time);

                return {
                    datetime,
                    date,
                    time,
                    sender: sender.trim(),
                    content: content.trim()
                };
            }
        }
        return null;
    }

    /**
     * Parse une date/heure en objet Date
     */
    parseDateTime(dateStr, timeStr) {
        // Extraire les composants de la date
        const dateParts = dateStr.split('/');
        let day, month, year;

        // Detecter le format (DD/MM ou MM/DD)
        if (dateParts.length === 3) {
            // On assume DD/MM/YYYY pour le francais
            day = parseInt(dateParts[0], 10);
            month = parseInt(dateParts[1], 10) - 1;
            year = parseInt(dateParts[2], 10);

            // Corriger l'annee si format court (YY)
            if (year < 100) {
                year += year < 50 ? 2000 : 1900;
            }
        }

        // Parser l'heure
        let hours, minutes, seconds = 0;
        const timeParts = timeStr.replace(/\s*[AP]M/i, '').split(':');
        hours = parseInt(timeParts[0], 10);
        minutes = parseInt(timeParts[1], 10);
        if (timeParts[2]) {
            seconds = parseInt(timeParts[2], 10);
        }

        // Gerer AM/PM
        if (/PM/i.test(timeStr) && hours < 12) {
            hours += 12;
        } else if (/AM/i.test(timeStr) && hours === 12) {
            hours = 0;
        }

        return new Date(year, month, day, hours, minutes, seconds);
    }

    /**
     * Verifie si un message est un message systeme
     */
    isSystemMessage(content) {
        return this.systemPatterns.some(pattern => pattern.test(content));
    }

    /**
     * Extrait les participants uniques
     */
    extractParticipants(messages) {
        const senderCounts = {};

        for (const msg of messages) {
            if (!senderCounts[msg.sender]) {
                senderCounts[msg.sender] = 0;
            }
            senderCounts[msg.sender]++;
        }

        // Trier par nombre de messages (descendant)
        return Object.entries(senderCounts)
            .sort((a, b) => b[1] - a[1])
            .map(([name, count]) => ({ name, messageCount: count }));
    }

    /**
     * Obtient la plage de dates de la conversation
     */
    getDateRange(messages) {
        if (messages.length === 0) {
            return { start: null, end: null, days: 0 };
        }

        const dates = messages.map(m => m.datetime).filter(d => !isNaN(d.getTime()));
        if (dates.length === 0) {
            return { start: null, end: null, days: 0 };
        }

        const start = new Date(Math.min(...dates));
        const end = new Date(Math.max(...dates));
        const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;

        return { start, end, days };
    }
}

// Export global
window.WhatsAppParser = WhatsAppParser;
