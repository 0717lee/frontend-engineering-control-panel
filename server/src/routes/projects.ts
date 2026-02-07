import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { getDb } from '../db/index.js';

const ProjectSchema = z.object({
    id: z.string(),
    name: z.string(),
    platform: z.enum(['vercel', 'self-hosted', 'cloudflare', 'other']),
    version: z.string(),
    buildTime: z.string(),
    status: z.enum(['running', 'stopped', 'error', 'deploying']),
    url: z.string().optional(),
    gitCommit: z.string().optional(),
    errorCount: z.number().default(0)
});

export type Project = z.infer<typeof ProjectSchema>;

export async function projectRoutes(fastify: FastifyInstance) {
    // Get all projects
    fastify.get('/', async () => {
        const db = await getDb();
        return db.data.projects;
    });

    // Get single project
    fastify.get<{ Params: { id: string } }>('/:id', async (request, reply) => {
        const db = await getDb();
        const project = db.data.projects.find(p => p.id === request.params.id);
        if (!project) {
            return reply.status(404).send({ error: 'Project not found' });
        }
        return project;
    });

    // Add/update project
    fastify.post('/', async (request, reply) => {
        const db = await getDb();
        const parsed = ProjectSchema.safeParse(request.body);

        if (!parsed.success) {
            return reply.status(400).send({ error: parsed.error.errors });
        }

        const existingIndex = db.data.projects.findIndex(p => p.id === parsed.data.id);
        if (existingIndex >= 0) {
            db.data.projects[existingIndex] = parsed.data;
        } else {
            db.data.projects.push(parsed.data);
        }

        await db.write();
        return parsed.data;
    });

    // Delete project
    fastify.delete<{ Params: { id: string } }>('/:id', async (request, reply) => {
        const db = await getDb();
        const index = db.data.projects.findIndex(p => p.id === request.params.id);

        if (index < 0) {
            return reply.status(404).send({ error: 'Project not found' });
        }

        db.data.projects.splice(index, 1);
        await db.write();
        return { success: true };
    });
}
