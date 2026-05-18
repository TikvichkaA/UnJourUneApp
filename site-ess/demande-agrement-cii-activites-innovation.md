# Activités d'innovation de Code'ess

**Demande d'agrément CII 2026-2030**
**Entreprise non titulaire d'un agrément CIR en cours de validité**

---

## 1. Présentation de l'entreprise

**Code'ess** (EI — SIRET 942 385 311 00017), fondée par Emmanuel Pinglier, conçoit des solutions numériques pour l'économie sociale et solidaire (ESS) et les entreprises à impact.

L'entreprise intervient sur trois axes :

- **Développement d'applications et de produits numériques** — Sites, applications web (React, Vue, Python, Node.js), PWA, avec intégration d'IA et de traitement de données ;
- **IA appliquée et automatisation** — Intégration de modèles de langage (LLM), traitement automatique du langage naturel (NLP), pipelines de données, workflows d'automatisation ;
- **Conseil en numérique responsable et cybersécurité** — Audits de sécurité (OWASP Top 10, sécurité LLM), conformité RGPD, migration vers des solutions open source et souveraines.

**Profil du fondateur :** Diplômé de l'École Polytechnique (X2016, spécialisation cryptographie sur courbes elliptiques — algorithme de Satoh), ancien officier. Certifié Google Cybersecurity Professional (2026). Enseignant vacataire à l'Université Paris-Saclay (Master Adaptation au Changement Climatique) et examinateur en CPGE. Formateur IA et transformation numérique auprès d'On Purpose France.

---

## 2. Activités d'innovation

Les travaux d'innovation de Code'ess portent sur la conception de **produits numériques nouveaux** intégrant des briques technologiques récentes (IA générative, NLP, pipelines de données) pour répondre à des besoins mal couverts par les solutions existantes du marché.

### 2.1 Intégration d'IA et de NLP dans des produits métier

Code'ess conçoit des fonctionnalités d'intelligence artificielle au sein de produits logiciels destinés à des marchés spécifiques. Le travail d'innovation porte sur :

- L'**adaptation de modèles de langage à des domaines métier spécialisés** (comptabilité carbone, aide sociale, civic tech), où les données sont hétérogènes, les nomenclatures complexes, et les modèles généralistes insuffisants ;
- La **recherche automatisée dans des bases de données techniques** via NLP, pour remplacer des processus manuels longs et sujets à erreur par des systèmes capables d'interpréter des descriptions en langage naturel et de les apparier aux bons référentiels ;
- La **conception d'interfaces utilisateur augmentées par l'IA** qui fluidifient le parcours sans créer de dépendance ni d'hallucination préjudiciable.

### 2.2 Pipelines de données et structuration d'information

Code'ess développe des systèmes de collecte, structuration et analyse de données issues de sources hétérogènes :

