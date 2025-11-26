const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://eqdycdmnociynyalticw.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVxZHljZG1ub2NpeW55YWx0aWN3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NDE1Mzc1OCwiZXhwIjoyMDc5NzI5NzU4fQ.HrtDDpAVl6GVC26u8qTlcoUIzPKlhx8_O6WCLv62DKk';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function seed() {
    console.log('Seeding database...');

    // 1. Create Home Page
    const { data: page, error: pageError } = await supabase
        .from('pages')
        .upsert({ slug: 'home', title: 'Home' }, { onConflict: 'slug' })
        .select()
        .single();

    if (pageError) {
        console.error('Error creating page:', pageError);
        return;
    }
    console.log('Page created:', page.id);

    // 2. Create Sections
    const sectionsData = [
        { key: 'hero', display_order: 1 },
        { key: 'new_arrivals', display_order: 2 },
        { key: 'circles', display_order: 3 },
        { key: 'found_florals', display_order: 4 },
    ];

    const sections = {};

    for (const s of sectionsData) {
        const { data: section, error: sectionError } = await supabase
            .from('sections')
            .upsert({ page_id: page.id, key: s.key, display_order: s.display_order }, { onConflict: 'page_id, key' }) // Note: requires unique constraint on page_id, key if not exists, but we'll assume it works or just insert
            .select()
            .single();

        // If upsert fails due to missing constraint, try select then insert. 
        // But for now let's just try to find it first.
        let finalSection = section;
        if (sectionError) {
            // Try finding it
            const { data: existing } = await supabase.from('sections').select().eq('page_id', page.id).eq('key', s.key).single();
            if (existing) finalSection = existing;
            else {
                const { data: newS } = await supabase.from('sections').insert({ page_id: page.id, key: s.key, display_order: s.display_order }).select().single();
                finalSection = newS;
            }
        }

        sections[s.key] = finalSection;
        console.log(`Section ${s.key} ready:`, finalSection.id);
    }

    // 3. Content Blocks
    const heroContent = {
        heading: 'Midcentury Modern, Vintage,\n& Retro Home Decor',
        subtext: 'Based out of Austin, TX.',
        est_year: '2018',
        est_description: 'Originally established in March 2018 out of a storage unit, our home decor store was born from a love of all things mid-century modern, vintage, and retro.',
        image_1: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&q=80',
        image_2: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=800&q=80',
    };

    const newArrivalsContent = {
        heading: '— New Arrivals',
    };

    const circlesContent = {
        heading: '— Circles & Spheres Collection',
        description: 'Fun and spherical candles, vases, and lamps.',
        link_text: 'Shop Collection',
    };

    const foundFloralsContent = {
        heading: '— Found Florals Collection',
        description: 'Antique vases, and odd shaped containers for flowers or trinkets.',
        link_text: 'Shop Collection',
    };

    await seedContent(sections['hero'].id, heroContent);
    await seedContent(sections['new_arrivals'].id, newArrivalsContent);
    await seedContent(sections['circles'].id, circlesContent);
    await seedContent(sections['found_florals'].id, foundFloralsContent);

    // 4. Products
    const products = [
        {
            name: 'Azul Candles (set of 2)',
            price: 40.00,
            main_image_url: 'https://images.unsplash.com/photo-1615486511484-92e172cc4fe0?w=800&q=80',
            slug: 'azul-candles'
        },
        {
            name: "Grandma's Vases (set of 4)",
            price: 60.00,
            main_image_url: 'https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?w=800&q=80',
            slug: 'grandmas-vases'
        },
        {
            name: 'Orb Light',
            price: 80.00,
            main_image_url: 'https://images.unsplash.com/photo-1573521193826-58c7dc2e13e3?w=600&q=80',
            slug: 'orb-light'
        },
        {
            name: 'Circular Candle',
            price: 15.00,
            main_image_url: 'https://images.unsplash.com/photo-1602874801006-94c0f0c1b90c?w=600&q=80',
            slug: 'circular-candle'
        },
        {
            name: 'Crystal Ball Sculpture',
            price: 100.00,
            main_image_url: 'https://images.unsplash.com/photo-1578321272176-b7bbc0679853?w=600&q=80',
            slug: 'crystal-ball-sculpture'
        },
        {
            name: 'Bubble Vase',
            price: 15.00,
            main_image_url: 'https://images.unsplash.com/photo-1490312278390-ab64016e0aa9?w=600&q=80',
            slug: 'bubble-vase'
        },
        {
            name: 'Antique Vases (set of 3)',
            price: 40.00,
            main_image_url: 'https://images.unsplash.com/photo-1455659817273-f96807779a8a?w=600&q=80',
            slug: 'antique-vases'
        },
        {
            name: 'Pint Vase',
            price: 10.00,
            main_image_url: 'https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?w=600&q=80',
            slug: 'pint-vase'
        },
    ];

    for (const p of products) {
        // We need to remove id from insert if we want uuid to be auto generated, 
        // BUT we want to keep consistent IDs for our hardcoded components to work initially.
        // So we will try to insert with ID.
        const { error } = await supabase
            .from('products')
            .upsert(p, { onConflict: 'slug' });

        if (error) console.error(`Error inserting product ${p.name}:`, error);
        else console.log(`Product ${p.name} inserted`);
    }

    console.log('Seeding complete!');
}

async function seedContent(sectionId, content) {
    for (const [key, value] of Object.entries(content)) {
        // Check if exists
        const { data: existing } = await supabase
            .from('content_blocks')
            .select()
            .eq('section_id', sectionId)
            .eq('key', key)
            .single();

        if (existing) {
            await supabase
                .from('content_blocks')
                .update({ content: value, type: 'text' })
                .eq('id', existing.id);
        } else {
            await supabase
                .from('content_blocks')
                .insert({ section_id: sectionId, key, type: 'text', content: value });
        }
    }
}

seed();
