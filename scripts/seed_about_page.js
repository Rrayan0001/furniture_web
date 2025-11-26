const { Client } = require('pg');

const connectionString = `postgresql://postgres:Sampath@0001@db.eqdycdmnociynyalticw.supabase.co:5432/postgres`;

async function seedAboutPage() {
    console.log('Seeding About page data...');

    const client = new Client({
        connectionString: connectionString,
        ssl: { rejectUnauthorized: false }
    });

    try {
        await client.connect();

        // Check if 'about' page exists
        const checkPage = await client.query(`SELECT id FROM pages WHERE slug = 'about'`);

        if (checkPage.rows.length > 0) {
            console.log('About page already exists. Skipping seed.');
            return;
        }

        // Insert About page
        const pageResult = await client.query(`
      INSERT INTO pages (slug, title)
      VALUES ('about', 'About Us')
      RETURNING id
    `);

        const pageId = pageResult.rows[0].id;
        console.log('✓ Created about page');

        // Insert Hero section
        const heroResult = await client.query(`
      INSERT INTO sections (page_id, type, order_index)
      VALUES ($1, 'hero', 0)
      RETURNING id
    `, [pageId]);

        const heroId = heroResult.rows[0].id;

        // Hero content blocks
        await client.query(`
      INSERT INTO content_blocks (section_id, type, key, value)
      VALUES 
        ($1, 'text', 'heading', 'About granger vintage'),
        ($1, 'text', 'description', 'We curate timeless pieces that tell a story and bring character to your space.')
    `, [heroId]);

        console.log('✓ Created hero section');

        // Insert Story section
        const storyResult = await client.query(`
      INSERT INTO sections (page_id, type, order_index)
      VALUES ($1, 'text', 1)
      RETURNING id
    `, [pageId]);

        const storyId = storyResult.rows[0].id;

        await client.query(`
      INSERT INTO content_blocks (section_id, type, key, value)
      VALUES 
        ($1, 'text', 'heading', 'Our Story'),
        ($1, 'text', 'content', 'Founded with a passion for vintage treasures, granger vintage brings carefully selected furniture and decor pieces to those who appreciate quality craftsmanship and timeless design. Each piece in our collection is handpicked for its unique character and enduring appeal.')
    `, [storyId]);

        console.log('✓ Created story section');

        // Insert Values section
        const valuesResult = await client.query(`
      INSERT INTO sections (page_id, type, order_index)
      VALUES ($1, 'text', 2)
      RETURNING id
    `, [pageId]);

        const valuesId = valuesResult.rows[0].id;

        await client.query(`
      INSERT INTO content_blocks (section_id, type, key, value)
      VALUES 
        ($1, 'text', 'heading', 'Our Values'),
        ($1, 'text', 'content', 'Quality • Authenticity • Sustainability • Character')
    `, [valuesId]);

        console.log('✓ Created values section');

        console.log('\n✅ About page seeded successfully!');
    } catch (err) {
        console.error('❌ Seed failed:', err);
    } finally {
        await client.end();
    }
}

seedAboutPage();