- **Scraping et extraction** de données à partir de sources web non structurées (sites institutionnels, registres publics, APIs ouvertes) ;
- **Structuration par NLP** de données textuelles en objets exploitables (profils, entités, déclarations, critères de scoring) ;
- **Algorithmes de matching et de scoring** pour croiser des données multi-sources et produire des recommandations actionnables (appariement mentor/mission, qualification de leads, identification d'organisations cibles).

### 2.3 Applications compagnon pour les professionnels de terrain

Code'ess conçoit des PWA (Progressive Web Apps) à destination de professionnels opérant dans des contextes contraints (terrain, connectivité intermittente, données sensibles) :

- Architecture **offline-first** avec synchronisation différée ;
- Gestion de **données sensibles** (données sociales, données de bénéficiaires) dans le respect du RGPD ;
- Interfaces optimisées pour un usage en mobilité (recherche universelle, fiches réflexes, suivi de situations).

---

## 3. Description d'un projet innovant : Simply Carbon

### Contexte

**Simply Carbon** est une startup climat (Paris) qui développe un outil SaaS B2B de calcul d'empreinte carbone à destination des entreprises. Emmanuel Pinglier a rejoint l'équipe en CDD de 6 mois (avril — octobre 2024) en tant que développeur produit IA.

### Problématique

Le calcul de l'empreinte carbone d'une entreprise requiert d'associer chaque poste d'activité (déplacements, achats, énergie, fret, etc.) au **facteur d'émission** correspondant dans des bases de référence. La base principale est la **Base Carbone de l'ADEME**, complétée par des comparaisons avec le **GHG Protocol** — soit plusieurs milliers de facteurs d'émission. Ce processus était essentiellement **manuel** : l'utilisateur devait naviguer dans des nomenclatures arborescentes complexes, comprendre le vocabulaire technique, et sélectionner le bon facteur parmi des milliers d'entrées.

Les difficultés techniques étaient les suivantes :

- **Hétérogénéité des référentiels** — La Base Carbone ADEME et le GHG Protocol utilisent des nomenclatures, des unités et des niveaux de granularité différents. Une même activité peut être décrite de manière très différente selon la source ;
- **Ambiguïté du langage naturel** — La description d'une activité par l'utilisateur (ex. « livraison de colis par camion ») peut correspondre à plusieurs dizaines de facteurs d'émission distincts selon le type de véhicule, le carburant, la distance, le taux de chargement, etc. ;
- **Volume et complexité des référentiels** — La Base Carbone de l'ADEME contient plusieurs milliers de facteurs d'émission, organisés dans une arborescence à plusieurs niveaux. Le GHG Protocol ajoute ses propres catégories et méthodologies ;
- **Exigence de fiabilité** — Une erreur d'appariement entre activité et facteur d'émission se propage dans tout le bilan carbone. Le système ne peut pas se contenter d'une approximation : il doit proposer les bons facteurs et permettre à l'utilisateur de valider son choix en connaissance de cause ;
- **Limites des modèles de langage disponibles (2024)** — Au moment du projet, les modèles de raisonnement (DeepSeek R1, GPT o1) n'existaient pas encore. Les LLM généralistes produisaient des résultats insuffisants sur ce type de tâche spécialisée : hallucinations de facteurs inexistants, confusion entre catégories proches, incapacité à désambiguïser sans guidage structuré.

### Travaux réalisés

**1. Recherche automatisée de facteurs d'émission par chaîne de raisonnement en cascade**

Face aux limites des LLM généralistes de l'époque (pré-modèles de raisonnement), le travail d'innovation a consisté à concevoir une **architecture de prompt engineering en cascade** combinant recherche vectorielle et chaîne de raisonnement (chain-of-thought) :

- **Indexation vectorielle** des milliers de facteurs d'émission de la Base Carbone ADEME : chaque facteur est transformé en embedding sémantique pour permettre une recherche par similarité à partir d'une description en langage naturel ;
- **Modèles segmentés en cascade** : plutôt qu'un appel unique à un LLM généraliste (qui produisait des résultats trop imprécis), l'architecture décompose la tâche en étapes successives — identification de la catégorie d'activité, extraction des paramètres discriminants (type d'énergie, mode de transport, périmètre géographique…), puis sélection fine du facteur d'émission dans le sous-ensemble pertinent ;
- **Prompt engineering avec chain-of-thought** : chaque étape de la cascade utilise des prompts structurés forçant le modèle à expliciter son raisonnement avant de produire un résultat, ce qui améliore significativement la pertinence par rapport à un appel direct. Cette approche a été développée avant que les modèles de raisonnement natifs (o1, DeepSeek R1) ne la rendent standard fin 2024-2025.

Le système permet à l'utilisateur de décrire son activité en langage courant et obtient en retour une liste ordonnée de facteurs d'émission candidats, avec un score de pertinence et les métadonnées associées (source, unité, périmètre, incertitude).

**2. Intégration IA dans le parcours utilisateur**

