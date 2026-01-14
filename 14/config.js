// Configuration Supabase - Veille Municipales 2026
// ==================================================

const SUPABASE_CONFIG = {
    // URL du projet Supabase
    url: 'https://hwunkojdzodcutewkfet.supabase.co',

    // Clé anon (publique)
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh3dW5rb2pkem9kY3V0ZXdrZmV0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgzOTMzNTAsImV4cCI6MjA4Mzk2OTM1MH0.Zpe-QqzKDIpx3pTa6_e9ysfI-Rprl3SXANM8b2pqXU0',

    // Tables
    tables: {
        communes: 'communes',
        candidats: 'candidats',
        dingueries: 'dingueries',
        sources: 'sources_scraping'
    }
};

// Client Supabase simplifié (sans dépendance npm)
class SupabaseClient {
    constructor(url, key) {
        this.url = url;
        this.key = key;
        this.headers = {
            'apikey': key,
            'Authorization': `Bearer ${key}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=representation'
        };
    }

    // SELECT * FROM table
    async select(table, options = {}) {
        let url = `${this.url}/rest/v1/${table}?select=*`;

        if (options.filter) {
            url += `&${options.filter}`;
        }
        if (options.order) {
            url += `&order=${options.order}`;
        }
        if (options.limit) {
            url += `&limit=${options.limit}`;
        }

        const response = await fetch(url, {
            method: 'GET',
            headers: this.headers
        });

        if (!response.ok) {
            throw new Error(`Erreur Supabase: ${response.status}`);
        }

        return response.json();
    }

    // INSERT INTO table
    async insert(table, data) {
        const response = await fetch(`${this.url}/rest/v1/${table}`, {
            method: 'POST',
            headers: this.headers,
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            const error = await response.text();
            throw new Error(`Erreur insertion: ${error}`);
        }

        return response.json();
    }

    // UPDATE table SET ... WHERE id = ...
    async update(table, id, data) {
        const response = await fetch(`${this.url}/rest/v1/${table}?id=eq.${id}`, {
            method: 'PATCH',
            headers: this.headers,
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error(`Erreur update: ${response.status}`);
        }

        return response.json();
    }

    // DELETE FROM table WHERE id = ...
    async delete(table, id) {
        const response = await fetch(`${this.url}/rest/v1/${table}?id=eq.${id}`, {
            method: 'DELETE',
            headers: this.headers
        });

        if (!response.ok) {
            throw new Error(`Erreur delete: ${response.status}`);
        }

        return true;
    }

    // Requête personnalisée avec filtres
    async query(table, filters = {}) {
        let url = `${this.url}/rest/v1/${table}?select=*`;

        Object.entries(filters).forEach(([key, value]) => {
            if (typeof value === 'object') {
                // Opérateurs: eq, neq, gt, lt, gte, lte, like, ilike
                Object.entries(value).forEach(([op, val]) => {
                    url += `&${key}=${op}.${val}`;
                });
            } else {
                url += `&${key}=eq.${value}`;
            }
        });

        const response = await fetch(url, {
            method: 'GET',
            headers: this.headers
        });

        return response.json();
    }
}

// Export pour utilisation
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { SUPABASE_CONFIG, SupabaseClient };
}
