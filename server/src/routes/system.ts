import { FastifyInstance } from 'fastify';
import si from 'systeminformation';

export async function systemRoutes(fastify: FastifyInstance) {
    // Get system status (CPU, Memory, Uptime)
    fastify.get('/status', async () => {
        const [cpu, mem, time, osInfo] = await Promise.all([
            si.currentLoad(),
            si.mem(),
            si.time(),
            si.osInfo()
        ]);

        return {
            cpu: {
                usage: Math.round(cpu.currentLoad * 100) / 100,
                cores: cpu.cpus.length
            },
            memory: {
                total: mem.total,
                used: mem.used,
                free: mem.free,
                usagePercent: Math.round((mem.used / mem.total) * 10000) / 100
            },
            uptime: time.uptime,
            os: {
                platform: osInfo.platform,
                distro: osInfo.distro,
                release: osInfo.release,
                hostname: osInfo.hostname
            },
            timestamp: new Date().toISOString()
        };
    });

    // Get CPU history (for charts)
    fastify.get('/cpu-history', async () => {
        const load = await si.currentLoad();
        return {
            current: load.currentLoad,
            cores: load.cpus.map((c, i) => ({
                core: i,
                load: c.load
            })),
            timestamp: new Date().toISOString()
        };
    });
}
