/* ===========================================
   Export Service - PNG and SGF Export
   =========================================== */

const ExportService = (function() {
    'use strict';

    /**
     * Export canvas as PNG
     * @param {HTMLCanvasElement} canvas - Canvas to export
     * @param {Object} gameInfo - Game information for filename
     */
    function exportPNG(canvas, gameInfo) {
        try {
            const dataUrl = canvas.toDataURL('image/png');
            const filename = generateFilename(gameInfo, 'png');

            downloadFile(dataUrl, filename);
            showToast('Image PNG exportee', 'success');
        } catch (err) {
            console.error('Error exporting PNG:', err);
            showToast('Erreur lors de l\'export PNG', 'error');
        }
    }

    /**
     * Export annotated SGF
     * @param {Object} gameInfo - Game information
     * @param {Object} board - Board state
     * @param {Set} deadStones - Dead stones
     * @param {Object} score - Score object
     */
    function exportSGF(gameInfo, board, deadStones, score) {
        try {
            const sgfContent = SGFParser.generateSGF(gameInfo, board, deadStones, score);
            const filename = generateFilename(gameInfo, 'sgf');

            const blob = new Blob([sgfContent], { type: 'application/x-go-sgf' });
            const url = URL.createObjectURL(blob);

            downloadFile(url, filename);
            URL.revokeObjectURL(url);

            showToast('Fichier SGF exporte', 'success');
        } catch (err) {
            console.error('Error exporting SGF:', err);
            showToast('Erreur lors de l\'export SGF', 'error');
        }
    }

    /**
     * Generate filename based on game info
     * @param {Object} gameInfo - Game information
     * @param {string} extension - File extension
     * @returns {string} Filename
     */
    function generateFilename(gameInfo, extension) {
        const black = sanitizeFilename(gameInfo.blackPlayer || 'Noir');
        const white = sanitizeFilename(gameInfo.whitePlayer || 'Blanc');
        const date = new Date().toISOString().split('T')[0];

        return `go-score_${black}-vs-${white}_${date}.${extension}`;
    }

    /**
     * Sanitize string for use in filename
     * @param {string} str - String to sanitize
     * @returns {string} Sanitized string
     */
    function sanitizeFilename(str) {
        return str
            .replace(/[^a-zA-Z0-9]/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-|-$/g, '')
            .substring(0, 20);
    }

    /**
     * Download a file
     * @param {string} url - URL or data URL
     * @param {string} filename - Filename
     */
    function downloadFile(url, filename) {
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    /**
     * Copy text to clipboard
     * @param {string} text - Text to copy
     * @returns {Promise}
     */
    async function copyToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);
            showToast('Copie dans le presse-papiers', 'success');
        } catch (err) {
            // Fallback for older browsers
            const textarea = document.createElement('textarea');
            textarea.value = text;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            showToast('Copie dans le presse-papiers', 'success');
        }
    }

    /**
     * Show toast notification
     * @param {string} message - Message to show
     * @param {string} type - Type (success, error, info)
     */
    function showToast(message, type) {
        const toast = document.getElementById('toast');
        if (toast) {
            toast.textContent = message;
            toast.className = 'toast show ' + type;
            setTimeout(() => {
                toast.classList.remove('show');
            }, 3000);
        }
    }

    // Public API
    return {
        exportPNG,
        exportSGF,
        copyToClipboard
    };
})();
