import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, '.env') });

const VERCEL_TOKEN = process.env.VERCEL_TOKEN;

async function debugVercelProjects() {
    console.log('🔍 Debugging Vercel Token...');
    if (!VERCEL_TOKEN) {
        console.error('❌ VERCEL_TOKEN NOT FOUND in process.env');
        return;
    }
    console.log(`✅ Token Found: ${VERCEL_TOKEN.substring(0, 4)}...${VERCEL_TOKEN.substring(VERCEL_TOKEN.length - 4)}`);
    console.log(`📏 Token Length: ${VERCEL_TOKEN.length}`);

    console.log('\n🔍 Fetching Vercel projects list (/v9/projects)...');
    try {
        const res = await fetch('https://api.vercel.com/v9/projects', {
            headers: { Authorization: `Bearer ${VERCEL_TOKEN}` }
        });

        console.log(`📡 Response Status: ${res.status} ${res.statusText}`);

        const data = await res.json();

        if (!res.ok) {
            console.error('❌ API Error Body:', JSON.stringify(data, null, 2));
            return;
        }

        const projects = data.projects || [];
        console.log(`✅ Found ${projects.length} projects.`);

        if (projects.length > 0) {
            const collab = projects.find(p => p.name.toLowerCase().includes('collab'));
            if (collab) {
                console.log('\n🎯 Collabboard Project (Full Structure):');
                console.log(JSON.stringify(collab, null, 2));
            } else {
                console.log('\n⚠️ Collabboard not found.');
                console.log('Available projects:', projects.map(p => p.name).join(', '));
            }
        }
    } catch (err) {
        console.error('❌ Fetch Error:', err);
    }
}

debugVercelProjects();
