const { createClient } = require('@supabase/supabase-js');
// require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVxZHljZG1ub2NpeW55YWx0aWN3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NDE1Mzc1OCwiZXhwIjoyMDc5NzI5NzU4fQ.HrtDDpAVl6GVC26u8qTlcoUIzPKlhx8_O6WCLv62DKk';

if (!supabaseUrl || !serviceKey) {
    console.error('Missing Supabase credentials in .env.local');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceKey);

async function runMigration() {
    console.log('Running migration: Adding additional_images and model_url to products...');

    // We'll use a raw SQL query via the rpc interface if available, or just standard pg client if we had it.
    // Since we don't have direct SQL access via supabase-js client without creating a function,
    // we will try to use the 'postgres' library if available, or just instruct the user to run SQL.
    // Wait, I can't easily run raw SQL with just supabase-js unless I have a stored procedure.
    // Actually, I can use the `pg` library I installed earlier for the initial migration!

    const { Client } = require('pg');

    // Parse the connection string. Since we don't have the connection string in env, 
    // I will have to ask the user or try to construct it if I had the password.
    // I have the password from the previous turn: Sampath@0001
    // And the project ref: eqdycdmnociynyalticw

    const connectionString = `postgresql://postgres:Sampath@0001@db.eqdycdmnociynyalticw.supabase.co:5432/postgres`;

    const client = new Client({
        connectionString: connectionString,
        ssl: { rejectUnauthorized: false } // Supabase requires SSL
    });

    try {
        await client.connect();

        await client.query(`
      ALTER TABLE products 
      ADD COLUMN IF NOT EXISTS additional_images text[] DEFAULT '{}',
      ADD COLUMN IF NOT EXISTS model_url text;
    `);

        console.log('Migration successful!');
    } catch (err) {
        console.error('Migration failed:', err);
    } finally {
        await client.end();
    }
}

runMigration();
