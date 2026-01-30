// KartApp - Georgian Learning PWA Data

const GEO_DATA = {
    // Georgian Alphabet (Mkhedruli) - 33 letters
    alphabet: [
        { letter: 'ა', translit: 'a', name: 'ani', sound: 'a comme dans "papa"', examples: [
            { geo: 'არა', translit: 'ara', meaning: 'non' },
            { geo: 'აბა', translit: 'aba', meaning: 'eh bien' }
        ]},
        { letter: 'ბ', translit: 'b', name: 'bani', sound: 'b comme dans "beau"', examples: [
            { geo: 'ბაბა', translit: 'baba', meaning: 'grand-père' },
            { geo: 'ბავშვი', translit: 'bavshvi', meaning: 'enfant' }
        ]},
        { letter: 'გ', translit: 'g', name: 'gani', sound: 'g dur comme dans "gare"', examples: [
            { geo: 'გოგო', translit: 'gogo', meaning: 'fille' },
            { geo: 'გული', translit: 'guli', meaning: 'coeur' }
        ]},
        { letter: 'დ', translit: 'd', name: 'doni', sound: 'd comme dans "doux"', examples: [
            { geo: 'დედა', translit: 'deda', meaning: 'mère' },
            { geo: 'დიდი', translit: 'didi', meaning: 'grand' }
        ]},
        { letter: 'ე', translit: 'e', name: 'eni', sound: 'é comme dans "été"', examples: [
            { geo: 'ერთი', translit: 'erti', meaning: 'un' },
            { geo: 'ეს', translit: 'es', meaning: 'ceci' }
        ]},
        { letter: 'ვ', translit: 'v', name: 'vini', sound: 'v comme dans "vent"', examples: [
            { geo: 'ვარ', translit: 'var', meaning: 'je suis' },
            { geo: 'ვინ', translit: 'vin', meaning: 'qui' }
        ]},
        { letter: 'ზ', translit: 'z', name: 'zeni', sound: 'z comme dans "zéro"', examples: [
            { geo: 'ზამთარი', translit: 'zamtari', meaning: 'hiver' },
            { geo: 'ზღვა', translit: 'zghva', meaning: 'mer' }
        ]},
        { letter: 'თ', translit: 't\'', name: 'tani', sound: 't aspiré (souffle après)', examples: [
            { geo: 'თავი', translit: 't\'avi', meaning: 'tête' },
            { geo: 'თბილისი', translit: 't\'bilisi', meaning: 'Tbilissi' }
        ]},
        { letter: 'ი', translit: 'i', name: 'ini', sound: 'i comme dans "midi"', examples: [
            { geo: 'იქ', translit: 'ik', meaning: 'là-bas' },
            { geo: 'ის', translit: 'is', meaning: 'il/elle/cela' }
        ]},
        { letter: 'კ', translit: 'k\'', name: 'kani', sound: 'k éjectif (gorge)', examples: [
            { geo: 'კაცი', translit: 'k\'atsi', meaning: 'homme' },
            { geo: 'კარგი', translit: 'k\'argi', meaning: 'bon' }
        ]},
        { letter: 'ლ', translit: 'l', name: 'lasi', sound: 'l comme dans "lune"', examples: [
            { geo: 'ლამაზი', translit: 'lamazi', meaning: 'beau' },
            { geo: 'ლურჯი', translit: 'lurji', meaning: 'bleu' }
        ]},
        { letter: 'მ', translit: 'm', name: 'mani', sound: 'm comme dans "maman"', examples: [
            { geo: 'მამა', translit: 'mama', meaning: 'père' },
            { geo: 'მე', translit: 'me', meaning: 'je/moi' }
        ]},
        { letter: 'ნ', translit: 'n', name: 'nari', sound: 'n comme dans "nuage"', examples: [
            { geo: 'ნახვა', translit: 'nakhva', meaning: 'voir' },
            { geo: 'ნელა', translit: 'nela', meaning: 'lentement' }
        ]},
        { letter: 'ო', translit: 'o', name: 'oni', sound: 'o fermé comme dans "beau"', examples: [
            { geo: 'ორი', translit: 'ori', meaning: 'deux' },
            { geo: 'ოთახი', translit: 'otakhi', meaning: 'chambre' }
        ]},
        { letter: 'პ', translit: 'p\'', name: 'pari', sound: 'p éjectif', examples: [
            { geo: 'პური', translit: 'p\'uri', meaning: 'pain' },
            { geo: 'პატარა', translit: 'p\'at\'ara', meaning: 'petit' }
        ]},
        { letter: 'ჟ', translit: 'zh', name: 'zhani', sound: 'j comme dans "jour"', examples: [
            { geo: 'ჟურნალი', translit: 'zhurnali', meaning: 'magazine' }
        ]},
        { letter: 'რ', translit: 'r', name: 'rae', sound: 'r roulé', examples: [
            { geo: 'რა', translit: 'ra', meaning: 'quoi' },
            { geo: 'რატომ', translit: 'ratom', meaning: 'pourquoi' }
        ]},
        { letter: 'ს', translit: 's', name: 'sani', sound: 's comme dans "soleil"', examples: [
            { geo: 'სახლი', translit: 'sakhli', meaning: 'maison' },
            { geo: 'სიტყვა', translit: 'sit\'qva', meaning: 'mot' }
        ]},
        { letter: 'ტ', translit: 't', name: 'tari', sound: 't éjectif', examples: [
            { geo: 'ტანი', translit: 'tani', meaning: 'corps' }
        ]},
        { letter: 'უ', translit: 'u', name: 'uni', sound: 'ou comme dans "loup"', examples: [
            { geo: 'უყვარს', translit: 'uqvars', meaning: 'il/elle aime' }
        ]},
        { letter: 'ფ', translit: 'p', name: 'pari', sound: 'p aspiré', examples: [
            { geo: 'ფული', translit: 'puli', meaning: 'argent' },
            { geo: 'ფანჯარა', translit: 'panjara', meaning: 'fenêtre' }
        ]},
        { letter: 'ქ', translit: 'k', name: 'kani', sound: 'k aspiré', examples: [
            { geo: 'ქალი', translit: 'kali', meaning: 'femme' },
            { geo: 'ქართული', translit: 'kartuli', meaning: 'géorgien' }
        ]},
        { letter: 'ღ', translit: 'gh', name: 'ghani', sound: 'r grasseyé (comme en français)', examples: [
            { geo: 'ღამე', translit: 'ghame', meaning: 'nuit' },
            { geo: 'ღვინო', translit: 'ghvino', meaning: 'vin' }
        ]},
        { letter: 'ყ', translit: 'q\'', name: 'qari', sound: 'q éjectif (très guttural)', examples: [
            { geo: 'ყველა', translit: 'qvela', meaning: 'tous/tout' },
            { geo: 'ყურადღება', translit: 'quradgheba', meaning: 'attention' }
        ]},
        { letter: 'შ', translit: 'sh', name: 'shini', sound: 'ch comme dans "chat"', examples: [
            { geo: 'შენ', translit: 'shen', meaning: 'tu/toi' },
            { geo: 'შვილი', translit: 'shvili', meaning: 'enfant' }
        ]},
        { letter: 'ჩ', translit: 'ch', name: 'chini', sound: 'tch aspiré', examples: [
            { geo: 'ჩაი', translit: 'chai', meaning: 'thé' },
            { geo: 'ჩემი', translit: 'chemi', meaning: 'mon/ma' }
        ]},
        { letter: 'ც', translit: 'ts', name: 'tsani', sound: 'ts aspiré', examples: [
            { geo: 'ცა', translit: 'tsa', meaning: 'ciel' },
            { geo: 'ცოტა', translit: 'tsota', meaning: 'peu' }
        ]},
        { letter: 'ძ', translit: 'dz', name: 'dzili', sound: 'dz comme dans "pizza"', examples: [
            { geo: 'ძალა', translit: 'dzala', meaning: 'force' },
            { geo: 'ძმა', translit: 'dzma', meaning: 'frère' }
        ]},
        { letter: 'წ', translit: 'ts\'', name: 'tsili', sound: 'ts éjectif', examples: [
            { geo: 'წყალი', translit: 'ts\'qali', meaning: 'eau' },
            { geo: 'წიგნი', translit: 'ts\'igni', meaning: 'livre' }
        ]},
        { letter: 'ჭ', translit: 'ch\'', name: 'chari', sound: 'tch éjectif', examples: [
            { geo: 'ჭამა', translit: 'ch\'ama', meaning: 'manger' }
        ]},
        { letter: 'ხ', translit: 'kh', name: 'khani', sound: 'kh guttural (comme en allemand "ach")', examples: [
            { geo: 'ხალხი', translit: 'khalkhi', meaning: 'peuple' },
            { geo: 'ხელი', translit: 'kheli', meaning: 'main' }
        ]},
        { letter: 'ჯ', translit: 'j', name: 'jani', sound: 'dj comme dans "Django"', examples: [
            { geo: 'ჯერ', translit: 'jer', meaning: 'encore/d\'abord' }
        ]},
        { letter: 'ჰ', translit: 'h', name: 'hae', sound: 'h aspiré (comme en anglais)', examples: [
            { geo: 'ჰაერი', translit: 'haeri', meaning: 'air' }
        ]}
    ],

    // Vocabulary organized by theme and level
    vocabulary: {
        greetings: [
            { geo: 'გამარჯობა', translit: 'gamarjoba', meaning: 'bonjour (formel)', level: 1 },
            { geo: 'გაუმარჯოს', translit: 'gaumarjos', meaning: 'salut (familier)', level: 1 },
            { geo: 'ნახვამდის', translit: 'nakhvamdis', meaning: 'au revoir', level: 1 },
            { geo: 'კარგად', translit: 'k\'argad', meaning: 'bien (au revoir familier)', level: 1 },
            { geo: 'დილა მშვიდობისა', translit: 'dila mshvidobisa', meaning: 'bonjour (matin)', level: 2 },
            { geo: 'საღამო მშვიდობისა', translit: 'saghamo mshvidobisa', meaning: 'bonsoir', level: 2 },
            { geo: 'ღამე მშვიდობისა', translit: 'ghame mshvidobisa', meaning: 'bonne nuit', level: 2 },
            { geo: 'როგორ ხარ?', translit: 'rogor khar?', meaning: 'comment vas-tu?', level: 1 },
            { geo: 'კარგად ვარ', translit: 'k\'argad var', meaning: 'je vais bien', level: 1 },
            { geo: 'მადლობა', translit: 'madloba', meaning: 'merci', level: 1 },
            { geo: 'დიდი მადლობა', translit: 'didi madloba', meaning: 'merci beaucoup', level: 1 },
            { geo: 'არაფრის', translit: 'arapris', meaning: 'de rien', level: 1 }
        ],
        pronouns: [
            { geo: 'მე', translit: 'me', meaning: 'je/moi', level: 1 },
            { geo: 'შენ', translit: 'shen', meaning: 'tu/toi', level: 1 },
            { geo: 'ის', translit: 'is', meaning: 'il/elle', level: 1 },
            { geo: 'ჩვენ', translit: 'chven', meaning: 'nous', level: 1 },
            { geo: 'თქვენ', translit: 't\'kven', meaning: 'vous', level: 1 },
            { geo: 'ისინი', translit: 'isini', meaning: 'ils/elles', level: 1 },
            { geo: 'ეს', translit: 'es', meaning: 'ceci/celui-ci', level: 1 },
            { geo: 'ის', translit: 'is', meaning: 'cela/celui-là', level: 1 }
        ],
        family: [
            { geo: 'დედა', translit: 'deda', meaning: 'mère', level: 1 },
            { geo: 'მამა', translit: 'mama', meaning: 'père', level: 1 },
            { geo: 'ბაბუა', translit: 'babua', meaning: 'grand-père', level: 1 },
            { geo: 'ბებია', translit: 'bebia', meaning: 'grand-mère', level: 1 },
            { geo: 'ძმა', translit: 'dzma', meaning: 'frère', level: 1 },
            { geo: 'და', translit: 'da', meaning: 'soeur', level: 1 },
            { geo: 'შვილი', translit: 'shvili', meaning: 'enfant', level: 1 },
            { geo: 'ვაჟი', translit: 'vazhi', meaning: 'fils', level: 2 },
            { geo: 'ქალიშვილი', translit: 'kalishvili', meaning: 'fille', level: 2 },
            { geo: 'ოჯახი', translit: 'ojakhi', meaning: 'famille', level: 1 }
        ],
        numbers: [
            { geo: 'ერთი', translit: 'erti', meaning: 'un (1)', level: 1 },
            { geo: 'ორი', translit: 'ori', meaning: 'deux (2)', level: 1 },
            { geo: 'სამი', translit: 'sami', meaning: 'trois (3)', level: 1 },
            { geo: 'ოთხი', translit: 'otkhi', meaning: 'quatre (4)', level: 1 },
            { geo: 'ხუთი', translit: 'khuti', meaning: 'cinq (5)', level: 1 },
            { geo: 'ექვსი', translit: 'ekvsi', meaning: 'six (6)', level: 1 },
            { geo: 'შვიდი', translit: 'shvidi', meaning: 'sept (7)', level: 1 },
            { geo: 'რვა', translit: 'rva', meaning: 'huit (8)', level: 1 },
            { geo: 'ცხრა', translit: 'tskhra', meaning: 'neuf (9)', level: 1 },
            { geo: 'ათი', translit: 'ati', meaning: 'dix (10)', level: 1 }
        ],
        common: [
            { geo: 'კი', translit: 'ki', meaning: 'oui', level: 1 },
            { geo: 'არა', translit: 'ara', meaning: 'non', level: 1 },
            { geo: 'კარგი', translit: 'k\'argi', meaning: 'bon/bien', level: 1 },
            { geo: 'ცუდი', translit: 'tsudi', meaning: 'mauvais', level: 1 },
            { geo: 'დიდი', translit: 'didi', meaning: 'grand', level: 1 },
            { geo: 'პატარა', translit: 'p\'at\'ara', meaning: 'petit', level: 1 },
            { geo: 'ახალი', translit: 'akhali', meaning: 'nouveau', level: 2 },
            { geo: 'ძველი', translit: 'dzveli', meaning: 'vieux/ancien', level: 2 },
            { geo: 'ლამაზი', translit: 'lamazi', meaning: 'beau', level: 2 }
        ],
        verbs: [
            { geo: 'ვარ', translit: 'var', meaning: 'je suis', level: 1 },
            { geo: 'ხარ', translit: 'khar', meaning: 'tu es', level: 1 },
            { geo: 'არის', translit: 'aris', meaning: 'il/elle est', level: 1 },
            { geo: 'ვართ', translit: 'vart', meaning: 'nous sommes', level: 1 },
            { geo: 'ხართ', translit: 'khart', meaning: 'vous êtes', level: 1 },
            { geo: 'არიან', translit: 'arian', meaning: 'ils/elles sont', level: 1 },
            { geo: 'მაქვს', translit: 'makvs', meaning: 'j\'ai', level: 2 },
            { geo: 'გაქვს', translit: 'gakvs', meaning: 'tu as', level: 2 },
            { geo: 'აქვს', translit: 'akvs', meaning: 'il/elle a', level: 2 }
        ]
    },

    // Grammar rules
    grammar: [
        {
            id: 'alphabet-intro',
            title: 'L\'alphabet Mkhedruli',
            shortDesc: 'Le système d\'écriture géorgien',
            content: `
                <h3>Caractéristiques uniques</h3>
                <p>L'alphabet géorgien <strong>Mkhedruli</strong> (მხედრული) est l'un des 14 alphabets uniques au monde. Il possède 33 lettres avec des particularités remarquables :</p>
                <ul>
                    <li><strong>Pas de majuscules/minuscules</strong> : une seule forme pour chaque lettre</li>
                    <li><strong>Correspondance quasi parfaite</strong> : un son = une lettre</li>
                    <li><strong>Écriture de gauche à droite</strong></li>
                    <li><strong>Origine ancienne</strong> : créé au 5ème siècle</li>
                </ul>

                <h3>Les types de consonnes</h3>
                <p>Le géorgien distingue trois types de consonnes occlusives :</p>
                <ul>
                    <li><strong>Aspirées</strong> (avec souffle) : თ, ფ, ქ, ჩ, ც</li>
                    <li><strong>Éjectives</strong> (gorge) : კ, პ, ტ, წ, ჭ, ყ</li>
                    <li><strong>Voisées</strong> (normales) : ბ, დ, გ, ძ, ჯ</li>
                </ul>

                <h3>Conseil d'apprentissage</h3>
                <p>Apprenez les lettres par groupes de sons similaires, pas dans l'ordre alphabétique. Commencez par les voyelles (ა, ე, ი, ო, უ) qui sont simples.</p>
            `
        },
        {
            id: 'verbe-etre',
            title: 'Le verbe "être" (ყოფნა)',
            shortDesc: 'Conjugaison au présent',
            content: `
                <h3>Conjugaison au présent</h3>
                <p>Le verbe "être" est irrégulier mais essentiel. Contrairement au français, il n'a pas d'infinitif utilisé couramment.</p>

                <table class="grammar-table">
                    <tr><th>Pronom</th><th>Géorgien</th><th>Français</th></tr>
                    <tr><td>მე</td><td class="geo">ვარ</td><td>je suis</td></tr>
                    <tr><td>შენ</td><td class="geo">ხარ</td><td>tu es</td></tr>
                    <tr><td>ის</td><td class="geo">არის / -ა</td><td>il/elle est</td></tr>
                    <tr><td>ჩვენ</td><td class="geo">ვართ</td><td>nous sommes</td></tr>
                    <tr><td>თქვენ</td><td class="geo">ხართ</td><td>vous êtes</td></tr>
                    <tr><td>ისინი</td><td class="geo">არიან</td><td>ils/elles sont</td></tr>
                </table>

                <h3>Point important</h3>
                <p>À la 3ème personne du singulier, <strong>არის</strong> est la forme complète, mais on utilise souvent le suffixe <strong>-ა</strong> attaché au mot précédent :</p>
                <ul>
                    <li>ის კარგია (is k'argia) = il/elle est bon(ne)</li>
                    <li>ეს სახლია (es sakhlia) = c'est une maison</li>
                </ul>
            `
        },
        {
            id: 'ordre-mots',
            title: 'L\'ordre des mots',
            shortDesc: 'Structure SOV et variations',
            content: `
                <h3>Structure de base : SOV</h3>
                <p>Le géorgien suit généralement l'ordre <strong>Sujet - Objet - Verbe</strong> :</p>

                <div class="lesson-examples">
                    <div class="lesson-example">
                        <span class="example-georgian">მე წიგნს ვკითხულობ</span>
                        <div class="example-details">
                            <span class="translit">me ts'igns vkitkhulob</span>
                            <span class="meaning">Je lis un livre (lit: Je livre lis)</span>
                        </div>
                    </div>
                </div>

                <h3>Flexibilité pragmatique</h3>
                <p>L'ordre peut varier pour mettre en valeur un élément. Ce qui vient en premier est souligné :</p>
                <ul>
                    <li><strong>წიგნს</strong> მე ვკითხულობ = C'est le <em>livre</em> que je lis</li>
                    <li><strong>მე</strong> ვკითხულობ წიგნს = C'est <em>moi</em> qui lis le livre</li>
                </ul>

                <h3>Comparaison avec le français</h3>
                <table class="grammar-table">
                    <tr><th>Français (SVO)</th><th>Géorgien (SOV)</th></tr>
                    <tr><td>Je mange du pain</td><td class="geo">მე პურს ვჭამ</td></tr>
                    <tr><td>Il voit la maison</td><td class="geo">ის სახლს ხედავს</td></tr>
                </table>
            `
        },
        {
            id: 'cas-nominatif',
            title: 'Le cas nominatif',
            shortDesc: 'Le sujet au présent',
            content: `
                <h3>Rôle du nominatif</h3>
                <p>Le <strong>nominatif</strong> est le cas de base en géorgien. Il marque :</p>
                <ul>
                    <li>Le sujet des verbes au présent</li>
                    <li>La forme de citation des noms</li>
                </ul>

                <h3>Formation</h3>
                <p>La plupart des noms au nominatif se terminent par <strong>-ი</strong> :</p>

                <table class="grammar-table">
                    <tr><th>Nominatif</th><th>Translittération</th><th>Sens</th></tr>
                    <tr><td class="geo">კაცი</td><td>k'atsi</td><td>homme</td></tr>
                    <tr><td class="geo">ქალი</td><td>kali</td><td>femme</td></tr>
                    <tr><td class="geo">სახლი</td><td>sakhli</td><td>maison</td></tr>
                    <tr><td class="geo">წიგნი</td><td>ts'igni</td><td>livre</td></tr>
                </table>

                <h3>Exemple en contexte</h3>
                <p><span class="geo">კაცი მუშაობს</span> (k'atsi mushaobs) = L'homme travaille</p>
                <p>Ici, <strong>კაცი</strong> est au nominatif car c'est le sujet d'un verbe au présent.</p>
            `
        },
        {
            id: 'postpositions',
            title: 'Postpositions vs prépositions',
            shortDesc: 'La différence fondamentale',
            content: `
                <h3>Concept clé</h3>
                <p>Contrairement au français qui utilise des <strong>prépositions</strong> (avant le nom), le géorgien utilise des <strong>postpositions</strong> (après le nom).</p>

                <table class="grammar-table">
                    <tr><th>Français</th><th>Géorgien</th><th>Littéralement</th></tr>
                    <tr><td>dans la maison</td><td class="geo">სახლში</td><td>maison-dans</td></tr>
                    <tr><td>sur la table</td><td class="geo">მაგიდაზე</td><td>table-sur</td></tr>
                    <tr><td>avec l'ami</td><td class="geo">მეგობართან</td><td>ami-avec</td></tr>
                </table>

                <h3>Postpositions courantes</h3>
                <ul>
                    <li><strong>-ში</strong> (-shi) : dans, à l'intérieur</li>
                    <li><strong>-ზე</strong> (-ze) : sur</li>
                    <li><strong>-თან</strong> (-tan) : avec, chez</li>
                    <li><strong>-დან</strong> (-dan) : de (provenance)</li>
                    <li><strong>-კენ</strong> (-ken) : vers</li>
                </ul>

                <h3>Point important</h3>
                <p>Ces postpositions se soudent directement au nom, formant un seul mot. C'est différent du français où la préposition est un mot séparé.</p>
            `
        }
    ],

    // Learning units
    units: [
        {
            id: 1,
            title: 'Les voyelles géorgiennes',
            description: 'Apprendre les 5 voyelles de base',
            concept: 'Les voyelles ა, ე, ი, ო, უ',
            lessons: [
                {
                    id: 'u1-l1',
                    title: 'Les 5 voyelles',
                    content: `
                        <h3>Introduction</h3>
                        <p>Le géorgien possède exactement <strong>5 voyelles</strong>, comme en espagnol ou en japonais. C'est une bonne nouvelle : elles correspondent assez bien aux voyelles françaises.</p>

                        <h3>Les voyelles géorgiennes</h3>
                    `,
                    letters: ['ა', 'ე', 'ი', 'ო', 'უ'],
                    vocabulary: [
                        { geo: 'არა', translit: 'ara', meaning: 'non' },
                        { geo: 'ეს', translit: 'es', meaning: 'ceci' },
                        { geo: 'ის', translit: 'is', meaning: 'cela' }
                    ]
                }
            ],
            exercises: [
                {
                    type: 'choice',
                    question: 'Quelle lettre géorgienne correspond au son "a" ?',
                    prompt: 'a',
                    options: [
                        { text: 'ა', correct: true },
                        { text: 'ე', correct: false },
                        { text: 'ო', correct: false },
                        { text: 'უ', correct: false }
                    ],
                    feedback: {
                        correct: 'Exact ! ა se prononce "a" comme dans "papa".',
                        incorrect: 'Non, la bonne réponse est ა. Cette lettre se prononce "a".'
                    }
                },
                {
                    type: 'choice',
                    question: 'Comment se prononce la lettre უ ?',
                    prompt: 'უ',
                    promptTranslit: 'u',
                    options: [
                        { text: 'ou (comme dans "loup")', correct: true },
                        { text: 'u (comme dans "tu")', correct: false },
                        { text: 'o (comme dans "pot")', correct: false },
                        { text: 'eu (comme dans "peu")', correct: false }
                    ],
                    feedback: {
                        correct: 'Correct ! უ se prononce "ou" comme dans "loup" ou "tout".',
                        incorrect: 'Non, უ se prononce "ou" (comme dans "loup"), pas comme le "u" français.'
                    }
                },
                {
                    type: 'choice',
                    question: 'Que signifie არა ?',
                    prompt: 'არა',
                    promptTranslit: 'ara',
                    options: [
                        { text: 'non', correct: true },
                        { text: 'oui', correct: false },
                        { text: 'bonjour', correct: false },
                        { text: 'merci', correct: false }
                    ],
                    feedback: {
                        correct: 'Bravo ! არა (ara) signifie "non".',
                        incorrect: 'Non, არა signifie "non". C\'est un mot très utile à retenir !'
                    }
                }
            ]
        },
        {
            id: 2,
            title: 'Consonnes simples (groupe 1)',
            description: 'Consonnes familières : ბ, გ, დ, ვ, ზ',
            concept: 'Consonnes proches du français',
            lessons: [
                {
                    id: 'u2-l1',
                    title: 'Les consonnes familières',
                    content: `
                        <h3>Bonne nouvelle</h3>
                        <p>Certaines consonnes géorgiennes se prononcent exactement comme en français. Commençons par celles-ci :</p>

                        <h3>Les consonnes du groupe 1</h3>
                    `,
                    letters: ['ბ', 'გ', 'დ', 'ვ', 'ზ'],
                    vocabulary: [
                        { geo: 'დედა', translit: 'deda', meaning: 'mère' },
                        { geo: 'ბაბუა', translit: 'babua', meaning: 'grand-père' },
                        { geo: 'გოგო', translit: 'gogo', meaning: 'fille' }
                    ]
                }
            ],
            exercises: [
                {
                    type: 'choice',
                    question: 'Quelle lettre correspond au son "d" ?',
                    prompt: 'd',
                    options: [
                        { text: 'დ', correct: true },
                        { text: 'ბ', correct: false },
                        { text: 'გ', correct: false },
                        { text: 'ვ', correct: false }
                    ],
                    feedback: {
                        correct: 'Exact ! დ se prononce "d" comme dans "doux".',
                        incorrect: 'Non, la bonne réponse est დ pour le son "d".'
                    }
                },
                {
                    type: 'choice',
                    question: 'Que signifie დედა ?',
                    prompt: 'დედა',
                    promptTranslit: 'deda',
                    options: [
                        { text: 'mère', correct: true },
                        { text: 'père', correct: false },
                        { text: 'soeur', correct: false },
                        { text: 'frère', correct: false }
                    ],
                    feedback: {
                        correct: 'Bravo ! დედა (deda) signifie "mère".',
                        incorrect: 'Non, დედა signifie "mère". Le père se dit მამა (mama).'
                    }
                }
            ]
        },
        {
            id: 3,
            title: 'Premiers mots et salutations',
            description: 'Apprendre à saluer en géorgien',
            concept: 'Formules de politesse essentielles',
            lessons: [
                {
                    id: 'u3-l1',
                    title: 'Bonjour et au revoir',
                    content: `
                        <h3>Les salutations de base</h3>
                        <p>Voici les expressions essentielles pour saluer en géorgien.</p>

                        <div class="concept-highlight">
                            <h4>Point culturel</h4>
                            <p>გამარჯობა vient du mot "victoire" (გამარჯვება). C'est comme souhaiter "que tu sois victorieux" !</p>
                        </div>
                    `,
                    vocabulary: [
                        { geo: 'გამარჯობა', translit: 'gamarjoba', meaning: 'bonjour' },
                        { geo: 'ნახვამდის', translit: 'nakhvamdis', meaning: 'au revoir' },
                        { geo: 'მადლობა', translit: 'madloba', meaning: 'merci' },
                        { geo: 'არაფრის', translit: 'arapris', meaning: 'de rien' }
                    ]
                }
            ],
            exercises: [
                {
                    type: 'choice',
                    question: 'Comment dit-on "bonjour" en géorgien ?',
                    options: [
                        { text: 'გამარჯობა (gamarjoba)', correct: true },
                        { text: 'ნახვამდის (nakhvamdis)', correct: false },
                        { text: 'მადლობა (madloba)', correct: false },
                        { text: 'არაფრის (arapris)', correct: false }
                    ],
                    feedback: {
                        correct: 'Excellent ! გამარჯობა est la salutation standard.',
                        incorrect: 'Non, "bonjour" se dit გამარჯობა (gamarjoba).'
                    }
                },
                {
                    type: 'choice',
                    question: 'Que signifie მადლობა ?',
                    prompt: 'მადლობა',
                    promptTranslit: 'madloba',
                    options: [
                        { text: 'merci', correct: true },
                        { text: 'bonjour', correct: false },
                        { text: 'au revoir', correct: false },
                        { text: 's\'il vous plaît', correct: false }
                    ],
                    feedback: {
                        correct: 'Parfait ! მადლობა signifie "merci".',
                        incorrect: 'Non, მადლობა signifie "merci".'
                    }
                },
                {
                    type: 'reorder',
                    question: 'Remettez dans l\'ordre pour dire "Bonjour, merci"',
                    words: ['გამარჯობა', 'მადლობა'],
                    correctOrder: ['გამარჯობა', 'მადლობა'],
                    feedback: {
                        correct: 'Bravo ! გამარჯობა, მადლობა = Bonjour, merci.',
                        incorrect: 'L\'ordre correct est : გამარჯობა (bonjour), puis მადლობა (merci).'
                    }
                }
            ]
        },
        {
            id: 4,
            title: 'Le verbe "être"',
            description: 'Conjugaison de base au présent',
            concept: 'ვარ, ხარ, არის...',
            lessons: [
                {
                    id: 'u4-l1',
                    title: 'Je suis, tu es, il est...',
                    content: `
                        <h3>Le verbe être au présent</h3>
                        <p>Le verbe "être" est essentiel. En géorgien, il change selon la personne.</p>

                        <div class="concept-highlight">
                            <h4>Particularité</h4>
                            <p>Le pronom personnel est souvent omis car la forme du verbe suffit à indiquer la personne.</p>
                        </div>
                    `,
                    vocabulary: [
                        { geo: 'ვარ', translit: 'var', meaning: 'je suis' },
                        { geo: 'ხარ', translit: 'khar', meaning: 'tu es' },
                        { geo: 'არის', translit: 'aris', meaning: 'il/elle est' },
                        { geo: 'მე', translit: 'me', meaning: 'je/moi' },
                        { geo: 'შენ', translit: 'shen', meaning: 'tu/toi' }
                    ]
                }
            ],
            exercises: [
                {
                    type: 'choice',
                    question: 'Comment dit-on "je suis" ?',
                    options: [
                        { text: 'ვარ (var)', correct: true },
                        { text: 'ხარ (khar)', correct: false },
                        { text: 'არის (aris)', correct: false },
                        { text: 'ვართ (vart)', correct: false }
                    ],
                    feedback: {
                        correct: 'Exact ! ვარ = je suis.',
                        incorrect: 'Non, "je suis" se dit ვარ (var). ხარ = tu es, არის = il/elle est.'
                    }
                },
                {
                    type: 'choice',
                    question: 'Complétez : მე ქართველი ___ (Je suis géorgien)',
                    options: [
                        { text: 'ვარ', correct: true },
                        { text: 'ხარ', correct: false },
                        { text: 'არის', correct: false },
                        { text: 'არიან', correct: false }
                    ],
                    feedback: {
                        correct: 'Parfait ! მე ქართველი ვარ = Je suis géorgien.',
                        incorrect: 'Avec მე (je), on utilise ვარ.'
                    }
                }
            ]
        },
        {
            id: 5,
            title: 'Les nombres de 1 à 10',
            description: 'Compter en géorgien',
            concept: 'Les chiffres de base',
            lessons: [
                {
                    id: 'u5-l1',
                    title: 'Compter jusqu\'à 10',
                    content: `
                        <h3>Les nombres</h3>
                        <p>Les nombres géorgiens suivent un système logique. Apprenons d'abord 1 à 10.</p>
                    `,
                    vocabulary: [
                        { geo: 'ერთი', translit: 'erti', meaning: 'un (1)' },
                        { geo: 'ორი', translit: 'ori', meaning: 'deux (2)' },
                        { geo: 'სამი', translit: 'sami', meaning: 'trois (3)' },
                        { geo: 'ოთხი', translit: 'otkhi', meaning: 'quatre (4)' },
                        { geo: 'ხუთი', translit: 'khuti', meaning: 'cinq (5)' }
                    ]
                }
            ],
            exercises: [
                {
                    type: 'choice',
                    question: 'Comment dit-on "trois" en géorgien ?',
                    options: [
                        { text: 'სამი (sami)', correct: true },
                        { text: 'ორი (ori)', correct: false },
                        { text: 'ოთხი (otkhi)', correct: false },
                        { text: 'ერთი (erti)', correct: false }
                    ],
                    feedback: {
                        correct: 'Exact ! სამი = trois.',
                        incorrect: 'Non, "trois" se dit სამი (sami).'
                    }
                },
                {
                    type: 'choice',
                    question: 'Que signifie ხუთი ?',
                    prompt: 'ხუთი',
                    promptTranslit: 'khuti',
                    options: [
                        { text: 'cinq (5)', correct: true },
                        { text: 'quatre (4)', correct: false },
                        { text: 'six (6)', correct: false },
                        { text: 'sept (7)', correct: false }
                    ],
                    feedback: {
                        correct: 'Bravo ! ხუთი = cinq.',
                        incorrect: 'Non, ხუთი signifie "cinq" (5).'
                    }
                }
            ]
        }
    ]
};

// Export for use in app.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GEO_DATA;
}
