import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { getDb } from '../db/index.js';

const ErrorLogSchema = z.object({
    id: z.string().optional(),
    projectId: z.string(),
    message: z.string(),
    stack: z.string().optional(),
    level: z.enum(['error', 'warn', 'info']).default('error'),
    url: z.string().optional(),
    userAgent: z.string().optional(),
    timestamp: z.string().optional()
});

export type ErrorLog = z.infer<typeof ErrorLogSchema>;

const MAX_LOGS = 1000; // Keep recent N logs

export async function errorRoutes(fastify: FastifyInstance) {
    // Get all error logs (with pagination)
    fastify.get<{
        Querystring: {
            projectId?: string;
            level?: string;
            limit?: string;
            offset?: string
        }
    }>('/', async (request) => {
        const db = await getDb();
        let logs = db.data.errorLogs;

        const { projectId, level, limit = '50', offset = '0' } = request.query;

        if (projectId) {
            logs = logs.filter(l => l.projectId === projectId);
        }
        if (level) {
            logs = logs.filter(l => l.level === level);
        }

        const total = logs.length;
        const limitNum = parseInt(limit);
        const offsetNum = parseInt(offset);

        logs = logs
            .sort((a, b) => new Date(b.timestamp || 0).getTime() - new Date(a.timestamp || 0).getTime())
            .slice(offsetNum, offsetNum + limitNum);

        return { logs, total, limit: limitNum, offset: offsetNum };
    });

    // Report new error
    fastify.post('/', async (request, reply) => {
        const db = await getDb();
        const parsed = ErrorLogSchema.safeParse(request.body);

        if (!parsed.success) {
            return reply.status(400).send({ error: parsed.error.errors });
        }

        const newLog = {
            ...parsed.data,
            id: parsed.data.id || crypto.randomUUID(),
            timestamp: parsed.data.timestamp || new Date().toISOString()
        };

        db.data.errorLogs.unshift(newLog);

        // Keep only recent N logs
        if (db.data.errorLogs.length > MAX_LOGS) {
            db.data.errorLogs = db.data.errorLogs.slice(0, MAX_LOGS);
        }

        // Update project error count
        const projectIndex = db.data.projects.findIndex(p => p.id === parsed.data.projectId);
        if (projectIndex >= 0) {
            db.data.projects[projectIndex].errorCount =
                (db.data.projects[projectIndex].errorCount || 0) + 1;
        }

        await db.write();
        return newLog;
    });

    // Clear logs for a project
    fastify.delete<{ Params: { projectId: string } }>('/project/:projectId', async (request) => {
        const db = await getDb();
        db.data.errorLogs = db.data.errorLogs.filter(l => l.projectId !== request.params.projectId);
        await db.write();
        return { success: true };
    });
}
