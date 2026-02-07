/**
 * Trajectoires d'Adaptation - Interactive Module
 * Metro Map / Adaptation Pathways Visualization
 */

// =============================================
// DATA DEFINITIONS
// =============================================

const trajectoryData = {
    trajectoire1: {
        id: 1,
        name: "Maintien intégral",
        color: "#10b981",
        description: "Maintenir le niveau de service actuel coûte que coûte",
        viability: {
            2030: "optimal",
            2050: "good",
            2075: "critical",
            2100: "failure"
        },
        tippingPoint: 2060,
        cost: "4-6 Mds€",
        decisions: [
            { year: 2030, action: "Renforcement massif des infrastructures" },
            { year: 2050, action: "Point critique - Révision obligatoire" }
        ]
    },
    trajectoire2: {
        id: 2,
        name: "Dégradation ponctuelle",
        color: "#f59e0b",
        description: "Accepter une dégradation temporaire lors des événements extrêmes",
        viability: {
            2030: "good",
            2050: "degraded",
            2075: "degraded",
            2100: "degraded"
        },
        tippingPoint: null,
        cost: "2-3 Mds€",
        decisions: [
            { year: 2030, action: "Plans de continuité renforcés" },
            { year: 2050, action: "Ajustement des seuils d'acceptabilité" },
            { year: 2075, action: "Stabilisation" }
        ]
    },
    trajectoire3: {
        id: 3,
        name: "Dégradation maîtrisée",
        color: "#3b82f6",
        description: "Accepter une baisse pérenne avec priorisation des services",
        viability: {
            2030: "good",
            2050: "degraded",
            2075: "mixed",
            2100: "mixed"
        },
        tippingPoint: null,
        cost: "1.5-2 Mds€",
        decisions: [
            { year: 2030, action: "Définition des services prioritaires" },
            { year: 2050, action: "Choix des systèmes à maintenir" },
            { year: 2075, action: "Réévaluation des priorités" }
        ],
        priorityServices: ["Santé", "Éducation", "Transports collectifs", "Eau potable"]
    }
};

const domainData = {
    global: {
        name: "Vue globale",
        description: "Synthèse de tous les domaines"
    },
    sante: {
        name: "Santé publique",
        description: "Impacts sur la santé des populations",
        indicators: ["Mortalité canicule", "Maladies vectorielles", "Qualité de l'air"]
    },
    infra: {
        name: "Infrastructures",
        description: "Réseaux et bâtiments",
        indicators: ["Voirie", "Réseaux électriques", "Bâtiments publics"]
    },
    biodiv: {
        name: "Biodiversité",
        description: "Écosystèmes et espèces",
        indicators: ["Espèces menacées", "Espaces verts", "Corridors écologiques"]
    },
    eau: {
        name: "Ressource en eau",
        description: "Gestion de l'eau",
        indicators: ["Disponibilité", "Qualité", "Assainissement"]
    }
};

const scenarioImpacts = {
    optimiste: {
        temp: "+2°C",
        horizon: "2030",
        modification: 0.8 // Coefficient de modification des trajectoires
    },
    tendanciel: {
        temp: "+2.7°C",
        horizon: "2050",
        modification: 1.0
    },
    pessimiste: {
        temp: "+4°C",
        horizon: "2100",
        modification: 1.3
    }
};

// =============================================
// STATE MANAGEMENT
// =============================================

let currentState = {
    domain: 'global',
    scenario: 'tendanciel',
    highlightedTrajectory: null,
    tooltipVisible: false
};

// =============================================
// INITIALIZATION
// =============================================

document.addEventListener('DOMContentLoaded', () => {
    initializeControls();
    initializeMetroMap();
    initializeTrajectoryCards();
    initializeScorecard();
});

// =============================================
// CONTROLS
// =============================================

function initializeControls() {
    // Domain selector
    document.querySelectorAll('.domain-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.domain-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            currentState.domain = e.target.dataset.domain;
            updateVisualization();
        });
    });

    // Scenario toggle
    document.querySelectorAll('.scenario-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.scenario-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            currentState.scenario = e.target.dataset.scenario;
            updateVisualization();
        });
    });
}

// =============================================
// METRO MAP INTERACTIONS
// =============================================

