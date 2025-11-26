const { createClient } = require('@supabase/supabase-js');
// require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // We might need this if anon doesn't have list permissions

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials in .env.local');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkStorage() {
    console.log('Checking "images" bucket...');

    // 1. List files
    const { data: files, error: listError } = await supabase
        .storage
        .from('images')
        .list();

    if (listError) {
        console.error('Error listing files:', listError);
    } else {
        console.log(`Found ${files.length} files in "images" bucket.`);
        if (files.length > 0) {
            console.log('First 5 files:', files.slice(0, 5).map(f => f.name));

            // 2. Check Public URL of the first file
            const firstFile = files[0];
            const { data } = supabase.storage.from('images').getPublicUrl(firstFile.name);
            console.log('Public URL for first file:', data.publicUrl);
        }
    }

    // 3. Try to upload a test file
    console.log('\nAttempting test upload...');
    const testFileName = `test-${Date.now()}.txt`;
    const { data: uploadData, error: uploadError } = await supabase
        .storage
        .from('images')
        .upload(testFileName, 'Hello World', {
            contentType: 'text/plain',
            upsert: true
        });

    if (uploadError) {
        console.error('Upload failed:', uploadError);
    } else {
        console.log('Upload successful:', uploadData);
        const { data: urlData } = supabase.storage.from('images').getPublicUrl(testFileName);
        console.log('Test file Public URL:', urlData.publicUrl);
    }
}

checkStorage();
