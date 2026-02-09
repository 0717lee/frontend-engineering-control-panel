import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Language } from '../i18n';

export type Theme = 'dark' | 'light' | 'system';

export interface SystemStatus {
    cpu: {
        usage: number;
        cores: number;
    };
    memory: {
        total: number;
        used: number;
        free: number;
        usagePercent: number;
    };
    uptime: number;
    os: {
        platform: string;
        distro: string;
        release: string;
        hostname: string;
    };
    timestamp: string;
}

export interface Project {
    id: string;
    name: string;
    platform: 'vercel' | 'github' | 'self-hosted' | 'cloudflare' | 'other';
    version: string;
    buildTime: string;
    status: 'running' | 'stopped' | 'error' | 'deploying' | 'not-deployed';
    url?: string;
    gitCommit?: string;
    errorCount: number;
    /** 项目定位: product = 产品级, experiment = 实验级 */
    tier?: 'product' | 'experiment';
    /** 工程评估信息 */
    assessment?: {
        vercelFit: boolean;       // 是否适合 Vercel
        needsServer: boolean;     // 是否需要服务器能力
        observability: 'none' | 'basic' | 'full';  // 可观察性级别
        evaluatedAt: string;      // 评估时间
    };
}

export interface ErrorLog {
    id: string;
    projectId: string;
    message: string;
    stack?: string;
    level: 'error' | 'warn' | 'info';
    url?: string;
    userAgent?: string;
    timestamp: string;
}

interface AppState {
    // System Status
    systemStatus: SystemStatus | null;
    systemLoading: boolean;

    // Projects
    projects: Project[];
    projectsLoading: boolean;

    // Error Logs
    errorLogs: ErrorLog[];
    errorLogsTotal: number;
    errorLogsLoading: boolean;

    // Active View
    activeView: 'dashboard' | 'projects' | 'errors' | 'settings';

    // Theme & Language
    theme: Theme;
    language: Language;

    // Settings
    refreshInterval: number; // in seconds
    errorAlertEnabled: boolean;
    notifyMethod: 'browser' | 'none';

    // Integration Status
    integrationStatus: { github: boolean; vercel: boolean; cloudflare: boolean } | null;
    syncing: boolean;

    // Actions
    fetchSystemStatus: () => Promise<void>;
    fetchProjects: () => Promise<void>;
    fetchErrorLogs: (filters?: { projectId?: string; level?: string }) => Promise<void>;
    setActiveView: (view: AppState['activeView']) => void;
    setTheme: (theme: Theme) => void;
    setLanguage: (lang: Language) => void;
    setRefreshInterval: (interval: number) => void;
    setErrorAlertEnabled: (enabled: boolean) => void;
    setNotifyMethod: (method: 'browser' | 'none') => void;
    syncPlatforms: () => Promise<void>;
    fetchIntegrationStatus: () => Promise<void>;
}

const API_BASE = '/api';

// Helper to get system preference
function getSystemTheme(): 'dark' | 'light' {
    if (typeof window !== 'undefined' && window.matchMedia) {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'dark';
}

// Apply theme to document
function applyTheme(theme: Theme) {
    const effectiveTheme = theme === 'system' ? getSystemTheme() : theme;
    document.documentElement.setAttribute('data-theme', effectiveTheme);
}

export const useStore = create<AppState>()(
    persist(
        (set) => ({
            // Initial State
            systemStatus: null,
            systemLoading: false,
            projects: [],
            projectsLoading: false,
            errorLogs: [],
            errorLogsTotal: 0,
            errorLogsLoading: false,
            activeView: 'dashboard',
            theme: 'dark',
            language: 'zh',
            refreshInterval: 30,
            errorAlertEnabled: true,
            notifyMethod: 'browser',
            integrationStatus: null,
            syncing: false,

            // Actions
            fetchSystemStatus: async () => {
                set({ systemLoading: true });
                try {
                    const res = await fetch(`${API_BASE}/status`);
                    if (res.ok) {
                        const data = await res.json();
                        set({ systemStatus: data });
                    }
                } catch (error) {
                    console.error('Failed to fetch system status:', error);
                } finally {
                    set({ systemLoading: false });
                }
            },

            fetchProjects: async () => {
                set({ projectsLoading: true });
                try {
                    const res = await fetch(`${API_BASE}/projects`);
                    if (res.ok) {
                        const data = await res.json();
                        set({ projects: data });
                    }
                } catch (error) {
                    console.error('Failed to fetch projects:', error);
                } finally {
                    set({ projectsLoading: false });
                }
            },

            fetchErrorLogs: async (filters) => {
                set({ errorLogsLoading: true });
                try {
                    const params = new URLSearchParams();
                    if (filters?.projectId) params.set('projectId', filters.projectId);
                    if (filters?.level) params.set('level', filters.level);

                    const res = await fetch(`${API_BASE}/errors?${params}`);
                    if (res.ok) {
                        const data = await res.json();
                        set({ errorLogs: data.logs, errorLogsTotal: data.total });
                    }
                } catch (error) {
                    console.error('Failed to fetch error logs:', error);
                } finally {
                    set({ errorLogsLoading: false });
                }
            },

            setActiveView: (view) => set({ activeView: view }),

            setTheme: (theme) => {
                applyTheme(theme);
                set({ theme });
            },

            setLanguage: (language) => set({ language }),

            setRefreshInterval: (refreshInterval) => set({ refreshInterval }),

            setErrorAlertEnabled: (errorAlertEnabled) => set({ errorAlertEnabled }),

            setNotifyMethod: (notifyMethod) => set({ notifyMethod }),

            syncPlatforms: async () => {
                set({ syncing: true });
                try {
                    const res = await fetch(`${API_BASE}/integrations/sync`, { method: 'POST' });
                    if (res.ok) {
                        // Refresh projects after sync
                        const projectsRes = await fetch(`${API_BASE}/projects`);
                        if (projectsRes.ok) {
                            const data = await projectsRes.json();
                            set({ projects: data });
                        }
                    }
                } catch (error) {
                    console.error('Failed to sync platforms:', error);
                } finally {
                    set({ syncing: false });
                }
            },

            fetchIntegrationStatus: async () => {
                try {
                    const res = await fetch(`${API_BASE}/integrations/status`);
                    if (res.ok) {
                        const data = await res.json();
                        set({ integrationStatus: data });
                    }
                } catch (error) {
                    console.error('Failed to fetch integration status:', error);
                }
            }
        }),
        {
            name: 'fecp-settings',
            partialize: (state) => ({
                theme: state.theme,
                language: state.language,
                refreshInterval: state.refreshInterval,
                errorAlertEnabled: state.errorAlertEnabled,
                notifyMethod: state.notifyMethod
            }),
            onRehydrateStorage: () => (state) => {
                if (state) {
                    applyTheme(state.theme);
                }
            }
        }
    )
);

// Listen for system theme changes
if (typeof window !== 'undefined') {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
        const { theme } = useStore.getState();
        if (theme === 'system') {
            applyTheme('system');
        }
    });
}
