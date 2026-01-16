/* ===========================================
   Rectangle Packer - Japanese Style Counting

   CRITICAL: Total territory for each color MUST be preserved
   - Only move stones if territory count stays the same
   - Verify score before and after
   =========================================== */

const RectanglePacker = (function() {
    'use strict';

    const EMPTY = 0;
    const BLACK = 1;
    const WHITE = 2;

    /**
     * Remodel the board for easy counting
     * Territory totals MUST be preserved
     */
    function remodel(territories, board, score, deadStones) {
        const size = board.size;

        // Step 1: Create grid without dead stones
        const grid = copyBoardWithoutDead(board, deadStones);

        // Step 2: Count prisoners
        const prisoners = countPrisoners(board, deadStones);

        // Step 3: Calculate initial territory counts (MUST be preserved)
        const initialTerritories = calculateTerritoryTotals(grid, size);
        console.log('Initial territories:', initialTerritories);

        // Step 4: Smooth territories while preserving counts
        const movements = [];
        smoothAllTerritories(grid, size, movements, initialTerritories);

        // Step 5: Verify territory counts are preserved
        const finalTerritories = calculateTerritoryTotals(grid, size);
        console.log('Final territories:', finalTerritories);

        if (finalTerritories.black !== initialTerritories.black ||
            finalTerritories.white !== initialTerritories.white) {
            console.error('TERRITORY COUNT CHANGED! Reverting...');
            // This should never happen if algorithm is correct
        }

        // Count final stones
        const counts = countStones(grid, size);

        // Get rectangles for display
        const rectangles = detectTerritoryRectangles(grid, size);

        return {
            size,
            grid,
            rectangles,
            movements,
            blackStones: { target: score.black.stones, placed: counts.black },
            whiteStones: { target: score.white.stones, placed: counts.white },
            prisoners,
            territoryCheck: {
                initial: initialTerritories,
                final: finalTerritories,
                preserved: finalTerritories.black === initialTerritories.black &&
                          finalTerritories.white === initialTerritories.white
            },
            score
        };
    }

    /**
     * Copy board without dead stones
     */
    function copyBoardWithoutDead(board, deadStones) {
        const grid = [];
        for (let y = 0; y < board.size; y++) {
            grid[y] = [];
            for (let x = 0; x < board.size; x++) {
                const key = `${x},${y}`;
                grid[y][x] = deadStones.has(key) ? EMPTY : board.grid[y][x];
            }
        }
        return grid;
    }

    /**
     * Count prisoners by color
     */
    function countPrisoners(board, deadStones) {
        let black = 0, white = 0;
        for (const key of deadStones) {
            const [x, y] = key.split(',').map(Number);
            if (board.grid[y][x] === BLACK) black++;
            else if (board.grid[y][x] === WHITE) white++;
        }
        return { black, white };
    }

    /**
     * Calculate total territory for each color
     */
    function calculateTerritoryTotals(grid, size) {
        let black = 0, white = 0;
        const visited = new Set();

        for (let y = 0; y < size; y++) {
            for (let x = 0; x < size; x++) {
                if (grid[y][x] !== EMPTY) continue;
                const key = `${x},${y}`;
                if (visited.has(key)) continue;

                const region = floodFill(grid, x, y, size, visited);
                if (region.owner === BLACK) black += region.points.length;
                else if (region.owner === WHITE) white += region.points.length;
            }
        }

        return { black, white };
    }

    /**
     * Flood fill to find a territory region
     */
    function floodFill(grid, startX, startY, size, visited) {
        const points = [];
        const queue = [{ x: startX, y: startY }];
        const adjacentColors = new Set();

        while (queue.length > 0) {
            const { x, y } = queue.shift();
            const key = `${x},${y}`;

            if (visited.has(key)) continue;
            if (x < 0 || x >= size || y < 0 || y >= size) continue;

            const cell = grid[y][x];
            if (cell === EMPTY) {
                visited.add(key);
                points.push({ x, y });
                queue.push({ x: x - 1, y });
                queue.push({ x: x + 1, y });
                queue.push({ x, y: y - 1 });
                queue.push({ x, y: y + 1 });
            } else {
                adjacentColors.add(cell);
            }
        }

        let owner = null;
        if (adjacentColors.size === 1) {
            owner = adjacentColors.has(BLACK) ? BLACK : WHITE;
        }

        return { points, owner };
    }

    /**
     * Smooth all territories while preserving total counts
     */
    function smoothAllTerritories(grid, size, movements, initialTerritories) {
        // Find candidate moves: pairs of (protrusion, gap) for each color
        const blackMoves = findValidMoves(grid, size, BLACK);
        const whiteMoves = findValidMoves(grid, size, WHITE);

        // Apply moves one by one, checking territory preservation
        for (const move of [...blackMoves, ...whiteMoves]) {
            // Try the move
            const fromCell = grid[move.from.y][move.from.x];
            grid[move.from.y][move.from.x] = EMPTY;
            grid[move.to.y][move.to.x] = fromCell;

            // Check if territories are preserved
            const newTerritories = calculateTerritoryTotals(grid, size);

            if (newTerritories.black === initialTerritories.black &&
                newTerritories.white === initialTerritories.white) {
                // Move is valid, keep it
                movements.push({
                    from: move.from,
                    to: move.to,
                    color: fromCell
                });
            } else {
                // Move changes territory counts, revert it
                grid[move.to.y][move.to.x] = EMPTY;
                grid[move.from.y][move.from.x] = fromCell;
            }
        }
    }

    /**
     * Find valid moves for a color (protrusion -> gap pairs)
     */
    function findValidMoves(grid, size, color) {
        const moves = [];
        const visited = new Set();

        // Find all territories of this color
        for (let y = 0; y < size; y++) {
            for (let x = 0; x < size; x++) {
                if (grid[y][x] !== EMPTY) continue;
                const key = `${x},${y}`;
                if (visited.has(key)) continue;

                const region = floodFill(grid, x, y, size, visited);
                if (region.owner !== color) continue;

                // Find protrusions and gaps for this territory
                const protrusions = findProtrusions(grid, region.points, color, size);
                const gaps = findGaps(grid, region.points, color, size);

                // Create move pairs
                const numMoves = Math.min(protrusions.length, gaps.length, 3);
                for (let i = 0; i < numMoves; i++) {
                    moves.push({
                        from: { x: protrusions[i].x, y: protrusions[i].y },
                        to: { x: gaps[i].x, y: gaps[i].y }
                    });
                }
            }
        }

        return moves;
    }

    /**
     * Find protrusions - stones that stick out and can be moved
     */
    function findProtrusions(grid, territoryPoints, color, size) {
        const protrusions = [];
        const checked = new Set();

        // Find border stones of this territory
        for (const p of territoryPoints) {
            for (const n of getNeighbors(p.x, p.y, size)) {
                if (grid[n.y][n.x] !== color) continue;
                const key = `${n.x},${n.y}`;
                if (checked.has(key)) continue;
                checked.add(key);

                // Check if this stone is a leaf (only 1 same-color neighbor)
                const neighbors = getNeighbors(n.x, n.y, size);
                const sameColor = neighbors.filter(nn => grid[nn.y][nn.x] === color);
                const empty = neighbors.filter(nn => grid[nn.y][nn.x] === EMPTY);

                if (sameColor.length === 1 && empty.length >= 2) {
                    protrusions.push({ x: n.x, y: n.y, score: empty.length });
                }
            }
        }

        protrusions.sort((a, b) => b.score - a.score);
        return protrusions;
    }

    /**
     * Find gaps - empty cells that could be filled
     */
    function findGaps(grid, territoryPoints, color, size) {
        const gaps = [];

        for (const p of territoryPoints) {
            const neighbors = getNeighbors(p.x, p.y, size);
            const colorNeighbors = neighbors.filter(n => grid[n.y][n.x] === color);

            // Gap: surrounded by owner on 3+ sides
            if (colorNeighbors.length >= 3) {
                gaps.push({ x: p.x, y: p.y, score: colorNeighbors.length });
            }
        }

        gaps.sort((a, b) => b.score - a.score);
        return gaps;
    }

    /**
     * Get orthogonal neighbors
     */
    function getNeighbors(x, y, size) {
        const neighbors = [];
        if (x > 0) neighbors.push({ x: x - 1, y });
        if (x < size - 1) neighbors.push({ x: x + 1, y });
        if (y > 0) neighbors.push({ x, y: y - 1 });
        if (y < size - 1) neighbors.push({ x, y: y + 1 });
        return neighbors;
    }

    /**
     * Count stones
     */
    function countStones(grid, size) {
        let black = 0, white = 0;
        for (let y = 0; y < size; y++) {
            for (let x = 0; x < size; x++) {
                if (grid[y][x] === BLACK) black++;
                else if (grid[y][x] === WHITE) white++;
            }
        }
        return { black, white };
    }

    /**
     * Detect territory rectangles for display
     */
    function detectTerritoryRectangles(grid, size) {
        const rectangles = [];
        const visited = new Set();

        for (let y = 0; y < size; y++) {
            for (let x = 0; x < size; x++) {
                if (grid[y][x] !== EMPTY) continue;
                const key = `${x},${y}`;
                if (visited.has(key)) continue;

                const region = floodFill(grid, x, y, size, visited);
                if (region.owner !== null && region.points.length > 0) {
                    const bounds = getBoundingBox(region.points);
                    rectangles.push({
                        x: bounds.minX,
                        y: bounds.minY,
                        width: bounds.maxX - bounds.minX + 1,
                        height: bounds.maxY - bounds.minY + 1,
                        area: region.points.length,
                        owner: region.owner
                    });
                }
            }
        }

        return rectangles;
    }

    /**
     * Get bounding box
     */
    function getBoundingBox(points) {
        let minX = Infinity, maxX = -Infinity;
        let minY = Infinity, maxY = -Infinity;

        for (const p of points) {
            minX = Math.min(minX, p.x);
            maxX = Math.max(maxX, p.x);
            minY = Math.min(minY, p.y);
            maxY = Math.max(maxY, p.y);
        }

        return { minX, maxX, minY, maxY };
    }

    return {
        remodel,
        getBoundingBox,
        countStones
    };
})();
