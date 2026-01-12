/**
 * SubVeille - Agregateur de sources AAP
 *
 * Usage: node scripts/aggregator.js [options]
 *
 * Options:
 *   --source=name    Sync only one source (ex: --source=aides-territoires)
 *   --dry-run        Don't write to database, just show what would be synced
 *   --verbose        Show detailed logs
 */

const SUPABASE_URL = 'https://zstisdptwxynshftqdln.supabase.co';
// Cle service - peut etre override par env var
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpzdGlzZHB0d3h5bnNoZnRxZGxuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODEzNzI1MCwiZXhwIjoyMDgzNzEzMjUwfQ.bSf1R4-gaDGrdzX4ZCjFreAf2xK50ekw0J5v3eVpsuU';

// Import des connecteurs
const AidesTerritoiresConnector = require('./connectors/aides-territoires');
const FondationFranceConnector = require('./connectors/fondation-france');
const RegionIdfConnector = require('./connectors/region-idf');

// Registry des connecteurs disponibles
const CONNECTORS = {
  'aides-territoires': AidesTerritoiresConnector,
  'fondation-france': FondationFranceConnector,
  'region-idf': RegionIdfConnector,
};

// Parse arguments
const args = process.argv.slice(2);
const options = {
  source: null,
  dryRun: false,
  verbose: false
};

args.forEach(arg => {
  if (arg.startsWith('--source=')) {
    options.source = arg.split('=')[1];
  } else if (arg === '--dry-run') {
    options.dryRun = true;
  } else if (arg === '--verbose') {
    options.verbose = true;
  }
});

/**
 * Upsert des AAP dans Supabase
 */
async function upsertToSupabase(aaps) {
  if (!SUPABASE_SERVICE_KEY) {
    console.error('ERROR: SUPABASE_SERVICE_KEY not set');
    console.log('Set it with: export SUPABASE_SERVICE_KEY="your-service-role-key"');
    process.exit(1);
  }

  if (options.dryRun) {
    console.log(`[DRY-RUN] Would upsert ${aaps.length} AAPs`);
    return aaps.length;
  }

  console.log(`Upserting ${aaps.length} AAPs to Supabase...`);

  // Transformer pour le schema Supabase
  const records = aaps.map(aap => ({
    id: aap.id,
    slug: aap.source_id,
    titre: aap.titre,
    description: aap.description,
    description_complete: aap.description_complete,
    financeur: aap.financeur,
    financeur_type: aap.financeur_type,
    secteur: aap.secteur,
    montant_min: aap.montant_min,
    montant_max: aap.montant_max,
    subvention_rate: aap.subvention_rate,
    date_ouverture: aap.date_ouverture,
    date_cloture: aap.date_cloture,
    lien: aap.lien,
    lien_candidature: aap.lien_candidature,
    territoires: aap.territoires,
    beneficiaires: aap.beneficiaires,
    is_appel_projet: aap.is_appel_projet,
    contact: aap.contact,
    source: aap.source,
    categories: aap.tags,
    programs: [],
    updated_at: aap.updated_at
  }));

  // Upsert par batch
  const batchSize = 100;
  let inserted = 0;

  for (let i = 0; i < records.length; i += batchSize) {
    const batch = records.slice(i, i + batchSize);

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
      console.error(`Error upserting batch ${i}-${i + batchSize}:`, error);
    } else {
      inserted += batch.length;
      if (options.verbose) {
        console.log(`  Upserted ${inserted}/${records.length}`);
      }
    }
  }

  return inserted;
}

/**
 * Supprime les AAP obsoletes (clos depuis longtemps)
 */
async function cleanupOldAaps() {
  if (options.dryRun) {
    console.log('[DRY-RUN] Would cleanup old AAPs');
    return;
  }

  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    .toISOString().split('T')[0];

  const response = await fetch(
    `${SUPABASE_URL}/rest/v1/aaps?date_cloture=lt.${thirtyDaysAgo}`,
    {
      method: 'DELETE',
      headers: {
        'apikey': SUPABASE_SERVICE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`
      }
    }
  );

  if (response.ok) {
    console.log('Cleaned up AAPs closed more than 30 days ago');
  }
}

/**
 * Main
 */
async function main() {
  console.log('========================================');
  console.log('  SubVeille AAP Aggregator');
  console.log('========================================\n');

  if (options.dryRun) {
    console.log('Mode: DRY-RUN (no database writes)\n');
  }

  // Determiner quels connecteurs utiliser
  let connectorsToRun = Object.keys(CONNECTORS);
  if (options.source) {
    if (!CONNECTORS[options.source]) {
      console.error(`Unknown source: ${options.source}`);
      console.log(`Available: ${Object.keys(CONNECTORS).join(', ')}`);
      process.exit(1);
    }
    connectorsToRun = [options.source];
  }

  console.log(`Sources to sync: ${connectorsToRun.join(', ')}\n`);

  // Collecter tous les AAP
  const allAaps = [];
  const stats = {};

  for (const name of connectorsToRun) {
    console.log(`--- ${name} ---`);

    try {
      const ConnectorClass = CONNECTORS[name];
      const connector = new ConnectorClass();

      const aaps = await connector.fetch();
      allAaps.push(...aaps);

      stats[name] = {
        fetched: connector.stats.fetched,
        errors: connector.stats.errors
      };

      console.log(`Fetched: ${connector.stats.fetched}, Errors: ${connector.stats.errors}\n`);

    } catch (error) {
      console.error(`Failed to fetch from ${name}: ${error.message}\n`);
      stats[name] = { fetched: 0, errors: 1, message: error.message };
    }
  }

  // Deduplication par ID
  const uniqueAaps = [];
  const seenIds = new Set();

  for (const aap of allAaps) {
    if (!seenIds.has(aap.id)) {
      seenIds.add(aap.id);
      uniqueAaps.push(aap);
    }
  }

  console.log(`Total unique AAPs: ${uniqueAaps.length}\n`);

  // Upsert dans Supabase
  const inserted = await upsertToSupabase(uniqueAaps);

  // Cleanup
  await cleanupOldAaps();

  // Resume
  console.log('\n========================================');
  console.log('  Summary');
  console.log('========================================');
  console.log(`Total synced: ${inserted}`);
  console.log('\nBy source:');
  for (const [name, s] of Object.entries(stats)) {
    console.log(`  ${name}: ${s.fetched} fetched, ${s.errors} errors`);
  }
  console.log('\nDone!');
}

main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
