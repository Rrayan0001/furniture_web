const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

const connectionString = 'postgres://postgres:Sampath%400001@db.eqdycdmnociynyalticw.supabase.co:5432/postgres';

const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false } // Supabase requires SSL
});

async function migrate() {
    try {
        await client.connect();
        console.log('Connected to database.');

        const schemaPath = path.join(__dirname, '../.gemini/antigravity/brain/4127cdf3-cbbc-4ac1-9e57-72b319facef6/schema.sql');
        // Note: The schema file path is in the artifacts directory. I need to make sure I can access it.
        // Actually, I should probably copy the content here or read it from the artifact path.
        // Let's just hardcode the path I know.

        // Wait, the artifact path is: /Users/mrrayan07/.gemini/antigravity/brain/4127cdf3-cbbc-4ac1-9e57-72b319facef6/schema.sql
        // I can read it.

        const sql = fs.readFileSync('/Users/mrrayan07/.gemini/antigravity/brain/4127cdf3-cbbc-4ac1-9e57-72b319facef6/schema.sql', 'utf8');

        console.log('Running schema migration...');
        await client.query(sql);
        console.log('Migration complete.');

    } catch (err) {
        console.error('Migration failed:', err);
    } finally {
        await client.end();
    }
}

migrate();
