/**
 * SubTracker - Module Paramètres (profil + abonnement + déconnexion)
 */
var SettingsModule = (function() {
  'use strict';

  async function render(container) {
    var user = Auth.getUser();
    var profile = Auth.getProfile() || {};

    container.innerHTML =
      '<div class="page-header">' +
        '<div class="page-header-row">' +
          '<div>' +
            '<h1 class="page-title">Paramètres</h1>' +
            '<p class="page-subtitle">Votre profil et abonnement</p>' +
          '</div>' +
        '</div>' +
      '</div>' +
      '<div class="page-body">' +
        '<div style="max-width:600px">' +

          // Profile form
          '<div class="card" style="margin-bottom:1.5rem">' +
            '<div class="card-header"><span class="card-title">Profil association</span></div>' +
            '<div class="card-body">' +
              '<form id="profileForm">' +
                '<div class="form-group"><label class="form-label">Nom de l\'association</label>' +
                  '<input type="text" class="form-input" name="nom_association" value="' + App.escapeHtml(profile.nom_association || '') + '"></div>' +
                '<div class="form-row">' +
                  '<div class="form-group"><label class="form-label">SIRET</label>' +
                    '<input type="text" class="form-input" name="siret" value="' + App.escapeHtml(profile.siret || '') + '"></div>' +
                  '<div class="form-group"><label class="form-label">Email contact</label>' +
                    '<input type="email" class="form-input" name="email_contact" value="' + App.escapeHtml(profile.email_contact || '') + '"></div>' +
                '</div>' +
                '<div class="form-row">' +
                  '<div class="form-group"><label class="form-label">Code postal</label>' +
                    '<input type="text" class="form-input" name="code_postal" value="' + App.escapeHtml(profile.code_postal || '') + '"></div>' +
                  '<div class="form-group"><label class="form-label">Ville</label>' +
                    '<input type="text" class="form-input" name="ville" value="' + App.escapeHtml(profile.ville || '') + '"></div>' +
                '</div>' +
                '<div class="form-group"><label class="form-label">Adresse</label>' +
                  '<input type="text" class="form-input" name="adresse" value="' + App.escapeHtml(profile.adresse || '') + '"></div>' +
                '<div class="form-row">' +
                  '<div class="form-group"><label class="form-label">Budget annuel</label>' +
                    '<input type="number" class="form-input" name="budget_annuel" value="' + (profile.budget_annuel || '') + '" min="0"></div>' +
                  '<div class="form-group"><label class="form-label">Nombre de salariés</label>' +
                    '<input type="number" class="form-input" name="nb_salaries" value="' + (profile.nb_salaries || '') + '" min="0"></div>' +
                '</div>' +
                '<div class="form-group"><label class="form-label">Secteurs d\'activité</label>' +
                  '<div style="display:flex;flex-wrap:wrap;gap:0.5rem" id="sectorsChecks">' +
                    sectorCheckboxes(profile.secteurs || []) +
                  '</div>' +
                '</div>' +
                '<button type="submit" class="btn btn-primary">Enregistrer le profil</button>' +
              '</form>' +
            '</div>' +
          '</div>' +

          // Subscription card
          '<div class="card" style="margin-bottom:1.5rem">' +
            '<div class="card-header"><span class="card-title">Abonnement</span></div>' +
            '<div class="card-body">' +
              '<div class="detail-row">' +
                '<div class="detail-field"><div class="detail-field-label">Plan</div>' +
                  '<div class="detail-field-value" style="text-transform:capitalize">' + (profile.subscription_tier || 'Free') + '</div></div>' +
                '<div class="detail-field"><div class="detail-field-label">Expire</div>' +
                  '<div class="detail-field-value">' + (profile.subscription_expires_at ? DateUtils.formatDate(profile.subscription_expires_at) : 'N/A') + '</div></div>' +
              '</div>' +
              '<p style="font-size:0.82rem;color:var(--text-muted);margin-top:0.75rem">Plan gratuit : 5 financements max. Passez a Pro pour un suivi illimite.</p>' +
            '</div>' +
          '</div>' +

          // Account actions
          '<div class="card">' +
            '<div class="card-header"><span class="card-title">Compte</span></div>' +
            '<div class="card-body">' +
              '<p style="font-size:0.85rem;margin-bottom:0.75rem">Connecté en tant que <strong>' + App.escapeHtml(user ? user.email : '') + '</strong></p>' +
              '<button class="btn btn-danger" id="btnSignOut">Se déconnecter</button>' +
            '</div>' +
          '</div>' +

        '</div>' +
      '</div>';

    // Bind
    container.querySelector('#profileForm').addEventListener('submit', handleProfileSubmit);
    container.querySelector('#btnSignOut').addEventListener('click', async function() {
      await Auth.signOut();
      App.toast('Déconnecté', 'success');
      window.location.hash = '#dashboard';
    });
  }

  function sectorCheckboxes(selected) {
    var sectors = ['culture', 'environnement', 'social', 'education', 'sante', 'sport', 'solidarite', 'insertion', 'numerique'];
    var html = '';
    for (var i = 0; i < sectors.length; i++) {
      var checked = selected.indexOf(sectors[i]) !== -1 ? ' checked' : '';
      html += '<label class="form-check"><input type="checkbox" name="secteurs" value="' + sectors[i] + '"' + checked + '> ' +
              sectors[i].charAt(0).toUpperCase() + sectors[i].slice(1) + '</label>';
    }
    return html;
  }

  async function handleProfileSubmit(e) {
    e.preventDefault();
    var form = e.target;

    var secteurCheckboxes = form.querySelectorAll('[name="secteurs"]:checked');
    var secteurs = [];
    for (var i = 0; i < secteurCheckboxes.length; i++) {
      secteurs.push(secteurCheckboxes[i].value);
    }

    var data = {
      nom_association: form.nom_association.value.trim(),
      siret: form.siret.value.trim() || null,
      email_contact: form.email_contact.value.trim() || null,
      code_postal: form.code_postal.value.trim() || null,
      ville: form.ville.value.trim() || null,
      adresse: form.adresse.value.trim() || null,
      budget_annuel: parseInt(form.budget_annuel.value) || null,
      nb_salaries: parseInt(form.nb_salaries.value) || null,
      secteurs: secteurs
    };

    try {
      await Auth.updateProfile(data);
      App.toast('Profil mis à jour', 'success');
    } catch (err) {
      App.toast('Erreur: ' + err.message, 'error');
    }
  }

  return {
    render: render
  };
})();
