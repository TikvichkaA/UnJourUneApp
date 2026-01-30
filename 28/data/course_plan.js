const COURSE_PLAN = 
{
  "courseId": "ka-fr",
  "title": "Apprendre le géorgien (FR) — A2 à B2",
  "levels": ["A2", "B1", "B2"],
  "units": [
    {
      "id": "A2.U1",
      "level": "A2",
      "title": "Système des cas — Vue d'ensemble",
      "description": "Les 7 cas du géorgien",
      "focus": ["cases", "morphology"],
      "rules": ["R.CASES.OVERVIEW"],
      "lessons": [
        {
          "id": "A2.U1.L1",
          "title": "Les 7 cas géorgiens",
          "content": "<h3>Pourquoi des cas ?</h3><p>Les cas indiquent la fonction grammaticale du nom (sujet, objet, etc.). En géorgien, ils sont marqués par des suffixes.</p>",
          "grammarTable": {
            "title": "Les 7 cas",
            "example": "კაცი (homme)",
            "rows": [
              { "case": "Nominatif", "suffix": "-ი/-ა/ø", "form": "კაცი", "function": "Sujet (présent/futur)" },
              { "case": "Ergatif", "suffix": "-მა", "form": "კაცმა", "function": "Agent (aoriste)" },
              { "case": "Datif", "suffix": "-ს", "form": "კაცს", "function": "COI, bénéficiaire" },
              { "case": "Génitif", "suffix": "-ის", "form": "კაცის", "function": "Possession" },
              { "case": "Instrumental", "suffix": "-ით", "form": "კაცით", "function": "Moyen, instrument" },
              { "case": "Adverbial", "suffix": "-ად", "form": "კაცად", "function": "Transformation, manière" },
              { "case": "Vocatif", "suffix": "-ო", "form": "კაცო!", "function": "Interpellation" }
            ]
          }
        }
      ],
      "exercises": [
        {
          "type": "mcq_case",
          "question": "Quel cas utilise le suffixe -მა ?",
          "options": [
            { "text": "Ergatif", "correct": true },
            { "text": "Datif", "correct": false },
            { "text": "Génitif", "correct": false }
          ],
          "feedback": {
            "correct": "Exact ! L'ergatif en -მა marque l'agent à l'aoriste.",
            "incorrect": "L'ergatif utilise -მა. Le datif = -ს, le génitif = -ის."
          }
        }
      ]
    },

    {
      "id": "A2.U2",
      "level": "A2",
      "title": "Nominatif et Ergatif — Le grand basculement",
      "description": "Comprendre l'ergativité",
      "focus": ["ergativity", "nominative", "ergative"],
      "rules": ["R.CASE.ERGATIVE.INTRO", "R.CASE.NOMINATIVE"],
      "lessons": [
        {
          "id": "A2.U2.L1",
          "title": "Présent vs Aoriste : qui est le sujet ?",
          "content": "<h3>Le concept clé</h3><p>En géorgien, le marquage du sujet <strong>change selon le temps</strong>. C'est l'ergativité.</p>",
          "comparison": [
            {
              "label": "Présent (Série I)",
              "geo": "კაცი წერილს წერს",
              "translit": "k'atsi tserils tsers",
              "meaning": "L'homme écrit une lettre",
              "analysis": "კაცი (NOM) = sujet, წერილს (ACC) = objet"
            },
            {
              "label": "Aoriste (Série II)",
              "geo": "კაცმა წერილი დაწერა",
              "translit": "k'atsma tserili datsera",
              "meaning": "L'homme a écrit une lettre",
              "analysis": "კაცმა (ERG) = agent, წერილი (NOM) = patient"
            }
          ],
          "warning": "L'objet au présent (ACC) devient sujet grammatical à l'aoriste (NOM) !"
        },
        {
          "id": "A2.U2.L2",
          "title": "Tableau récapitulatif",
          "content": "<h3>Alignement selon la série</h3>",
          "grammarTable": {
            "title": "Qui prend quel cas ?",
            "rows": [
              { "series": "Série I (Présent)", "agent": "Nominatif", "patient": "Accusatif/Datif" },
              { "series": "Série II (Aoriste)", "agent": "Ergatif (-მა)", "patient": "Nominatif" },
              { "series": "Série III (Parfait)", "agent": "Datif", "patient": "Nominatif" }
            ]
          }
        }
      ],
      "exercises": [
        {
          "type": "identify_agent_patient",
          "question": "Dans 'ბავშვმა წიგნი წაიკითხა', identifiez l'agent.",
          "prompt": "ბავშვმა წიგნი წაიკითხა",
          "meaning": "L'enfant a lu le livre",
          "options": [
            { "text": "ბავშვმა (l'enfant - ERG)", "correct": true },
            { "text": "წიგნი (le livre - NOM)", "correct": false }
          ],
          "feedback": {
            "correct": "Exact ! ბავშვმა avec -მა est l'agent (ergatif).",
            "incorrect": "ბავშვმა (avec -მა) est l'agent. წიგნი (NOM) est le patient."
          }
        },
        {
          "type": "contrast_case",
          "question": "Transformez au présent : 'კაცმა დაწერა' → ?",
          "options": [
            { "text": "კაცი წერს", "correct": true },
            { "text": "კაცმა წერს", "correct": false },
            { "text": "კაცს წერს", "correct": false }
          ],
          "feedback": {
            "correct": "Bravo ! Au présent, l'agent reprend le nominatif : კაცი.",
            "incorrect": "Au présent (Série I), l'agent est au nominatif, pas à l'ergatif."
          }
        }
      ]
    },

    {
      "id": "A2.U3",
      "level": "A2",
      "title": "Datif et Génitif",
      "description": "Complément indirect et possession",
      "focus": ["dative", "genitive"],
      "rules": ["R.CASE.DATIVE", "R.CASE.GENITIVE"],
      "lessons": [
        {
          "id": "A2.U3.L1",
          "title": "Le datif (-ს)",
          "content": "<h3>À qui ? Pour qui ?</h3><p>Le datif marque le bénéficiaire ou le destinataire.</p>",
          "examples": [
            { "geo": "მე მას წიგნს ვაძლევ", "translit": "me mas tsigns vadzlev", "meaning": "Je lui donne un livre", "gloss": "je lui-DAT livre-ACC je.donne" },
            { "geo": "დედას ვეხმარები", "translit": "dedas vekhmarebi", "meaning": "J'aide (ma) mère", "gloss": "mère-DAT je.aide" }
          ],
          "note": "Certains verbes (aider, croire, etc.) régissent le datif pour leur 'objet'."
        },
        {
          "id": "A2.U3.L2",
          "title": "Le génitif (-ის)",
          "content": "<h3>La possession</h3><p>Le génitif exprime l'appartenance. Il précède le nom possédé.</p>",
          "examples": [
            { "geo": "კაცის სახლი", "translit": "k'atsis sakhli", "meaning": "la maison de l'homme", "gloss": "homme-GEN maison" },
            { "geo": "საქართველოს დედაქალაქი", "translit": "sakartvelos dedakalaki", "meaning": "la capitale de la Géorgie" }
          ]
        }
      ],
      "exercises": [
        {
          "type": "mcq_case",
          "question": "Comment dit-on 'le livre de l'enfant' ?",
          "options": [
            { "text": "ბავშვის წიგნი", "correct": true },
            { "text": "ბავშვს წიგნი", "correct": false },
            { "text": "ბავშვი წიგნი", "correct": false }
          ],
          "feedback": {
            "correct": "Exact ! Génitif -ის pour la possession.",
            "incorrect": "Le génitif utilise -ის : ბავშვის (de l'enfant)."
          }
        }
      ]
    },

    {
      "id": "A2.U4",
      "level": "A2",
      "title": "Instrumental et Adverbial",
      "description": "Moyen et transformation",
      "focus": ["instrumental", "adverbial"],
      "rules": ["R.CASE.INSTRUMENTAL", "R.CASE.ADVERBIAL"],
      "lessons": [
        {
          "id": "A2.U4.L1",
          "title": "L'instrumental (-ით)",
          "content": "<h3>Avec quoi ? Par quel moyen ?</h3>",
          "examples": [
            { "geo": "კალმით ვწერ", "translit": "kalmit vtser", "meaning": "J'écris avec un stylo" },
            { "geo": "მანქანით მივდივარ", "translit": "mankanit mivdivar", "meaning": "J'y vais en voiture" },
            { "geo": "სიხარულით", "translit": "sikharulით", "meaning": "avec joie" }
          ]
        },
        {
          "id": "A2.U4.L2",
          "title": "L'adverbial (-ად)",
          "content": "<h3>Devenir, en tant que</h3><p>L'adverbial exprime la transformation ou la fonction.</p>",
          "examples": [
            { "geo": "ექიმად მუშაობს", "translit": "ekimad mushaobs", "meaning": "Il travaille comme médecin" },
            { "geo": "მეგობრად მიმიჩნევს", "translit": "megobrad mimichnevs", "meaning": "Il me considère comme ami" },
            { "geo": "ქართულად", "translit": "kartulad", "meaning": "en géorgien" }
          ]
        }
      ],
      "exercises": [
        {
          "type": "mcq_case",
          "question": "'J'écris en géorgien' = ?",
          "options": [
            { "text": "ქართულად ვწერ", "correct": true },
            { "text": "ქართულით ვწერ", "correct": false },
            { "text": "ქართულის ვწერ", "correct": false }
          ],
          "feedback": {
            "correct": "Bravo ! -ად pour 'en (langue)', manière.",
            "incorrect": "Pour 'en géorgien' (langue/manière), on utilise l'adverbial -ად."
          }
        }
      ]
    },

    {
      "id": "A2.U5",
      "level": "A2",
      "title": "Postpositions locatives",
      "description": "Dans, sur, vers, de",
      "focus": ["postpositions", "location"],
      "rules": ["R.POSTPOSITIONS"],
      "lessons": [
        {
          "id": "A2.U5.L1",
          "title": "Lieu statique vs mouvement",
          "content": "<h3>Où ? vs D'où ? Vers où ?</h3>",
          "grammarTable": {
            "title": "Les postpositions locatives",
            "rows": [
              { "meaning": "dans (statique)", "suffix": "-ში", "example": "სახლში (dans la maison)" },
              { "meaning": "sur (statique)", "suffix": "-ზე", "example": "მაგიდაზე (sur la table)" },
              { "meaning": "chez, près de", "suffix": "-თან", "example": "მასთან (chez lui)" },
              { "meaning": "de (provenance)", "suffix": "-დან", "example": "სახლიდან (de la maison)" },
              { "meaning": "jusqu'à", "suffix": "-მდე", "example": "სახლამდე (jusqu'à la maison)" },
              { "meaning": "vers (direction)", "suffix": "-კენ", "example": "სახლისკენ (vers la maison)" }
            ]
          },
          "examples": [
            { "geo": "თბილისში ვცხოვრობ", "translit": "tbilisshi vtskhovrob", "meaning": "J'habite à Tbilissi" },
            { "geo": "თბილისიდან მოვდივარ", "translit": "tbilisidan movdivar", "meaning": "Je viens de Tbilissi" },
            { "geo": "თბილისისკენ მივდივარ", "translit": "tbilisisken mivdivar", "meaning": "Je vais vers Tbilissi" }
          ]
        }
      ],
      "exercises": [
        {
          "type": "fill_postposition",
          "question": "Je travaille à Batoumi = ბათუმ___ ვმუშაობ",
          "options": [
            { "text": "-ში", "correct": true },
            { "text": "-დან", "correct": false },
            { "text": "-კენ", "correct": false }
          ],
          "feedback": {
            "correct": "Exact ! -ში pour un lieu statique.",
            "incorrect": "-ში = dans (statique), -დან = de, -კენ = vers."
          }
        }
      ]
    },

    {
      "id": "A2.U6",
      "level": "A2",
      "title": "L'aoriste (Série II)",
      "description": "Le passé narratif",
      "focus": ["aorist", "past", "series2"],
      "rules": ["R.AORIST.S2"],
      "lessons": [
        {
          "id": "A2.U6.L1",
          "title": "Formation de l'aoriste",
          "content": "<h3>Action ponctuelle accomplie</h3><p>L'aoriste est LE temps du récit. Il déclenche l'ergativité.</p>",
          "conjugation": {
            "verb": "დაწერა (écrire - aoriste)",
            "root": "წერ",
            "preverb": "და-",
            "forms": [
              { "person": "მე", "form": "დავწერე", "translit": "davtsere" },
              { "person": "შენ", "form": "დაწერე", "translit": "datsere" },
              { "person": "მან", "form": "დაწერა", "translit": "datsera" },
              { "person": "ჩვენ", "form": "დავწერეთ", "translit": "davtseret" },
              { "person": "თქვენ", "form": "დაწერეთ", "translit": "datseret" },
              { "person": "მათ", "form": "დაწერეს", "translit": "datseres" }
            ]
          },
          "note": "Les pronoms changent aussi : ის → მან (il/elle agent), ისინი → მათ"
        },
        {
          "id": "A2.U6.L2",
          "title": "Exemples en contexte",
          "content": "<h3>Récit au passé</h3>",
          "examples": [
            { "geo": "გუშინ წერილი დავწერე", "translit": "gushin tserili davtsere", "meaning": "Hier j'ai écrit une lettre" },
            { "geo": "მან კარი გააღო", "translit": "man k'ari gaagho", "meaning": "Il/Elle a ouvert la porte" },
            { "geo": "რა ქენი?", "translit": "ra keni?", "meaning": "Qu'as-tu fait ?" }
          ]
        }
      ],
      "exercises": [
        {
          "type": "micro_conjugation",
          "question": "Conjuguez 'lire' (წაკითხვა) à l'aoriste, 1ère personne",
          "options": [
            { "text": "წავიკითხე", "correct": true },
            { "text": "ვკითხულობ", "correct": false },
            { "text": "წაიკითხა", "correct": false }
          ],
          "feedback": {
            "correct": "Parfait ! წავიკითხე = j'ai lu.",
            "incorrect": "წავიკითხე (aoriste 1SG). ვკითხულობ = présent."
          }
        }
      ]
    },

    {
      "id": "A2.U7",
      "level": "A2",
      "title": "Préverbes directionnels",
      "description": "Modifier le sens des verbes",
      "focus": ["preverbs", "direction"],
      "rules": ["R.VERB.PREVERBS.DIRECTION"],
      "lessons": [
        {
          "id": "A2.U7.L1",
          "title": "Les préverbes de mouvement",
          "content": "<h3>Direction et orientation</h3>",
          "grammarTable": {
            "title": "Préverbes courants",
            "rows": [
              { "preverb": "მი-", "meaning": "vers là-bas (éloignement)", "example": "მივიდა (il y est allé)" },
              { "preverb": "მო-", "meaning": "vers ici (rapprochement)", "example": "მოვიდა (il est venu)" },
              { "preverb": "შე-", "meaning": "dedans, entrée", "example": "შევიდა (il est entré)" },
              { "preverb": "გა-", "meaning": "dehors, sortie", "example": "გავიდა (il est sorti)" },
              { "preverb": "ა-", "meaning": "vers le haut", "example": "ავიდა (il est monté)" },
              { "preverb": "ჩა-", "meaning": "vers le bas", "example": "ჩავიდა (il est descendu)" },
              { "preverb": "გადა-", "meaning": "à travers, transfert", "example": "გადავიდა (il a traversé)" },
              { "preverb": "და-", "meaning": "action accomplie", "example": "დაწერა (il a écrit)" }
            ]
          }
        },
        {
          "id": "A2.U7.L2",
          "title": "Famille du verbe 'aller'",
          "content": "<h3>სვლა / ვიდ- : aller</h3>",
          "verbFamily": [
            { "geo": "მივდივარ", "translit": "mivdivar", "meaning": "je vais (là-bas)" },
            { "geo": "მოვდივარ", "translit": "movdivar", "meaning": "je viens (ici)" },
            { "geo": "შევდივარ", "translit": "shevdivar", "meaning": "j'entre" },
            { "geo": "გავდივარ", "translit": "gavdivar", "meaning": "je sors" },
            { "geo": "ავდივარ", "translit": "avdivar", "meaning": "je monte" },
            { "geo": "ჩავდივარ", "translit": "chavdivar", "meaning": "je descends" }
          ]
        }
      ],
      "exercises": [
        {
          "type": "family_recognition",
          "question": "Quel préverbe pour 'il est entré' ?",
          "options": [
            { "text": "შე- (შევიდა)", "correct": true },
            { "text": "გა- (გავიდა)", "correct": false },
            { "text": "მი- (მივიდა)", "correct": false }
          ],
          "feedback": {
            "correct": "Exact ! შე- = dedans, entrée.",
            "incorrect": "შე- = entrer, გა- = sortir, მი- = aller vers là-bas."
          }
        }
      ]
    },

    {
      "id": "A2.U8",
      "level": "A2",
      "title": "Le futur",
      "description": "Exprimer les actions à venir",
      "focus": ["future", "series1"],
      "rules": ["R.FUTURE"],
      "lessons": [
        {
          "id": "A2.U8.L1",
          "title": "Formation du futur",
          "content": "<h3>Préverbe + présent modifié</h3><p>Le futur utilise le même alignement que le présent (Série I) mais avec un préverbe.</p>",
          "conjugation": {
            "verb": "დაწერს (écrire - futur)",
            "forms": [
              { "person": "მე", "form": "დავწერ", "translit": "davtser", "meaning": "j'écrirai" },
              { "person": "შენ", "form": "დაწერ", "translit": "datser", "meaning": "tu écriras" },
              { "person": "ის", "form": "დაწერს", "translit": "datsers", "meaning": "il/elle écrira" },
              { "person": "ჩვენ", "form": "დავწერთ", "translit": "davtsert", "meaning": "nous écrirons" },
              { "person": "თქვენ", "form": "დაწერთ", "translit": "datsert", "meaning": "vous écrirez" },
              { "person": "ისინი", "form": "დაწერენ", "translit": "datseren", "meaning": "ils écriront" }
            ]
          },
          "examples": [
            { "geo": "ხვალ წერილს დავწერ", "translit": "khval tserils davtser", "meaning": "Demain j'écrirai une lettre" },
            { "geo": "მალე მოვალ", "translit": "male moval", "meaning": "Je viendrai bientôt" }
          ]
        }
      ],
      "exercises": [
        {
          "type": "mcq_tense",
          "question": "Quelle est la différence entre ვწერ et დავწერ ?",
          "options": [
            { "text": "ვწერ = présent, დავწერ = futur", "correct": true },
            { "text": "ვწერ = futur, დავწერ = présent", "correct": false },
            { "text": "Ils sont synonymes", "correct": false }
          ],
          "feedback": {
            "correct": "Exact ! Le préverbe და- transforme le présent en futur.",
            "incorrect": "Le préverbe და- marque le futur (ou l'accompli selon le contexte)."
          }
        }
      ]
    },

    {
      "id": "B1.U1",
      "level": "B1",
      "title": "Système verbal — Vue complète",
      "description": "Les 3 séries et leurs temps",
      "focus": ["verbal-system", "screeves"],
      "rules": ["R.VERBAL.SYSTEM.OVERVIEW"],
      "lessons": [
        {
          "id": "B1.U1.L1",
          "title": "Les 11 temps (screeves)",
          "content": "<h3>Architecture complète</h3>",
          "grammarTable": {
            "title": "Les séries verbales",
            "rows": [
              { "series": "Série I", "tenses": ["Présent", "Imparfait", "Présent du subjonctif", "Futur", "Conditionnel"], "alignment": "NOM-ACC/DAT" },
              { "series": "Série II", "tenses": ["Aoriste", "Optatif"], "alignment": "ERG-NOM" },
              { "series": "Série III", "tenses": ["Parfait", "Plus-que-parfait", "Parfait du subjonctif", "Parfait conditionnel"], "alignment": "DAT-NOM" }
            ]
          }
        },
        {
          "id": "B1.U1.L2",
          "title": "L'imparfait",
          "content": "<h3>Action passée en cours</h3>",
          "examples": [
            { "geo": "ვწერდი", "translit": "vtserd", "meaning": "j'écrivais" },
            { "geo": "ის წიგნს კითხულობდა", "translit": "is tsigns kitkhuloda", "meaning": "il lisait un livre" }
          ],
          "note": "L'imparfait utilise l'alignement NOM-ACC comme le présent."
        }
      ],
      "exercises": [
        {
          "type": "morphology_parse",
          "question": "Décomposez : წავიკითხე",
          "answer": {
            "preverb": "წა-",
            "prefix": "ვ- (1SG)",
            "root": "კითხ",
            "suffix": "-ე (aoriste)",
            "meaning": "j'ai lu"
          },
          "options": [
            { "text": "წა- + ვ- + კითხ + -ე (aoriste 1SG)", "correct": true },
            { "text": "წავი- + კითხე (présent)", "correct": false }
          ],
          "feedback": {
            "correct": "Parfait ! Préverbe წა- + préfixe personnel ვ- + radical კითხ + suffixe aoriste -ე.",
            "incorrect": "Décomposition : წა- (préverbe) + ვ- (1SG) + კითხ (radical) + -ე (aoriste)."
          }
        }
      ]
    },

    {
      "id": "B1.U2",
      "level": "B1",
      "title": "Double marquage — Verbes bivalents",
      "description": "Agent et bénéficiaire encodés ensemble",
      "focus": ["double-marking", "bivalent-verbs"],
      "rules": ["R.DOUBLE.MARKING"],
      "lessons": [
        {
          "id": "B1.U2.L1",
          "title": "Donner, montrer, dire",
          "content": "<h3>Deux personnes dans un verbe</h3><p>Les verbes comme 'donner' encodent QUI donne ET À QUI.</p>",
          "grammarTable": {
            "title": "ძლევა (donner)",
            "rows": [
              { "form": "მაძლევს", "meaning": "il me donne", "analysis": "მ- (me) + ა- + ძლევ + ს (il)" },
              { "form": "გაძლევს", "meaning": "il te donne", "analysis": "გ- (te) + ა- + ძლევ + ს (il)" },
              { "form": "ვაძლევ", "meaning": "je lui donne", "analysis": "ვ- (je) + ა- + ძლევ + ø" },
              { "form": "გაძლევ", "meaning": "je te donne", "analysis": "გ- (te) + ა- + ძლევ + ვ- (je)" },
              { "form": "მოგცემ", "meaning": "je te donnerai", "analysis": "მო- + გ- (te) + ცემ + ø (je)" }
            ]
          }
        },
        {
          "id": "B1.U2.L2",
          "title": "Préfixes d'objet",
          "content": "<h3>Qui reçoit ?</h3>",
          "grammarTable": {
            "title": "Préfixes de bénéficiaire",
            "rows": [
              { "person": "1SG (me)", "prefix": "მ-" },
              { "person": "2SG (te)", "prefix": "გ-" },
              { "person": "3SG (lui)", "prefix": "ø / ს- / ჰ-" },
              { "person": "1PL (nous)", "prefix": "გვ-" },
              { "person": "2PL (vous)", "prefix": "გ-...-თ" },
              { "person": "3PL (leur)", "prefix": "ø / ს- / ჰ-" }
            ]
          }
        }
      ],
      "exercises": [
        {
          "type": "slot_fill_roles",
          "question": "მაძლევს = qui donne à qui ?",
          "options": [
            { "text": "Il/Elle me donne", "correct": true },
            { "text": "Je lui donne", "correct": false },
            { "text": "Tu me donnes", "correct": false }
          ],
          "feedback": {
            "correct": "Exact ! მ- = me (bénéficiaire), -ს = il/elle (agent).",
            "incorrect": "მ- indique 'me' (1SG objet), -ს indique 'il/elle' (3SG sujet)."
          }
        }
      ]
    },

    {
      "id": "B1.U3",
      "level": "B1",
      "title": "Parfait et Plus-que-parfait (Série III)",
      "description": "Le résultat d'une action passée",
      "focus": ["perfect", "series3"],
      "rules": ["R.PERFECT.S3"],
      "lessons": [
        {
          "id": "B1.U3.L1",
          "title": "Le parfait — Résultat présent",
          "content": "<h3>Série III : l'agent au datif</h3><p>Le parfait décrit un état résultant d'une action passée. L'agent prend le DATIF.</p>",
          "examples": [
            { "geo": "მე დამიწერია წერილი", "translit": "me damitseria tserili", "meaning": "J'ai (déjà) écrit une lettre", "analysis": "მე (DAT implicite) + და-მ-ი-წერ-ია + წერილი (NOM)" },
            { "geo": "მას წაუკითხავს წიგნი", "translit": "mas tsauk'itkhavs tsigni", "meaning": "Il a lu un livre (et s'en souvient)", "analysis": "მას (DAT) + წაუკითხავს + წიგნი (NOM)" }
          ],
          "warning": "L'agent est au DATIF, pas à l'ergatif !"
        }
      ],
      "exercises": [
        {
          "type": "mcq_case",
          "question": "Au parfait, l'agent prend quel cas ?",
          "options": [
            { "text": "Datif", "correct": true },
            { "text": "Ergatif", "correct": false },
            { "text": "Nominatif", "correct": false }
          ],
          "feedback": {
            "correct": "Exact ! Série III = agent au datif.",
            "incorrect": "Série III (parfait) : agent au DATIF. Série II (aoriste) : ergatif."
          }
        }
      ]
    },

    {
      "id": "B1.U4",
      "level": "B1",
      "title": "Subordonnées — რომ, თუ, როცა",
      "description": "Phrases complexes",
      "focus": ["subordination", "conjunctions"],
      "rules": ["R.SUBORDINATION"],
      "lessons": [
        {
          "id": "B1.U4.L1",
          "title": "Les conjonctions",
          "content": "<h3>Construire des phrases complexes</h3>",
          "vocabulary": [
            { "geo": "რომ", "translit": "rom", "meaning": "que (complétive), si (irréel)" },
            { "geo": "თუ", "translit": "tu", "meaning": "si (condition réelle)" },
            { "geo": "როცა", "translit": "rotsa", "meaning": "quand" },
            { "geo": "სანამ", "translit": "sanam", "meaning": "avant que, tant que" },
            { "geo": "მას შემდეგ რაც", "translit": "mas shemdeg rats", "meaning": "après que" },
            { "geo": "რადგან", "translit": "radgan", "meaning": "parce que" },
            { "geo": "თუმცა", "translit": "tumtsa", "meaning": "bien que" }
          ],
          "examples": [
            { "geo": "ვიცი, რომ შენ ქართული იცი", "translit": "vitsi, rom shen kartuli itsi", "meaning": "Je sais que tu connais le géorgien" },
            { "geo": "თუ მოხვალ, მოგვიყევი", "translit": "tu mokhval, mogviqevi", "meaning": "Si tu viens, raconte-nous" },
            { "geo": "როცა პატარა ვიყავი, სოფელში ვცხოვრობდი", "translit": "rotsa patara viqavi, sopelshi vtskhovrobdi", "meaning": "Quand j'étais petit, j'habitais au village" }
          ]
        }
      ],
      "exercises": [
        {
          "type": "fill_conjunction",
          "question": "Je sais ___ il viendra = ვიცი, ___ მოვა",
          "options": [
            { "text": "რომ", "correct": true },
            { "text": "თუ", "correct": false },
            { "text": "როცა", "correct": false }
          ],
          "feedback": {
            "correct": "Exact ! რომ introduit une complétive (que).",
            "incorrect": "რომ = que (complétive), თუ = si (condition), როცა = quand."
          }
        }
      ]
    },

    {
      "id": "B1.U5",
      "level": "B1",
      "title": "Verbes médio-passifs",
      "description": "Actions sur soi-même",
      "focus": ["mediopassive", "reflexive"],
      "rules": ["R.MEDIOPASSIVE"],
      "lessons": [
        {
          "id": "B1.U5.L1",
          "title": "La voyelle -ი- de version",
          "content": "<h3>Le marqueur médio-passif</h3><p>La voyelle -ი- après le préfixe personnel indique une action sur soi ou sans agent externe.</p>",
          "examples": [
            { "geo": "ვიბან (viban)", "meaning": "je me lave", "vs": "ვბან (vban) = je lave (qqch)" },
            { "geo": "ვიცვამ (vitsvam)", "meaning": "je m'habille", "vs": "ვაცვამ (vatsvam) = j'habille (qqn)" },
            { "geo": "ვისწავლი (visstsvli)", "meaning": "j'apprends", "note": "Action auto-bénéfactive" }
          ]
        }
      ],
      "exercises": []
    },

    {
      "id": "B1.U6",
      "level": "B1",
      "title": "Discours indirect",
      "description": "Rapporter les paroles",
      "focus": ["indirect-speech"],
      "rules": ["R.INDIRECT.SPEECH"],
      "lessons": [
        {
          "id": "B1.U6.L1",
          "title": "Rapporter ce que quelqu'un a dit",
          "content": "<h3>Construction avec რომ</h3>",
          "examples": [
            { "geo": "მან თქვა, რომ მოვა", "translit": "man tkva, rom mova", "meaning": "Il a dit qu'il viendrait" },
            { "geo": "მას ეგონა, რომ მართალი იყო", "translit": "mas egona, rom martali iqo", "meaning": "Il pensait qu'il avait raison" }
          ],
          "note": "Le temps dans la subordonnée reste souvent inchangé (pas de concordance stricte)."
        }
      ],
      "exercises": []
    },

    {
      "id": "B2.U1",
      "level": "B2",
      "title": "Aspect verbal — Perfectif vs Imperfectif",
      "description": "Au-delà du temps",
      "focus": ["aspect", "perfectivity"],
      "rules": ["R.ASPECT.PREVERBS"],
      "lessons": [
        {
          "id": "B2.U1.L1",
          "title": "L'aspect plus important que le temps",
          "content": "<h3>Voir l'action différemment</h3><p>En géorgien, l'ASPECT (accompli/en cours) est souvent plus important que le TEMPS (passé/présent).</p>",
          "comparison": [
            {
              "imperfective": { "geo": "წერდა", "meaning": "il écrivait (en cours, processus)" },
              "perfective": { "geo": "დაწერა", "meaning": "il a écrit (accompli, résultat)" }
            },
            {
              "imperfective": { "geo": "კითხულობდა", "meaning": "il lisait (habituellement ou à ce moment)" },
              "perfective": { "geo": "წაიკითხა", "meaning": "il a lu (terminé, d'un bout à l'autre)" }
            }
          ],
          "note": "Le préverbe 'perfectivise' souvent le verbe."
        }
      ],
      "exercises": [
        {
          "type": "meaning_shift",
          "question": "Quelle nuance entre წერდა et დაწერა ?",
          "options": [
            { "text": "წერდა = action en cours/répétée, დაწერა = action achevée", "correct": true },
            { "text": "Même sens, styles différents", "correct": false },
            { "text": "წერდა = formel, დაწერა = familier", "correct": false }
          ],
          "feedback": {
            "correct": "Exact ! C'est la distinction aspectuelle fondamentale.",
            "incorrect": "წერდა (imperfectif) vs დაწერა (perfectif) = en cours vs achevé."
          }
        }
      ]
    },

    {
      "id": "B2.U2",
      "level": "B2",
      "title": "Classes verbales",
      "description": "Les 4 classes de conjugaison",
      "focus": ["verb-classes"],
      "rules": ["R.VERB.CLASSES"],
      "lessons": [
        {
          "id": "B2.U2.L1",
          "title": "Classer les verbes géorgiens",
          "content": "<h3>4 classes principales</h3>",
          "grammarTable": {
            "title": "Classes verbales",
            "rows": [
              { "class": "Classe 1", "type": "Transitifs actifs", "example": "წერს (il écrit)", "marker": "Suffixe -ს au présent 3SG" },
              { "class": "Classe 2", "type": "Intransitifs actifs", "example": "მუშაობს (il travaille)", "marker": "Souvent -ობ-" },
              { "class": "Classe 3", "type": "Médio-passifs", "example": "იშლება (ça se casse)", "marker": "Voyelle -ი-, suffixe -ება" },
              { "class": "Classe 4", "type": "Verbes indirects", "example": "უყვარს (il aime)", "marker": "L'expérienceur au datif" }
            ]
          }
        },
        {
          "id": "B2.U2.L2",
          "title": "Classe 4 : les verbes 'inversés'",
          "content": "<h3>L'expérienceur au datif</h3><p>Certains verbes (aimer, vouloir, pouvoir) ont une structure 'inverse' : celui qui ressent est au datif.</p>",
          "examples": [
            { "geo": "მას უყვარს მუსიკა", "translit": "mas uqvars musik'a", "meaning": "Il aime la musique", "literal": "À-lui plaît musique" },
            { "geo": "მე მინდა ჩაი", "translit": "me minda chai", "meaning": "Je veux du thé", "literal": "À-moi est-voulu thé" },
            { "geo": "მას შეუძლია", "translit": "mas sheudzlia", "meaning": "Il peut", "literal": "À-lui est-possible" }
          ]
        }
      ],
      "exercises": [
        {
          "type": "mcq_grammar",
          "question": "Dans 'მას უყვარს მუსიკა', qui est au datif ?",
          "options": [
            { "text": "მას (celui qui aime)", "correct": true },
            { "text": "მუსიკა (ce qui est aimé)", "correct": false }
          ],
          "feedback": {
            "correct": "Exact ! L'expérienceur (celui qui ressent) est au datif.",
            "incorrect": "მას (DAT) = celui qui aime. მუსიკა (NOM) = ce qui est aimé."
          }
        }
      ]
    },

    {
      "id": "B2.U3",
      "level": "B2",
      "title": "Registres et politesse",
      "description": "Adapter son langage",
      "focus": ["register", "politeness"],
      "rules": ["R.REGISTER.POLITENESS"],
      "lessons": [
        {
          "id": "B2.U3.L1",
          "title": "Tutoiement et vouvoiement",
          "content": "<h3>შენ vs თქვენ</h3><p>Le géorgien distingue le tutoiement (შენ) et le vouvoiement (თქვენ) comme le français.</p>",
          "examples": [
            { "informal": "როგორ ხარ?", "formal": "როგორ ბრძანდებით?", "meaning": "Comment allez-vous ?" },
            { "informal": "მოდი!", "formal": "მობრძანდით!", "meaning": "Venez !" }
          ],
          "vocabulary": [
            { "geo": "ბატონო", "translit": "batono", "meaning": "Monsieur" },
            { "geo": "ქალბატონო", "translit": "kalbatono", "meaning": "Madame" },
            { "geo": "გეთაყვა", "translit": "getaqva", "meaning": "s'il vous plaît (très poli)" }
          ]
        }
      ],
      "exercises": []
    },

    {
      "id": "B2.U4",
      "level": "B2",
      "title": "Participes et gérondifs",
      "description": "Formes nominales du verbe",
      "focus": ["participles", "gerund"],
      "rules": ["R.PARTICIPLES"],
      "lessons": [
        {
          "id": "B2.U4.L1",
          "title": "Le participe passé",
          "content": "<h3>Adjectif verbal</h3>",
          "examples": [
            { "geo": "დაწერილი წერილი", "translit": "datserili tserili", "meaning": "la lettre écrite" },
            { "geo": "წაკითხული წიგნი", "translit": "tsak'itkhuli tsigni", "meaning": "le livre lu" }
          ]
        },
        {
          "id": "B2.U4.L2",
          "title": "Le masdar (nom verbal)",
          "content": "<h3>L'infinitif géorgien</h3>",
          "examples": [
            { "geo": "წერა", "translit": "tsera", "meaning": "écrire, l'écriture" },
            { "geo": "კითხვა", "translit": "k'itkhva", "meaning": "lire, la lecture" },
            { "geo": "წერის შემდეგ", "translit": "tseris shemdeg", "meaning": "après avoir écrit" }
          ]
        }
      ],
      "exercises": []
    },

    {
      "id": "B2.U5",
      "level": "B2",
      "title": "Textes authentiques",
      "description": "Lire la presse et la littérature",
      "focus": ["reading", "authentic-texts"],
      "rules": [],
      "lessons": [
        {
          "id": "B2.U5.L1",
          "title": "Stratégies de lecture",
          "content": "<h3>Aborder un texte réel</h3><ul><li>Identifier les verbes et leur série</li><li>Repérer les cas pour comprendre les rôles</li><li>Ne pas traduire mot à mot</li><li>Chercher les connecteurs logiques</li></ul>",
          "sampleText": {
            "geo": "საქართველოს პრეზიდენტმა განაცხადა, რომ ქვეყანა ევროკავშირში გაწევრიანებისკენ მიისწრაფვის. მთავრობამ ახალი რეფორმები დაიწყო.",
            "meaning": "Le président de la Géorgie a déclaré que le pays aspire à l'adhésion à l'UE. Le gouvernement a lancé de nouvelles réformes.",
            "analysis": [
              "პრეზიდენტმა (ERG) = agent à l'aoriste",
              "განაცხადა = il a déclaré (aoriste)",
              "რომ = que (complétive)",
              "მიისწრაფვის = aspire (présent)",
              "მთავრობამ (ERG) = le gouvernement (agent)",
              "დაიწყო = a commencé (aoriste)"
            ]
          }
        }
      ],
      "exercises": []
    }
  ]
}
;
