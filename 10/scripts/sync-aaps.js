/**
 * Script de synchronisation des AAP depuis Aides-territoires vers Supabase
 *
 * Usage: node scripts/sync-aaps.js
 *
 * Peut etre execute manuellement ou via cron/GitHub Actions
 */

const SUPABASE_URL = 'https://zstisdptwxynshftqdln.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY; // Cle service (pas anon!)

// URL du fichier JSON public (data.gouv.fr)
const DATA_URL = 'https://aides-territoires-prod.s3.fr-par.scw.cloud/aides-territoires-prod/aids/all-aids.json';

// Mapping des categories
const CATEGORY_MAPPING = {
  'culture': 'culture',
  'environnement': 'environnement',
  'nature-environnement': 'environnement',
  'developpement-durable': 'environnement',
  'eau-et-assainissement': 'environnement',
  'social': 'social',
  'solidarites': 'social',
  'cohesion-sociale': 'social',
  'education': 'education',
  'education-et-formation': 'education',
  'sante': 'sante',
  'sport': 'sport',
  'emploi': 'insertion',
  'insertion-professionnelle': 'insertion',
  'numerique': 'numerique',
  'urbanisme': 'autre',
  'mobilite': 'autre',
  'energie': 'environnement'
};

const AUDIENCE_MAPPING = {
  'association': 'Associations',
  'commune': 'Communes',
  'epci': 'EPCI',
  'department': 'Departements',
  'region': 'Regions',
  'public-org': 'Etablissements publics',
  'private-sector': 'Entreprises',
  'farmer': 'Agriculteurs'
};

async function fetchAllAids() {
  console.log('Fetching aids from data.gouv.fr JSON file...');
  console.log(`URL: ${DATA_URL}`);

  try {
    const response = await fetch(DATA_URL);

    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }

    const allAids = await response.json();
    console.log(`Total aids in file: ${allAids.length}`);

    // Filtrer pour les associations uniquement
    const forAssociations = allAids.filter(aid => {
      const audiences = aid.targeted_audiences || [];
      return audiences.some(a => {
        const slug = typeof a === 'string' ? a : a.slug;
        return slug === 'association' || slug === 'associations';
      });
    });

    console.log(`Aids for associations: ${forAssociations.length}`);
    return forAssociations;

  } catch (error) {
    console.error('Error fetching data:', error.message);
    return [];
  }
}

function transformAid(aide) {
  // Determiner le secteur
  let secteur = 'autre';
  if (aide.categories && aide.categories.length > 0) {
    const cat = aide.categories[0].slug || aide.categories[0];
    secteur = CATEGORY_MAPPING[cat] || 'autre';
  }

  // Determiner le type de financeur
  let financeurType = 'etat';
  const financerName = (aide.financers && aide.financers[0]?.name) || '';
  if (financerName.toLowerCase().includes('region')) {
    financeurType = 'region';
  } else if (financerName.toLowerCase().includes('departement')) {
    financeurType = 'departement';
  } else if (financerName.toLowerCase().includes('europe') || financerName.toLowerCase().includes('ue')) {
    financeurType = 'europe';
  } else if (financerName.toLowerCase().includes('fondation')) {
    financeurType = 'fondation';
  }

  // Extraire les beneficiaires
  const beneficiaires = (aide.targeted_audiences || []).map(a => {
    if (typeof a === 'string') return AUDIENCE_MAPPING[a] || a;
    return AUDIENCE_MAPPING[a.slug] || a.name || a;
  });

  // Extraire le perimetre
  const territoires = [];
  if (aide.perimeter) {
    territoires.push(aide.perimeter.name || 'France');
  } else {
    territoires.push('National');
  }

  // Nettoyer HTML de la description
  const description = stripHtml(aide.description || '');

  return {
    id: `at-${aide.id}`,
    slug: aide.slug,
    titre: aide.name || aide.short_title || 'Sans titre',
    description: description.substring(0, 500),
    description_complete: aide.description || '',
    financeur: (aide.financers && aide.financers[0]?.name) || 'Non precise',
    financeur_type: financeurType,
    secteur: secteur,
    montant_min: null,
    montant_max: null,
    subvention_rate: aide.subvention_rate || null,
    date_ouverture: aide.start_date || null,
    date_cloture: aide.submission_deadline || null,
    lien: aide.origin_url || aide.application_url || `https://aides-territoires.beta.gouv.fr/aides/${aide.slug}/`,
    lien_candidature: aide.application_url || null,
    territoires: territoires,
    beneficiaires: beneficiaires.length > 0 ? beneficiaires : ['Non precise'],
    is_appel_projet: aide.is_call_for_project || false,
    contact: aide.contact || null,
    source: 'aides-territoires',
    categories: aide.categories || [],
    programs: aide.programs || [],
    updated_at: new Date().toISOString()
  };
}

function stripHtml(html) {
  if (!html) return '';
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

async function upsertToSupabase(aids) {
  if (!SUPABASE_SERVICE_KEY) {
    console.error('ERROR: SUPABASE_SERVICE_KEY environment variable is not set');
    console.log('Set it with: export SUPABASE_SERVICE_KEY="your-service-role-key"');
    console.log('Find it in: Supabase Dashboard > Settings > API > service_role key');
    process.exit(1);
  }

  console.log(`Upserting ${aids.length} aids to Supabase...`);

  // Upsert par batch de 100
  const batchSize = 100;
  let inserted = 0;

  for (let i = 0; i < aids.length; i += batchSize) {
    const batch = aids.slice(i, i + batchSize);

    const response = await fetch(`${SUPABASE_URL}/rest/v1/aaps`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_SERVICE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
        'Prefer': 'resolution=merge-duplicates'
      },
      body: JSON.stringify(batch)
    });

    if (!response.ok) {
      const error = await response.text();
      console.error(`Error upserting batch ${i}-${i+batchSize}:`, error);
    } else {
      inserted += batch.length;
      console.log(`  Upserted ${inserted}/${aids.length}`);
    }
  }

  console.log(`Done! ${inserted} aids synced.`);
}

async function main() {
  console.log('=== SubVeille AAP Sync ===\n');

  // 1. Fetch from API
  const rawAids = await fetchAllAids();

  if (rawAids.length === 0) {
    console.log('No aids fetched. Exiting.');
    return;
  }

  // 2. Transform
  console.log('\nTransforming data...');
  const transformedAids = rawAids.map(transformAid);

  // 3. Upsert to Supabase
  console.log('');
  await upsertToSupabase(transformedAids);

  console.log('\n=== Sync complete ===');
}

main().catch(console.error);
