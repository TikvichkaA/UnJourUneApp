/* ===========================================
   Rectangle Packer - Japanese Style Counting

   Strategy:
   1. Move isolated stones from territory centers to fill border gaps
   2. Fill small territories (1-2 pts) using stones from large territories
   3. Prefer large continuous zones over many small ones
   4. ALWAYS preserve total territory counts
   =========================================== */

const RectanglePacker = (function() {
    'use strict';

    const EMPTY = 0;
    const BLACK = 1;
    const WHITE = 2;

    /**
     * Remodel the board for easy counting
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

        // Step 4: Remodel
        const movements = [];

        // Phase 1: Fill small territories (1-2 points) with stones from large territories
        fillSmallTerritories(grid, size, movements, initialTerritories);

        // Phase 2: Move isolated center stones to fill border gaps
        for (let pass = 0; pass < 10; pass++) {
            const moved = moveIsolatedStonesToBorders(grid, size, movements, initialTerritories);
            if (moved === 0) break;
        }

        // Phase 3: Straighten borders toward rectangles
        for (let pass = 0; pass < 10; pass++) {
            const moved = straightenBorders(grid, size, movements, initialTerritories);
            if (moved === 0) break;
        }

        // Phase 4: Adjust territory sizes to multiples of 5
        for (let pass = 0; pass < 20; pass++) {
            const moved = adjustToMultiplesOf5(grid, size, movements, initialTerritories);
            if (moved === 0) break;
        }

        // Step 5: Verify
        const finalTerritories = calculateTerritoryTotals(grid, size);
        console.log('Final territories:', finalTerritories, 'Movements:', movements.length);

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
     * Get all territories grouped by color and sorted by size
     */
    function getAllTerritories(grid, size) {
        const visited = new Set();
        const territories = { [BLACK]: [], [WHITE]: [] };

        for (let y = 0; y < size; y++) {
            for (let x = 0; x < size; x++) {
                if (grid[y][x] !== EMPTY) continue;
                const key = `${x},${y}`;
                if (visited.has(key)) continue;

                const region = floodFill(grid, x, y, size, visited);
                if (region.owner !== null) {
                    territories[region.owner].push(region);
                }
            }
        }

        // Sort by size descending
        territories[BLACK].sort((a, b) => b.points.length - a.points.length);
        territories[WHITE].sort((a, b) => b.points.length - a.points.length);

        return territories;
    }

    /**
     * Fill small territories (1-2 points) using stones from large territories
     */
    function fillSmallTerritories(grid, size, movements, initialTerritories) {
        for (const color of [BLACK, WHITE]) {
            let territories = getAllTerritories(grid, size)[color];

            // Find small territories to fill
            const smallTerritories = territories.filter(t => t.points.length <= 2);
            const largeTerritories = territories.filter(t => t.points.length >= 10);

            for (const smallT of smallTerritories) {
                if (smallT.points.length === 0) continue;

                // Find a stone from a large territory that we can move
                for (const largeT of largeTerritories) {
                    // Find isolated stones in the large territory (stones inside, not on border)
                    const isolatedStones = findIsolatedStones(grid, largeT, color, size);

                    for (const stone of isolatedStones) {
                        // Try to move this stone to fill the small territory
                        for (const target of smallT.points) {
                            if (grid[target.y][target.x] !== EMPTY) continue;

                            // Try the move
                            grid[stone.y][stone.x] = EMPTY;
                            grid[target.y][target.x] = color;

                            // Check if territories are preserved
                            const newTerritories = calculateTerritoryTotals(grid, size);

                            if (newTerritories.black === initialTerritories.black &&
                                newTerritories.white === initialTerritories.white) {
                                movements.push({
                                    from: { x: stone.x, y: stone.y },
                                    to: { x: target.x, y: target.y },
                                    color
                                });
                                break;
                            } else {
                                // Revert
                                grid[target.y][target.x] = EMPTY;
                                grid[stone.y][stone.x] = color;
                            }
                        }
                    }
                }
            }
        }
    }

    /**
     * Find isolated stones inside a territory (not on the border of the territory)
     */
    function findIsolatedStones(grid, territory, color, size) {
        const isolated = [];
        const territorySet = new Set(territory.points.map(p => `${p.x},${p.y}`));

        // Find all stones adjacent to this territory
        const adjacentStones = new Set();
        for (const p of territory.points) {
            for (const n of getNeighbors(p.x, p.y, size)) {
                if (grid[n.y][n.x] === color) {
                    adjacentStones.add(`${n.x},${n.y}`);
                }
            }
        }

        // Check each adjacent stone
        for (const stoneKey of adjacentStones) {
            const [x, y] = stoneKey.split(',').map(Number);
            const neighbors = getNeighbors(x, y, size);

            // Count how many neighbors are in this territory vs other
            const inTerritory = neighbors.filter(n => territorySet.has(`${n.x},${n.y}`)).length;
            const sameColor = neighbors.filter(n => grid[n.y][n.x] === color).length;

            // Isolated = surrounded mostly by this territory (3-4 neighbors in territory)
            // or has only 1 same-color connection
            if (inTerritory >= 3 || (inTerritory >= 2 && sameColor === 1)) {
                isolated.push({ x, y, score: inTerritory });
            }
        }

        // Sort by most isolated first
        isolated.sort((a, b) => b.score - a.score);
        return isolated;
    }

    /**
     * Move isolated stones from territory centers to fill border gaps (créneaux)
     */
    function moveIsolatedStonesToBorders(grid, size, movements, initialTerritories) {
        let totalMoved = 0;

        for (const color of [BLACK, WHITE]) {
            const territories = getAllTerritories(grid, size)[color];

            for (const territory of territories) {
                if (territory.points.length < 3) continue;

                // Find isolated stones in this territory
                const isolatedStones = findIsolatedStones(grid, territory, color, size);

                // Find border gaps (créneaux) - empty cells on the edge that could be filled
                const gaps = findBorderGaps(grid, territory, color, size);

                // Move isolated stones to gaps
                for (const stone of isolatedStones) {
                    if (grid[stone.y][stone.x] !== color) continue;

                    for (const gap of gaps) {
                        if (grid[gap.y][gap.x] !== EMPTY) continue;

                        // Try the move
                        grid[stone.y][stone.x] = EMPTY;
                        grid[gap.y][gap.x] = color;

                        // Check if territories are preserved
                        const newTerritories = calculateTerritoryTotals(grid, size);

                        if (newTerritories.black === initialTerritories.black &&
                            newTerritories.white === initialTerritories.white) {
                            movements.push({
                                from: { x: stone.x, y: stone.y },
                                to: { x: gap.x, y: gap.y },
                                color
                            });
                            totalMoved++;
                            break;
                        } else {
                            // Revert
                            grid[gap.y][gap.x] = EMPTY;
                            grid[stone.y][stone.x] = color;
                        }
                    }
                }
            }
        }

        return totalMoved;
    }

    /**
     * Find border gaps (créneaux) - indentations in the territory border
     */
    function findBorderGaps(grid, territory, color, size) {
        const gaps = [];
        const territorySet = new Set(territory.points.map(p => `${p.x},${p.y}`));

        for (const p of territory.points) {
            const neighbors = getNeighbors(p.x, p.y, size);
            const colorNeighbors = neighbors.filter(n => grid[n.y][n.x] === color);
            const emptyNeighbors = neighbors.filter(n => grid[n.y][n.x] === EMPTY);
            const territoryNeighbors = neighbors.filter(n => territorySet.has(`${n.x},${n.y}`));

            // A gap is on the edge of territory (has both color neighbors and territory neighbors)
            // and would "fill in" an indentation
            if (colorNeighbors.length >= 2 && territoryNeighbors.length <= 2) {
                // Check if filling this would make the border straighter
                // (the color neighbors should be roughly aligned)
                gaps.push({ x: p.x, y: p.y, score: colorNeighbors.length * 10 - territoryNeighbors.length });
            }
        }

        // Sort by best gaps first
        gaps.sort((a, b) => b.score - a.score);
        return gaps;
    }

    /**
     * Phase 4: Adjust territory sizes to be multiples of 5
     * Transfer points between territories of the same color
     */
    function adjustToMultiplesOf5(grid, size, movements, initialTerritories) {
        let totalMoved = 0;

        for (const color of [BLACK, WHITE]) {
            const territories = getAllTerritories(grid, size)[color];
            if (territories.length < 2) continue;

            // Calculate current "badness" (distance from multiples of 5)
            const currentScore = territories.reduce((sum, t) => sum + (t.points.length % 5), 0);
            if (currentScore === 0) continue; // Already all multiples of 5

            // Find territories that need adjustment
            const needsMore = territories.filter(t => {
                const mod = t.points.length % 5;
                return mod > 0 && mod <= 2; // Needs 1-2 more to reach next multiple
            });
            const needsLess = territories.filter(t => {
                const mod = t.points.length % 5;
                return mod >= 3; // Needs to lose 1-2 to reach previous multiple
            });

            // Try to transfer from needsLess to needsMore
            for (const srcTerritory of needsLess) {
                for (const dstTerritory of needsMore) {
                    if (srcTerritory === dstTerritory) continue;

                    // Find a stone on the border of srcTerritory that we could move
                    const srcBorderStones = findBorderStonesForTransfer(grid, srcTerritory, color, size);

                    // Find empty cells in dstTerritory where we could place a stone
                    const dstEmptyCells = findEmptyCellsForTransfer(grid, dstTerritory, color, size);

                    for (const stone of srcBorderStones) {
                        if (grid[stone.y][stone.x] !== color) continue;

                        for (const target of dstEmptyCells) {
                            if (grid[target.y][target.x] !== EMPTY) continue;

                            // Try the move
                            grid[stone.y][stone.x] = EMPTY;
                            grid[target.y][target.x] = color;

                            // Check if territories are preserved AND if we improved
                            const newTerritories = calculateTerritoryTotals(grid, size);

                            if (newTerritories.black === initialTerritories.black &&
                                newTerritories.white === initialTerritories.white) {

                                // Check if this improved the multiple-of-5 score
                                const newTerrs = getAllTerritories(grid, size)[color];
                                const newScore = newTerrs.reduce((sum, t) => sum + (t.points.length % 5), 0);

                                if (newScore < currentScore) {
                                    movements.push({
                                        from: { x: stone.x, y: stone.y },
                                        to: { x: target.x, y: target.y },
                                        color
                                    });
                                    totalMoved++;
                                    return totalMoved; // Restart to recalculate territories
                                }
                            }

                            // Revert
                            grid[target.y][target.x] = EMPTY;
                            grid[stone.y][stone.x] = color;
                        }
                    }
                }
            }
        }

        return totalMoved;
    }

    /**
     * Find border stones of a territory that could be moved
     */
    function findBorderStonesForTransfer(grid, territory, color, size) {
        const stones = [];
        const territorySet = new Set(territory.points.map(p => `${p.x},${p.y}`));

        for (const p of territory.points) {
            for (const n of getNeighbors(p.x, p.y, size)) {
                if (grid[n.y][n.x] === color) {
                    const neighbors = getNeighbors(n.x, n.y, size);
                    const sameColor = neighbors.filter(nn => grid[nn.y][nn.x] === color).length;
                    const inThisTerritory = neighbors.filter(nn => territorySet.has(`${nn.x},${nn.y}`)).length;

                    // Prefer stones that are more "detachable"
                    if (sameColor >= 1 && inThisTerritory >= 1) {
                        stones.push({ x: n.x, y: n.y, score: inThisTerritory - sameColor });
                    }
                }
            }
        }

        // Remove duplicates and sort
        const unique = [...new Map(stones.map(s => [`${s.x},${s.y}`, s])).values()];
        unique.sort((a, b) => b.score - a.score);
        return unique;
    }

    /**
     * Find empty cells in a territory where we could place a stone
     */
    function findEmptyCellsForTransfer(grid, territory, color, size) {
        const cells = [];

        for (const p of territory.points) {
            const neighbors = getNeighbors(p.x, p.y, size);
            const colorNeighbors = neighbors.filter(n => grid[n.y][n.x] === color).length;

            // Prefer cells that would integrate well (more color neighbors)
            cells.push({ x: p.x, y: p.y, score: colorNeighbors });
        }

        cells.sort((a, b) => b.score - a.score);
        return cells;
    }

    /**
     * Phase 3: Straighten borders toward rectangles
     * Look for single-point bumps and dents along horizontal/vertical lines
     */
    function straightenBorders(grid, size, movements, initialTerritories) {
        let totalMoved = 0;

        for (const color of [BLACK, WHITE]) {
            const territories = getAllTerritories(grid, size)[color];

            for (const territory of territories) {
                if (territory.points.length < 5) continue;

                const territorySet = new Set(territory.points.map(p => `${p.x},${p.y}`));
                const bounds = getBoundingBox(territory.points);

                // Find bumps (stones that stick out from a straight line)
                const bumps = findBumps(grid, territory, color, size, bounds);

                // Find dents (empty cells that indent from a straight line)
                const dents = findDents(grid, territory, color, size, territorySet, bounds);

                // Try to move bumps to fill dents
                for (const bump of bumps) {
                    if (grid[bump.y][bump.x] !== color) continue;

                    for (const dent of dents) {
                        if (grid[dent.y][dent.x] !== EMPTY) continue;

                        // Try the move
                        grid[bump.y][bump.x] = EMPTY;
                        grid[dent.y][dent.x] = color;

                        // Check if territories are preserved
                        const newTerritories = calculateTerritoryTotals(grid, size);

                        if (newTerritories.black === initialTerritories.black &&
                            newTerritories.white === initialTerritories.white) {
                            movements.push({
                                from: { x: bump.x, y: bump.y },
                                to: { x: dent.x, y: dent.y },
                                color
                            });
                            totalMoved++;
                            break;
                        } else {
                            // Revert
                            grid[dent.y][dent.x] = EMPTY;
                            grid[bump.y][bump.x] = color;
                        }
                    }
                }
            }
        }

        return totalMoved;
    }

    /**
     * Find bumps - stones that stick out from the territory border
     * (stone with mostly empty neighbors on the territory side)
     */
    function findBumps(grid, territory, color, size, bounds) {
        const bumps = [];
        const territorySet = new Set(territory.points.map(p => `${p.x},${p.y}`));

        // Find border stones
        const borderStones = new Set();
        for (const p of territory.points) {
            for (const n of getNeighbors(p.x, p.y, size)) {
                if (grid[n.y][n.x] === color) {
                    borderStones.add(`${n.x},${n.y}`);
                }
            }
        }

        for (const stoneKey of borderStones) {
            const [x, y] = stoneKey.split(',').map(Number);
            const neighbors = getNeighbors(x, y, size);

            const sameColor = neighbors.filter(n => grid[n.y][n.x] === color).length;
            const inTerritory = neighbors.filter(n => territorySet.has(`${n.x},${n.y}`)).length;

            // A bump: stone with 1 same-color neighbor and 2+ territory neighbors
            // It's sticking into the territory
            if (sameColor === 1 && inTerritory >= 2) {
                bumps.push({ x, y, score: inTerritory });
            }
            // Also: stone with 2 same-color neighbors in a line, sticking out
            else if (sameColor === 2 && inTerritory >= 1) {
                const colorNeighbors = neighbors.filter(n => grid[n.y][n.x] === color);
                // Check if aligned (same row or column)
                if (colorNeighbors.length === 2) {
                    const [n1, n2] = colorNeighbors;
                    if (n1.x === n2.x || n1.y === n2.y) {
                        // Aligned - this could be a bump on a straight line
                        bumps.push({ x, y, score: inTerritory + 1 });
                    }
                }
            }
        }

        bumps.sort((a, b) => b.score - a.score);
        return bumps;
    }

    /**
     * Find dents - empty cells that are indentations in the border
     * (would make border straighter if filled)
     */
    function findDents(grid, territory, color, size, territorySet, bounds) {
        const dents = [];

        for (const p of territory.points) {
            const neighbors = getNeighbors(p.x, p.y, size);
            const colorNeighbors = neighbors.filter(n => grid[n.y][n.x] === color);
            const territoryNeighbors = neighbors.filter(n => territorySet.has(`${n.x},${n.y}`));

            // A dent: empty cell with 2+ color neighbors (would straighten border)
            if (colorNeighbors.length >= 2) {
                // Prefer dents that are more "indented" (fewer territory neighbors = more indented)
                const score = colorNeighbors.length * 10 - territoryNeighbors.length;

                // Check if filling would make a straighter line
                // (color neighbors should be roughly aligned or forming a corner)
                if (colorNeighbors.length >= 2) {
                    dents.push({ x: p.x, y: p.y, score });
                }
            }
        }

        dents.sort((a, b) => b.score - a.score);
        return dents;
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
