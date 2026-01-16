/* ===========================================
   Go Score Counter - Main Application
   =========================================== */

const App = (function() {
    'use strict';

    // Constants
    const EMPTY = 0;
    const BLACK = 1;
    const WHITE = 2;

    // Application state
    const state = {
        gameInfo: null,
        board: null,
        deadStones: new Set(),
        territories: [],
        score: null,
        remodeledBoard: null,
        currentView: 'original'
    };

    // DOM Elements
    let elements = {};

    // Initialize the application
    function init() {
        cacheElements();
        bindEvents();
        console.log('Go Score Counter initialized');
    }

    // Cache DOM elements
    function cacheElements() {
        elements = {
            dropZone: document.getElementById('drop-zone'),
            fileInput: document.getElementById('file-input'),
            boardView: document.getElementById('board-view'),
            gameInfo: document.getElementById('game-info'),
            canvas: document.getElementById('board-canvas'),
            tabs: document.querySelectorAll('.tab'),

            // Info
            infoPlayers: document.getElementById('info-players'),
            infoSize: document.getElementById('info-size'),
            infoKomi: document.getElementById('info-komi'),

            // Score
            blackTerritory: document.getElementById('black-territory'),
            blackStones: document.getElementById('black-stones'),
            blackTotal: document.getElementById('black-total'),
            whiteTerritory: document.getElementById('white-territory'),
            whiteStones: document.getElementById('white-stones'),
            whiteKomi: document.getElementById('white-komi'),
            whiteTotal: document.getElementById('white-total'),
            scoreResult: document.getElementById('score-result'),
            deadCount: document.getElementById('dead-count'),

            // Buttons
            btnLoad: document.getElementById('btn-load'),
            btnPhoto: document.getElementById('btn-photo'),
            photoInput: document.getElementById('photo-input'),
            btnExport: document.getElementById('btn-export'),
            btnResetDead: document.getElementById('btn-reset-dead'),
            btnAutoDetect: document.getElementById('btn-auto-detect'),
            exportPng: document.getElementById('export-png'),
            exportSgf: document.getElementById('export-sgf'),

            // Toast
            toast: document.getElementById('toast')
        };
    }

    // Bind event listeners
    function bindEvents() {
        // File upload
        elements.dropZone.addEventListener('click', () => elements.fileInput.click());
        elements.fileInput.addEventListener('change', handleFileSelect);
        elements.btnLoad.addEventListener('click', () => elements.fileInput.click());

        // Photo upload
        elements.btnPhoto.addEventListener('click', () => showPhotoSizeDialog());
        elements.photoInput.addEventListener('change', handlePhotoSelect);

        // Drag and drop
        elements.dropZone.addEventListener('dragover', handleDragOver);
        elements.dropZone.addEventListener('dragleave', handleDragLeave);
        elements.dropZone.addEventListener('drop', handleDrop);

        // View tabs
        elements.tabs.forEach(tab => {
            tab.addEventListener('click', () => switchView(tab.dataset.view));
        });

        // Canvas click for dead stone toggle
        elements.canvas.addEventListener('click', handleCanvasClick);

        // Action buttons
        elements.btnResetDead.addEventListener('click', resetDeadStones);
        elements.btnAutoDetect.addEventListener('click', autoDetectDeadStones);

        // Export
        elements.exportPng.addEventListener('click', () => ExportService.exportPNG(elements.canvas, state.gameInfo));
        elements.exportSgf.addEventListener('click', () => ExportService.exportSGF(state.gameInfo, state.board, state.deadStones, state.score));
    }

    // Handle drag over
    function handleDragOver(e) {
        e.preventDefault();
        elements.dropZone.classList.add('drag-over');
    }

    // Handle drag leave
    function handleDragLeave(e) {
        e.preventDefault();
        elements.dropZone.classList.remove('drag-over');
    }

    // Handle file drop
    function handleDrop(e) {
        e.preventDefault();
        elements.dropZone.classList.remove('drag-over');

        const files = e.dataTransfer.files;
        if (files.length > 0) {
            loadFile(files[0]);
        }
    }

    // Handle file selection
    function handleFileSelect(e) {
        const files = e.target.files;
        if (files.length > 0) {
            loadFile(files[0]);
        }
    }

    // Load SGF file
    function loadFile(file) {
        if (!file.name.endsWith('.sgf')) {
            showToast('Veuillez selectionner un fichier SGF', 'error');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                loadSGF(e.target.result);
            } catch (err) {
                console.error('Error loading SGF:', err);
                showToast('Erreur lors du chargement du fichier: ' + err.message, 'error');
            }
        };
        reader.readAsText(file);
    }

    // Load and process SGF content
    function loadSGF(sgfContent) {
        // Parse SGF
        const gameTree = SGFParser.parse(sgfContent);
        state.gameInfo = SGFParser.getGameInfo(gameTree);

        // Replay game to get final position
        const moves = SGFParser.getMoves(gameTree);
        const setupStones = SGFParser.getSetupStones(gameTree);
        state.board = GameEngine.replayGame(moves, setupStones, state.gameInfo.size);

        // Reset dead stones
        state.deadStones = new Set();

        // Auto-detect dead stones
        state.deadStones = DeadStones.detect(state.board);

        // Calculate territories and score
        recalculateScore();

        // Update UI
        showBoardView();
        updateGameInfo();
        render();

        elements.btnExport.disabled = false;
        showToast('Partie chargee avec succes', 'success');
    }

    // Show board view, hide drop zone
    function showBoardView() {
        elements.dropZone.style.display = 'none';
        elements.boardView.style.display = 'flex';
        elements.gameInfo.style.display = 'flex';
    }

    // Update game info display
    function updateGameInfo() {
        const info = state.gameInfo;
        elements.infoPlayers.textContent = `${info.blackPlayer || 'Noir'} vs ${info.whitePlayer || 'Blanc'}`;
        elements.infoSize.textContent = `${info.size}x${info.size}`;
        elements.infoKomi.textContent = `Komi: ${info.komi}`;
    }

    // Recalculate territories and score
    function recalculateScore() {
        // Find territories
        state.territories = Territory.findTerritories(state.board, state.deadStones);

        // Calculate score
        state.score = Territory.calculateScore(state.board, state.territories, state.deadStones, state.gameInfo.komi);

        // Generate remodeled board
        state.remodeledBoard = RectanglePacker.remodel(state.territories, state.board, state.score, state.deadStones);

        // Update score display
        updateScoreDisplay();
    }

    // Update score display
    function updateScoreDisplay() {
        const score = state.score;

        elements.blackTerritory.textContent = score.black.territory;
        elements.blackStones.textContent = score.black.stones;
        elements.blackTotal.textContent = score.black.total;

        elements.whiteTerritory.textContent = score.white.territory;
        elements.whiteStones.textContent = score.white.stones;
        elements.whiteKomi.textContent = score.white.komi;
        elements.whiteTotal.textContent = score.white.total;

        elements.deadCount.textContent = state.deadStones.size;

        // Result
        const diff = score.black.total - score.white.total;
        let resultText;
        if (diff > 0) {
            resultText = `Noir gagne de ${diff} points`;
        } else if (diff < 0) {
            resultText = `Blanc gagne de ${Math.abs(diff)} points`;
        } else {
            resultText = 'Egalite';
        }
        elements.scoreResult.innerHTML = `<span class="result-text result-winner">${resultText}</span>`;
    }

    // Switch between original and remodeled view
    function switchView(view) {
        state.currentView = view;

        // Update tab states
        elements.tabs.forEach(tab => {
            tab.classList.toggle('active', tab.dataset.view === view);
        });

        render();
    }

    // Render current view
    function render() {
        if (!state.board) return;

        if (state.currentView === 'original') {
            BoardRenderer.render(elements.canvas, state.board, state.territories, state.deadStones);
        } else {
            RemodelRenderer.render(elements.canvas, state.remodeledBoard, state.score);
        }
    }

    // Handle canvas click for dead stone toggle
    function handleCanvasClick(e) {
        if (!state.board || state.currentView !== 'original') return;

        const rect = elements.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const coords = BoardRenderer.canvasToBoardCoords(x, y, state.board.size, elements.canvas);
        if (!coords) return;

        const cell = state.board.grid[coords.y][coords.x];
        if (cell === EMPTY) return; // Can only toggle stones

        // Get the entire connected group
        const group = GameEngine.getGroup(state.board, coords.x, coords.y);

        // Check if any stone in the group is already marked dead
        const key = `${coords.x},${coords.y}`;
        const isCurrentlyDead = state.deadStones.has(key);

        // Toggle the entire group
        for (const posKey of group) {
            if (isCurrentlyDead) {
                state.deadStones.delete(posKey);
            } else {
                state.deadStones.add(posKey);
            }
        }

        recalculateScore();
        render();
    }

    // Reset dead stones
    function resetDeadStones() {
        state.deadStones = new Set();
        recalculateScore();
        render();
        showToast('Pierres mortes reinitialisees', 'success');
    }

    // Auto-detect dead stones
    function autoDetectDeadStones() {
        state.deadStones = DeadStones.detect(state.board);
        recalculateScore();
        render();
        showToast(`${state.deadStones.size} pierres mortes detectees`, 'success');
    }

    // Show photo size dialog
    function showPhotoSizeDialog() {
        const overlay = document.createElement('div');
        overlay.id = 'size-dialog-overlay';
        overlay.style.cssText = `
            position: fixed; top: 0; left: 0; right: 0; bottom: 0;
            background: rgba(0,0,0,0.8); z-index: 1500;
            display: flex; align-items: center; justify-content: center;
        `;
        overlay.innerHTML = `
            <div style="background: var(--bg-secondary); padding: 24px; border-radius: 12px; text-align: center;">
                <h3 style="margin-bottom: 16px;">Taille du plateau</h3>
                <div class="size-selector">
                    <button class="size-btn" data-size="9">9×9</button>
                    <button class="size-btn" data-size="13">13×13</button>
                    <button class="size-btn active" data-size="19">19×19</button>
                </div>
                <div style="margin-top: 20px; display: flex; gap: 8px; justify-content: center;">
                    <button id="size-cancel" class="btn btn-outline">Annuler</button>
                    <button id="size-confirm" class="btn btn-primary">Choisir photo</button>
                </div>
            </div>
        `;
        document.body.appendChild(overlay);

        let selectedSize = 19;

        overlay.querySelectorAll('.size-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                overlay.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                selectedSize = parseInt(btn.dataset.size);
            });
        });

        document.getElementById('size-cancel').addEventListener('click', () => overlay.remove());
        document.getElementById('size-confirm').addEventListener('click', () => {
            overlay.remove();
            state.pendingPhotoSize = selectedSize;
            elements.photoInput.click();
        });
    }

    // Handle photo selection
    function handlePhotoSelect(e) {
        const files = e.target.files;
        if (files.length > 0) {
            const size = state.pendingPhotoSize || 19;
            loadPhoto(files[0], size);
        }
        // Reset input
        e.target.value = '';
    }

    // Load and analyze photo
    function loadPhoto(file, boardSize) {
        showToast('Chargement de la photo...', 'info');

        PhotoAnalyzer.analyze(file, boardSize, (result) => {
            if (result && result.grid) {
                // Create board object from photo result
                state.gameInfo = {
                    size: result.size,
                    komi: 6.5,
                    handicap: 0,
                    blackPlayer: 'Photo',
                    whitePlayer: 'Analyse',
                    result: '',
                    rules: 'Japanese'
                };

                state.board = {
                    size: result.size,
                    grid: result.grid,
                    prisoners: { black: 0, white: 0 }
                };

                // Reset dead stones
                state.deadStones = new Set();

                // Auto-detect dead stones
                state.deadStones = DeadStones.detect(state.board);

                // Calculate territories and score
                recalculateScore();

                // Update UI
                showBoardView();
                updateGameInfo();
                render();

                elements.btnExport.disabled = false;
                showToast('Photo analysee avec succes', 'success');
            } else {
                showToast('Erreur lors de l\'analyse de la photo', 'error');
            }
        });
    }

    // Show toast notification
    function showToast(message, type = 'info') {
        elements.toast.textContent = message;
        elements.toast.className = 'toast show ' + type;

        setTimeout(() => {
            elements.toast.classList.remove('show');
        }, 3000);
    }

    // Public API
    return {
        init,
        EMPTY,
        BLACK,
        WHITE
    };
})();

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', App.init);
