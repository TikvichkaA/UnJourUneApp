/* ===========================================
   Territory Detection and Scoring
   =========================================== */

const Territory = (function() {
    'use strict';

    // Constants
    const EMPTY = 0;
    const BLACK = 1;
    const WHITE = 2;
    const NEUTRAL = 0;

    /**
     * Find all territories on the board
     * @param {Object} board - Board state
     * @param {Set} deadStones - Set of dead stone positions "x,y"
     * @returns {Array} Array of territory objects
     */
    function findTerritories(board, deadStones) {
        const territories = [];
        const visited = new Set();
        let territoryId = 0;

        // Create effective board (treating dead stones as empty)
        const effectiveGrid = board.grid.map((row, y) =>
            row.map((cell, x) => {
                if (deadStones.has(`${x},${y}`)) return EMPTY;
                return cell;
            })
        );

        for (let y = 0; y < board.size; y++) {
            for (let x = 0; x < board.size; x++) {
                const key = `${x},${y}`;
                if (visited.has(key)) continue;
                if (effectiveGrid[y][x] !== EMPTY) continue;

                // Found an empty point - flood fill to find territory
                const territory = floodFillTerritory(effectiveGrid, x, y, board.size, visited);

                if (territory.points.length > 0) {
                    territory.id = territoryId++;
                    territory.owner = determineOwner(territory, effectiveGrid, board.size);
                    territories.push(territory);
                }
            }
        }

        return territories;
    }

    /**
     * Flood fill to find connected empty region
     * @param {Array} grid - Effective grid
     * @param {number} startX - Starting X
     * @param {number} startY - Starting Y
     * @param {number} size - Board size
     * @param {Set} visited - Already visited positions
     * @returns {Object} Territory with points and adjacent colors
     */
    function floodFillTerritory(grid, startX, startY, size, visited) {
        const points = [];
        const adjacentColors = new Set();
        const queue = [{ x: startX, y: startY }];

        let minX = startX, maxX = startX;
        let minY = startY, maxY = startY;

        while (queue.length > 0) {
            const { x, y } = queue.shift();
            const key = `${x},${y}`;

            if (visited.has(key)) continue;
            if (x < 0 || x >= size || y < 0 || y >= size) continue;

            const cell = grid[y][x];

            if (cell === EMPTY) {
                visited.add(key);
                points.push({ x, y });

                // Update bounds
                minX = Math.min(minX, x);
                maxX = Math.max(maxX, x);
                minY = Math.min(minY, y);
                maxY = Math.max(maxY, y);

                // Add neighbors to queue
                queue.push({ x: x - 1, y });
                queue.push({ x: x + 1, y });
                queue.push({ x, y: y - 1 });
                queue.push({ x, y: y + 1 });
            } else {
                // Adjacent stone
                adjacentColors.add(cell);
            }
        }

        return {
            points,
            adjacentColors,
            bounds: { minX, maxX, minY, maxY },
            area: points.length
        };
    }

    /**
     * Determine the owner of a territory
     * @param {Object} territory - Territory object
     * @param {Array} grid - Effective grid
     * @param {number} size - Board size
     * @returns {number} Owner (BLACK, WHITE, or NEUTRAL)
     */
    function determineOwner(territory, grid, size) {
        const { adjacentColors } = territory;

        // If only touches one color, it belongs to that color
        if (adjacentColors.size === 1) {
            return adjacentColors.has(BLACK) ? BLACK : WHITE;
        }

        // If touches both colors (or neither), it's neutral/dame
        return NEUTRAL;
    }

    /**
     * Calculate the score (Chinese/Area scoring)
     * @param {Object} board - Board state
     * @param {Array} territories - Array of territories
     * @param {Set} deadStones - Dead stones
     * @param {number} komi - Komi value
     * @returns {Object} Score breakdown
     */
    function calculateScore(board, territories, deadStones, komi) {
        let blackTerritory = 0;
        let whiteTerritory = 0;
        let blackStones = 0;
        let whiteStones = 0;

        // Count territory points
        for (const territory of territories) {
            if (territory.owner === BLACK) {
                blackTerritory += territory.area;
            } else if (territory.owner === WHITE) {
                whiteTerritory += territory.area;
            }
        }

        // Count living stones (excluding dead stones)
        for (let y = 0; y < board.size; y++) {
            for (let x = 0; x < board.size; x++) {
                const key = `${x},${y}`;
                if (deadStones.has(key)) continue;

                const cell = board.grid[y][x];
                if (cell === BLACK) blackStones++;
                else if (cell === WHITE) whiteStones++;
            }
        }

        // Dead stones count as territory for opponent (area scoring)
        for (const key of deadStones) {
            const [x, y] = key.split(',').map(Number);
            const cell = board.grid[y][x];
            if (cell === BLACK) whiteTerritory++;
            else if (cell === WHITE) blackTerritory++;
        }

        const blackTotal = blackTerritory + blackStones;
        const whiteTotal = whiteTerritory + whiteStones + komi;

        return {
            black: {
                territory: blackTerritory,
                stones: blackStones,
                total: blackTotal
            },
            white: {
                territory: whiteTerritory,
                stones: whiteStones,
                komi: komi,
                total: whiteTotal
            },
            winner: blackTotal > whiteTotal ? 'B' : (blackTotal < whiteTotal ? 'W' : 'Tie'),
            margin: Math.abs(blackTotal - whiteTotal)
        };
    }

    /**
     * Get neutral points (dame)
     * @param {Array} territories - Array of territories
     * @returns {Array} Array of neutral point positions
     */
    function getNeutralPoints(territories) {
        const neutral = [];
        for (const territory of territories) {
            if (territory.owner === NEUTRAL) {
                neutral.push(...territory.points);
            }
        }
        return neutral;
    }

    // Public API
    return {
        EMPTY,
        BLACK,
        WHITE,
        NEUTRAL,
        findTerritories,
        calculateScore,
        getNeutralPoints
    };
})();
