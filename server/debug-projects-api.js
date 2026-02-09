import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = join(__dirname, '.env');

console.log(`📂 Checking .env file at: ${envPath}`);

if (fs.existsSync(envPath)) {
    const stats = fs.statSync(envPath);
    console.log(`✅ File exists. Size: ${stats.size} bytes`);

    const content = fs.readFileSync(envPath, 'utf-8');
    const lines = content.split('\n');
    console.log(`📝 Total lines: ${lines.length}`);

    // Check for VERCEL_TOKEN key without showing value
    const hasToken = content.includes('VERCEL_TOKEN');
    console.log(`🔍 Contains 'VERCEL_TOKEN' string: ${hasToken}`);

    if (hasToken) {
        const tokenLine = lines.find(l => l.startsWith('VERCEL_TOKEN'));
        if (tokenLine) {
            console.log(`📍 Found line starting with VERCEL_TOKEN (Length: ${tokenLine.length})`);
        } else {
            console.log('⚠️ VERCEL_TOKEN found in file but line doesn\'t START with it (maybe spaces or BOM?)');
        }
    }
} else {
    console.error('❌ .env file NOT FOUND at this path.');
}

console.log('\n--- Dotenv Injection Test ---');
const result = dotenv.config({ path: envPath });
if (result.error) {
    console.error('❌ Dotenv Error:', result.error);
} else {
    const envVars = Object.keys(result.parsed || {});
    console.log(`✅ Loaded ${envVars.length} keys:`, envVars);
}

const VERCEL_TOKEN = process.env.VERCEL_TOKEN;

async function debugVercelProjects() {
    console.log('\n--- Vercel API Test ---');
    if (!VERCEL_TOKEN) {
        console.error('❌ VERCEL_TOKEN NOT FOUND in process.env');
        return;
    }
    console.log(`✅ Token Found: ${VERCEL_TOKEN.substring(0, 4)}...${VERCEL_TOKEN.substring(VERCEL_TOKEN.length - 4)}`);

    try {
        const res = await fetch('https://api.vercel.com/v9/projects', {
            headers: { Authorization: `Bearer ${VERCEL_TOKEN}` }
        });
        console.log(`📡 Response Status: ${res.status}`);
        const data = await res.json();
        if (!res.ok) {
            console.error('❌ API Error:', data.error);
        } else {
            console.log(`✅ Success! Found ${data.projects?.length} projects.`);
        }
    } catch (err) {
        console.error('❌ Fetch Error:', err);
    }
}

debugVercelProjects();