L'IA a été intégrée dans le flux de saisie du bilan carbone pour :
- Suggérer automatiquement le facteur le plus probable au fur et à mesure de la saisie ;
- Détecter les incohérences (ex. facteur d'émission électrique appliqué à un véhicule diesel) ;
- Guider l'utilisateur vers la bonne granularité quand sa description est trop vague.

**3. Modèle de comptabilité carbone consolidée sur la chaîne de valeur**

Au-delà de la recherche de facteurs, le travail a porté sur la **redéfinition du modèle de collecte de données carbone** lui-même. Les outils existants (Greenly, Carbometrix, etc.) collectent les données poste par poste, ce qui génère des redondances et des incohérences lorsqu'une même donnée source (ex. une facture d'énergie, un contrat de transport) alimente plusieurs postes d'émission.

L'approche développée chez Simply Carbon s'inspire de la **comptabilité financière consolidée** : les données sont collectées une seule fois au niveau de la chaîne de valeur de l'entreprise, puis propagées automatiquement vers les postes d'émission concernés (scopes 1, 2, 3). Ce modèle en chaîne :

- **Élimine les doubles saisies** et les incohérences entre postes d'émission alimentés par la même source ;
- **Garantit la traçabilité** de chaque facteur d'émission jusqu'à la donnée source ;
- **Facilite la mise à jour** : quand une donnée source change, tous les postes d'émission impactés sont recalculés automatiquement ;
- **Reproduit la logique de consolidation comptable**, familière aux directions financières, ce qui facilite l'adoption par les entreprises.

**Ce modèle de comptabilité carbone consolidée n'a pas d'équivalent identifié sur le marché.** Les concurrents (Greenly, Carbometrix) proposent de la recherche de facteurs d'émission assistée, mais aucun ne structure la collecte de données selon la chaîne de valeur avec propagation automatique.

### Caractère innovant

Ce projet présente un caractère d'innovation au sens de l'article 244 quater B II-k du CGI, sur deux volets distincts :

**Volet 1 — Recherche de facteurs d'émission par architecture IA en cascade :**

- **Incertitudes techniques levées** — En 2024, la correspondance entre langage naturel et nomenclature technique des facteurs d'émission n'était pas un problème résolu par les LLM généralistes disponibles. L'architecture en cascade avec chain-of-thought a été conçue pour pallier les limites des modèles de l'époque, anticipant de plusieurs mois les capacités de raisonnement rendues natives par les modèles de fin 2024 (o1, DeepSeek R1) ;
- **Supériorité fonctionnelle** — Par rapport aux outils concurrents (Greenly, Carbometrix), la fonctionnalité d'appariement automatique par recherche vectorielle + raisonnement en cascade offre un gain en ergonomie (saisie en langage courant vs. navigation dans des arborescences) et en fiabilité (désambiguïsation explicite vs. suggestion naïve).

**Volet 2 — Modèle de comptabilité carbone consolidée :**

- **Produit nouveau sans équivalent marché** — Le modèle de collecte de données basé sur la chaîne de valeur, avec propagation automatique vers les postes d'émission, n'a pas d'équivalent identifié chez les concurrents. C'est une innovation de concept qui transpose au carbone une logique de consolidation issue de la comptabilité financière ;
- **Supériorité technique** — L'élimination des redondances de collecte et la traçabilité automatique des données source constituent une amélioration structurelle par rapport au modèle « poste par poste » utilisé par l'ensemble des acteurs du marché.

---

## 4. Autres projets illustrant les activités d'innovation

### 4.1 Pipeline de données et matching algorithmique — On Purpose France (2025)

**Contexte :** On Purpose France, programme de transition de carrière vers l'économie sociale, a besoin d'identifier des organisations d'accueil pour ses participants (objectif : 40 placements/an en Île-de-France).

