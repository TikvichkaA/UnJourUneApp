/* ===========================================
   Remodel Renderer - Display rearranged territories on original-size goban
   Human-style counting visualization
   =========================================== */

const RemodelRenderer = (function() {
    'use strict';

    // Constants
    const EMPTY = 0;
    const BLACK = 1;
    const WHITE = 2;

    /**
     * Draw a rounded rectangle (polyfill for older browsers)
     */
    function drawRoundRect(ctx, x, y, width, height, radius) {
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + width - radius, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        ctx.lineTo(x + width, y + height - radius);
        ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        ctx.lineTo(x + radius, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.closePath();
    }

    // Rendering configuration (matches board-renderer style)
    const CONFIG = {
        margin: 30,
        stoneRadius: 0.47,
        boardColor: '#dcb35c',
        lineColor: '#2d2d2d',
        blackStone: '#1a1a1a',
        whiteStone: '#f5f5f5',
        territoryBlack: 'rgba(0, 0, 0, 0.12)',
        territoryWhite: 'rgba(255, 255, 255, 0.20)',
        rectBorderBlack: 'rgba(0, 0, 0, 0.4)',
        rectBorderWhite: 'rgba(255, 255, 255, 0.5)',
        labelBg: 'rgba(0, 0, 0, 0.75)',
        labelColor: '#fff'
    };

    // Star point positions
    const STAR_POINTS = {
        9: [{ x: 2, y: 2 }, { x: 6, y: 2 }, { x: 4, y: 4 }, { x: 2, y: 6 }, { x: 6, y: 6 }],
        13: [{ x: 3, y: 3 }, { x: 9, y: 3 }, { x: 6, y: 6 }, { x: 3, y: 9 }, { x: 9, y: 9 }],
        19: [
            { x: 3, y: 3 }, { x: 9, y: 3 }, { x: 15, y: 3 },
            { x: 3, y: 9 }, { x: 9, y: 9 }, { x: 15, y: 9 },
            { x: 3, y: 15 }, { x: 9, y: 15 }, { x: 15, y: 15 }
        ]
    };

    let cellSize = 0;
    let currentMargin = 0;

    /**
     * Render the remodeled board
     * @param {HTMLCanvasElement} canvas - Canvas element
     * @param {Object} remodeledBoard - Remodeled board data from RectanglePacker
     * @param {Object} score - Score object
     */
    function render(canvas, remodeledBoard, score) {
        const ctx = canvas.getContext('2d');

        if (!remodeledBoard || !remodeledBoard.grid) {
            renderEmptyState(ctx, canvas);
            return;
        }

        const size = remodeledBoard.size;

        // Calculate dimensions to fit canvas
        const canvasSize = Math.min(canvas.width, canvas.height);
        currentMargin = CONFIG.margin;
        cellSize = (canvasSize - 2 * currentMargin) / (size - 1);

        // Clear and draw board background
        ctx.fillStyle = CONFIG.boardColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw grid
        drawGrid(ctx, size);

        // Draw star points
        drawStarPoints(ctx, size);

        // Draw coordinates
        drawCoordinates(ctx, size);

        // Draw territory rectangles (highlighted areas)
        drawTerritoryRectangles(ctx, remodeledBoard.rectangles);

        // Draw stones
        drawStones(ctx, remodeledBoard.grid, size);

        // Draw point counts on rectangles
        drawRectangleLabels(ctx, remodeledBoard.rectangles);

        // Draw score info
        drawScoreInfo(ctx, canvas, score, remodeledBoard);
    }

    /**
     * Draw the grid lines
     */
    function drawGrid(ctx, size) {
        ctx.strokeStyle = CONFIG.lineColor;
        ctx.lineWidth = 1;

        for (let i = 0; i < size; i++) {
            const pos = currentMargin + i * cellSize;

            // Vertical line
            ctx.beginPath();
            ctx.moveTo(pos, currentMargin);
            ctx.lineTo(pos, currentMargin + (size - 1) * cellSize);
            ctx.stroke();

            // Horizontal line
            ctx.beginPath();
            ctx.moveTo(currentMargin, pos);
            ctx.lineTo(currentMargin + (size - 1) * cellSize, pos);
            ctx.stroke();
        }
    }

    /**
     * Draw star points (hoshi)
     */
    function drawStarPoints(ctx, size) {
        const points = STAR_POINTS[size] || [];
        ctx.fillStyle = CONFIG.lineColor;

        for (const point of points) {
            const px = currentMargin + point.x * cellSize;
            const py = currentMargin + point.y * cellSize;

            ctx.beginPath();
            ctx.arc(px, py, cellSize * 0.1, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    /**
     * Draw coordinate labels
     */
    function drawCoordinates(ctx, size) {
        ctx.fillStyle = CONFIG.lineColor;
        ctx.font = `${Math.max(10, cellSize * 0.4)}px Inter, sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        const letters = 'ABCDEFGHJKLMNOPQRST'.slice(0, size);

        for (let i = 0; i < size; i++) {
            const x = currentMargin + i * cellSize;
            ctx.fillText(letters[i], x, currentMargin * 0.4);
            ctx.fillText(letters[i], x, currentMargin + (size - 1) * cellSize + currentMargin * 0.6);
        }

        for (let i = 0; i < size; i++) {
            const y = currentMargin + i * cellSize;
            const num = size - i;
            ctx.fillText(num.toString(), currentMargin * 0.4, y);
            ctx.fillText(num.toString(), currentMargin + (size - 1) * cellSize + currentMargin * 0.6, y);
        }
    }

    /**
     * Draw territory rectangles with highlighting
     */
    function drawTerritoryRectangles(ctx, rectangles) {
        if (!rectangles) return;

        for (const rect of rectangles) {
            const px = currentMargin + (rect.x - 0.5) * cellSize;
            const py = currentMargin + (rect.y - 0.5) * cellSize;
            const pw = rect.width * cellSize;
            const ph = rect.height * cellSize;

            // Fill with territory color
            ctx.fillStyle = rect.owner === BLACK ? CONFIG.territoryBlack : CONFIG.territoryWhite;
            ctx.fillRect(px, py, pw, ph);

            // Draw border
            ctx.strokeStyle = rect.owner === BLACK ? CONFIG.rectBorderBlack : CONFIG.rectBorderWhite;
            ctx.lineWidth = 2;
            ctx.strokeRect(px, py, pw, ph);
        }
    }

    /**
     * Draw stones on the board
     */
    function drawStones(ctx, grid, size) {
        const radius = cellSize * CONFIG.stoneRadius;

        for (let y = 0; y < size; y++) {
            for (let x = 0; x < size; x++) {
                const cell = grid[y][x];
                if (cell === EMPTY) continue;

                const px = currentMargin + x * cellSize;
                const py = currentMargin + y * cellSize;

                drawStone(ctx, px, py, radius, cell);
            }
        }
    }

    /**
     * Draw a single stone with 3D effect
     */
    function drawStone(ctx, x, y, radius, color) {
        const gradient = ctx.createRadialGradient(
            x - radius * 0.3, y - radius * 0.3, radius * 0.1,
            x, y, radius
        );

        if (color === BLACK) {
            gradient.addColorStop(0, '#4a4a4a');
            gradient.addColorStop(1, CONFIG.blackStone);
        } else {
            gradient.addColorStop(0, '#ffffff');
            gradient.addColorStop(1, '#d0d0d0');
        }

        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();

        ctx.strokeStyle = color === BLACK ? '#000' : '#aaa';
        ctx.lineWidth = 1;
        ctx.stroke();
    }

    /**
     * Draw point count labels on rectangles
     */
    function drawRectangleLabels(ctx, rectangles) {
        if (!rectangles) return;

        ctx.font = `bold ${Math.max(14, cellSize * 0.7)}px Inter, sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        for (const rect of rectangles) {
            if (rect.area <= 0) continue;

            // Calculate center of rectangle
            const cx = currentMargin + (rect.x + rect.width / 2 - 0.5) * cellSize;
            const cy = currentMargin + (rect.y + rect.height / 2 - 0.5) * cellSize;

            const text = rect.area.toString();
            const metrics = ctx.measureText(text);
            const padding = 6;
            const boxWidth = metrics.width + padding * 2;
            const boxHeight = Math.max(20, cellSize * 0.8);

            // Background
            ctx.fillStyle = CONFIG.labelBg;
            drawRoundRect(ctx, cx - boxWidth / 2, cy - boxHeight / 2, boxWidth, boxHeight, 4);
            ctx.fill();

            // Text
            ctx.fillStyle = CONFIG.labelColor;
            ctx.fillText(text, cx, cy);
        }
    }

    /**
     * Draw score information
     */
    function drawScoreInfo(ctx, canvas, score, remodeledBoard) {
        const infoY = canvas.height - 25;

        // Semi-transparent background
        ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        ctx.fillRect(0, infoY - 15, canvas.width, 40);

        ctx.font = '12px Inter, sans-serif';
        ctx.textBaseline = 'middle';

        // Black info
        ctx.textAlign = 'left';
        ctx.fillStyle = '#fff';
        const blackInfo = `Noir: ${score.black.territory} territoire + ${score.black.stones} pierres = ${score.black.total}`;
        ctx.fillText(blackInfo, 10, infoY);

        // White info
        ctx.textAlign = 'right';
        const whiteInfo = `Blanc: ${score.white.territory} + ${score.white.stones} + ${score.white.komi} komi = ${score.white.total}`;
        ctx.fillText(whiteInfo, canvas.width - 10, infoY);

        // Result in center
        ctx.textAlign = 'center';
        ctx.font = 'bold 13px Inter, sans-serif';

        const diff = score.black.total - score.white.total;
        if (diff > 0) {
            ctx.fillStyle = '#4ade80';
            ctx.fillText(`Noir +${diff}`, canvas.width / 2, infoY);
        } else if (diff < 0) {
            ctx.fillStyle = '#4ade80';
            ctx.fillText(`Blanc +${Math.abs(diff)}`, canvas.width / 2, infoY);
        } else {
            ctx.fillStyle = '#fbbf24';
            ctx.fillText('Egalite', canvas.width / 2, infoY);
        }

        // Territory verification and movements (small text)
        ctx.font = '10px Inter, sans-serif';
        ctx.textAlign = 'center';

        let verificationText = '';

        // Show territory check
        if (remodeledBoard.territoryCheck) {
            const tc = remodeledBoard.territoryCheck;
            if (tc.preserved) {
                ctx.fillStyle = '#4ade80'; // green
                verificationText = `Territoires preserves (N:${tc.final.black} B:${tc.final.white})`;
            } else {
                ctx.fillStyle = '#f87171'; // red
                verificationText = `ERREUR: Territoires changes!`;
            }
        }

        if (remodeledBoard.movements && remodeledBoard.movements.length > 0) {
            verificationText += ` | ${remodeledBoard.movements.length} deplacements`;
        }

        if (verificationText) {
            ctx.fillText(verificationText, canvas.width / 2, infoY + 12);
        }
    }

    /**
     * Render empty state
     */
    function renderEmptyState(ctx, canvas) {
        ctx.fillStyle = CONFIG.boardColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = '#666';
        ctx.font = '16px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('Chargez un fichier SGF pour voir le comptage', canvas.width / 2, canvas.height / 2);
    }

    // Public API
    return {
        render
    };
})();