function initializeMetroMap() {
    const svg = document.getElementById('metro-map');
    if (!svg) return;

    // Trajectory hover effects
    const trajectories = svg.querySelectorAll('.trajectory');
    trajectories.forEach(traj => {
        traj.addEventListener('mouseenter', () => {
            const trajId = traj.dataset.trajectory;
            highlightTrajectory(trajId);
        });

        traj.addEventListener('mouseleave', () => {
            resetTrajectoryHighlight();
        });
    });

    // Decision point interactions
    const decisionPoints = svg.querySelectorAll('.decision-point');
    decisionPoints.forEach(point => {
        point.addEventListener('mouseenter', (e) => {
            const year = point.dataset.year;
            const trajGroup = point.closest('.trajectory');
            const trajId = trajGroup ? trajGroup.dataset.trajectory : null;
            showDecisionTooltip(e, year, trajId);
        });

        point.addEventListener('mouseleave', () => {
            hideTooltip();
        });

        point.addEventListener('click', (e) => {
            const year = point.dataset.year;
            showDecisionModal(year);
        });
    });

    // Tipping point interactions
    const tippingPoints = svg.querySelectorAll('.tipping-point');
    tippingPoints.forEach(point => {
        point.addEventListener('mouseenter', (e) => {
            showTippingTooltip(e);
        });

        point.addEventListener('mouseleave', () => {
            hideTooltip();
        });
    });
}

function highlightTrajectory(trajId) {
    currentState.highlightedTrajectory = trajId;
    const svg = document.getElementById('metro-map');

    svg.querySelectorAll('.trajectory').forEach(traj => {
        if (traj.dataset.trajectory === trajId) {
            traj.classList.add('highlighted');
            traj.classList.remove('dimmed');
        } else {
            traj.classList.add('dimmed');
            traj.classList.remove('highlighted');
        }
    });

    // Also highlight corresponding card
    document.querySelectorAll('.trajectory-card').forEach(card => {
        if (card.dataset.trajectory === trajId) {
            card.style.transform = 'scale(1.02)';
            card.style.boxShadow = '0 8px 30px rgba(0,0,0,0.15)';
        } else {
            card.style.opacity = '0.6';
        }
    });
}

function resetTrajectoryHighlight() {
    currentState.highlightedTrajectory = null;
    const svg = document.getElementById('metro-map');

    svg.querySelectorAll('.trajectory').forEach(traj => {
        traj.classList.remove('highlighted', 'dimmed');
    });

    document.querySelectorAll('.trajectory-card').forEach(card => {
        card.style.transform = '';
        card.style.boxShadow = '';
        card.style.opacity = '';
    });
}

// =============================================
// TOOLTIPS
// =============================================

function showDecisionTooltip(event, year, trajId) {
    const tooltip = document.getElementById('tooltip');
    if (!tooltip) return;

    const trajData = trajId ? trajectoryData[`trajectoire${trajId}`] : null;
    const decision = trajData?.decisions.find(d => d.year === parseInt(year));

    const titleEl = tooltip.querySelector('#tooltip-title');
    const yearEl = tooltip.querySelector('#tooltip-year');
    const descEl = tooltip.querySelector('#tooltip-desc');
    const actionEl = tooltip.querySelector('#tooltip-action');

    titleEl.textContent = `Point de décision`;
    yearEl.textContent = `Année: ${year}`;
    descEl.textContent = decision ? decision.action : 'Action à définir';
    actionEl.textContent = 'Cliquez pour plus de détails';

    // Position tooltip
    const point = event.target.closest('.decision-point');
    const bbox = point.getBoundingClientRect();
    const svgRect = document.getElementById('metro-map').getBoundingClientRect();

    const x = bbox.left - svgRect.left + 20;
    const y = bbox.top - svgRect.top - 110;

    tooltip.setAttribute('transform', `translate(${x}, ${y})`);
    tooltip.setAttribute('visibility', 'visible');
}

function showTippingTooltip(event) {
    const tooltip = document.getElementById('tooltip');
    if (!tooltip) return;

    const titleEl = tooltip.querySelector('#tooltip-title');
    const yearEl = tooltip.querySelector('#tooltip-year');
    const descEl = tooltip.querySelector('#tooltip-desc');
    const actionEl = tooltip.querySelector('#tooltip-action');

    titleEl.textContent = `Tipping Point`;
    yearEl.textContent = `Seuil critique atteint`;
    descEl.textContent = 'La trajectoire devient inviable';
    actionEl.textContent = 'Changement de trajectoire obligatoire';

    const point = event.target.closest('.tipping-point');
    const bbox = point.getBoundingClientRect();
    const svgRect = document.getElementById('metro-map').getBoundingClientRect();

    const x = bbox.left - svgRect.left + 20;
    const y = bbox.top - svgRect.top - 110;

    tooltip.setAttribute('transform', `translate(${x}, ${y})`);
    tooltip.setAttribute('visibility', 'visible');
}

