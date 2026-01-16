/* ===========================================
   Dead Stone Detection
   =========================================== */

const DeadStones = (function() {
    'use strict';

    // Constants
    const EMPTY = 0;
    const BLACK = 1;
    const WHITE = 2;

    /**
     * Detect dead stones using heuristics
     * @param {Object} board - Board state
     * @returns {Set} Set of dead stone positions "x,y"
     */
    function detect(board) {
        const deadStones = new Set();
        const groups = GameEngine.getAllGroups(board);

        for (const { color, group } of groups) {
            if (isGroupDead(board, group, color)) {
                for (const pos of group) {
                    deadStones.add(pos);
                }
            }
        }

        return deadStones;
    }

    /**
     * Check if a group is likely dead
     * @param {Object} board - Board state
     * @param {Set} group - Group positions
     * @param {number} color - Group color
     * @returns {boolean} True if group appears dead
     */
    function isGroupDead(board, group, color) {
        const opponent = color === BLACK ? WHITE : BLACK;
        const liberties = GameEngine.getLiberties(board, group);

        // Groups with many liberties are alive
        if (liberties.size > 4) return false;

        // Check if completely surrounded by opponent
        if (!isCompletelySurrounded(board, group, opponent)) {
            return false;
        }

        // Check for eye potential
        const eyePotential = countEyePotential(board, group, color);

        // Need at least 2 eyes to live
        if (eyePotential >= 2) return false;

        // Small groups (1-3 stones) without eye space are likely dead
        if (group.size <= 3 && eyePotential < 2) {
            return true;
        }

        // Medium groups (4-6 stones) need more analysis
        if (group.size <= 6 && eyePotential < 2 && liberties.size <= 2) {
            return true;
        }

        // Larger groups need better heuristics
        // For now, be conservative and assume they're alive
        return false;
    }

    /**
     * Check if a group is completely surrounded by opponent stones
     * @param {Object} board - Board state
     * @param {Set} group - Group positions
     * @param {number} opponent - Opponent color
     * @returns {boolean} True if surrounded
     */
    function isCompletelySurrounded(board, group, opponent) {
        const visited = new Set(group);
        const queue = [];

        // Start from all liberties of the group
        for (const posStr of group) {
            const [x, y] = posStr.split(',').map(Number);
            for (const neighbor of GameEngine.getNeighbors(x, y, board.size)) {
                const key = `${neighbor.x},${neighbor.y}`;
                if (!visited.has(key) && board.grid[neighbor.y][neighbor.x] === EMPTY) {
                    queue.push(neighbor);
                    visited.add(key);
                }
            }
        }

        // BFS to check if we can reach the edge without hitting opponent
        while (queue.length > 0) {
            const { x, y } = queue.shift();

            // If we reach the edge through empty space, not surrounded
            if (x === 0 || x === board.size - 1 || y === 0 || y === board.size - 1) {
                // Check if this edge position is not blocked by opponent
                const edgeNeighbors = GameEngine.getNeighbors(x, y, board.size);
                let hasOpenEdge = edgeNeighbors.length < 4; // Edge of board

                if (hasOpenEdge) {
                    return false;
                }
            }

            for (const neighbor of GameEngine.getNeighbors(x, y, board.size)) {
                const key = `${neighbor.x},${neighbor.y}`;
                if (visited.has(key)) continue;

                const cell = board.grid[neighbor.y][neighbor.x];
                if (cell === EMPTY) {
                    visited.add(key);
                    queue.push(neighbor);
                }
                // If same color as the group, continue exploring
                else if (cell !== opponent) {
                    visited.add(key);
                    queue.push(neighbor);
                }
            }
        }

        // Couldn't reach edge - surrounded
        return true;
    }

    /**
     * Count potential eyes for a group
     * @param {Object} board - Board state
     * @param {Set} group - Group positions
     * @param {number} color - Group color
     * @returns {number} Number of potential eyes
     */
    function countEyePotential(board, group, color) {
        const liberties = GameEngine.getLiberties(board, group);
        let eyeCount = 0;

        // Find enclosed empty regions
        const visited = new Set();

        for (const libStr of liberties) {
            if (visited.has(libStr)) continue;

            const [x, y] = libStr.split(',').map(Number);
            const region = floodFillEmpty(board, x, y, visited);

            // Check if this region could be an eye
            if (isEyeCandidate(board, region, group, color)) {
                eyeCount++;
            }
        }

        return eyeCount;
    }

    /**
     * Flood fill to find connected empty region
     * @param {Object} board - Board state
     * @param {number} startX - Starting X
     * @param {number} startY - Starting Y
     * @param {Set} visited - Already visited positions
     * @returns {Set} Set of positions in the region
     */
    function floodFillEmpty(board, startX, startY, visited) {
        const region = new Set();
        const queue = [{ x: startX, y: startY }];

        while (queue.length > 0) {
            const { x, y } = queue.shift();
            const key = `${x},${y}`;

            if (visited.has(key)) continue;
            if (x < 0 || x >= board.size || y < 0 || y >= board.size) continue;
            if (board.grid[y][x] !== EMPTY) continue;

            visited.add(key);
            region.add(key);

            queue.push({ x: x - 1, y });
            queue.push({ x: x + 1, y });
            queue.push({ x, y: y - 1 });
            queue.push({ x, y: y + 1 });
        }

        return region;
    }

    /**
     * Check if a region could be an eye for the group
     * @param {Object} board - Board state
     * @param {Set} region - Empty region
     * @param {Set} group - The group we're checking
     * @param {number} color - Group color
     * @returns {boolean} True if could be an eye
     */
    function isEyeCandidate(board, region, group, color) {
        // Very small regions (1-2 points) surrounded by our stones are eyes
        if (region.size > 3) return false;

        // Check that all adjacent stones belong to our group (or at least same color)
        for (const posStr of region) {
            const [x, y] = posStr.split(',').map(Number);

            for (const neighbor of GameEngine.getNeighbors(x, y, board.size)) {
                const cell = board.grid[neighbor.y][neighbor.x];
                if (cell !== EMPTY && cell !== color) {
                    return false; // Adjacent to opponent
                }
            }
        }

        // For single-point eye, check diagonals (false eye detection)
        if (region.size === 1) {
            const [posStr] = [...region];
            const [x, y] = posStr.split(',').map(Number);

            const diagonals = [
                { x: x - 1, y: y - 1 },
                { x: x + 1, y: y - 1 },
                { x: x - 1, y: y + 1 },
                { x: x + 1, y: y + 1 }
            ];

            let opponentDiagonals = 0;
            let edgeDiagonals = 0;

            for (const diag of diagonals) {
                if (diag.x < 0 || diag.x >= board.size || diag.y < 0 || diag.y >= board.size) {
                    edgeDiagonals++;
                } else if (board.grid[diag.y][diag.x] !== color && board.grid[diag.y][diag.x] !== EMPTY) {
                    opponentDiagonals++;
                }
            }

            // False eye if opponent controls too many diagonals
            // At edge: 1 opponent diagonal makes false eye
            // In center: 2 opponent diagonals makes false eye
            if (edgeDiagonals > 0 && opponentDiagonals >= 1) return false;
            if (edgeDiagonals === 0 && opponentDiagonals >= 2) return false;
        }

        return true;
    }

    /**
     * Toggle dead status for all stones in the same group
     * @param {Object} board - Board state
     * @param {Set} deadStones - Current dead stones set
     * @param {number} x - Clicked X
     * @param {number} y - Clicked Y
     * @returns {Set} Updated dead stones set
     */
    function toggleGroup(board, deadStones, x, y) {
        const cell = board.grid[y][x];
        if (cell === EMPTY) return deadStones;

        const group = GameEngine.getGroup(board, x, y);
        const key = `${x},${y}`;
        const isDead = deadStones.has(key);

        const newDeadStones = new Set(deadStones);

        if (isDead) {
            // Mark group as alive
            for (const pos of group) {
                newDeadStones.delete(pos);
            }
        } else {
            // Mark group as dead
            for (const pos of group) {
                newDeadStones.add(pos);
            }
        }

        return newDeadStones;
    }

    // Public API
    return {
        detect,
        isGroupDead,
        toggleGroup
    };
})();
