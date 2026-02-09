import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to the compiled JS file (assuming standard build output)
const integrationFile = path.join(__dirname, 'dist', 'routes', 'integrations.js');
// Also check source if mapped (less likely on prod)
const sourceFile = path.join(__dirname, 'src', 'routes', 'integrations.ts');

console.log('🔍 Verifying Server Code...');

function checkFile(filePath) {
    if (fs.existsSync(filePath)) {
        console.log(`\n📄 Checking ${filePath}...`);
        const content = fs.readFileSync(filePath, 'utf-8');

        // Check for key fixes
        const hasReadyState = content.includes('readyState');
        const hasConsole = content.includes('console.log');
        const hasSyncLog = content.includes('[Sync] Updating');

        if (hasReadyState) {
            console.log('✅ Found "readyState" usage - Code is UPDATED.');
        } else {
            console.error('❌ "readyState" NOT FOUND - Code is OUTDATED.');
        }

        if (hasSyncLog) {
            console.log('✅ Found sync logging "[Sync] Updating" - Logging is ENABLED.');
        } else {
            console.warn('⚠️ Sync logging NOT FOUND.');
        }

    } else {
        console.log(`⚠️ File not found: ${filePath}`);
    }
}

checkFile(integrationFile);
// checkFile(sourceFile); // Source might not be on prod in dist folder, but check anyway