function hideTooltip() {
    const tooltip = document.getElementById('tooltip');
    if (tooltip) {
        tooltip.setAttribute('visibility', 'hidden');
    }
}

// =============================================
// TRAJECTORY CARDS
// =============================================

function initializeTrajectoryCards() {
    document.querySelectorAll('.trajectory-card').forEach(card => {
        const trajId = card.dataset.trajectory;

        card.addEventListener('mouseenter', () => {
            highlightTrajectory(trajId);
        });

        card.addEventListener('mouseleave', () => {
            resetTrajectoryHighlight();
        });

        card.addEventListener('click', () => {
            showTrajectoryDetail(trajId);
        });
    });
}

function showTrajectoryDetail(trajId) {
    const trajData = trajectoryData[`trajectoire${trajId}`];
    if (!trajData) return;

    // Scroll to card and expand details
    const card = document.querySelector(`.trajectory-card[data-trajectory="${trajId}"]`);
    if (card) {
        card.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

// =============================================
// SCORECARD
// =============================================

function initializeScorecard() {
    // Add hover effects to scorecard rows
    document.querySelectorAll('.scorecard-table tbody tr').forEach(row => {
        row.addEventListener('mouseenter', () => {
            row.style.backgroundColor = '#f8fafc';
        });
        row.addEventListener('mouseleave', () => {
            row.style.backgroundColor = '';
        });
    });

    // Total score click to show details
    document.querySelectorAll('.total-score').forEach(cell => {
        cell.style.cursor = 'pointer';
        cell.addEventListener('click', (e) => {
            const trajClass = e.target.classList[1]; // traj-1, traj-2, or traj-3
            const trajId = trajClass.split('-')[1];
            showTrajectoryDetail(trajId);
        });
    });
}

// =============================================
// VISUALIZATION UPDATES
// =============================================

function updateVisualization() {
    const scenario = scenarioImpacts[currentState.scenario];

    // Update service level display based on scenario
    updateServiceLevels(scenario);

    // Update trajectory paths based on scenario
    updateTrajectoryPaths(scenario);

    // Update scorecard if needed
    updateScorecard(scenario);
}

function updateServiceLevels(scenario) {
    const modifier = scenario.modification;

    // Adjust service levels in the detail panel based on scenario
    const serviceGrid = document.querySelector('.service-grid');
    if (!serviceGrid) return;

    // This would dynamically update the levels based on the scenario
    // For now, we'll add a visual indicator
    document.querySelectorAll('.service-row').forEach(row => {
        if (modifier > 1) {
            row.style.borderLeftWidth = '6px';
        } else if (modifier < 1) {
            row.style.borderLeftWidth = '3px';
        } else {
            row.style.borderLeftWidth = '4px';
        }
    });
}

function updateTrajectoryPaths(scenario) {
    const svg = document.getElementById('metro-map');
    if (!svg) return;

    // Visual feedback for scenario change
    const modifier = scenario.modification;

    // Adjust uncertainty zone
    const uncertaintyZone = svg.querySelector('.uncertainty-zone');
    if (uncertaintyZone) {
        if (modifier > 1) {
            uncertaintyZone.setAttribute('x', '750');
            uncertaintyZone.setAttribute('width', '400');
        } else if (modifier < 1) {
            uncertaintyZone.setAttribute('x', '950');
            uncertaintyZone.setAttribute('width', '200');
        } else {
            uncertaintyZone.setAttribute('x', '850');
            uncertaintyZone.setAttribute('width', '300');
        }
    }

    // Update temp labels
    const tempLabels = svg.querySelectorAll('.temp-label');
    tempLabels.forEach((label, i) => {
        if (i === 1) {
            label.textContent = scenario.temp;
        }
    });
}

function updateScorecard(scenario) {
    // Adjust scores based on scenario
    const modifier = scenario.modification;

    // Update total scores with animation
    document.querySelectorAll('.total-score').forEach(cell => {
        const baseScore = parseInt(cell.textContent);
        let adjustedScore = baseScore;

        if (cell.classList.contains('traj-1')) {
            // T1 becomes less viable with worse scenarios
            adjustedScore = Math.round(baseScore * (1 / modifier));
        } else if (cell.classList.contains('traj-3')) {
            // T3 becomes more valuable with worse scenarios
            adjustedScore = Math.min(100, Math.round(baseScore * modifier));
        }

        // Animate score change
        animateValue(cell, baseScore, adjustedScore, 300);
    });
}

function animateValue(element, start, end, duration) {
    const startTime = performance.now();

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        const current = Math.round(start + (end - start) * progress);
        element.textContent = `${current}/100`;

        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }

    requestAnimationFrame(update);
}

// =============================================
// DECISION MODAL
// =============================================

function showDecisionModal(year) {
    // Create modal for decision point details
    const existingModal = document.querySelector('.decision-modal');
    if (existingModal) existingModal.remove();

    const modal = document.createElement('div');
    modal.className = 'decision-modal';
    modal.innerHTML = `
        <div class="modal-overlay" onclick="closeDecisionModal()"></div>
        <div class="modal-content">
            <button class="modal-close" onclick="closeDecisionModal()">&times;</button>
            <h2>Point de décision ${year}</h2>
            <p class="modal-intro">À cet horizon, plusieurs options sont disponibles :</p>
            <div class="modal-options">
                <div class="modal-option traj-1">
                    <h4>Maintenir T1</h4>
                    <p>Continuer à maintenir le niveau de service actuel</p>
                    <span class="option-cost">Coût: Élevé</span>
                </div>
                <div class="modal-option traj-2">
                    <h4>Bifurquer vers T2</h4>
                    <p>Accepter une dégradation ponctuelle lors des crises</p>
                    <span class="option-cost">Coût: Modéré</span>
                </div>
                <div class="modal-option traj-3">
                    <h4>Bifurquer vers T3</h4>
                    <p>Passer à une dégradation maîtrisée avec priorisation</p>
                    <span class="option-cost">Coût: Optimisé</span>
                </div>
            </div>
            <div class="modal-footer">
                <p class="modal-note">Les transitions entre trajectoires impliquent des coûts de transfert et nécessitent une période d'adaptation.</p>
            </div>
        </div>
    `;

    // Add modal styles dynamically
    const style = document.createElement('style');
    style.textContent = `
        .decision-modal {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            z-index: 1000;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .modal-overlay {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.5);
        }
        .modal-content {
            position: relative;
            background: white;
            border-radius: 12px;
            padding: 2rem;
            max-width: 600px;
            width: 90%;
            max-height: 80vh;
            overflow-y: auto;
            animation: modalIn 0.3s ease-out;
        }
        @keyframes modalIn {
            from { opacity: 0; transform: scale(0.9); }
            to { opacity: 1; transform: scale(1); }
        }
        .modal-close {
            position: absolute;
            top: 1rem;
            right: 1rem;
            background: none;
            border: none;
            font-size: 1.5rem;
            cursor: pointer;
            color: #64748b;
        }
        .modal-content h2 {
            margin: 0 0 0.5rem;
            color: #1e293b;
        }
        .modal-intro {
            color: #64748b;
            margin: 0 0 1.5rem;
        }
        .modal-options {
            display: flex;
            flex-direction: column;
            gap: 1rem;
        }
        .modal-option {
            padding: 1rem;
            border-radius: 8px;
            border-left: 4px solid;
            background: #f8fafc;
        }
        .modal-option.traj-1 { border-color: #10b981; }
        .modal-option.traj-2 { border-color: #f59e0b; }
        .modal-option.traj-3 { border-color: #3b82f6; }
        .modal-option h4 {
            margin: 0 0 0.5rem;
            color: #1e293b;
        }
        .modal-option p {
            margin: 0 0 0.5rem;
            color: #64748b;
            font-size: 0.875rem;
        }
        .option-cost {
            font-size: 0.75rem;
            font-weight: 600;
            color: #94a3b8;
        }
        .modal-footer {
            margin-top: 1.5rem;
            padding-top: 1rem;
            border-top: 1px solid #e2e8f0;
        }
        .modal-note {
            font-size: 0.875rem;
            color: #64748b;
            font-style: italic;
            margin: 0;
        }
    `;

    document.head.appendChild(style);
    document.body.appendChild(modal);
}

function closeDecisionModal() {
    const modal = document.querySelector('.decision-modal');
    if (modal) {
        modal.remove();
    }
}

// =============================================
// UTILITY FUNCTIONS
// =============================================

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeDecisionModal();
        resetTrajectoryHighlight();
    }
});

// Export functions for potential external use
window.AdaptationPathways = {
    highlightTrajectory,
    resetTrajectoryHighlight,
    showDecisionModal,
    closeDecisionModal,
    updateVisualization
};
