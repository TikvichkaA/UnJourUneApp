# Configuration Supabase - TS Compagnon

## Structure de la base de données attendue

### Table `femmes_isolees`
```sql
CREATE TABLE femmes_isolees (
    id SERIAL PRIMARY KEY,
    chambre VARCHAR(10),
    ts_referente VARCHAR(100),
    nom VARCHAR(100),
    prenom VARCHAR(100),
    date_naissance DATE,
    age INTEGER,
    nationalite VARCHAR(100),
    telephone VARCHAR(20),
    email VARCHAR(200),
    statut VARCHAR(50), -- 'Régulière', 'Irrégulière', 'Demandeur d\'asile'
    assurance_maladie VARCHAR(50), -- 'CSS', 'AME', 'PUMA', 'Aucune', 'Mutuelle'
    date_arrivee DATE,
    aide_alimentaire VARCHAR(10), -- 'Oui', 'Non'
    montant_aide INTEGER DEFAULT 0,
    emploi VARCHAR(50), -- 'CDI', 'CDD', 'Intérim', 'Temps partiel', 'En recherche', 'Sans'
    compte_bancaire VARCHAR(10), -- 'Oui', 'Non'
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

### Table `familles`
```sql
CREATE TABLE familles (
    id SERIAL PRIMARY KEY,
    chambre VARCHAR(10),
    ts_referente VARCHAR(100),
    nom VARCHAR(100),
    prenom VARCHAR(100),
    date_naissance DATE,
    age INTEGER,
    nationalite VARCHAR(100),
    telephone VARCHAR(20),
    email VARCHAR(200),
    statut VARCHAR(50),
    assurance_maladie VARCHAR(50),
    date_arrivee DATE,
    aide_alimentaire VARCHAR(10),
    montant_aide INTEGER DEFAULT 0,
    emploi VARCHAR(50),
    compte_bancaire VARCHAR(10),
    enfants JSONB, -- [{"prenom": "Lucas", "age": 10, "ecole": "...", "classe": "CM2"}]
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

### Table `travailleurs_sociaux` (optionnelle)
```sql
CREATE TABLE travailleurs_sociaux (
    id SERIAL PRIMARY KEY,
    nom VARCHAR(100) UNIQUE,
    email VARCHAR(200),
    actif BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Données initiales
INSERT INTO travailleurs_sociaux (nom) VALUES ('Marie'), ('Sophie'), ('Julie'), ('Laura');
```

## Configuration de l'application

### Option 1 : Via la console du navigateur

Ouvrir la console (F12) et exécuter :

```javascript
configureSupabase(
    'https://votre-projet.supabase.co',
    'votre-anon-key-publique'
);
```

Puis recharger la page.

### Option 2 : Modifier config.js directement

```javascript
const CONFIG = {
    dataMode: 'supabase',
    supabase: {
        url: 'https://votre-projet.supabase.co',
        anonKey: 'votre-anon-key-publique',
        // ...
    }
};
```

## Revenir en mode démo

```javascript
useDemo();
```

## Politiques de sécurité Supabase (RLS)

```sql
-- Activer RLS
ALTER TABLE femmes_isolees ENABLE ROW LEVEL SECURITY;
ALTER TABLE familles ENABLE ROW LEVEL SECURITY;

-- Politique de lecture pour tous les utilisateurs authentifiés
CREATE POLICY "Lecture autorisée" ON femmes_isolees
    FOR SELECT USING (true);

CREATE POLICY "Lecture autorisée" ON familles
    FOR SELECT USING (true);

-- Politique d'écriture (à adapter selon vos besoins)
CREATE POLICY "Écriture autorisée" ON femmes_isolees
    FOR ALL USING (true);

CREATE POLICY "Écriture autorisée" ON familles
    FOR ALL USING (true);
```

## Notes

- Les données démo restent disponibles comme fallback en cas d'erreur de connexion
- Le cache local expire après 5 minutes par défaut
- La sync automatique est désactivée par défaut (activer dans config.js)
