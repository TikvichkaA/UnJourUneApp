/* ===========================================
   SGF Parser - Smart Game Format Parser
   =========================================== */

const SGFParser = (function() {
    'use strict';

    /**
     * Parse SGF text into a game tree structure
     * @param {string} sgfText - Raw SGF content
     * @returns {Object} Game tree with nodes
     */
    function parse(sgfText) {
        const cleaned = sgfText.trim();
        if (!cleaned.startsWith('(') || !cleaned.endsWith(')')) {
            throw new Error('Format SGF invalide: doit commencer par ( et finir par )');
        }

        let pos = 0;

        function parseTree() {
            const tree = { nodes: [], variations: [] };

            if (cleaned[pos] !== '(') {
                throw new Error('Arbre attendu a la position ' + pos);
            }
            pos++; // Skip '('

            // Parse nodes
            while (pos < cleaned.length && cleaned[pos] !== ')') {
                skipWhitespace();

                if (cleaned[pos] === ';') {
                    tree.nodes.push(parseNode());
                } else if (cleaned[pos] === '(') {
                    tree.variations.push(parseTree());
                } else if (cleaned[pos] === ')') {
                    break;
                } else {
                    pos++; // Skip unexpected character
                }
            }

            if (cleaned[pos] === ')') {
                pos++; // Skip ')'
            }

            return tree;
        }

        function parseNode() {
            const node = {};
            pos++; // Skip ';'
            skipWhitespace();

            while (pos < cleaned.length && cleaned[pos] !== ';' && cleaned[pos] !== '(' && cleaned[pos] !== ')') {
                skipWhitespace();

                // Parse property identifier
                let propId = '';
                while (pos < cleaned.length && /[A-Z]/.test(cleaned[pos])) {
                    propId += cleaned[pos];
                    pos++;
                }

                if (!propId) break;

                // Parse property values
                const values = [];
                while (pos < cleaned.length && cleaned[pos] === '[') {
                    pos++; // Skip '['
                    let value = '';
                    let escaped = false;

                    while (pos < cleaned.length) {
                        const char = cleaned[pos];

                        if (escaped) {
                            value += char;
                            escaped = false;
                        } else if (char === '\\') {
                            escaped = true;
                        } else if (char === ']') {
                            pos++; // Skip ']'
                            break;
                        } else {
                            value += char;
                        }
                        pos++;
                    }

                    values.push(value);
                }

                // Store property
                if (values.length === 1) {
                    node[propId] = values[0];
                } else if (values.length > 1) {
                    node[propId] = values;
                }

                skipWhitespace();
            }

            return node;
        }

        function skipWhitespace() {
            while (pos < cleaned.length && /\s/.test(cleaned[pos])) {
                pos++;
            }
        }

        return parseTree();
    }

    /**
     * Extract game information from parsed tree
     * @param {Object} tree - Parsed game tree
     * @returns {Object} Game info
     */
    function getGameInfo(tree) {
        const root = tree.nodes[0] || {};

        return {
            size: parseInt(root.SZ || '19', 10),
            komi: parseFloat(root.KM || '6.5'),
            handicap: parseInt(root.HA || '0', 10),
            blackPlayer: root.PB || 'Noir',
            whitePlayer: root.PW || 'Blanc',
            result: root.RE || '',
            rules: root.RU || 'Japanese',
            date: root.DT || '',
            event: root.EV || '',
            gameName: root.GN || ''
        };
    }

    /**
     * Extract moves from parsed tree (main line only)
     * @param {Object} tree - Parsed game tree
     * @returns {Array} Array of move objects {color, x, y}
     */
    function getMoves(tree) {
        const moves = [];
        const size = parseInt((tree.nodes[0] || {}).SZ || '19', 10);

        // Process all nodes in main line
        for (const node of tree.nodes) {
            if (node.B !== undefined) {
                const coords = sgfCoordToXY(node.B, size);
                if (coords) {
                    moves.push({ color: 1, ...coords }); // BLACK = 1
                } else if (node.B === '' || node.B === 'tt') {
                    moves.push({ color: 1, pass: true }); // Pass move
                }
            }
            if (node.W !== undefined) {
                const coords = sgfCoordToXY(node.W, size);
                if (coords) {
                    moves.push({ color: 2, ...coords }); // WHITE = 2
                } else if (node.W === '' || node.W === 'tt') {
                    moves.push({ color: 2, pass: true }); // Pass move
                }
            }
        }

        return moves;
    }

    /**
     * Extract setup stones (AB, AW, AE) from parsed tree
     * @param {Object} tree - Parsed game tree
     * @returns {Object} Setup stones {black: [], white: [], empty: []}
     */
    function getSetupStones(tree) {
        const setup = { black: [], white: [], empty: [] };
        const root = tree.nodes[0] || {};
        const size = parseInt(root.SZ || '19', 10);

        // Process AB (Add Black)
        if (root.AB) {
            const stones = Array.isArray(root.AB) ? root.AB : [root.AB];
            for (const coord of stones) {
                const xy = sgfCoordToXY(coord, size);
                if (xy) setup.black.push(xy);
            }
        }

        // Process AW (Add White)
        if (root.AW) {
            const stones = Array.isArray(root.AW) ? root.AW : [root.AW];
            for (const coord of stones) {
                const xy = sgfCoordToXY(coord, size);
                if (xy) setup.white.push(xy);
            }
        }

        // Process AE (Add Empty)
        if (root.AE) {
            const points = Array.isArray(root.AE) ? root.AE : [root.AE];
            for (const coord of points) {
                const xy = sgfCoordToXY(coord, size);
                if (xy) setup.empty.push(xy);
            }
        }

        return setup;
    }

    /**
     * Convert SGF coordinate to x,y
     * SGF uses 'aa' = top-left (0,0), 'ss' = (18,18) for 19x19
     * @param {string} coord - SGF coordinate (e.g., 'pd')
     * @param {number} size - Board size
     * @returns {Object|null} {x, y} or null if invalid
     */
    function sgfCoordToXY(coord, size) {
        if (!coord || coord.length < 2) return null;

        const x = coord.charCodeAt(0) - 97; // 'a' = 0
        const y = coord.charCodeAt(1) - 97;

        if (x < 0 || x >= size || y < 0 || y >= size) {
            return null;
        }

        return { x, y };
    }

    /**
     * Convert x,y to SGF coordinate
     * @param {number} x - X coordinate (0-based)
     * @param {number} y - Y coordinate (0-based)
     * @returns {string} SGF coordinate
     */
    function xyToSgfCoord(x, y) {
        return String.fromCharCode(97 + x) + String.fromCharCode(97 + y);
    }

    /**
     * Generate SGF content from board state
     * @param {Object} gameInfo - Game information
     * @param {Object} board - Board state
     * @param {Set} deadStones - Dead stones set
     * @param {Object} score - Score object
     * @returns {string} SGF content
     */
    function generateSGF(gameInfo, board, deadStones, score) {
        let sgf = '(;GM[1]FF[4]CA[UTF-8]\n';
        sgf += `SZ[${board.size}]\n`;
        sgf += `KM[${gameInfo.komi}]\n`;

        if (gameInfo.blackPlayer) sgf += `PB[${gameInfo.blackPlayer}]\n`;
        if (gameInfo.whitePlayer) sgf += `PW[${gameInfo.whitePlayer}]\n`;

        // Add stones as setup
        const blackStones = [];
        const whiteStones = [];

        for (let y = 0; y < board.size; y++) {
            for (let x = 0; x < board.size; x++) {
                const key = `${x},${y}`;
                if (deadStones.has(key)) continue; // Skip dead stones

                const cell = board.grid[y][x];
                if (cell === 1) { // BLACK
                    blackStones.push(xyToSgfCoord(x, y));
                } else if (cell === 2) { // WHITE
                    whiteStones.push(xyToSgfCoord(x, y));
                }
            }
        }

        if (blackStones.length > 0) {
            sgf += 'AB' + blackStones.map(c => `[${c}]`).join('') + '\n';
        }
        if (whiteStones.length > 0) {
            sgf += 'AW' + whiteStones.map(c => `[${c}]`).join('') + '\n';
        }

        // Add comment with score
        const winner = score.black.total > score.white.total ? 'Noir' : 'Blanc';
        const margin = Math.abs(score.black.total - score.white.total);
        sgf += `C[Position finale avec comptage humain\\n`;
        sgf += `Noir: ${score.black.total} points (territoire: ${score.black.territory}, pierres: ${score.black.stones})\\n`;
        sgf += `Blanc: ${score.white.total} points (territoire: ${score.white.territory}, pierres: ${score.white.stones}, komi: ${score.white.komi})\\n`;
        sgf += `${winner} gagne de ${margin} points]\n`;

        sgf += ')';
        return sgf;
    }

    // Public API
    return {
        parse,
        getGameInfo,
        getMoves,
        getSetupStones,
        sgfCoordToXY,
        xyToSgfCoord,
        generateSGF
    };
})();
