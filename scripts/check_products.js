const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://eqdycdmnociynyalticw.supabase.co';
const serviceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVxZHljZG1ub2NpeW55YWx0aWN3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NDE1Mzc1OCwiZXhwIjoyMDc5NzI5NzU4fQ.HrtDDpAVl6GVC26u8qTlcoUIzPKlhx8_O6WCLv62DKk';

const supabase = createClient(supabaseUrl, serviceKey);

async function checkProducts() {
    console.log('Checking products with 3D models...\n');

    const { data, error } = await supabase
        .from('products')
        .select('id, name, model_url, additional_images');

    if (error) {
        console.error('Error:', error);
        return;
    }

    console.log('Total products:', data.length);
    console.log('\nProducts with model_url:');

    data.forEach(product => {
        console.log(`\n- ${product.name} (ID: ${product.id})`);
        console.log(`  model_url: ${product.model_url || 'NOT SET'}`);
        console.log(`  additional_images: ${product.additional_images ? product.additional_images.length + ' images' : 'NONE'}`);
    });
}

checkProducts();
