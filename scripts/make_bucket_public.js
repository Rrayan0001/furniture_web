const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://eqdycdmnociynyalticw.supabase.co';
const serviceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVxZHljZG1ub2NpeW55YWx0aWN3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NDE1Mzc1OCwiZXhwIjoyMDc5NzI5NzU4fQ.HrtDDpAVl6GVC26u8qTlcoUIzPKlhx8_O6WCLv62DKk';

const supabase = createClient(supabaseUrl, serviceKey);

async function fixStorage() {
    console.log('Updating "images" bucket to public...');

    const { data, error } = await supabase
        .storage
        .updateBucket('images', {
            public: true,
            fileSizeLimit: 10485760, // 10MB
            allowedMimeTypes: ['image/png', 'image/jpeg', 'image/gif', 'image/webp']
        });

    if (error) {
        console.error('Error updating bucket:', error);
    } else {
        console.log('Bucket updated successfully:', data);
    }
}

fixStorage();
