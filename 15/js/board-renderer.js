/* ===========================================
   Board Renderer - Canvas 2D Rendering
   =========================================== */

const BoardRenderer = (function() {
    'use strict';

    // Constants
    const EMPTY = 0;
    const BLACK = 1;
    const WHITE = 2;

    // Rendering configuration
    const CONFIG = {
        margin: 30,
        stoneRadius: 0.47, // Relative to cell size
        boardColor: '#dcb35c',
        lineColor: '#2d2d2d',
        blackStone: '#1a1a1a',
        whiteStone: '#f5f5f5',
        deadOverlay: 'rgba(255, 0, 0, 0.4)',
        territoryBlack: 'rgba(0, 0, 0, 0.25)',
        territoryWhite: 'rgba(255, 255, 255, 0.35)',
        territoryMarkerSize: 0.25 // Relative to cell size
    };

    // Star point positions for different board sizes
    const STAR_POINTS = {
        9: [
            { x: 2, y: 2 }, { x: 6, y: 2 },
            { x: 4, y: 4 },
            { x: 2, y: 6 }, { x: 6, y: 6 }
        ],
        13: [
            { x: 3, y: 3 }, { x: 9, y: 3 },
            { x: 6, y: 6 },
            { x: 3, y: 9 }, { x: 9, y: 9 }
        ],
        19: [
            { x: 3, y: 3 }, { x: 9, y: 3 }, { x: 15, y: 3 },
            { x: 3, y: 9 }, { x: 9, y: 9 }, { x: 15, y: 9 },
            { x: 3, y: 15 }, { x: 9, y: 15 }, { x: 15, y: 15 }
        ]
    };

    let cellSize = 0;
    let currentMargin = 0;

    /**
     * Render the board on canvas
     * @param {HTMLCanvasElement} canvas - Canvas element
     * @param {Object} board - Board state
     * @param {Array} territories - Territory array
     * @param {Set} deadStones - Dead stones set
     */
    function render(canvas, board, territories, deadStones) {
        const ctx = canvas.getContext('2d');
        const size = board.size;

        // Calculate dimensions
        const canvasSize = Math.min(canvas.width, canvas.height);
        currentMargin = CONFIG.margin;
        cellSize = (canvasSize - 2 * currentMargin) / (size - 1);

        // Clear and draw background
        ctx.fillStyle = CONFIG.boardColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw grid
        drawGrid(ctx, size);

        // Draw star points
        drawStarPoints(ctx, size);

        // Draw coordinates
        drawCoordinates(ctx, size);

        // Draw territory markers
        drawTerritories(ctx, territories);

        // Draw stones
        drawStones(ctx, board, deadStones);
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

        // Letters (skip 'I')
        const letters = 'ABCDEFGHJKLMNOPQRST'.slice(0, size);

        for (let i = 0; i < size; i++) {
            const x = currentMargin + i * cellSize;

            // Top
            ctx.fillText(letters[i], x, currentMargin * 0.4);

            // Bottom
            ctx.fillText(letters[i], x, currentMargin + (size - 1) * cellSize + currentMargin * 0.6);
        }

        // Numbers
        for (let i = 0; i < size; i++) {
            const y = currentMargin + i * cellSize;
            const num = size - i;

            // Left
            ctx.fillText(num.toString(), currentMargin * 0.4, y);

            // Right
            ctx.fillText(num.toString(), currentMargin + (size - 1) * cellSize + currentMargin * 0.6, y);
        }
    }

    /**
     * Draw territory markers
     */
    function drawTerritories(ctx, territories) {
        const markerSize = cellSize * CONFIG.territoryMarkerSize;

        for (const territory of territories) {
            if (territory.owner === Territory.NEUTRAL) continue;

            const color = territory.owner === BLACK ? CONFIG.territoryBlack : CONFIG.territoryWhite;

            for (const point of territory.points) {
                const px = currentMargin + point.x * cellSize;
                const py = currentMargin + point.y * cellSize;

                ctx.fillStyle = color;
                ctx.fillRect(px - markerSize / 2, py - markerSize / 2, markerSize, markerSize);
            }
        }
    }

    /**
     * Draw stones on the board
     */
    function drawStones(ctx, board, deadStones) {
        const radius = cellSize * CONFIG.stoneRadius;

        for (let y = 0; y < board.size; y++) {
            for (let x = 0; x < board.size; x++) {
                const cell = board.grid[y][x];
                if (cell === EMPTY) continue;

                const px = currentMargin + x * cellSize;
                const py = currentMargin + y * cellSize;
                const isDead = deadStones.has(`${x},${y}`);

                drawStone(ctx, px, py, radius, cell, isDead);
            }
        }
    }

    /**
     * Draw a single stone
     */
    function drawStone(ctx, x, y, radius, color, isDead) {
        // Create gradient for 3D effect
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

        // Draw stone
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();

        // Add subtle border
        ctx.strokeStyle = color === BLACK ? '#000' : '#aaa';
        ctx.lineWidth = 1;
        ctx.stroke();

        // Draw dead stone indicator
        if (isDead) {
            // Red X overlay
            ctx.strokeStyle = CONFIG.deadOverlay;
            ctx.lineWidth = 3;

            const crossSize = radius * 0.6;
            ctx.beginPath();
            ctx.moveTo(x - crossSize, y - crossSize);
            ctx.lineTo(x + crossSize, y + crossSize);
            ctx.moveTo(x + crossSize, y - crossSize);
            ctx.lineTo(x - crossSize, y + crossSize);
            ctx.stroke();

            // Semi-transparent overlay
            ctx.beginPath();
            ctx.arc(x, y, radius, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(255, 0, 0, 0.2)';
            ctx.fill();
        }
    }

    /**
     * Convert canvas coordinates to board coordinates
     * @param {number} canvasX - Canvas X position
     * @param {number} canvasY - Canvas Y position
     * @param {number} size - Board size
     * @param {HTMLCanvasElement} canvas - Canvas element
     * @returns {Object|null} {x, y} or null if outside board
     */
    function canvasToBoardCoords(canvasX, canvasY, size, canvas) {
        // Account for canvas scaling
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;

        const x = canvasX * scaleX;
        const y = canvasY * scaleY;

        // Convert to board coordinates
        const boardX = Math.round((x - currentMargin) / cellSize);
        const boardY = Math.round((y - currentMargin) / cellSize);

        // Check bounds
        if (boardX < 0 || boardX >= size || boardY < 0 || boardY >= size) {
            return null;
        }

        // Check if click is close enough to intersection
        const intersectionX = currentMargin + boardX * cellSize;
        const intersectionY = currentMargin + boardY * cellSize;
        const distance = Math.sqrt(Math.pow(x - intersectionX, 2) + Math.pow(y - intersectionY, 2));

        if (distance > cellSize * 0.5) {
            return null;
        }

        return { x: boardX, y: boardY };
    }

    /**
     * Convert board coordinates to canvas coordinates
     * @param {number} boardX - Board X
     * @param {number} boardY - Board Y
     * @returns {Object} {x, y} canvas coordinates
     */
    function boardToCanvasCoords(boardX, boardY) {
        return {
            x: currentMargin + boardX * cellSize,
            y: currentMargin + boardY * cellSize
        };
    }

    // Public API
    return {
        render,
        canvasToBoardCoords,
        boardToCanvasCoords,
        getCellSize: () => cellSize
    };
})();
