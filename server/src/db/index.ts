import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { mkdir } from 'fs/promises';

const __dirname = dirname(fileURLToPath(import.meta.url));

export interface DbData {
    projects: Array<{
        id: string;
        name: string;
        platform: 'vercel' | 'github' | 'self-hosted' | 'cloudflare' | 'other';
        version: string;
        buildTime: string;
        status: 'running' | 'stopped' | 'error' | 'deploying';
        url?: string;
        gitCommit?: string;
        errorCount: number;
    }>;
    errorLogs: Array<{
        id: string;
        projectId: string;
        message: string;
        stack?: string;
        level: 'error' | 'warn' | 'info';
        url?: string;
        userAgent?: string;
        timestamp: string;
    }>;
}

const defaultData: DbData = {
    projects: [
        {
            id: 'collabboard',
            name: 'Collabboard',
            platform: 'vercel',
            version: '1.0.0',
            buildTime: new Date().toISOString(),
            status: 'running',
            url: 'https://collab-board-lee.vercel.app',
            errorCount: 0
        },
        {
            id: 'collabboard-cf',
            name: 'Collabboard (Cloudflare)',
            platform: 'cloudflare',
            version: '1.0.0',
            buildTime: new Date().toISOString(),
            status: 'running',
            url: 'https://collabboard.pages.dev',
            errorCount: 0
        },
        {
            id: 'lumina-flow',
            name: 'Lumina Flow',
            platform: 'github',
            version: '1.0.0',
            buildTime: new Date().toISOString(),
            status: 'running',
            url: 'https://github.com/0717lee/lumina-flow',
            errorCount: 0
        }
    ],
    errorLogs: []
};

let db: Low<DbData> | null = null;

export async function getDb(): Promise<Low<DbData>> {
    if (db) return db;

    const dataDir = join(__dirname, '../../data');
    await mkdir(dataDir, { recursive: true });

    const file = join(dataDir, 'db.json');
    const adapter = new JSONFile<DbData>(file);
    db = new Low(adapter, defaultData);

    await db.read();

    // Initialize with default data if empty
    if (!db.data) {
        db.data = defaultData;
        await db.write();
    }

    return db;
}
