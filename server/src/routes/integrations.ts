import { FastifyInstance } from 'fastify';
import { getDb } from '../db/index.js';

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const VERCEL_TOKEN = process.env.VERCEL_TOKEN;
const CLOUDFLARE_TOKEN = process.env.CLOUDFLARE_TOKEN;
const CLOUDFLARE_ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID;

interface GitHubRepo {
    name: string;
    full_name: string;
    html_url: string;
    pushed_at: string;
    default_branch: string;
}

interface GitHubCommit {
    sha: string;
    commit: {
        message: string;
        author: { date: string };
    };
}

interface VercelProject {
    id: string;
    name: string;
    framework: string;
    latestDeployments?: Array<{
        id: string;
        readyState: string;
        url: string;
        createdAt: number;
    }>;
}

interface CloudflareProject {
    name: string;
    subdomain: string;
    production_branch: string;
    latest_deployment?: {
        id: string;
        url: string;
        created_on: string;
    };
}

export function registerIntegrationRoutes(fastify: FastifyInstance) {

    // GitHub: Get repository info
    fastify.get('/api/integrations/github/:owner/:repo', async (request, reply) => {
        const { owner, repo } = request.params as { owner: string; repo: string };

        if (!GITHUB_TOKEN) {
            return reply.status(400).send({ error: 'GitHub token not configured' });
        }

        try {
            const [repoRes, commitsRes] = await Promise.all([
                fetch(`https://api.github.com/repos/${owner}/${repo}`, {
                    headers: { Authorization: `Bearer ${GITHUB_TOKEN}` }
                }),
                fetch(`https://api.github.com/repos/${owner}/${repo}/commits?per_page=5`, {
                    headers: { Authorization: `Bearer ${GITHUB_TOKEN}` }
                })
            ]);

            if (!repoRes.ok) {
                return reply.status(repoRes.status).send({ error: 'Failed to fetch GitHub repo' });
            }

            const repoData: GitHubRepo = await repoRes.json();
            const commits: GitHubCommit[] = await commitsRes.json();

            return {
                name: repoData.name,
                fullName: repoData.full_name,
                url: repoData.html_url,
                pushedAt: repoData.pushed_at,
                defaultBranch: repoData.default_branch,
                latestCommit: commits[0] ? {
                    sha: commits[0].sha.slice(0, 7),
                    message: commits[0].commit.message.split('\n')[0],
                    date: commits[0].commit.author.date
                } : null,
                recentCommits: commits.slice(0, 5).map(c => ({
                    sha: c.sha.slice(0, 7),
                    message: c.commit.message.split('\n')[0],
                    date: c.commit.author.date
                }))
            };
        } catch (error) {
            return reply.status(500).send({ error: 'GitHub API error' });
        }
    });

    // Vercel: Get all projects
    fastify.get('/api/integrations/vercel/projects', async (request, reply) => {
        if (!VERCEL_TOKEN) {
            return reply.status(400).send({ error: 'Vercel token not configured' });
        }

        try {
            const res = await fetch('https://api.vercel.com/v9/projects', {
                headers: { Authorization: `Bearer ${VERCEL_TOKEN}` }
            });

            if (!res.ok) {
                return reply.status(res.status).send({ error: 'Failed to fetch Vercel projects' });
            }

            const data = await res.json();
            const projects = data.projects || [];

            return projects.map((p: VercelProject) => ({
                id: p.id,
                name: p.name,
                framework: p.framework,
                latestDeployment: p.latestDeployments?.[0] ? {
                    state: p.latestDeployments[0].readyState,
                    url: `https://${p.latestDeployments[0].url}`,
                    createdAt: new Date(p.latestDeployments[0].createdAt).toISOString()
                } : null
            }));
        } catch (error) {
            return reply.status(500).send({ error: 'Vercel API error' });
        }
    });

    // Cloudflare: Get Pages projects
    fastify.get('/api/integrations/cloudflare/pages', async (request, reply) => {
        if (!CLOUDFLARE_TOKEN || !CLOUDFLARE_ACCOUNT_ID) {
            return reply.status(400).send({ error: 'Cloudflare credentials not configured' });
        }

        try {
            const res = await fetch(
                `https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/pages/projects`,
                {
                    headers: { Authorization: `Bearer ${CLOUDFLARE_TOKEN}` }
                }
            );

            if (!res.ok) {
                return reply.status(res.status).send({ error: 'Failed to fetch Cloudflare Pages' });
            }

            const data = await res.json();
            const projects = data.result || [];

            return projects.map((p: CloudflareProject) => ({
                name: p.name,
                subdomain: p.subdomain,
                productionBranch: p.production_branch,
                url: `https://${p.subdomain}.pages.dev`,
                latestDeployment: p.latest_deployment ? {
                    id: p.latest_deployment.id,
                    url: p.latest_deployment.url,
                    createdAt: p.latest_deployment.created_on
                } : null
            }));
        } catch (error) {
            return reply.status(500).send({ error: 'Cloudflare API error' });
        }
    });

    // Sync: Update local projects with data from all platforms
    fastify.post('/api/integrations/sync', async (request, reply) => {
        const db = await getDb();
        const results: { platform: string; status: string; data?: any; error?: string }[] = [];

        // Sync GitHub repos
        if (GITHUB_TOKEN) {
            try {
                // Sync Lumina Flow from GitHub
                const res = await fetch('https://api.github.com/repos/0717lee/lumina-flow', {
                    headers: { Authorization: `Bearer ${GITHUB_TOKEN}` }
                });
                if (res.ok) {
                    const repo = await res.json();
                    const commitsRes = await fetch('https://api.github.com/repos/0717lee/lumina-flow/commits?per_page=1', {
                        headers: { Authorization: `Bearer ${GITHUB_TOKEN}` }
                    });
                    const commits = await commitsRes.json();

                    const project = db.data.projects.find(p => p.id === 'lumina-flow');
                    if (project) {
                        project.gitCommit = commits[0]?.sha?.slice(0, 7);
                        project.buildTime = repo.pushed_at;
                    }
                    results.push({ platform: 'github', status: 'success', data: { repo: repo.name } });
                }
            } catch (e) {
                results.push({ platform: 'github', status: 'error', error: String(e) });
            }
        }

        // Sync Vercel projects
        if (VERCEL_TOKEN) {
            try {
                const res = await fetch('https://api.vercel.com/v9/projects', {
                    headers: { Authorization: `Bearer ${VERCEL_TOKEN}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    const vercelProjects = data.projects || [];

                    for (const vp of vercelProjects) {
                        const existing = db.data.projects.find(p => {
                            if (p.platform !== 'vercel') return false;

                            // 1. Try exact or substring name match (bidirectional)
                            const pName = p.name.toLowerCase();
                            const vName = vp.name.toLowerCase();
                            if (pName.includes(vName) || vName.includes(pName)) return true;

                            // 2. Try URL match (if project URL contains Vercel project name/ID)
                            if (p.url && p.url.toLowerCase().includes(vName)) return true;

                            return false;
                        });
                        if (existing && vp.latestDeployments?.[0]) {
                            const deployment = vp.latestDeployments[0];
                            // Map Vercel states: READY, BUILDING, ERROR, QUEUED, CANCELED
                            // API returns 'readyState', not 'state'
                            const state = (deployment as any).readyState;

                            if (state === 'READY') {
                                existing.status = 'running';
                            } else if (state === 'BUILDING' || state === 'QUEUED') {
                                existing.status = 'deploying';
                            } else if (state === 'ERROR' || state === 'CANCELED') {
                                existing.status = 'error';
                            } else {
                                existing.status = 'running';
                            }

                            const newBuildTime = new Date(deployment.createdAt).toISOString();
                            console.log(`[Sync] Updating ${existing.name}: Status=${existing.status}, Time=${newBuildTime}`);
                            existing.buildTime = newBuildTime;
                            // Keep original URL instead of using deployment URL
                        }
                    }
                    results.push({ platform: 'vercel', status: 'success', data: { count: vercelProjects.length } });
                }
            } catch (e) {
                results.push({ platform: 'vercel', status: 'error', error: String(e) });
            }
        }

        // Sync Cloudflare Pages
        if (CLOUDFLARE_TOKEN && CLOUDFLARE_ACCOUNT_ID) {
            try {
                const res = await fetch(
                    `https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/pages/projects`,
                    { headers: { Authorization: `Bearer ${CLOUDFLARE_TOKEN}` } }
                );
                if (res.ok) {
                    const data = await res.json();
                    const cfProjects = data.result || [];

                    for (const cp of cfProjects) {
                        const existing = db.data.projects.find(p =>
                            p.name.toLowerCase().includes(cp.name.toLowerCase()) && p.platform === 'cloudflare'
                        );
                        if (existing && cp.latest_deployment) {
                            existing.status = 'running';
                            existing.buildTime = cp.latest_deployment.created_on;
                            // Don't update URL - keep original from db
                        }
                    }
                    results.push({ platform: 'cloudflare', status: 'success', data: { count: cfProjects.length } });
                }
            } catch (e) {
                results.push({ platform: 'cloudflare', status: 'error', error: String(e) });
            }
        }

        await db.write();
        return { synced: true, results };
    });

    // Get integration status (which platforms are connected)
    fastify.get('/api/integrations/status', async () => {
        return {
            github: !!GITHUB_TOKEN,
            vercel: !!VERCEL_TOKEN,
            cloudflare: !!(CLOUDFLARE_TOKEN && CLOUDFLARE_ACCOUNT_ID)
        };
    });
}
