import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, '.env') });

const VERCEL_TOKEN = process.env.VERCEL_TOKEN;

async function debugVercelProjects() {
    console.log('🔍 Fetching Vercel projects list...');
    try {
        const res = await fetch('https://api.vercel.com/v9/projects', {
            headers: { Authorization: `Bearer ${VERCEL_TOKEN}` }
        });

        if (!res.ok) {
            console.error(`❌ API Error: ${res.status} ${res.statusText}`);
            console.log(await res.text());
            return;
        }

        const data = await res.json();
        const projects = data.projects || [];
        console.log(`✅ Found ${projects.length} projects.`);

        if (projects.length > 0) {
            const first = projects[0];
            console.log('\n📋 Sample Project Keys:', Object.keys(first));
            console.log('\n📋 Sample Project (limited):', JSON.stringify({
                name: first.name,
                id: first.id,
                latestDeployments: first.latestDeployments,
                link: first.link,
                lastAlias: first.lastAlias
            }, null, 2));

            // Check if Collabboard is here
            const collab = projects.find(p => p.name.toLowerCase().includes('collab'));
            if (collab) {
                console.log('\n🎯 Collabboard Project Details:', JSON.stringify(collab, null, 2));
            } else {
                console.log('\n⚠️ Collabboard not found in Vercel project list.');
                console.log('Available names:', projects.map(p => p.name).join(', '));
            }
        }
    } catch (err) {
        console.error('❌ Fetch Error:', err);
    }
}

debugVercelProjects();
