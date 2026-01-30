// KartApp - DataService for Dynamic Data Loading
// Now uses pre-loaded JavaScript variables instead of fetch (for file:// compatibility)

class DataService {
    constructor() {
        this.coursePlan = null;
        this.lexicon = null;
        this.rules = null;
        this.loaded = false;
    }

    async loadAll() {
        try {
            // Use global variables loaded via script tags
            if (typeof COURSE_PLAN !== 'undefined') {
                this.coursePlan = COURSE_PLAN;
            }
            if (typeof LEXICON !== 'undefined') {
                this.lexicon = LEXICON;
            }
            if (typeof RULES !== 'undefined') {
                this.rules = RULES;
            }

            this.loaded = !!(this.coursePlan && this.lexicon && this.rules);

            if (this.loaded) {
                console.log('DataService: All data loaded successfully');
                console.log('  - Units:', this.coursePlan?.units?.length || 0);
                console.log('  - Verbs:', this.lexicon?.verbs?.length || 0);
                console.log('  - Nouns:', this.lexicon?.nouns?.length || 0);
                console.log('  - Rules:', this.rules?.length || 0);
            } else {
                console.warn('DataService: Some data files are missing');
            }

            return this.loaded;
        } catch (error) {
            console.error('DataService: Error loading data', error);
            this.loaded = false;
            return false;
        }
    }

    // ========== Course Plan Methods ==========

    getAdvancedUnits(level = null) {
        if (this.coursePlan && this.coursePlan.units) {
            if (level) {
                return this.coursePlan.units.filter(u => u.level === level);
            }
            return this.coursePlan.units;
        }
        return [];
    }

    getUnitById(unitId) {
        if (this.coursePlan && this.coursePlan.units) {
            return this.coursePlan.units.find(u => u.id === unitId);
        }
        return null;
    }

    // ========== Grammar Rules Methods ==========

    getRules(level = null) {
        if (this.rules) {
            if (level) {
                return this.rules.filter(r => r.level === level);
            }
            return this.rules;
        }
        return [];
    }

    getRuleById(id) {
        if (this.rules) {
            return this.rules.find(r => r.id === id);
        }
        return null;
    }

    getRulesForUnit(unitId) {
        const unit = this.getUnitById(unitId);
        if (unit && unit.rules && this.rules) {
            return unit.rules.map(ruleId => this.getRuleById(ruleId)).filter(Boolean);
        }
        return [];
    }

    // ========== Lexicon - Verbs ==========

    getVerbs(level = null) {
        if (this.lexicon && this.lexicon.verbs) {
            if (level) {
                return this.lexicon.verbs.filter(v => v.level === level);
            }
            return this.lexicon.verbs;
        }
        return [];
    }

    getVerbById(id) {
        if (this.lexicon && this.lexicon.verbs) {
            return this.lexicon.verbs.find(v => v.id === id);
        }
        return null;
    }

    getVerbByRoot(root) {
        if (this.lexicon && this.lexicon.verbs) {
            return this.lexicon.verbs.find(v => v.root === root);
        }
        return null;
    }

    getVerbConjugation(verbId, tense = 'present') {
        const verb = this.getVerbById(verbId);
        if (verb && verb.conjugation && verb.conjugation[tense]) {
            return verb.conjugation[tense];
        }
        return null;
    }

    getVerbFamily(verbId) {
        const verb = this.getVerbById(verbId);
        if (verb && verb.family) {
            return verb.family;
        }
        return null;
    }

    // ========== Lexicon - Nouns ==========

    getNouns(level = null) {
        if (this.lexicon && this.lexicon.nouns) {
            if (level) {
                return this.lexicon.nouns.filter(n => n.level === level);
            }
            return this.lexicon.nouns;
        }
        return [];
    }

    getNounById(id) {
        if (this.lexicon && this.lexicon.nouns) {
            return this.lexicon.nouns.find(n => n.id === id);
        }
        return null;
    }

    getNounByNominative(nominative) {
        if (this.lexicon && this.lexicon.nouns) {
            return this.lexicon.nouns.find(n => n.nominative === nominative);
        }
        return null;
    }

    getNounDeclension(nominative) {
        const noun = this.getNounByNominative(nominative);
        return noun ? noun.declension : null;
    }

    getNounCase(nominative, caseName) {
        const declension = this.getNounDeclension(nominative);
        return declension ? declension[caseName] : null;
    }

    // ========== Lexicon - Adjectives ==========

    getAdjectives(level = null) {
        if (this.lexicon && this.lexicon.adjectives) {
            if (level) {
                return this.lexicon.adjectives.filter(a => a.level === level);
            }
            return this.lexicon.adjectives;
        }
        return [];
    }

    getAdjectiveById(id) {
        if (this.lexicon && this.lexicon.adjectives) {
            return this.lexicon.adjectives.find(a => a.id === id);
        }
        return null;
    }

    // ========== Lexicon - Postpositions ==========

    getPostpositions() {
        if (this.lexicon && this.lexicon.postpositions) {
            return this.lexicon.postpositions.items || [];
        }
        return [];
    }

    getPostpositionById(id) {
        const postpositions = this.getPostpositions();
        return postpositions.find(p => p.id === id);
    }