**Travaux d'innovation :**
- Développement d'un **pipeline de collecte de données** croisant l'API Recherche d'Entreprises (registre français), les données de subventions du Projet de Loi de Finances (jaunes budgétaires) et des sources sectorielles ;
- Conception d'un **algorithme de scoring multi-critères** (10+ critères : taille, secteur, statut juridique, subventions ESS, localisation) pour qualifier automatiquement les organisations cibles ;
- Audit de sécurité d'un **système RAG (Retrieval-Augmented Generation)** déployé en interne : analyse des vulnérabilités (injection de prompt, exfiltration via Qdrant, guardrails Mistral), recommandations et plan de remédiation.

### 4.2 Application compagnon pour travailleuses sociales — TS Compagnon (2025-2026)

**Contexte :** Les travailleuses sociales en intervention terrain ont besoin d'accéder rapidement à des informations réglementaires et de suivi sans connectivité fiable.

**Travaux d'innovation :**
- Conception d'une **PWA offline-first** avec Service Worker et synchronisation différée (Supabase) ;
- **Recherche universelle** à travers dispositifs, glossaire et fiches réflexes, fonctionnant intégralement hors ligne ;
- Architecture de **stockage sécurisé de données sensibles** (situations de bénéficiaires) sur le terminal, avec chiffrement local.

### 4.3 Veille électorale et structuration NLP — Municipales 2026 (2026)

**Contexte :** Projet de civic tech visant à structurer l'information politique locale pour les élections municipales 2026 (90+ communes, 100+ profils).

**Travaux d'innovation :**
- Pipeline de **scraping multi-sources** (Node.js, Cheerio) avec gestion des structures de pages hétérogènes ;
- **Traitement NLP** pour extraire et structurer des données textuelles non normalisées (déclarations, prises de position, profils biographiques) ;
- Base de données structurée (Supabase) avec **requêtes analytiques complexes** sur corpus textuel.

---

## 5. Moyens dédiés à l'innovation

### Moyens humains

- **Emmanuel Pinglier** (fondateur) — Formation Polytechnique (mathématiques, cryptographie), compétences en développement full-stack (Python, JavaScript, React, Vue, Node.js), IA/NLP, cybersécurité ;
- **Formation continue** — Google Cybersecurity Professional Certificate (2026), veille OWASP (web et LLM), suivi des évolutions des modèles de langage et des frameworks d'IA.

### Moyens techniques

- Environnements de développement et d'hébergement sur infrastructure française (OVH, Scaleway, Infomaniak) ;
- Accès aux APIs d'IA (OpenAI, Mistral, Anthropic) et aux bases de données ouvertes (ADEME, INSEE, registres d'entreprises) ;
- Outils de sécurité et d'audit (SIEM, frameworks OWASP, outils de test d'injection) ;
- Plateforme de prototypage rapide (Supabase, n8n, Make).

### Veille et diffusion des connaissances

- Enseignement universitaire (Paris-Saclay) et en classes préparatoires ;
- Formation de professionnels de l'ESS à l'IA et à la transformation numérique (On Purpose France) ;
- Publication d'analyses techniques (sécurité LLM, souveraineté numérique) ;
- Participation aux communautés open source.

---

## 6. Perspectives 2026-2030

1. **IA appliquée aux données ESS** — Développement d'outils de traitement automatique de données spécifiques au secteur ESS (rapports d'impact, données de bénéficiaires, indicateurs sociaux), où les modèles généralistes sont insuffisants et où les volumes de données ne justifient pas un entraînement from scratch ;

2. **Sécurisation des systèmes LLM pour les petites structures** — Méthodologies et outils de sécurisation des applications d'IA générative adaptés aux moyens des associations et PME ESS (audit simplifié, configurations sécurisées par défaut, monitoring léger) ;

3. **Applications offline-first pour les professionnels de terrain** — Poursuite du développement de PWA compagnon pour les métiers du social, de l'aide alimentaire et de l'accompagnement, avec des contraintes d'accessibilité, de confidentialité et de résilience réseau.

---

*Document établi le 3 avril 2026*
*Code'ess — Emmanuel Pinglier*
*contact@unjouruneapp.com*
