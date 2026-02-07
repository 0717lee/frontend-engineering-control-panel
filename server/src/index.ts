import 'dotenv/config';
import Fastify from 'fastify';
import cors from '@fastify/cors';
import si from 'systeminformation';
import { getDb } from './db/index.js';
import { registerIntegrationRoutes } from './routes/integrations.js';

const fastify = Fastify({ logger: true });

await fastify.register(cors, { origin: true });

// System status endpoint
fastify.get('/api/status', async () => {
    const [cpu, mem, osInfo, time] = await Promise.all([
        si.currentLoad(),
        si.mem(),
        si.osInfo(),
        si.time()
    ]);

    return {
        cpu: {
            usage: cpu.currentLoad,
            cores: cpu.cpus.length
        },
        memory: {
            total: mem.total,
            used: mem.used,
            free: mem.free,
            usagePercent: (mem.used / mem.total) * 100
        },
        os: {
            platform: osInfo.platform,
            distro: osInfo.distro,
            release: osInfo.release,
            hostname: osInfo.hostname
        },
        uptime: time.uptime
    };
});

// Projects endpoints
fastify.get('/api/projects', async () => {
    const db = await getDb();
    return db.data.projects;
});

fastify.post('/api/projects', async (request) => {
    const db = await getDb();
    const project = request.body as any;
    db.data.projects.push(project);
    await db.write();
    return project;
});

fastify.delete('/api/projects/:id', async (request) => {
    const db = await getDb();
    const { id } = request.params as { id: string };
    db.data.projects = db.data.projects.filter(p => p.id !== id);
    await db.write();
    return { success: true };
});

// Error logs endpoints
fastify.get('/api/errors', async (request) => {
    const db = await getDb();
    const { projectId, level, page = 1, limit = 50 } = request.query as any;

    let logs = db.data.errorLogs;

    if (projectId) {
        logs = logs.filter(log => log.projectId === projectId);
    }
    if (level) {
        logs = logs.filter(log => log.level === level);
    }

    // Sort by timestamp descending
    logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    const start = (page - 1) * limit;
    const paginatedLogs = logs.slice(start, start + limit);

    return {
        logs: paginatedLogs,
        total: logs.length,
        page: Number(page),
        limit: Number(limit)
    };
});

fastify.post('/api/errors', async (request) => {
    const db = await getDb();
    const errorLog = {
        ...(request.body as any),
        id: `err-${Date.now()}`,
        timestamp: new Date().toISOString()
    };
    db.data.errorLogs.push(errorLog);
    await db.write();
    return errorLog;
});

// Register integration routes
registerIntegrationRoutes(fastify);

// Start server
try {
    await fastify.listen({ port: 3001, host: '0.0.0.0' });
    console.log('Server running at http://localhost:3001');
} catch (err) {
    fastify.log.error(err);
    process.exit(1);
}
