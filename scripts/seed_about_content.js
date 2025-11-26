const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://eqdycdmnociynyalticw.supabase.co';
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVxZHljZG1ub2NpeW55YWx0aWN3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NDE1Mzc1OCwiZXhwIjoyMDc5NzI5NzU4fQ.HrtDDpAVl6GVC26u8qTlcoUIzPKlhx8_O6WCLv62DKk';

const supabase = createClient(supabaseUrl, serviceKey);

async function seedAboutPage() {
    console.log('Seeding About page content...');

    // 1. Get or Create About Page
    let { data: page } = await supabase
        .from('pages')
        .select('id')
        .eq('slug', 'about')
        .single();

    if (!page) {
        const { data: newPage, error } = await supabase
            .from('pages')
            .insert({ slug: 'about', title: 'About Us' })
            .select()
            .single();
        if (error) {
            console.error('Error creating page:', error);
            return;
        }
        page = newPage;
    }

    console.log('Page ID:', page.id);

    // 2. Create Hero Section
    let { data: heroSection } = await supabase
        .from('sections')
        .select('id')
        .eq('page_id', page.id)
        .eq('type', 'hero')
        .single();

    if (!heroSection) {
        const { data: newHero, error } = await supabase
            .from('sections')
            .insert({ page_id: page.id, key: 'hero', display_order: 0 })
            .select()
            .single();
        if (error) console.error('Error creating hero section:', error);
        heroSection = newHero;
    }

    if (heroSection) {
        // Insert Hero Content
        const heroContent = [
            { section_id: heroSection.id, key: 'heading', content: { text: 'About granger vintage' }, type: 'text' },
            { section_id: heroSection.id, key: 'description', content: { text: 'We curate timeless pieces that tell a story.' }, type: 'text' }
        ];

        for (const item of heroContent) {
            const { data: existing } = await supabase
                .from('content_blocks')
                .select('id')
                .eq('section_id', item.section_id)
                .eq('key', item.key)
                .single();

            if (!existing) {
                const { error } = await supabase.from('content_blocks').insert(item);
                if (error) console.error('Error inserting hero content:', error);
            } else {
                const { error } = await supabase
                    .from('content_blocks')
                    .update(item)
                    .eq('id', existing.id);
                if (error) console.error('Error updating hero content:', error);
            }
        }
    }

    // 3. Create Text Sections (Story, Values, etc.)
    const sectionsData = [
        {
            key: 'story',
            heading: 'Our Story',
            content: 'Granger Vintage began with a simple love for the past. What started as a weekend hobby of hunting for mid-century treasures in local thrift stores has grown into a curated collection of furniture and decor that brings character to modern homes.\n\nWe believe that every scratch, fade, and patina tells a story. Our mission is to preserve these stories and help you create a space that feels uniquely yours.'
        },
        {
            key: 'values',
            heading: 'Our Values',
            content: 'Sustainability is at the heart of what we do. By giving new life to pre-loved furniture, we reduce waste and promote a more circular economy. We also believe in quality craftsmanship that stands the test of time—something often missing in today\'s fast furniture world.'
        }
    ];

    for (let i = 0; i < sectionsData.length; i++) {
        const sectionData = sectionsData[i];

        let { data: section } = await supabase
            .from('sections')
            .select('id')
            .eq('page_id', page.id)
            .eq('key', sectionData.key)
            .single();

        if (!section) {
            const { data: newSection, error } = await supabase
                .from('sections')
                .insert({ page_id: page.id, key: sectionData.key, display_order: i + 1 })
                .select()
                .single();
            if (error) console.error('Error creating section:', error);
            section = newSection;
        }

        if (section) {
            const content = [
                { section_id: section.id, key: 'heading', content: { text: sectionData.heading }, type: 'text' },
                { section_id: section.id, key: 'content', content: { text: sectionData.content }, type: 'text' }
            ];

            for (const item of content) {
                const { data: existing } = await supabase
                    .from('content_blocks')
                    .select('id')
                    .eq('section_id', item.section_id)
                    .eq('key', item.key)
                    .single();

                if (!existing) {
                    const { error } = await supabase.from('content_blocks').insert(item);
                    if (error) console.error('Error inserting content:', error);
                } else {
                    const { error } = await supabase
                        .from('content_blocks')
                        .update(item)
                        .eq('id', existing.id);
                    if (error) console.error('Error updating content:', error);
                }
            }
        }
    }
    console.log('About page seeded successfully!');
}

seedAboutPage();
