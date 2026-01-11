# Guide d'utilisation de Claude CLI

## ✅ Vérification de l'installation

1. **Fermez et rouvrez votre terminal** (PowerShell ou CMD) pour que les changements du PATH prennent effet.

2. **Vérifiez que Claude est installé :**
   ```powershell
   claude --version
   ```

3. **Vérifiez l'aide :**
   ```powershell
   claude --help
   ```

## 🚀 Utilisation de base

### Commandes principales

```powershell
# Afficher l'aide
claude --help

# Vérifier la version
claude --version

# Lancer Claude en mode interactif (si disponible)
claude

# Exécuter une commande spécifique
claude [commande] [options]
```

## 📝 Notes importantes

- **Redémarrez votre terminal** après l'ajout au PATH pour que la commande `claude` soit reconnue
- Si la commande n'est pas reconnue après redémarrage, vérifiez que le PATH contient bien `C:\Users\Moi\.local\bin`
- Pour vérifier le PATH dans PowerShell :
  ```powershell
  $env:PATH -split ';' | Select-String "\.local\\bin"
  ```

## 🔍 Vérification du PATH

Pour vérifier que le répertoire est bien dans votre PATH utilisateur :

```powershell
[System.Environment]::GetEnvironmentVariable("PATH", "User") -split ';' | Select-String "\.local"
```

## 🆘 Dépannage

Si `claude` n'est pas reconnu même après redémarrage :

1. Vérifiez que le fichier existe :
   ```powershell
   Test-Path "C:\Users\Moi\.local\bin\claude.exe"
   ```

2. Ajoutez manuellement le PATH pour cette session :
   ```powershell
   $env:PATH += ";C:\Users\Moi\.local\bin"
   claude --version
   ```

3. Si nécessaire, ajoutez-le de façon permanente via l'interface graphique :
   - Ouvrez "Variables d'environnement" dans Windows
   - Ajoutez `C:\Users\Moi\.local\bin` au PATH utilisateur






