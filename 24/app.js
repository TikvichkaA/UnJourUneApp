/**
 * Ping Pang Club - Application de gestion des matchs et tournois
 * Système de classement ELO + Tournois avec poules et tableaux
 */

class PingPangApp {
    constructor() {
        this.storageKey = 'pingpang-club-data';
        this.data = this.loadData();
        this.currentTournament = null;
        this.init();
    }

    // ==========================================
    // Initialisation
    // ==========================================

    init() {
        this.setupMobileMenu();
        this.setupNavigation();
        this.setupForms();
        this.setupFilters();
        this.renderAll();

        // Charger des données de démo si vide
        if (this.data.players.length === 0) {
            this.loadDemoData();
        }
    }

    setupMobileMenu() {
        const menuBtn = document.getElementById('mobile-menu-btn');
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('sidebar-overlay');

        const toggleMenu = () => {
            menuBtn.classList.toggle('active');
            sidebar.classList.toggle('open');
            overlay.classList.toggle('active');
        };

        const closeMenu = () => {
            menuBtn.classList.remove('active');
            sidebar.classList.remove('open');
            overlay.classList.remove('active');
        };

        menuBtn.addEventListener('click', toggleMenu);
        overlay.addEventListener('click', closeMenu);

        // Fermer le menu quand on clique sur un item de navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', closeMenu);
        });
    }

    loadData() {
        const saved = localStorage.getItem(this.storageKey);
        if (saved) {
            return JSON.parse(saved);
        }
        return {
            players: [],
            matches: [],
            tournaments: []
        };
    }

    saveData() {
        localStorage.setItem(this.storageKey, JSON.stringify(this.data));
    }

    resetData() {
        if (confirm('Êtes-vous sûr de vouloir réinitialiser toutes les données ?')) {
            localStorage.removeItem(this.storageKey);
            this.data = { players: [], matches: [], tournaments: [] };
            this.loadDemoData();
            this.renderAll();
            this.showToast('Données réinitialisées', 'success');
        }
    }

    loadDemoData() {
        // Joueurs de démo
        const demoPlayers = [
            { firstname: 'Lucas', lastname: 'Martin', elo: 1450 },
            { firstname: 'Emma', lastname: 'Bernard', elo: 1380 },
            { firstname: 'Hugo', lastname: 'Dubois', elo: 1320 },
            { firstname: 'Léa', lastname: 'Thomas', elo: 1280 },
            { firstname: 'Louis', lastname: 'Robert', elo: 1250 },
            { firstname: 'Chloé', lastname: 'Richard', elo: 1200 },
            { firstname: 'Nathan', lastname: 'Petit', elo: 1150 },
            { firstname: 'Jade', lastname: 'Durand', elo: 1100 },
            { firstname: 'Ethan', lastname: 'Leroy', elo: 1050 },
            { firstname: 'Sarah', lastname: 'Moreau', elo: 1000 },
            { firstname: 'Théo', lastname: 'Simon', elo: 980 },
            { firstname: 'Manon', lastname: 'Laurent', elo: 950 }
        ];

        demoPlayers.forEach(p => {
            this.addPlayer(p.firstname, p.lastname, p.elo, false);
        });

        // Quelques matchs de démo
        const now = Date.now();
        const day = 24 * 60 * 60 * 1000;

        const demoMatches = [
            { p1: 0, p2: 1, s1: 3, s2: 2, daysAgo: 1 },
            { p1: 2, p2: 3, s1: 3, s2: 1, daysAgo: 2 },
            { p1: 4, p2: 5, s1: 2, s2: 3, daysAgo: 3 },
            { p1: 0, p2: 2, s1: 3, s2: 0, daysAgo: 4 },
            { p1: 1, p2: 3, s1: 3, s2: 2, daysAgo: 5 },
            { p1: 6, p2: 7, s1: 1, s2: 3, daysAgo: 6 },
            { p1: 8, p2: 9, s1: 3, s2: 2, daysAgo: 7 },
            { p1: 0, p2: 4, s1: 3, s2: 1, daysAgo: 8 },
        ];

        demoMatches.forEach(m => {
            const player1 = this.data.players[m.p1];
            const player2 = this.data.players[m.p2];
            if (player1 && player2) {
                this.recordMatch(player1.id, player2.id, m.s1, m.s2, now - (m.daysAgo * day), false);
            }
        });

        this.saveData();
        this.renderAll();
    }

    // ==========================================
    // Navigation
    // ==========================================

    setupNavigation() {
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', () => {
                const page = item.dataset.page;
                this.showPage(page);
            });
        });
    }

    showPage(pageName) {
        // Update nav
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.toggle('active', item.dataset.page === pageName);
        });

        // Update pages
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
        });
        document.getElementById(`page-${pageName}`).classList.add('active');

        // Refresh content based on page
        switch(pageName) {
            case 'dashboard':
                this.renderDashboard();
                break;
            case 'match':
                this.renderMatchForm();
                break;
            case 'ranking':
                this.renderRanking();
                break;
            case 'tournament':
                this.renderTournaments();
                break;
            case 'players':
                this.renderPlayers();
                break;
            case 'history':
                this.renderHistory();
                break;
        }
    }

    // ==========================================
    // Système ELO
    // ==========================================

    calculateExpectedScore(ratingA, ratingB) {
        return 1 / (1 + Math.pow(10, (ratingB - ratingA) / 400));
    }

    calculateEloChange(winnerElo, loserElo, kFactor = 32) {
        const expectedWinner = this.calculateExpectedScore(winnerElo, loserElo);
        const expectedLoser = this.calculateExpectedScore(loserElo, winnerElo);

        const winnerChange = Math.round(kFactor * (1 - expectedWinner));
        const loserChange = Math.round(kFactor * (0 - expectedLoser));

        return { winnerChange, loserChange };
    }

    previewEloChange(player1Id, player2Id) {
        const player1 = this.getPlayer(player1Id);
        const player2 = this.getPlayer(player2Id);

        if (!player1 || !player2) return null;

        const if1Wins = this.calculateEloChange(player1.elo, player2.elo);
        const if2Wins = this.calculateEloChange(player2.elo, player1.elo);

        return {
            player1: {
                name: `${player1.firstname} ${player1.lastname}`,
                currentElo: player1.elo,
                ifWins: if1Wins.winnerChange,
                ifLoses: if2Wins.loserChange
            },
            player2: {
                name: `${player2.firstname} ${player2.lastname}`,
                currentElo: player2.elo,
                ifWins: if2Wins.winnerChange,
                ifLoses: if1Wins.loserChange
            }
        };
    }

    // ==========================================
    // Gestion des Joueurs
    // ==========================================

    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    addPlayer(firstname, lastname, elo = 1000, save = true) {
        const player = {
            id: this.generateId(),
            firstname: firstname.trim(),
            lastname: lastname.trim(),
            elo: parseInt(elo),
            initialElo: parseInt(elo),
            wins: 0,
            losses: 0,
            eloHistory: [{ date: Date.now(), elo: parseInt(elo) }],
            createdAt: Date.now()
        };

        this.data.players.push(player);
        if (save) {
            this.saveData();
            this.renderAll();
            this.showToast(`${firstname} ${lastname} ajouté(e)`, 'success');
        }
        return player;
    }

    getPlayer(id) {
        return this.data.players.find(p => p.id === id);
    }

    getPlayersSorted(filter = 'all') {
        let players = [...this.data.players];

        if (filter === 'active') {
            const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
            const activePlayers = new Set();

            this.data.matches.forEach(m => {
                if (m.date >= thirtyDaysAgo) {
                    activePlayers.add(m.player1Id);
                    activePlayers.add(m.player2Id);
                }
            });

            players = players.filter(p => activePlayers.has(p.id));
        }

        return players.sort((a, b) => b.elo - a.elo);
    }

    // ==========================================
    // Gestion des Matchs
    // ==========================================

    recordMatch(player1Id, player2Id, score1, score2, date = Date.now(), save = true) {
        const player1 = this.getPlayer(player1Id);
        const player2 = this.getPlayer(player2Id);

        if (!player1 || !player2 || player1Id === player2Id) {
            this.showToast('Erreur: joueurs invalides', 'error');
            return null;
        }

        score1 = parseInt(score1);
        score2 = parseInt(score2);

        if (score1 === score2) {
            this.showToast('Match nul non autorisé', 'error');
            return null;
        }

        const winner = score1 > score2 ? player1 : player2;
        const loser = score1 > score2 ? player2 : player1;

        const { winnerChange, loserChange } = this.calculateEloChange(winner.elo, loser.elo);

        // Update ELOs
        const oldWinnerElo = winner.elo;
        const oldLoserElo = loser.elo;

        winner.elo += winnerChange;
        winner.wins++;
        winner.eloHistory.push({ date, elo: winner.elo });

        loser.elo += loserChange;
        loser.losses++;
        loser.eloHistory.push({ date, elo: loser.elo });

        // Record match
        const match = {
            id: this.generateId(),
            player1Id,
            player2Id,
            score1,
            score2,
            winnerId: winner.id,
            loserId: loser.id,
            eloChanges: {
                [winner.id]: winnerChange,
                [loser.id]: loserChange
            },
            eloBefore: {
                [player1Id]: player1Id === winner.id ? oldWinnerElo : oldLoserElo,
                [player2Id]: player2Id === winner.id ? oldWinnerElo : oldLoserElo
            },
            date,
            tournamentId: null
        };

        this.data.matches.push(match);

        if (save) {
            this.saveData();
            this.renderAll();
            this.showToast('Match enregistré !', 'success');
        }

        return match;
    }

    getPlayerMatches(playerId) {
        return this.data.matches
            .filter(m => m.player1Id === playerId || m.player2Id === playerId)
            .sort((a, b) => b.date - a.date);
    }

    // ==========================================
    // Gestion des Tournois
    // ==========================================

    createTournament(name, format, poolCount, participantIds) {
        if (participantIds.length < 4) {
            this.showToast('Minimum 4 participants requis', 'error');
            return null;
        }

        const tournament = {
            id: this.generateId(),
            name,
            format,
            status: 'active',
            pools: [],
            bracket: null,
            participants: participantIds,
            createdAt: Date.now()
        };

        // Créer les poules si nécessaire
        if (format === 'pool-bracket' || format === 'pool-only') {
            tournament.pools = this.createPools(participantIds, poolCount);
        }

        // Créer le tableau si format tableau seul
        if (format === 'bracket-only') {
            tournament.bracket = this.createBracket(participantIds);
        }

        this.data.tournaments.push(tournament);
        this.saveData();
        this.renderAll();
        this.showToast('Tournoi créé !', 'success');

        return tournament;
    }

    createPools(participantIds, poolCount) {
        const pools = [];
        const shuffled = [...participantIds].sort(() => Math.random() - 0.5);

        // Seed by ELO (serpentine)
        const seeded = shuffled.sort((a, b) => {
            const pA = this.getPlayer(a);
            const pB = this.getPlayer(b);
            return pB.elo - pA.elo;
        });

        // Distribute into pools (serpentine)
        for (let i = 0; i < poolCount; i++) {
            pools.push({
                id: `pool-${i}`,
                name: `Poule ${String.fromCharCode(65 + i)}`,
                players: [],
                matches: [],
                standings: []
            });
        }

        seeded.forEach((playerId, idx) => {
            const poolIdx = idx % poolCount;
            pools[poolIdx].players.push(playerId);
        });

        // Generate matches for each pool
        pools.forEach(pool => {
            pool.matches = this.generatePoolMatches(pool.players);
            pool.standings = pool.players.map(pid => ({
                playerId: pid,
                played: 0,
                won: 0,
                lost: 0,
                setsWon: 0,
                setsLost: 0,
                points: 0
            }));
        });

        return pools;
    }

    generatePoolMatches(playerIds) {
        const matches = [];
        for (let i = 0; i < playerIds.length; i++) {
            for (let j = i + 1; j < playerIds.length; j++) {
                matches.push({
                    id: this.generateId(),
                    player1Id: playerIds[i],
                    player2Id: playerIds[j],
                    score1: null,
                    score2: null,
                    completed: false
                });
            }
        }
        return matches;
    }

    createBracket(participantIds, fromPools = false) {
        // Determine bracket size (next power of 2)
        let bracketSize = 2;
        while (bracketSize < participantIds.length) {
            bracketSize *= 2;
        }

        const rounds = [];
        const numRounds = Math.log2(bracketSize);

        // Create rounds
        const roundNames = ['Finale', 'Demi-finales', 'Quarts de finale', 'Huitièmes', 'Seizièmes'];

        for (let r = numRounds - 1; r >= 0; r--) {
            const matchCount = Math.pow(2, r);
            const roundName = roundNames[r] || `Tour ${numRounds - r}`;

            const round = {
                name: roundName,
                matches: []
            };

            for (let m = 0; m < matchCount; m++) {
                round.matches.push({
                    id: this.generateId(),
                    player1Id: null,
                    player2Id: null,
                    score1: null,
                    score2: null,
                    completed: false
                });
            }

            rounds.unshift(round);
        }

        // Seed first round
        const seeded = [...participantIds].sort((a, b) => {
            const pA = this.getPlayer(a);
            const pB = this.getPlayer(b);
            return pB.elo - pA.elo;
        });

        // Fill with byes
        while (seeded.length < bracketSize) {
            seeded.push(null);
        }

        // Standard bracket seeding
        const seedOrder = this.generateSeedOrder(bracketSize);
        rounds[0].matches.forEach((match, idx) => {
            match.player1Id = seeded[seedOrder[idx * 2]] || null;
            match.player2Id = seeded[seedOrder[idx * 2 + 1]] || null;

            // Auto-advance byes
            if (match.player1Id && !match.player2Id) {
                match.completed = true;
                match.score1 = 'W';
                match.score2 = '-';
                this.advanceInBracket(rounds, 0, idx, match.player1Id);
            } else if (!match.player1Id && match.player2Id) {
                match.completed = true;
                match.score1 = '-';
                match.score2 = 'W';
                this.advanceInBracket(rounds, 0, idx, match.player2Id);
            }
        });

        return rounds;
    }

    generateSeedOrder(size) {
        if (size === 2) return [0, 1];

        const smaller = this.generateSeedOrder(size / 2);
        const result = [];

        smaller.forEach(seed => {
            result.push(seed);
            result.push(size - 1 - seed);
        });

        return result;
    }

    advanceInBracket(rounds, roundIdx, matchIdx, winnerId) {
        if (roundIdx >= rounds.length - 1) return;

        const nextRoundIdx = roundIdx + 1;
        const nextMatchIdx = Math.floor(matchIdx / 2);
        const nextMatch = rounds[nextRoundIdx].matches[nextMatchIdx];

        if (matchIdx % 2 === 0) {
            nextMatch.player1Id = winnerId;
        } else {
            nextMatch.player2Id = winnerId;
        }
    }

    recordTournamentPoolMatch(tournamentId, poolId, matchId, score1, score2) {
        const tournament = this.data.tournaments.find(t => t.id === tournamentId);
        if (!tournament) return;

        const pool = tournament.pools.find(p => p.id === poolId);
        if (!pool) return;

        const match = pool.matches.find(m => m.id === matchId);
        if (!match) return;

        match.score1 = parseInt(score1);
        match.score2 = parseInt(score2);
        match.completed = true;

        // Update standings
        const winnerId = score1 > score2 ? match.player1Id : match.player2Id;
        const loserId = score1 > score2 ? match.player2Id : match.player1Id;

        const winnerStanding = pool.standings.find(s => s.playerId === winnerId);
        const loserStanding = pool.standings.find(s => s.playerId === loserId);

        if (winnerStanding) {
            winnerStanding.played++;
            winnerStanding.won++;
            winnerStanding.setsWon += Math.max(score1, score2);
            winnerStanding.setsLost += Math.min(score1, score2);
            winnerStanding.points += 2;
        }

        if (loserStanding) {
            loserStanding.played++;
            loserStanding.lost++;
            loserStanding.setsWon += Math.min(score1, score2);
            loserStanding.setsLost += Math.max(score1, score2);
            loserStanding.points += 1;
        }

        // Sort standings
        pool.standings.sort((a, b) => {
            if (b.points !== a.points) return b.points - a.points;
            const aRatio = a.setsWon / (a.setsLost || 1);
            const bRatio = b.setsWon / (b.setsLost || 1);
            return bRatio - aRatio;
        });

        // Check if pool phase complete
        const allPoolsComplete = tournament.pools.every(p =>
            p.matches.every(m => m.completed)
        );

        if (allPoolsComplete && tournament.format === 'pool-bracket' && !tournament.bracket) {
            // Create bracket from pool qualifiers
            const qualifiers = [];
            tournament.pools.forEach(p => {
                // Top 2 from each pool qualify
                qualifiers.push(p.standings[0].playerId);
                if (p.standings[1]) qualifiers.push(p.standings[1].playerId);
            });
            tournament.bracket = this.createBracket(qualifiers, true);
        }

        // Also record as regular match (for ELO)
        this.recordMatch(match.player1Id, match.player2Id, score1, score2, Date.now(), false);

        this.saveData();
        this.renderTournamentView(tournamentId);
    }

    recordTournamentBracketMatch(tournamentId, roundIdx, matchIdx, score1, score2) {
        const tournament = this.data.tournaments.find(t => t.id === tournamentId);
        if (!tournament || !tournament.bracket) return;

        const match = tournament.bracket[roundIdx].matches[matchIdx];
        if (!match || !match.player1Id || !match.player2Id) return;

        match.score1 = parseInt(score1);
        match.score2 = parseInt(score2);
        match.completed = true;

        const winnerId = score1 > score2 ? match.player1Id : match.player2Id;
        this.advanceInBracket(tournament.bracket, roundIdx, matchIdx, winnerId);

        // Check if tournament complete
        const finalMatch = tournament.bracket[tournament.bracket.length - 1].matches[0];
        if (finalMatch.completed) {
            tournament.status = 'completed';
            tournament.winnerId = finalMatch.score1 > finalMatch.score2 ?
                finalMatch.player1Id : finalMatch.player2Id;
        }

        // Record as regular match
        this.recordMatch(match.player1Id, match.player2Id, score1, score2, Date.now(), false);

        this.saveData();
        this.renderTournamentView(tournamentId);
    }

    // ==========================================
    // Formulaires
    // ==========================================

    setupForms() {
        // Match form
        document.getElementById('match-form').addEventListener('submit', (e) => {
            e.preventDefault();
            const p1 = document.getElementById('player1-select').value;
            const p2 = document.getElementById('player2-select').value;
            const s1 = document.getElementById('score1').value;
            const s2 = document.getElementById('score2').value;

            if (this.recordMatch(p1, p2, s1, s2)) {
                e.target.reset();
                document.getElementById('elo-preview').innerHTML = '<p>Sélectionnez les joueurs pour voir l\'impact ELO</p>';
            }
        });

        // Player selects change
        ['player1-select', 'player2-select'].forEach(id => {
            document.getElementById(id).addEventListener('change', () => this.updateMatchPreview());
        });

        // Add player form
        document.getElementById('add-player-form').addEventListener('submit', (e) => {
            e.preventDefault();
            const firstname = document.getElementById('new-player-firstname').value;
            const lastname = document.getElementById('new-player-lastname').value;
            const elo = document.getElementById('new-player-elo').value;

            this.addPlayer(firstname, lastname, elo);
            this.closeModal('add-player-modal');
            e.target.reset();
        });

        // Tournament form
        document.getElementById('tournament-form').addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('tournament-name').value;
            const format = document.getElementById('tournament-format').value;
            const poolCount = parseInt(document.getElementById('pool-count').value);

            const selected = document.querySelectorAll('.participant-checkbox.selected');
            const participantIds = Array.from(selected).map(el => el.dataset.playerId);

            if (this.createTournament(name, format, poolCount, participantIds)) {
                e.target.reset();
                document.querySelectorAll('.participant-checkbox').forEach(el => {
                    el.classList.remove('selected');
                    el.querySelector('input').checked = false;
                });
            }
        });

        // Tournament tabs
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const tab = btn.dataset.tab;
                document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
                document.getElementById(tab).classList.add('active');
            });
        });

        // Tournament phases
        document.querySelectorAll('.phase-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const phase = btn.dataset.phase;
                document.querySelectorAll('.phase-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                document.querySelectorAll('.phase-content').forEach(c => c.classList.remove('active'));
                document.getElementById(`phase-${phase}`).classList.add('active');
            });
        });

        // History search
        document.getElementById('history-search').addEventListener('input', () => this.renderHistory());
        document.getElementById('history-period').addEventListener('change', () => this.renderHistory());
    }

    setupFilters() {
        document.querySelectorAll('.ranking-filters .filter-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.ranking-filters .filter-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.renderRanking(btn.dataset.filter);
            });
        });
    }

    updateMatchPreview() {
        const p1Id = document.getElementById('player1-select').value;
        const p2Id = document.getElementById('player2-select').value;

        // Update player previews
        [
            { id: p1Id, el: 'player1-preview' },
            { id: p2Id, el: 'player2-preview' }
        ].forEach(({ id, el }) => {
            const preview = document.getElementById(el);
            if (id) {
                const player = this.getPlayer(id);
                preview.innerHTML = `
                    <div class="elo-badge">${player.elo}</div>
                    <div class="record">${player.wins}V - ${player.losses}D</div>
                `;
            } else {
                preview.innerHTML = '';
            }
        });

        // Update ELO preview
        const eloPreview = document.getElementById('elo-preview');
        if (p1Id && p2Id && p1Id !== p2Id) {
            const preview = this.previewEloChange(p1Id, p2Id);
            eloPreview.innerHTML = `
                <div class="elo-preview-content">
                    <div class="elo-change">
                        <div class="player-name">${preview.player1.name} gagne</div>
                        <div class="change-value positive">+${preview.player1.ifWins}</div>
                    </div>
                    <div class="elo-change">
                        <div class="player-name">${preview.player2.name} gagne</div>
                        <div class="change-value positive">+${preview.player2.ifWins}</div>
                    </div>
                </div>
            `;
        } else {
            eloPreview.innerHTML = '<p>Sélectionnez les joueurs pour voir l\'impact ELO</p>';
        }
    }

    // ==========================================
    // Rendu
    // ==========================================

    renderAll() {
        this.renderDashboard();
        this.renderMatchForm();
        this.renderRanking();
        this.renderTournaments();
        this.renderPlayers();
        this.renderHistory();
    }

    renderDashboard() {
        // Stats
        document.getElementById('stat-players').textContent = this.data.players.length;
        document.getElementById('stat-matches').textContent = this.data.matches.length;
        document.getElementById('stat-tournaments').textContent = this.data.tournaments.length;

        const avgElo = this.data.players.length > 0
            ? Math.round(this.data.players.reduce((sum, p) => sum + p.elo, 0) / this.data.players.length)
            : 1000;
        document.getElementById('stat-avg-elo').textContent = avgElo;

        // Top 5 players
        const topPlayers = this.getPlayersSorted().slice(0, 5);
        const topList = document.getElementById('top-players-list');
        topList.innerHTML = topPlayers.map((p, i) => `
            <div class="mini-rank-item">
                <span class="mini-rank-position ${i === 0 ? 'gold' : i === 1 ? 'silver' : i === 2 ? 'bronze' : ''}">${i + 1}</span>
                <span class="mini-rank-name">${p.firstname} ${p.lastname}</span>
                <span class="mini-rank-elo">${p.elo}</span>
            </div>
        `).join('') || '<p class="empty-state">Aucun joueur</p>';

        // Recent matches
        const recentMatches = this.data.matches.slice(-5).reverse();
        const matchList = document.getElementById('recent-matches-list');
        matchList.innerHTML = recentMatches.map(m => {
            const p1 = this.getPlayer(m.player1Id);
            const p2 = this.getPlayer(m.player2Id);
            return `
                <div class="mini-match-item">
                    <span class="mini-match-players">${p1?.firstname || '?'} vs ${p2?.firstname || '?'}</span>
                    <span class="mini-match-score">${m.score1} - ${m.score2}</span>
                </div>
            `;
        }).join('') || '<p class="empty-state">Aucun match</p>';

        // Active tournament
        const activeTournament = this.data.tournaments.find(t => t.status === 'active');
        const tournamentPreview = document.getElementById('active-tournament-preview');
        if (activeTournament) {
            tournamentPreview.innerHTML = `
                <div class="tournament-card" onclick="app.viewTournament('${activeTournament.id}')">
                    <div class="tournament-card-header">
                        <span class="tournament-card-title">${activeTournament.name}</span>
                        <span class="tournament-card-badge active">En cours</span>
                    </div>
                    <div class="tournament-card-info">
                        <span>${activeTournament.participants.length} participants</span>
                        <span>${activeTournament.format}</span>
                    </div>
                </div>
            `;
        } else {
            tournamentPreview.innerHTML = '<p class="empty-state">Aucun tournoi en cours</p>';
        }
    }

    renderMatchForm() {
        const players = this.getPlayersSorted();
        const options = '<option value="">Sélectionner...</option>' +
            players.map(p => `<option value="${p.id}">${p.firstname} ${p.lastname} (${p.elo})</option>`).join('');

        document.getElementById('player1-select').innerHTML = options;
        document.getElementById('player2-select').innerHTML = options;
    }

    renderRanking(filter = 'all') {
        const players = this.getPlayersSorted(filter);
        const tbody = document.getElementById('ranking-body');

        tbody.innerHTML = players.map((p, i) => {
            const ratio = p.wins + p.losses > 0
                ? (p.wins / (p.wins + p.losses) * 100).toFixed(1)
                : '0.0';

            const evolution = p.elo - p.initialElo;
            const evolutionClass = evolution > 0 ? 'positive' : evolution < 0 ? 'negative' : '';

            return `
                <tr onclick="app.showPlayerProfile('${p.id}')">
                    <td class="rank-cell">
                        <span class="rank-badge ${i === 0 ? 'gold' : i === 1 ? 'silver' : i === 2 ? 'bronze' : ''}">${i + 1}</span>
                    </td>
                    <td class="player-cell">${p.firstname} ${p.lastname}</td>
                    <td class="elo-cell">${p.elo}</td>
                    <td>${p.wins}/${p.losses}</td>
                    <td class="ratio-cell">${ratio}%</td>
                    <td class="evolution-cell ${evolutionClass}">${evolution > 0 ? '+' : ''}${evolution}</td>
                </tr>
            `;
        }).join('');

        if (players.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" class="empty-state">Aucun joueur trouvé</td></tr>';
        }
    }

    renderTournaments() {
        // Active tournaments
        const activeTournaments = this.data.tournaments.filter(t => t.status === 'active');
        const activeList = document.getElementById('active-tournament-list');
        activeList.innerHTML = activeTournaments.map(t => `
            <div class="tournament-card" onclick="app.viewTournament('${t.id}')">
                <div class="tournament-card-header">
                    <span class="tournament-card-title">${t.name}</span>
                    <span class="tournament-card-badge active">En cours</span>
                </div>
                <div class="tournament-card-info">
                    <span>${t.participants.length} participants</span>
                    <span>${t.format === 'pool-bracket' ? 'Poules + Tableau' : t.format === 'pool-only' ? 'Poules' : 'Tableau'}</span>
                </div>
            </div>
        `).join('') || '<div class="empty-state"><div class="empty-state-icon">🎪</div><div class="empty-state-title">Aucun tournoi en cours</div><p>Créez un nouveau tournoi pour commencer</p></div>';

        // Past tournaments
        const pastTournaments = this.data.tournaments.filter(t => t.status === 'completed');
        const pastList = document.getElementById('past-tournament-list');
        pastList.innerHTML = pastTournaments.map(t => {
            const winner = this.getPlayer(t.winnerId);
            return `
                <div class="tournament-card" onclick="app.viewTournament('${t.id}')">
                    <div class="tournament-card-header">
                        <span class="tournament-card-title">${t.name}</span>
                        <span class="tournament-card-badge completed">Terminé</span>
                    </div>
                    <div class="tournament-card-info">
                        <span>Vainqueur: ${winner ? winner.firstname + ' ' + winner.lastname : 'N/A'}</span>
                        <span>${t.participants.length} participants</span>
                    </div>
                </div>
            `;
        }).join('') || '<div class="empty-state">Aucun tournoi terminé</div>';

        // Participants selector
        const participantsSelector = document.getElementById('participants-selector');
        const players = this.getPlayersSorted();
        participantsSelector.innerHTML = players.map(p => `
            <label class="participant-checkbox" data-player-id="${p.id}">
                <input type="checkbox" onchange="this.parentElement.classList.toggle('selected', this.checked)">
                ${p.firstname} ${p.lastname[0]}.
            </label>
        `).join('');
    }

    viewTournament(tournamentId) {
        this.currentTournament = tournamentId;
        this.showPage('tournament-view');
        this.renderTournamentView(tournamentId);
    }

    renderTournamentView(tournamentId) {
        const tournament = this.data.tournaments.find(t => t.id === tournamentId);
        if (!tournament) return;

        document.getElementById('tournament-view-title').textContent = tournament.name;
        document.getElementById('tournament-view-status').textContent =
            tournament.status === 'active' ? 'En cours' : 'Terminé';

        // Pools
        const poolsContainer = document.getElementById('pools-container');
        if (tournament.pools && tournament.pools.length > 0) {
            poolsContainer.innerHTML = tournament.pools.map(pool => `
                <div class="pool-card">
                    <div class="pool-header">${pool.name}</div>
                    <table class="pool-standings">
                        <thead>
                            <tr>
                                <th>Joueur</th>
                                <th>J</th>
                                <th>V</th>
                                <th>D</th>
                                <th>Sets</th>
                                <th>Pts</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${pool.standings.map((s, i) => {
                                const player = this.getPlayer(s.playerId);
                                const qualified = i < 2 && pool.matches.every(m => m.completed);
                                return `
                                    <tr class="${qualified ? 'qualified' : ''}">
                                        <td>${player?.firstname || '?'} ${player?.lastname || ''}</td>
                                        <td>${s.played}</td>
                                        <td>${s.won}</td>
                                        <td>${s.lost}</td>
                                        <td>${s.setsWon}-${s.setsLost}</td>
                                        <td><strong>${s.points}</strong></td>
                                    </tr>
                                `;
                            }).join('')}
                        </tbody>
                    </table>
                    <div class="pool-matches">
                        ${pool.matches.map(m => {
                            const p1 = this.getPlayer(m.player1Id);
                            const p2 = this.getPlayer(m.player2Id);
                            return `
                                <div class="pool-match ${m.completed ? 'completed' : ''}"
                                     onclick="app.openTournamentMatchModal('${tournament.id}', 'pool', '${pool.id}', '${m.id}')">
                                    <span class="pool-match-players">${p1?.firstname || '?'} vs ${p2?.firstname || '?'}</span>
                                    <span class="pool-match-score ${m.completed ? '' : 'pending'}">
                                        ${m.completed ? `${m.score1} - ${m.score2}` : 'À jouer'}
                                    </span>
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>
            `).join('');
        } else {
            poolsContainer.innerHTML = '<div class="empty-state">Pas de phase de poules</div>';
        }

        // Bracket
        const bracketContainer = document.getElementById('bracket-container');
        if (tournament.bracket) {
            bracketContainer.innerHTML = `
                <div class="bracket-rounds">
                    ${tournament.bracket.map((round, rIdx) => `
                        <div class="bracket-round">
                            <div class="bracket-round-title">${round.name}</div>
                            ${round.matches.map((m, mIdx) => {
                                const p1 = m.player1Id ? this.getPlayer(m.player1Id) : null;
                                const p2 = m.player2Id ? this.getPlayer(m.player2Id) : null;
                                const canPlay = m.player1Id && m.player2Id && !m.completed;
                                const winner = m.completed && m.score1 !== 'W' && m.score2 !== 'W'
                                    ? (parseInt(m.score1) > parseInt(m.score2) ? m.player1Id : m.player2Id)
                                    : (m.score1 === 'W' ? m.player1Id : m.score2 === 'W' ? m.player2Id : null);

                                return `
                                    <div class="bracket-match ${m.completed ? 'completed' : ''}"
                                         ${canPlay ? `onclick="app.openTournamentMatchModal('${tournament.id}', 'bracket', ${rIdx}, ${mIdx})"` : ''}>
                                        <div class="bracket-player ${winner === m.player1Id ? 'winner' : ''}">
                                            <span class="name">${p1 ? p1.firstname + ' ' + p1.lastname[0] + '.' : 'TBD'}</span>
                                            <span class="score">${m.score1 ?? '-'}</span>
                                        </div>
                                        <div class="bracket-player ${winner === m.player2Id ? 'winner' : ''}">
                                            <span class="name">${p2 ? p2.firstname + ' ' + p2.lastname[0] + '.' : 'TBD'}</span>
                                            <span class="score">${m.score2 ?? '-'}</span>
                                        </div>
                                    </div>
                                `;
                            }).join('')}
                        </div>
                    `).join('')}
                </div>
            `;
        } else {
            bracketContainer.innerHTML = '<div class="empty-state">Le tableau sera généré après les poules</div>';
        }
    }

    openTournamentMatchModal(tournamentId, type, arg1, arg2) {
        const tournament = this.data.tournaments.find(t => t.id === tournamentId);
        if (!tournament) return;

        let match, player1, player2;

        if (type === 'pool') {
            const pool = tournament.pools.find(p => p.id === arg1);
            match = pool.matches.find(m => m.id === arg2);
        } else {
            match = tournament.bracket[arg1].matches[arg2];
        }

        if (!match || match.completed) return;

        player1 = this.getPlayer(match.player1Id);
        player2 = this.getPlayer(match.player2Id);

        const container = document.getElementById('tournament-match-form-container');
        container.innerHTML = `
            <form id="tournament-match-result-form">
                <div class="match-players" style="margin-bottom: 20px;">
                    <div style="flex:1; text-align: center;">
                        <strong>${player1?.firstname} ${player1?.lastname}</strong>
                        <div style="color: #0b362d; font-size: 1.5rem;">${player1?.elo}</div>
                    </div>
                    <div class="vs-badge">VS</div>
                    <div style="flex:1; text-align: center;">
                        <strong>${player2?.firstname} ${player2?.lastname}</strong>
                        <div style="color: #0b362d; font-size: 1.5rem;">${player2?.elo}</div>
                    </div>
                </div>
                <div class="score-fields" style="justify-content: center; margin-bottom: 20px;">
                    <div class="score-field">
                        <input type="number" id="tm-score1" min="0" max="4" value="0" required style="width:60px; height:60px; font-size:1.5rem;">
                    </div>
                    <div class="score-separator">-</div>
                    <div class="score-field">
                        <input type="number" id="tm-score2" min="0" max="4" value="0" required style="width:60px; height:60px; font-size:1.5rem;">
                    </div>
                </div>
                <button type="submit" class="btn-primary" style="width: 100%;">Valider le résultat</button>
            </form>
        `;

        document.getElementById('tournament-match-result-form').addEventListener('submit', (e) => {
            e.preventDefault();
            const s1 = document.getElementById('tm-score1').value;
            const s2 = document.getElementById('tm-score2').value;

            if (s1 === s2) {
                this.showToast('Match nul non autorisé', 'error');
                return;
            }

            if (type === 'pool') {
                this.recordTournamentPoolMatch(tournamentId, arg1, arg2, s1, s2);
            } else {
                this.recordTournamentBracketMatch(tournamentId, arg1, arg2, s1, s2);
            }

            this.closeModal('tournament-match-modal');
        });

        this.openModal('tournament-match-modal');
    }

    renderPlayers() {
        const players = this.getPlayersSorted();
        const grid = document.getElementById('players-grid');

        grid.innerHTML = players.map(p => {
            const initial = p.firstname[0] + p.lastname[0];
            const ratio = p.wins + p.losses > 0
                ? (p.wins / (p.wins + p.losses) * 100).toFixed(0)
                : 0;

            return `
                <div class="player-card" onclick="app.showPlayerProfile('${p.id}')">
                    <div class="player-avatar">${initial}</div>
                    <div class="player-card-name">${p.firstname} ${p.lastname}</div>
                    <div class="player-card-elo">${p.elo}</div>
                    <div class="player-card-stats">
                        <div class="player-card-stat">
                            <strong>${p.wins}</strong>
                            <span>Victoires</span>
                        </div>
                        <div class="player-card-stat">
                            <strong>${ratio}%</strong>
                            <span>Ratio</span>
                        </div>
                        <div class="player-card-stat">
                            <strong>${p.losses}</strong>
                            <span>Défaites</span>
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        if (players.length === 0) {
            grid.innerHTML = '<div class="empty-state"><div class="empty-state-icon">👥</div><div class="empty-state-title">Aucun joueur</div><p>Ajoutez des joueurs pour commencer</p></div>';
        }
    }

    showPlayerProfile(playerId) {
        const player = this.getPlayer(playerId);
        if (!player) return;

        document.getElementById('profile-name').textContent = `${player.firstname} ${player.lastname}`;

        // Stats
        const ratio = player.wins + player.losses > 0
            ? (player.wins / (player.wins + player.losses) * 100).toFixed(1)
            : 0;
        const evolution = player.elo - player.initialElo;

        document.getElementById('profile-stats').innerHTML = `
            <div class="profile-elo">${player.elo}</div>
            <div class="profile-elo-label">Points ELO</div>
            <div class="profile-stats-grid">
                <div class="profile-stat-item">
                    <strong>${player.wins}</strong>
                    <span>Victoires</span>
                </div>
                <div class="profile-stat-item">
                    <strong>${player.losses}</strong>
                    <span>Défaites</span>
                </div>
                <div class="profile-stat-item">
                    <strong>${ratio}%</strong>
                    <span>Ratio</span>
                </div>
                <div class="profile-stat-item">
                    <strong class="${evolution >= 0 ? 'positive' : 'negative'}" style="color: ${evolution >= 0 ? '#22c55e' : '#ef4444'}">
                        ${evolution >= 0 ? '+' : ''}${evolution}
                    </strong>
                    <span>Évolution</span>
                </div>
            </div>
        `;

        // Match history
        const matches = this.getPlayerMatches(playerId);
        document.getElementById('profile-matches').innerHTML = matches.slice(0, 10).map(m => {
            const opponent = this.getPlayer(m.player1Id === playerId ? m.player2Id : m.player1Id);
            const isWinner = m.winnerId === playerId;
            const score = m.player1Id === playerId ? `${m.score1} - ${m.score2}` : `${m.score2} - ${m.score1}`;
            const eloChange = m.eloChanges[playerId];

            return `
                <div class="history-item">
                    <span class="history-date">${new Date(m.date).toLocaleDateString('fr-FR')}</span>
                    <span class="history-player ${isWinner ? 'winner' : ''}">${isWinner ? 'Victoire' : 'Défaite'} vs ${opponent?.firstname || '?'}</span>
                    <span class="history-score">${score}</span>
                    <span class="history-elo-change ${eloChange >= 0 ? 'positive' : 'negative'}">
                        ${eloChange >= 0 ? '+' : ''}${eloChange}
                    </span>
                </div>
            `;
        }).join('') || '<div class="empty-state">Aucun match</div>';

        // ELO Chart (simple canvas chart)
        this.renderEloChart(player);

        this.showPage('player-profile');
    }

    renderEloChart(player) {
        const canvas = document.getElementById('elo-chart');
        const ctx = canvas.getContext('2d');

        // Set canvas size
        canvas.width = canvas.offsetWidth * 2;
        canvas.height = 400;
        ctx.scale(2, 2);

        const history = player.eloHistory;
        if (history.length < 2) {
            ctx.font = '14px Inter';
            ctx.fillStyle = '#6b6b6b';
            ctx.textAlign = 'center';
            ctx.fillText('Pas assez de données', canvas.offsetWidth / 2, 100);
            return;
        }

        const width = canvas.offsetWidth;
        const height = 200;
        const padding = 40;

        // Find min/max
        const elos = history.map(h => h.elo);
        const minElo = Math.min(...elos) - 50;
        const maxElo = Math.max(...elos) + 50;

        // Clear
        ctx.clearRect(0, 0, width, height);

        // Draw grid
        ctx.strokeStyle = '#e8e8e8';
        ctx.lineWidth = 1;
        for (let i = 0; i <= 4; i++) {
            const y = padding + (height - 2 * padding) * i / 4;
            ctx.beginPath();
            ctx.moveTo(padding, y);
            ctx.lineTo(width - padding, y);
            ctx.stroke();

            // Labels
            ctx.fillStyle = '#9a9a9a';
            ctx.font = '10px Inter';
            ctx.textAlign = 'right';
            const eloLabel = Math.round(maxElo - (maxElo - minElo) * i / 4);
            ctx.fillText(eloLabel, padding - 5, y + 3);
        }

        // Draw line
        ctx.strokeStyle = '#0b362d';
        ctx.lineWidth = 2;
        ctx.beginPath();

        history.forEach((point, i) => {
            const x = padding + (width - 2 * padding) * i / (history.length - 1);
            const y = padding + (height - 2 * padding) * (maxElo - point.elo) / (maxElo - minElo);

            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });

        ctx.stroke();

        // Draw points
        history.forEach((point, i) => {
            const x = padding + (width - 2 * padding) * i / (history.length - 1);
            const y = padding + (height - 2 * padding) * (maxElo - point.elo) / (maxElo - minElo);

            ctx.fillStyle = '#0b362d';
            ctx.beginPath();
            ctx.arc(x, y, 4, 0, Math.PI * 2);
            ctx.fill();
        });
    }

    renderHistory() {
        const search = document.getElementById('history-search').value.toLowerCase();
        const period = document.getElementById('history-period').value;

        let matches = [...this.data.matches].reverse();

        // Filter by period
        const now = Date.now();
        const day = 24 * 60 * 60 * 1000;
        switch (period) {
            case 'week':
                matches = matches.filter(m => m.date >= now - 7 * day);
                break;
            case 'month':
                matches = matches.filter(m => m.date >= now - 30 * day);
                break;
            case 'year':
                matches = matches.filter(m => m.date >= now - 365 * day);
                break;
        }

        // Filter by search
        if (search) {
            matches = matches.filter(m => {
                const p1 = this.getPlayer(m.player1Id);
                const p2 = this.getPlayer(m.player2Id);
                const name1 = `${p1?.firstname || ''} ${p1?.lastname || ''}`.toLowerCase();
                const name2 = `${p2?.firstname || ''} ${p2?.lastname || ''}`.toLowerCase();
                return name1.includes(search) || name2.includes(search);
            });
        }

        const list = document.getElementById('history-list');
        list.innerHTML = matches.map(m => {
            const p1 = this.getPlayer(m.player1Id);
            const p2 = this.getPlayer(m.player2Id);
            const winner = m.winnerId === m.player1Id ? p1 : p2;

            return `
                <div class="history-item">
                    <span class="history-date">${new Date(m.date).toLocaleDateString('fr-FR')}</span>
                    <div class="history-players">
                        <span class="history-player ${m.winnerId === m.player1Id ? 'winner' : ''}">
                            ${p1?.firstname || '?'} ${p1?.lastname || ''}
                        </span>
                        <span class="history-vs">vs</span>
                        <span class="history-player ${m.winnerId === m.player2Id ? 'winner' : ''}">
                            ${p2?.firstname || '?'} ${p2?.lastname || ''}
                        </span>
                    </div>
                    <span class="history-score">${m.score1} - ${m.score2}</span>
                    <div class="history-elo-changes">
                        <span class="history-elo-change ${m.eloChanges[m.player1Id] >= 0 ? 'positive' : 'negative'}">
                            ${m.eloChanges[m.player1Id] >= 0 ? '+' : ''}${m.eloChanges[m.player1Id]}
                        </span>
                        <span class="history-elo-change ${m.eloChanges[m.player2Id] >= 0 ? 'positive' : 'negative'}">
                            ${m.eloChanges[m.player2Id] >= 0 ? '+' : ''}${m.eloChanges[m.player2Id]}
                        </span>
                    </div>
                </div>
            `;
        }).join('');

        if (matches.length === 0) {
            list.innerHTML = '<div class="empty-state"><div class="empty-state-icon">📜</div><div class="empty-state-title">Aucun match trouvé</div></div>';
        }
    }

    // ==========================================
    // Utilitaires
    // ==========================================

    showAddPlayerModal() {
        this.openModal('add-player-modal');
    }

    openModal(modalId) {
        document.getElementById(modalId).classList.add('active');
    }

    closeModal(modalId) {
        document.getElementById(modalId).classList.remove('active');
    }

    showToast(message, type = 'info') {
        const container = document.getElementById('toast-container');
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        container.appendChild(toast);

        setTimeout(() => {
            toast.remove();
        }, 3000);
    }
}

// Initialize app
const app = new PingPangApp();
