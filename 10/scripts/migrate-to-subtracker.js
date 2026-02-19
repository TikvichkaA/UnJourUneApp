/**
 * SubTracker - Migration des données existantes
 *
 * Migre les saved_aaps vers la table subventions.
 *
 * Usage: node scripts/migrate-to-subtracker.js
 *
 * Requiert: SUPABASE_URL et SUPABASE_SERVICE_KEY en variables d'env
 */

const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://zstisdptwxynshftqdln.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

if (!SUPABASE_SERVICE_KEY) {
  console.error('SUPABASE_SERVICE_KEY requis');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

const STATUS_MAP = {
  'saved': 'piste',
  'applied': 'deposee',
  'accepted': 'accordee',
  'rejected': 'refusee'
};

async function migrate() {
  console.log('Migration saved_aaps → subventions...');

  const { data: savedAaps, error } = await supabase
    .from('saved_aaps')
    .select('*');

  if (error) {
    console.error('Erreur lecture saved_aaps:', error);
    return;
  }

  console.log(`${savedAaps.length} saved_aaps trouvés`);

  let migrated = 0;
  let skipped = 0;

  for (const saved of savedAaps) {
    const aapData = saved.aap_data || {};

    const subvention = {
      user_id: saved.user_id,
      aap_id: saved.aap_id,
      name: aapData.titre || aapData.title || 'AAP sans titre',
      financeur: aapData.financeur || null,
      financeur_type: aapData.financeurType || aapData.financeur_type || null,
      status: STATUS_MAP[saved.status] || 'piste',
      amount_requested: aapData.montantMax || aapData.montant_max || 0,
      notes: saved.notes || null,
      aap_data: aapData,
      dates: {
        depot: saved.applied_at || null,
        deadline: aapData.dateCloture || aapData.date_cloture || null
      },
      created_at: saved.saved_at || new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const { error: insertError } = await supabase
      .from('subventions')
      .insert(subvention);

    if (insertError) {
      console.warn(`  Skip ${subvention.name}: ${insertError.message}`);
      skipped++;
    } else {
      console.log(`  Migré: ${subvention.name} (${subvention.status})`);
      migrated++;
    }
  }

  console.log(`\nTerminé: ${migrated} migrés, ${skipped} ignorés`);
}

migrate().catch(console.error);