    // ========== Lexicon - Pronouns ==========

    getPronouns() {
        if (this.lexicon && this.lexicon.pronouns) {
            return this.lexicon.pronouns;
        }
        return null;
    }

    getPersonalPronouns() {
        const pronouns = this.getPronouns();
        return pronouns ? pronouns.personal : null;
    }

    getPronounForms(person) {
        const personal = this.getPersonalPronouns();
        if (personal && personal.forms) {
            return personal.forms.find(p => p.person === person);
        }
        return null;
    }

    // ========== Lexicon - Conjunctions & Adverbs ==========

    getConjunctions(level = null) {
        if (this.lexicon && this.lexicon.conjunctions && this.lexicon.conjunctions.items) {
            if (level) {
                return this.lexicon.conjunctions.items.filter(c => c.level === level);
            }
            return this.lexicon.conjunctions.items;
        }
        return [];
    }

    getAdverbs(level = null) {
        if (this.lexicon && this.lexicon.adverbs && this.lexicon.adverbs.items) {
            if (level) {
                return this.lexicon.adverbs.items.filter(a => a.level === level);
            }
            return this.lexicon.adverbs.items;
        }
        return [];
    }

    // ========== Lexicon - Numbers ==========

    getNumbers() {
        if (this.lexicon && this.lexicon.numbers) {
            return this.lexicon.numbers;
        }
        return null;
    }

    getCardinalNumbers() {
        const numbers = this.getNumbers();
        return numbers ? numbers.cardinals : [];
    }

    // ========== Search & Utility Methods ==========

    searchVocabulary(query) {
        const results = [];
        const q = query.toLowerCase();

        if (this.lexicon) {
            this.lexicon.verbs?.forEach(v => {
                if (v.root?.includes(q) || v.meaning?.toLowerCase().includes(q) ||
                    v.infinitive?.includes(q)) {
                    results.push({ type: 'verb', ...v });
                }
            });

            this.lexicon.nouns?.forEach(n => {
                if (n.nominative?.includes(q) || n.meaning?.toLowerCase().includes(q)) {
                    results.push({ type: 'noun', ...n });
                }
            });

            this.lexicon.adjectives?.forEach(a => {
                if (a.base?.includes(q) || a.meaning?.toLowerCase().includes(q)) {
                    results.push({ type: 'adjective', ...a });
                }
            });

            this.lexicon.conjunctions?.items?.forEach(c => {
                if (c.geo?.includes(q) || c.meaning?.toLowerCase().includes(q)) {
                    results.push({ type: 'conjunction', ...c });
                }
            });

            this.lexicon.adverbs?.items?.forEach(a => {
                if (a.geo?.includes(q) || a.meaning?.toLowerCase().includes(q)) {
                    results.push({ type: 'adverb', ...a });
                }
            });
        }

        return results;
    }

    getVocabularyByLevel(level) {
        const vocab = [];

        if (this.lexicon) {
            this.lexicon.verbs?.filter(v => v.level === level).forEach(v => {
                vocab.push({
                    geo: v.conjugation?.present?.['3sg'] || v.family?.base || v.root,
                    meaning: v.meaning,
                    type: 'verb',
                    level: v.level,
                    translit: '',
                    data: v
                });
            });

            this.lexicon.nouns?.filter(n => n.level === level).forEach(n => {
                vocab.push({
                    geo: n.nominative,
                    meaning: n.meaning,
                    type: 'noun',
                    level: n.level,
                    translit: '',
                    data: n
                });
            });

            this.lexicon.adjectives?.filter(a => a.level === level).forEach(a => {
                vocab.push({
                    geo: a.base,
                    meaning: a.meaning,
                    type: 'adjective',
                    level: a.level,
                    translit: '',
                    data: a
                });
            });
        }

        return vocab;
    }

    getVocabularyStats() {
        if (!this.lexicon) return null;

        return {
            verbs: this.lexicon.verbs?.length || 0,
            nouns: this.lexicon.nouns?.length || 0,
            adjectives: this.lexicon.adjectives?.length || 0,
            postpositions: this.lexicon.postpositions?.items?.length || 0,
            conjunctions: this.lexicon.conjunctions?.items?.length || 0,
            adverbs: this.lexicon.adverbs?.items?.length || 0,
            total: (this.lexicon.verbs?.length || 0) +
                   (this.lexicon.nouns?.length || 0) +
                   (this.lexicon.adjectives?.length || 0)
        };
    }

    // ========== Ergativity & Case Helpers ==========

    getCaseAlignmentForSeries(series) {
        const alignments = {
            'I': { agent: 'nominative', patient: 'dative' },
            'II': { agent: 'ergative', patient: 'nominative' },
            'III': { agent: 'dative', patient: 'nominative' }
        };
        return alignments[series] || alignments['I'];
    }

    isInversiveVerb(verbId) {
        const verb = this.getVerbById(verbId);
        return verb && verb.class === 'inversif';
    }

    hasDoubleMarking(verbId) {
        const verb = this.getVerbById(verbId);
        return verb && verb.doubleMarking === true;
    }
}

// Global DataService instance
const dataService = new DataService();
