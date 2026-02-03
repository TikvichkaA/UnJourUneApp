/**
 * Couche d'accès à la base de données SQLite (sql.js)
 * Persistance dans IndexedDB pour survie aux rechargements
 */

const DB_NAME = 'chu-babinski';
const DB_STORE = 'database';
const DB_KEY = 'sqlite-data';

class Database {
    constructor() {
        this.db = null;
        this.SQL = null;
        this.ready = false;
        this._saveTimeout = null;
    }

    /**
     * Initialise la base de données
     */
    async init() {
        // Charger sql.js
        this.SQL = await initSqlJs({
            locateFile: file => `lib/${file}`
        });

        // Tenter de charger depuis IndexedDB
        const savedData = await this._loadFromIndexedDB();

        if (savedData) {
            this.db = new this.SQL.Database(savedData);
            console.log('Base de données chargée depuis IndexedDB');
        } else {
            this.db = new this.SQL.Database();
            console.log('Nouvelle base de données créée');
        }

        this.ready = true;
        return this;
    }

    /**
     * Exécute une requête SQL (INSERT, UPDATE, DELETE)
     */
    run(sql, params = []) {
        this.db.run(sql, params);
        this._scheduleSave();
    }

    /**
     * Exécute plusieurs requêtes SQL
     */
    exec(sql) {
        const result = this.db.exec(sql);
        this._scheduleSave();
        return result;
    }

    /**
     * Récupère une seule ligne
     */
    get(sql, params = []) {
        const stmt = this.db.prepare(sql);
        stmt.bind(params);
        let result = null;
        if (stmt.step()) {
            result = stmt.getAsObject();
        }
        stmt.free();
        return result;
    }

    /**
     * Récupère toutes les lignes
     */
    getAll(sql, params = []) {
        const stmt = this.db.prepare(sql);
        stmt.bind(params);
        const results = [];
        while (stmt.step()) {
            results.push(stmt.getAsObject());
        }
        stmt.free();
        return results;
    }

    /**
     * Récupère le dernier ID inséré
     */
    lastInsertRowId() {
        return this.db.exec("SELECT last_insert_rowid()")[0].values[0][0];
    }

    /**
     * Compte le nombre de changements de la dernière requête
     */
    changes() {
        return this.db.getRowsModified();
    }

    /**
     * Planifie une sauvegarde (debounce pour éviter trop d'écritures)
     */
    _scheduleSave() {
        if (this._saveTimeout) {
            clearTimeout(this._saveTimeout);
        }
        this._saveTimeout = setTimeout(() => {
            this._saveToIndexedDB();
        }, 100);
    }

    /**
     * Force la sauvegarde immédiate
     */
    async save() {
        if (this._saveTimeout) {
            clearTimeout(this._saveTimeout);
        }
        await this._saveToIndexedDB();
    }

    /**
     * Sauvegarde dans IndexedDB
     */
    async _saveToIndexedDB() {
        const data = this.db.export();
        const buffer = new Uint8Array(data);

        return new Promise((resolve, reject) => {
            const request = indexedDB.open(DB_NAME, 1);

            request.onerror = () => reject(request.error);

            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                if (!db.objectStoreNames.contains(DB_STORE)) {
                    db.createObjectStore(DB_STORE);
                }
            };

            request.onsuccess = (event) => {
                const db = event.target.result;
                const transaction = db.transaction(DB_STORE, 'readwrite');
                const store = transaction.objectStore(DB_STORE);
                store.put(buffer, DB_KEY);

                transaction.oncomplete = () => {
                    db.close();
                    resolve();
                };
                transaction.onerror = () => reject(transaction.error);
            };
        });
    }

    /**
     * Charge depuis IndexedDB
     */
    async _loadFromIndexedDB() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(DB_NAME, 1);

            request.onerror = () => reject(request.error);

            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                if (!db.objectStoreNames.contains(DB_STORE)) {
                    db.createObjectStore(DB_STORE);
                }
            };

            request.onsuccess = (event) => {
                const db = event.target.result;
                const transaction = db.transaction(DB_STORE, 'readonly');
                const store = transaction.objectStore(DB_STORE);
                const getRequest = store.get(DB_KEY);

                getRequest.onsuccess = () => {
                    db.close();
                    resolve(getRequest.result || null);
                };
                getRequest.onerror = () => {
                    db.close();
                    resolve(null);
                };
            };
        });
    }

    /**
     * Exporte la base en fichier téléchargeable
     */
    exportAsFile(filename = 'chu-babinski.sqlite') {
        const data = this.db.export();
        const blob = new Blob([data], { type: 'application/x-sqlite3' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();

        URL.revokeObjectURL(url);
    }

    /**
     * Importe depuis un fichier .sqlite
     */
    async importFromFile(file) {
        const buffer = await file.arrayBuffer();
        this.db = new this.SQL.Database(new Uint8Array(buffer));
        await this._saveToIndexedDB();
        console.log('Base de données importée depuis fichier');
    }

    /**
     * Réinitialise complètement la base de données
     */
    async reset() {
        this.db.close();
        this.db = new this.SQL.Database();
        await this._saveToIndexedDB();
        console.log('Base de données réinitialisée');
    }
}

// Instance singleton
const db = new Database();
