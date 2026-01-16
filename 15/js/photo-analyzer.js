/* ===========================================
   Photo Analyzer - Detect Go position from photo

   Semi-automatic approach:
   1. User marks 4 corners of the board
   2. Perspective correction
   3. Analyze each intersection for stones
   =========================================== */

const PhotoAnalyzer = (function() {
    'use strict';

    const EMPTY = 0;
    const BLACK = 1;
    const WHITE = 2;

    let sourceImage = null;
    let corners = []; // 4 corners marked by user
    let boardSize = 19;
    let onComplete = null;
    let detectedGrid = null; // Grid after detection, for correction mode

    /**
     * Start photo analysis workflow
     * @param {File} imageFile - Image file
     * @param {number} size - Board size (9, 13, 19)
     * @param {Function} callback - Called with result {grid, size}
     */
    function analyze(imageFile, size, callback) {
        boardSize = size;
        onComplete = callback;
        corners = [];

        // Load image
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                sourceImage = img;
                showCornerSelector(img);
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(imageFile);
    }

    /**
     * Show the corner selection UI
     */
    function showCornerSelector(img) {
        // Create modal overlay
        const overlay = document.createElement('div');
        overlay.id = 'photo-overlay';
        overlay.innerHTML = `
            <div class="photo-modal">
                <div class="photo-header">
                    <h2>Sélectionnez les 4 coins du plateau</h2>
                    <p>Cliquez dans l'ordre : haut-gauche, haut-droite, bas-droite, bas-gauche</p>
                    <div class="corner-status">
                        <span class="corner-dot" data-index="0">1</span>
                        <span class="corner-dot" data-index="1">2</span>
                        <span class="corner-dot" data-index="2">3</span>
                        <span class="corner-dot" data-index="3">4</span>
                    </div>
                </div>
                <div class="photo-canvas-container">
                    <canvas id="photo-canvas"></canvas>
                </div>
                <div class="photo-actions">
                    <button id="photo-cancel" class="btn btn-outline">Annuler</button>
                    <button id="photo-reset" class="btn btn-outline">Réinitialiser</button>
                    <button id="photo-confirm" class="btn btn-primary" disabled>Analyser</button>
                </div>
            </div>
        `;
        document.body.appendChild(overlay);

        // Setup canvas
        const canvas = document.getElementById('photo-canvas');
        const ctx = canvas.getContext('2d');

        // Scale image to fit
        const maxWidth = window.innerWidth * 0.8;
        const maxHeight = window.innerHeight * 0.6;
        const scale = Math.min(maxWidth / img.width, maxHeight / img.height, 1);

        canvas.width = img.width * scale;
        canvas.height = img.height * scale;

        // Draw image
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        // Store scale for coordinate conversion
        canvas.dataset.scale = scale;

        // Event listeners
        canvas.addEventListener('click', handleCanvasClick);
        document.getElementById('photo-cancel').addEventListener('click', closeModal);
        document.getElementById('photo-reset').addEventListener('click', () => resetCorners(ctx, img, scale));
        document.getElementById('photo-confirm').addEventListener('click', () => processImage(ctx, img, scale));
    }

    /**
     * Handle click on canvas to mark corner
     */
    function handleCanvasClick(e) {
        if (corners.length >= 4) return;

        const canvas = e.target;
        const rect = canvas.getBoundingClientRect();
        const scale = parseFloat(canvas.dataset.scale);

        const x = (e.clientX - rect.left) / scale;
        const y = (e.clientY - rect.top) / scale;

        corners.push({ x, y });

        // Update UI
        const dots = document.querySelectorAll('.corner-dot');
        dots[corners.length - 1].classList.add('active');

        // Redraw
        redrawCanvas(canvas, scale);

        // Enable confirm button if all corners selected
        if (corners.length === 4) {
            document.getElementById('photo-confirm').disabled = false;
        }
    }

    /**
     * Redraw canvas with corners and lines
     */
    function redrawCanvas(canvas, scale) {
        const ctx = canvas.getContext('2d');

        // Redraw image
        ctx.drawImage(sourceImage, 0, 0, canvas.width, canvas.height);

        // Draw corners and lines
        ctx.strokeStyle = '#00ff00';
        ctx.fillStyle = '#00ff00';
        ctx.lineWidth = 2;

        for (let i = 0; i < corners.length; i++) {
            const c = corners[i];
            const sx = c.x * scale;
            const sy = c.y * scale;

            // Draw point
            ctx.beginPath();
            ctx.arc(sx, sy, 8, 0, Math.PI * 2);
            ctx.fill();

            // Draw number
            ctx.fillStyle = '#000';
            ctx.font = 'bold 12px sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText((i + 1).toString(), sx, sy);
            ctx.fillStyle = '#00ff00';

            // Draw line to next corner
            if (i > 0) {
                const prev = corners[i - 1];
                ctx.beginPath();
                ctx.moveTo(prev.x * scale, prev.y * scale);
                ctx.lineTo(sx, sy);
                ctx.stroke();
            }
        }

        // Close the quadrilateral
        if (corners.length === 4) {
            ctx.beginPath();
            ctx.moveTo(corners[3].x * scale, corners[3].y * scale);
            ctx.lineTo(corners[0].x * scale, corners[0].y * scale);
            ctx.stroke();
        }
    }

    /**
     * Reset corners
     */
    function resetCorners(ctx, img, scale) {
        corners = [];
        document.querySelectorAll('.corner-dot').forEach(d => d.classList.remove('active'));
        document.getElementById('photo-confirm').disabled = true;

        ctx.drawImage(img, 0, 0, ctx.canvas.width, ctx.canvas.height);
    }

    /**
     * Process the image and detect stones
     */
    function processImage(ctx, img, scale) {
        // Create a temporary canvas at original resolution for analysis
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = img.width;
        tempCanvas.height = img.height;
        const tempCtx = tempCanvas.getContext('2d');
        tempCtx.drawImage(img, 0, 0);

        // Get image data
        const imageData = tempCtx.getImageData(0, 0, img.width, img.height);

        // Analyze each intersection
        detectedGrid = analyzeIntersections(imageData, corners, boardSize);

        // Show correction mode
        showCorrectionMode(ctx, img, scale);
    }

    /**
     * Show correction mode - preview detection and allow manual fixes
     */
    function showCorrectionMode(ctx, img, scale) {
        const canvas = ctx.canvas;

        // Count initial detections
        let initBlack = 0, initWhite = 0;
        for (let row = 0; row < boardSize; row++) {
            for (let col = 0; col < boardSize; col++) {
                if (detectedGrid[row][col] === BLACK) initBlack++;
                else if (detectedGrid[row][col] === WHITE) initWhite++;
            }
        }

        // Update header
        const header = document.querySelector('.photo-header');
        header.innerHTML = `
            <h2>Vérifiez et corrigez la détection</h2>
            <p>Cliquez sur une intersection pour changer : vide → noir → blanc → vide</p>
            <div class="detection-stats" style="margin-top: 12px; display: flex; gap: 16px; justify-content: center; flex-wrap: wrap;">
                <span><span class="stone-indicator black" style="display:inline-block;width:12px;height:12px;border-radius:50%;background:#1a1a1a;vertical-align:middle;"></span> Noires: <strong id="black-count">${initBlack}</strong></span>
                <span><span class="stone-indicator white" style="display:inline-block;width:12px;height:12px;border-radius:50%;background:#f5f5f5;border:1px solid #ccc;vertical-align:middle;"></span> Blanches: <strong id="white-count">${initWhite}</strong></span>
            </div>
            <p style="font-size: 0.8rem; color: var(--text-muted); margin-top: 8px;">Détection auto: ${initBlack} noires, ${initWhite} blanches. Corrigez si besoin.</p>
        `;

        // Update buttons
        const actions = document.querySelector('.photo-actions');
        actions.innerHTML = `
            <button id="photo-back" class="btn btn-outline">Retour</button>
            <button id="photo-reset-detection" class="btn btn-outline">Tout effacer</button>
            <button id="photo-validate" class="btn btn-primary">Valider</button>
        `;

        // Remove old click handler and add new one for correction
        canvas.removeEventListener('click', handleCanvasClick);
        canvas.addEventListener('click', handleCorrectionClick);

        // Draw the preview
        drawCorrectionPreview(ctx, img, scale);

        // Button handlers
        document.getElementById('photo-back').addEventListener('click', () => {
            canvas.removeEventListener('click', handleCorrectionClick);
            canvas.addEventListener('click', handleCanvasClick);
            corners = [];
            detectedGrid = null;
            showCornerSelector(img);
        });

        document.getElementById('photo-reset-detection').addEventListener('click', () => {
            // Clear all detections
            for (let row = 0; row < boardSize; row++) {
                for (let col = 0; col < boardSize; col++) {
                    detectedGrid[row][col] = EMPTY;
                }
            }
            drawCorrectionPreview(ctx, img, scale);
        });

        document.getElementById('photo-validate').addEventListener('click', () => {
            canvas.removeEventListener('click', handleCorrectionClick);
            closeModal();

            if (onComplete) {
                onComplete({
                    grid: detectedGrid,
                    size: boardSize
                });
            }
        });
    }

    /**
     * Handle click in correction mode
     */
    function handleCorrectionClick(e) {
        const canvas = e.target;
        const rect = canvas.getBoundingClientRect();
        const scale = parseFloat(canvas.dataset.scale);

        const clickX = (e.clientX - rect.left) / scale;
        const clickY = (e.clientY - rect.top) / scale;

        // Find which intersection was clicked
        const [tl, tr, br, bl] = corners;

        // Find the closest intersection
        let closestRow = -1, closestCol = -1;
        let closestDist = Infinity;

        for (let row = 0; row < boardSize; row++) {
            for (let col = 0; col < boardSize; col++) {
                const u = col / (boardSize - 1);
                const v = row / (boardSize - 1);

                const x = (1 - u) * (1 - v) * tl.x + u * (1 - v) * tr.x +
                          u * v * br.x + (1 - u) * v * bl.x;
                const y = (1 - u) * (1 - v) * tl.y + u * (1 - v) * tr.y +
                          u * v * br.y + (1 - u) * v * bl.y;

                const dist = Math.sqrt((clickX - x) ** 2 + (clickY - y) ** 2);
                if (dist < closestDist) {
                    closestDist = dist;
                    closestRow = row;
                    closestCol = col;
                }
            }
        }

        // Check if click is close enough to an intersection
        const cellSize = Math.min(sourceImage.width, sourceImage.height) / boardSize;
        if (closestDist < cellSize * 0.5 && closestRow >= 0) {
            // Cycle through states: EMPTY -> BLACK -> WHITE -> EMPTY
            const current = detectedGrid[closestRow][closestCol];
            detectedGrid[closestRow][closestCol] = (current + 1) % 3;

            // Redraw
            const ctx = canvas.getContext('2d');
            drawCorrectionPreview(ctx, sourceImage, scale);
        }
    }

    /**
     * Draw the correction preview
     */
    function drawCorrectionPreview(ctx, img, scale) {
        const canvas = ctx.canvas;

        // Draw the original image
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        // Draw semi-transparent overlay
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const [tl, tr, br, bl] = corners;
        const cellSize = Math.min(img.width, img.height) / boardSize;
        const stoneRadius = cellSize * 0.42 * scale;

        let blackCount = 0, whiteCount = 0;

        // Draw grid and stones
        for (let row = 0; row < boardSize; row++) {
            for (let col = 0; col < boardSize; col++) {
                const u = col / (boardSize - 1);
                const v = row / (boardSize - 1);

                const x = (1 - u) * (1 - v) * tl.x + u * (1 - v) * tr.x +
                          u * v * br.x + (1 - u) * v * bl.x;
                const y = (1 - u) * (1 - v) * tl.y + u * (1 - v) * tr.y +
                          u * v * br.y + (1 - u) * v * bl.y;

                const sx = x * scale;
                const sy = y * scale;

                const stone = detectedGrid[row][col];

                if (stone === BLACK) {
                    // Draw black stone
                    ctx.beginPath();
                    ctx.arc(sx, sy, stoneRadius, 0, Math.PI * 2);
                    ctx.fillStyle = '#1a1a1a';
                    ctx.fill();
                    ctx.strokeStyle = '#000';
                    ctx.lineWidth = 1;
                    ctx.stroke();
                    blackCount++;
                } else if (stone === WHITE) {
                    // Draw white stone
                    ctx.beginPath();
                    ctx.arc(sx, sy, stoneRadius, 0, Math.PI * 2);
                    ctx.fillStyle = '#f5f5f5';
                    ctx.fill();
                    ctx.strokeStyle = '#aaa';
                    ctx.lineWidth = 1;
                    ctx.stroke();
                    whiteCount++;
                } else {
                    // Draw empty intersection marker
                    ctx.beginPath();
                    ctx.arc(sx, sy, 4, 0, Math.PI * 2);
                    ctx.fillStyle = 'rgba(255, 255, 0, 0.5)';
                    ctx.fill();
                }
            }
        }

        // Update counts
        const blackCountEl = document.getElementById('black-count');
        const whiteCountEl = document.getElementById('white-count');
        if (blackCountEl) blackCountEl.textContent = blackCount;
        if (whiteCountEl) whiteCountEl.textContent = whiteCount;
    }

    /**
     * Analyze intersections to detect stones
     */
    function analyzeIntersections(imageData, corners, size) {
        const grid = [];
        const width = imageData.width;
        const height = imageData.height;
        const data = imageData.data;

        // Corners: [topLeft, topRight, bottomRight, bottomLeft]
        const [tl, tr, br, bl] = corners;

        // First pass: collect all sample data
        const samples = [];

        for (let row = 0; row < size; row++) {
            for (let col = 0; col < size; col++) {
                const u = col / (size - 1);
                const v = row / (size - 1);

                const x = (1 - u) * (1 - v) * tl.x + u * (1 - v) * tr.x +
                          u * v * br.x + (1 - u) * v * bl.x;
                const y = (1 - u) * (1 - v) * tl.y + u * (1 - v) * tr.y +
                          u * v * br.y + (1 - u) * v * bl.y;

                const sample = sampleIntersection(data, width, height, Math.round(x), Math.round(y), size);
                samples.push({ row, col, ...sample });
            }
        }

        // Calculate global thresholds for reference
        const globalThresholds = calculateAdaptiveThresholds(samples);
        console.log('Global thresholds:', globalThresholds);

        // Divide board into regions for local adaptive thresholding (3x3 grid)
        const regionSize = Math.ceil(size / 3);
        const localThresholds = [];

        for (let ry = 0; ry < 3; ry++) {
            localThresholds[ry] = [];
            for (let rx = 0; rx < 3; rx++) {
                // Collect samples in this region
                const regionSamples = samples.filter(s => {
                    const inRow = s.row >= ry * regionSize && s.row < (ry + 1) * regionSize;
                    const inCol = s.col >= rx * regionSize && s.col < (rx + 1) * regionSize;
                    return inRow && inCol;
                });

                if (regionSamples.length > 10) {
                    localThresholds[ry][rx] = calculateAdaptiveThresholds(regionSamples);
                } else {
                    localThresholds[ry][rx] = globalThresholds;
                }
            }
        }

        // Second pass: classify each intersection using local thresholds
        for (let row = 0; row < size; row++) {
            grid[row] = [];
            for (let col = 0; col < size; col++) {
                const sample = samples[row * size + col];

                // Determine which region this point is in
                const ry = Math.min(2, Math.floor(row / regionSize));
                const rx = Math.min(2, Math.floor(col / regionSize));
                const thresholds = localThresholds[ry][rx];

                grid[row][col] = classifyIntersection(sample, thresholds, globalThresholds);
            }
        }

        return grid;
    }

    /**
     * Sample pixels around an intersection
     */
    function sampleIntersection(data, width, height, cx, cy, boardSize) {
        const cellSize = Math.min(width, height) / boardSize;
        const radius = Math.floor(cellSize * 0.42); // Larger radius to capture more of the stone

        let totalR = 0, totalG = 0, totalB = 0;
        let count = 0;
        const brightnessValues = [];

        // Sample pixels in a circle
        for (let dy = -radius; dy <= radius; dy++) {
            for (let dx = -radius; dx <= radius; dx++) {
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist > radius) continue;

                const px = cx + dx;
                const py = cy + dy;

                if (px < 0 || px >= width || py < 0 || py >= height) continue;

                const idx = (py * width + px) * 4;
                const r = data[idx];
                const g = data[idx + 1];
                const b = data[idx + 2];

                totalR += r;
                totalG += g;
                totalB += b;
                count++;

                const brightness = (r + g + b) / 3;
                brightnessValues.push(brightness);
            }
        }

        if (count === 0) {
            return { brightness: 128, saturation: 0, uniformity: 0, r: 128, g: 128, b: 128 };
        }

        const avgR = totalR / count;
        const avgG = totalG / count;
        const avgB = totalB / count;
        const brightness = (avgR + avgG + avgB) / 3;

        // Calculate saturation (how colorful vs grayscale)
        const maxC = Math.max(avgR, avgG, avgB);
        const minC = Math.min(avgR, avgG, avgB);
        const saturation = maxC > 0 ? (maxC - minC) / maxC : 0;

        // Calculate uniformity (low variance = more uniform = likely a stone)
        const mean = brightnessValues.reduce((a, b) => a + b, 0) / brightnessValues.length;
        const variance = brightnessValues.reduce((sum, val) => sum + (val - mean) ** 2, 0) / brightnessValues.length;
        const stdDev = Math.sqrt(variance);
        const uniformity = 1 / (1 + stdDev / 30); // Normalize to 0-1, higher = more uniform

        return { brightness, saturation, uniformity, r: avgR, g: avgG, b: avgB };
    }

    /**
     * Calculate adaptive thresholds using percentile-based approach
     */
    function calculateAdaptiveThresholds(samples) {
        // Sort samples by brightness
        const sorted = [...samples].sort((a, b) => a.brightness - b.brightness);
        const n = sorted.length;

        // Get percentiles
        const p5 = sorted[Math.floor(n * 0.05)].brightness;
        const p15 = sorted[Math.floor(n * 0.15)].brightness;
        const p50 = sorted[Math.floor(n * 0.50)].brightness;
        const p85 = sorted[Math.floor(n * 0.85)].brightness;
        const p95 = sorted[Math.floor(n * 0.95)].brightness;

        console.log('Percentiles - 5%:', p5, '15%:', p15, '50%:', p50, '85%:', p85, '95%:', p95);

        // Estimate wood as median (most intersections are empty on a typical board)
        const woodBrightness = p50;

        // Dark threshold: midpoint between darkest and wood
        // If there are black stones, p5-p15 should be much darker than wood
        const darkThreshold = (p15 + woodBrightness) / 2;

        // Bright threshold: midpoint between wood and brightest
        // If there are white stones, p85-p95 should be much brighter than wood
        const brightThreshold = (woodBrightness + p85) / 2;

        console.log('Wood brightness:', woodBrightness);
        console.log('Thresholds - dark:', darkThreshold.toFixed(1), 'bright:', brightThreshold.toFixed(1));

        // Log some sample values for debugging
        console.log('Darkest 10 samples:', sorted.slice(0, 10).map(s => s.brightness.toFixed(1)));
        console.log('Brightest 10 samples:', sorted.slice(-10).map(s => s.brightness.toFixed(1)));

        return {
            darkThreshold,
            brightThreshold,
            woodBrightness,
            minBrightness: p5,
            maxBrightness: p95
        };
    }

    /**
     * Classify an intersection as BLACK, WHITE, or EMPTY
     */
    function classifyIntersection(sample, localThresholds, globalThresholds) {
        const { brightness, saturation, uniformity } = sample;
        const { darkThreshold, brightThreshold, woodBrightness } = localThresholds;
        const globalWood = globalThresholds.woodBrightness;

        // Sanity check: don't classify as white if not brighter than global wood
        // This prevents bright areas of wood being detected as white stones
        const canBeWhite = brightness > globalWood + 15;

        // Sanity check: don't classify as black if not darker than global wood
        const canBeBlack = brightness < globalWood - 15;

        // Primary classification: pure brightness against local thresholds
        if (canBeBlack && brightness < darkThreshold) {
            return BLACK;
        }
        if (canBeWhite && brightness > brightThreshold) {
            return WHITE;
        }

        // Secondary: near-threshold + uniform (stones are more uniform than wood grain)
        if (canBeBlack && brightness < darkThreshold * 1.15 && uniformity > 0.55) {
            return BLACK;
        }
        if (canBeWhite && brightness > brightThreshold * 0.92 && uniformity > 0.55) {
            return WHITE;
        }

        // Tertiary: significant deviation from LOCAL wood + low saturation + high uniformity
        const distFromWood = brightness - woodBrightness;
        if (saturation < 0.15 && uniformity > 0.5) {
            if (canBeBlack && distFromWood < -20) {
                return BLACK;
            }
            if (canBeWhite && distFromWood > 20) {
                return WHITE;
            }
        }

        return EMPTY;
    }

    /**
     * Close the modal
     */
    function closeModal() {
        const overlay = document.getElementById('photo-overlay');
        if (overlay) {
            overlay.remove();
        }
        corners = [];
        sourceImage = null;
    }

    // Public API
    return {
        analyze
    };
})();
