const { createClient } = require('@supabase/supabase-js');
const { Client } = require('pg');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://eqdycdmnociynyalticw.supabase.co';
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVxZHljZG1ub2NpeW55YWx0aWN3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NDE1Mzc1OCwiZXhwIjoyMDc5NzI5NzU4fQ.HrtDDpAVl6GVC26u8qTlcoUIzPKlhx8_O6WCLv62DKk';

const connectionString = `postgresql://postgres:Sampath@0001@db.eqdycdmnociynyalticw.supabase.co:5432/postgres`;

async function runMigration() {
    console.log('Running migration: Creating user_profiles and user_addresses tables...');

    const client = new Client({
        connectionString: connectionString,
        ssl: { rejectUnauthorized: false }
    });

    try {
        await client.connect();

        // Create user_profiles table
        await client.query(`
      CREATE TABLE IF NOT EXISTS user_profiles (
        id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
        user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
        email text,
        first_name text,
        last_name text,
        phone text,
        created_at timestamp with time zone DEFAULT now(),
        updated_at timestamp with time zone DEFAULT now(),
        UNIQUE(user_id)
      );
    `);

        console.log('✓ Created user_profiles table');

        // Create user_addresses table
        await client.query(`
      CREATE TABLE IF NOT EXISTS user_addresses (
        id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
        user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
        label text,
        address text,
        city text,
        state text,
        pincode text,
        country text DEFAULT 'India',
        is_default boolean DEFAULT false,
        created_at timestamp with time zone DEFAULT now()
      );
    `);

        console.log('✓ Created user_addresses table');

        // Create RLS policies for user_profiles
        await client.query(`
      ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
      
      DROP POLICY IF EXISTS "Users can view own profile" ON user_profiles;
      CREATE POLICY "Users can view own profile" ON user_profiles
        FOR SELECT USING (auth.uid() = user_id);
      
      DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
      CREATE POLICY "Users can update own profile" ON user_profiles
        FOR UPDATE USING (auth.uid() = user_id);
      
      DROP POLICY IF EXISTS "Users can insert own profile" ON user_profiles;
      CREATE POLICY "Users can insert own profile" ON user_profiles
        FOR INSERT WITH CHECK (auth.uid() = user_id);
    `);

        console.log('✓ Created RLS policies for user_profiles');

        // Create RLS policies for user_addresses
        await client.query(`
      ALTER TABLE user_addresses ENABLE ROW LEVEL SECURITY;
      
      DROP POLICY IF EXISTS "Users can view own addresses" ON user_addresses;
      CREATE POLICY "Users can view own addresses" ON user_addresses
        FOR SELECT USING (auth.uid() = user_id);
      
      DROP POLICY IF EXISTS "Users can manage own addresses" ON user_addresses;
      CREATE POLICY "Users can manage own addresses" ON user_addresses
        FOR ALL USING (auth.uid() = user_id);
    `);

        console.log('✓ Created RLS policies for user_addresses');

        console.log('\n✅ Migration successful!');
    } catch (err) {
        console.error('❌ Migration failed:', err);
    } finally {
        await client.end();
    }
}

runMigration();
