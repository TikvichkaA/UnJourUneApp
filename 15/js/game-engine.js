/* ===========================================
   Game Engine - Go Board Logic
   =========================================== */

const GameEngine = (function() {
    'use strict';

    // Constants
    const EMPTY = 0;
    const BLACK = 1;
    const WHITE = 2;

    /**
     * Create an empty board
     * @param {number} size - Board size (9, 13, or 19)
     * @returns {Object} Board state
     */
    function createBoard(size) {
        const grid = [];
        for (let y = 0; y < size; y++) {
            grid[y] = [];
            for (let x = 0; x < size; x++) {
                grid[y][x] = EMPTY;
            }
        }

        return {
            size,
            grid,
            prisoners: { black: 0, white: 0 }
        };
    }

    /**
     * Clone a board state
     * @param {Object} board - Board to clone
     * @returns {Object} Cloned board
     */
    function cloneBoard(board) {
        return {
            size: board.size,
            grid: board.grid.map(row => [...row]),
            prisoners: { ...board.prisoners }
        };
    }

    /**
     * Get adjacent positions (up, down, left, right)
     * @param {number} x - X coordinate
     * @param {number} y - Y coordinate
     * @param {number} size - Board size
     * @returns {Array} Adjacent positions [{x, y}, ...]
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
     * Get all stones in a connected group
     * @param {Object} board - Board state
     * @param {number} x - Starting X
     * @param {number} y - Starting Y
     * @returns {Set} Set of position strings "x,y"
     */
    function getGroup(board, x, y) {
        const color = board.grid[y][x];
        if (color === EMPTY) return new Set();

        const group = new Set();
        const queue = [{ x, y }];
        const visited = new Set();

        while (queue.length > 0) {
            const pos = queue.shift();
            const key = `${pos.x},${pos.y}`;

            if (visited.has(key)) continue;
            visited.add(key);

            if (board.grid[pos.y][pos.x] === color) {
                group.add(key);

                for (const neighbor of getNeighbors(pos.x, pos.y, board.size)) {
                    const nKey = `${neighbor.x},${neighbor.y}`;
                    if (!visited.has(nKey)) {
                        queue.push(neighbor);
                    }
                }
            }
        }

        return group;
    }

    /**
     * Count liberties for a group
     * @param {Object} board - Board state
     * @param {Set} group - Set of position strings
     * @returns {Set} Set of liberty positions
     */
    function getLiberties(board, group) {
        const liberties = new Set();

        for (const posStr of group) {
            const [x, y] = posStr.split(',').map(Number);

            for (const neighbor of getNeighbors(x, y, board.size)) {
                if (board.grid[neighbor.y][neighbor.x] === EMPTY) {
                    liberties.add(`${neighbor.x},${neighbor.y}`);
                }
            }
        }

        return liberties;
    }

    /**
     * Remove a group from the board (capture)
     * @param {Object} board - Board state
     * @param {Set} group - Group to remove
     * @returns {number} Number of stones removed
     */
    function removeGroup(board, group) {
        let count = 0;
        for (const posStr of group) {
            const [x, y] = posStr.split(',').map(Number);
            board.grid[y][x] = EMPTY;
            count++;
        }
        return count;
    }

    /**
     * Apply a move to the board
     * @param {Object} board - Board state (will be modified)
     * @param {number} color - Stone color (BLACK or WHITE)
     * @param {number} x - X coordinate
     * @param {number} y - Y coordinate
     * @returns {Object} Result { captured: number, success: boolean }
     */
    function applyMove(board, color, x, y) {
        if (x < 0 || x >= board.size || y < 0 || y >= board.size) {
            return { captured: 0, success: false };
        }

        if (board.grid[y][x] !== EMPTY) {
            return { captured: 0, success: false };
        }

        // Place stone
        board.grid[y][x] = color;

        const opponent = color === BLACK ? WHITE : BLACK;
        let totalCaptured = 0;

        // Check and remove opponent groups with no liberties
        for (const neighbor of getNeighbors(x, y, board.size)) {
            if (board.grid[neighbor.y][neighbor.x] === opponent) {
                const group = getGroup(board, neighbor.x, neighbor.y);
                const liberties = getLiberties(board, group);

                if (liberties.size === 0) {
                    const captured = removeGroup(board, group);
                    totalCaptured += captured;

                    // Track prisoners
                    if (color === BLACK) {
                        board.prisoners.black += captured;
                    } else {
                        board.prisoners.white += captured;
                    }
                }
            }
        }

        // Check if self-capture (suicide) - remove own group if no liberties
        const ownGroup = getGroup(board, x, y);
        const ownLiberties = getLiberties(board, ownGroup);

        if (ownLiberties.size === 0 && totalCaptured === 0) {
            // Suicide move - remove the placed stone
            // Note: In standard Go rules, suicide is illegal, but some rulesets allow it
            board.grid[y][x] = EMPTY;
            return { captured: 0, success: false };
        }

        return { captured: totalCaptured, success: true };
    }

    /**
     * Replay a game from moves and setup stones
     * @param {Array} moves - Array of {color, x, y} or {color, pass: true}
     * @param {Object} setupStones - {black: [], white: []}
     * @param {number} size - Board size
     * @returns {Object} Final board state
     */
    function replayGame(moves, setupStones, size) {
        const board = createBoard(size);

        // Apply setup stones
        for (const stone of setupStones.black) {
            board.grid[stone.y][stone.x] = BLACK;
        }
        for (const stone of setupStones.white) {
            board.grid[stone.y][stone.x] = WHITE;
        }

        // Replay moves
        for (const move of moves) {
            if (move.pass) continue; // Skip pass moves

            applyMove(board, move.color, move.x, move.y);
        }

        return board;
    }

    /**
     * Count stones of a color on the board
     * @param {Object} board - Board state
     * @param {number} color - Stone color
     * @returns {number} Stone count
     */
    function countStones(board, color) {
        let count = 0;
        for (let y = 0; y < board.size; y++) {
            for (let x = 0; x < board.size; x++) {
                if (board.grid[y][x] === color) {
                    count++;
                }
            }
        }
        return count;
    }

    /**
     * Get all groups on the board
     * @param {Object} board - Board state
     * @returns {Array} Array of {color, group: Set}
     */
    function getAllGroups(board) {
        const groups = [];
        const visited = new Set();

        for (let y = 0; y < board.size; y++) {
            for (let x = 0; x < board.size; x++) {
                const key = `${x},${y}`;
                if (visited.has(key)) continue;

                const color = board.grid[y][x];
                if (color === EMPTY) continue;

                const group = getGroup(board, x, y);
                for (const pos of group) {
                    visited.add(pos);
                }

                groups.push({ color, group });
            }
        }

        return groups;
    }

    // Public API
    return {
        EMPTY,
        BLACK,
        WHITE,
        createBoard,
        cloneBoard,
        getNeighbors,
        getGroup,
        getLiberties,
        removeGroup,
        applyMove,
        replayGame,
        countStones,
        getAllGroups
    };
})();
