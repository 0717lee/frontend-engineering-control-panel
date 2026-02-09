import { useState } from 'react';
import { FolderKanban, ExternalLink, GitCommit, Clock, RefreshCw, Plus, X } from 'lucide-react';
import { useStore, Project } from '../store';
import { t, Language } from '../i18n';

const API_BASE = '/api';

function formatDate(dateString: string, language: Language): string {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();

    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) return t('time.minutesAgo', language, { n: minutes });
    if (hours < 24) return t('time.hoursAgo', language, { n: hours });
    return t('time.daysAgo', language, { n: days });
}

function getPlatformBadge(platform: Project['platform'], language: Language) {
    const styles: Record<Project['platform'], { class: string; label: string }> = {
        vercel: { class: 'badge-neutral', label: 'Vercel' },
        github: { class: 'badge-neutral', label: 'GitHub' },
        'self-hosted': { class: 'badge-neutral', label: t('platform.selfHosted', language) },
        cloudflare: { class: 'badge-neutral', label: 'Cloudflare' },
        other: { class: 'badge-neutral', label: t('platform.other', language) }
    };
    return styles[platform];
}

function getStatusColor(status: Project['status']) {
    const colors: Record<Project['status'], string> = {
        running: 'running',
        stopped: 'stopped',
        error: 'error',
        deploying: 'deploying',
        'not-deployed': 'stopped'
    };
    return colors[status];
}

function getTierBadge(tier: Project['tier'], language: Language) {
    if (!tier) return null;
    const styles = {
        product: { class: 'badge-success', label: language === 'zh' ? '🚀 产品级' : '🚀 Product' },
        experiment: { class: 'badge-warning', label: language === 'zh' ? '🧪 实验级' : '🧪 Experiment' }
    };
    return styles[tier];
}

function ProjectCard({ project, language }: { project: Project; language: Language }) {
    const platformBadge = getPlatformBadge(project.platform, language);

    return (
        <div className="glass-card project-card">
            <div className="project-header">
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                        <span className={`status-dot ${getStatusColor(project.status)}`} />
                        <h3 className="project-name">{project.name}</h3>
                    </div>
                    <div style={{ display: 'flex', gap: 'var(--spacing-xs)', marginTop: 'var(--spacing-xs)', flexWrap: 'wrap' }}>
                        <span className={`badge ${platformBadge.class}`}>
                            {platformBadge.label}
                        </span>
                        {getTierBadge(project.tier, language) && (
                            <span className={`badge ${getTierBadge(project.tier, language)!.class}`}>
                                {getTierBadge(project.tier, language)!.label}
                            </span>
                        )}
                    </div>
                </div>

                {project.errorCount > 0 && (
                    <span className="badge badge-error">
                        {project.errorCount} {language === 'zh' ? '个错误' : 'errors'}
                    </span>
                )}
            </div>

            <div className="project-meta">
                <div className="project-meta-item">
                    <span style={{ color: 'var(--color-text-muted)' }}>{t('projects.version', language)}:</span>
                    <code className="mono">{project.version}</code>
                </div>

                {project.gitCommit && (
                    <div className="project-meta-item">
                        <GitCommit size={14} />
                        <code className="mono">{project.gitCommit.slice(0, 7)}</code>
                    </div>
                )}

                <div className="project-meta-item">
                    <Clock size={14} />
                    <span>{t('projects.builtAt', language, { time: formatDate(project.buildTime, language) })}</span>
                </div>
            </div>

            {project.url && (
                <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-secondary"
                    style={{ marginTop: 'auto' }}
                >
                    <ExternalLink size={14} />
                    {t('projects.openSite', language)}
                </a>
            )}
        </div>
    );
}

interface ImportModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (project: Omit<Project, 'errorCount'>) => Promise<void>;
    language: Language;
}

function ImportModal({ isOpen, onClose, onSubmit, language }: ImportModalProps) {
    const [formData, setFormData] = useState({
        name: '',
        platform: 'self-hosted' as Project['platform'],
        customPlatform: '',
        version: '1.0.0',
        url: '',
        gitCommit: '',
        status: 'running' as Project['status']
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!formData.name.trim()) {
            setError(language === 'zh' ? '请输入项目名称' : 'Project name is required');
            return;
        }

        setLoading(true);
        try {
            await onSubmit({
                id: `project-${Date.now()}`,
                name: formData.name.trim(),
                platform: formData.platform,
                version: formData.version,
                buildTime: new Date().toISOString(),
                status: formData.status,
                url: formData.url.trim() || undefined,
                gitCommit: formData.gitCommit.trim() || undefined
            });
            onClose();
            setFormData({
                name: '',
                platform: 'self-hosted',
                customPlatform: '',
                version: '1.0.0',
                url: '',
                gitCommit: '',
                status: 'running'
            });
        } catch (err) {
            setError(language === 'zh' ? '导入失败，请重试' : 'Import failed, please try again');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal glass-card" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h3>{language === 'zh' ? '导入项目' : 'Import Project'}</h3>
                    <button className="btn-icon" onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>{language === 'zh' ? '项目名称' : 'Project Name'} *</label>
                        <input
                            type="text"
                            className="input"
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                            placeholder={language === 'zh' ? '输入项目名称' : 'Enter project name'}
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>{language === 'zh' ? '平台' : 'Platform'}</label>
                            <select
                                className="input"
                                value={formData.platform}
                                onChange={e => setFormData({ ...formData, platform: e.target.value as Project['platform'] })}
                            >
                                <option value="self-hosted">{language === 'zh' ? '自建服务器' : 'Self-Hosted'}</option>
                                <option value="vercel">Vercel</option>
                                <option value="cloudflare">Cloudflare</option>
                                <option value="other">{language === 'zh' ? '其他 (自定义)' : 'Other (Custom)'}</option>
                            </select>
                            {formData.platform === 'other' && (
                                <input
                                    type="text"
                                    className="input"
                                    style={{ marginTop: 'var(--spacing-xs)' }}
                                    value={formData.customPlatform}
                                    onChange={e => setFormData({ ...formData, customPlatform: e.target.value })}
                                    placeholder={language === 'zh' ? '输入平台名称' : 'Enter platform name'}
                                />
                            )}
                        </div>

                        <div className="form-group">
                            <label>{language === 'zh' ? '状态' : 'Status'}</label>
                            <select
                                className="input"
                                value={formData.status}
                                onChange={e => setFormData({ ...formData, status: e.target.value as Project['status'] })}
                            >
                                <option value="running">{language === 'zh' ? '运行中' : 'Running'}</option>
                                <option value="stopped">{language === 'zh' ? '已停止' : 'Stopped'}</option>
                                <option value="deploying">{language === 'zh' ? '部署中' : 'Deploying'}</option>
                                <option value="not-deployed">{language === 'zh' ? '未部署' : 'Not Deployed'}</option>
                            </select>
                        </div>
                    </div>

                    <div className="form-group">
                        <label>{language === 'zh' ? '版本号' : 'Version'}</label>
                        <input
                            type="text"
                            className="input"
                            value={formData.version}
                            onChange={e => setFormData({ ...formData, version: e.target.value })}
                            placeholder="1.0.0"
                        />
                    </div>

                    <div className="form-group">
                        <label>{language === 'zh' ? '项目 URL' : 'Project URL'}</label>
                        <input
                            type="url"
                            className="input"
                            value={formData.url}
                            onChange={e => setFormData({ ...formData, url: e.target.value })}
                            placeholder="https://example.com"
                        />
                    </div>

                    <div className="form-group">
                        <label>{language === 'zh' ? 'Git Commit' : 'Git Commit'}</label>
                        <input
                            type="text"
                            className="input"
                            value={formData.gitCommit}
                            onChange={e => setFormData({ ...formData, gitCommit: e.target.value })}
                            placeholder="abc1234"
                        />
                    </div>

                    {error && (
                        <div className="form-error">{error}</div>
                    )}

                    <div className="modal-actions">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>
                            {language === 'zh' ? '取消' : 'Cancel'}
                        </button>
                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            {loading ? (language === 'zh' ? '导入中...' : 'Importing...') : (language === 'zh' ? '导入' : 'Import')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export function ProjectList() {
    const { projects, projectsLoading, language, syncPlatforms, syncing, fetchProjects } = useStore();
    const [showImportModal, setShowImportModal] = useState(false);

    const handleImport = async (project: Omit<Project, 'errorCount'>) => {
        const response = await fetch(`${API_BASE}/projects`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...project, errorCount: 0 })
        });

        if (!response.ok) {
            throw new Error('Failed to import project');
        }

        await fetchProjects();
    };

    if (projectsLoading && projects.length === 0) {
        return (
            <div>
                <div className="section-header">
                    <h2 className="section-title">
                        <FolderKanban size={20} />
                        {t('projects.title', language)}
                    </h2>
                </div>
                <div className="grid-3">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="glass-card skeleton" style={{ height: 180 }} />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div>
            <div className="section-header">
                <h2 className="section-title">
                    <FolderKanban size={20} />
                    {t('projects.title', language)}
                </h2>
                <style>{`
                    @keyframes spin {
                        from { transform: rotate(0deg); }
                        to { transform: rotate(360deg); }
                    }
                    .spinning {
                        animation: spin 1s linear infinite;
                        transform-origin: center center;
                        display: inline-block;
                    }
                `}</style>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                    <button
                        className="btn btn-primary"
                        onClick={() => setShowImportModal(true)}
                        title={language === 'zh' ? '导入项目' : 'Import project'}
                    >
                        <Plus size={14} />
                        {language === 'zh' ? '导入' : 'Import'}
                    </button>
                    <button
                        className="btn btn-secondary"
                        onClick={syncPlatforms}
                        disabled={syncing}
                        title={language === 'zh' ? '从平台同步最新数据' : 'Sync from platforms'}
                    >
                        <RefreshCw size={14} className={syncing ? 'spinning' : ''} />
                        {language === 'zh' ? '同步' : 'Sync'}
                    </button>
                    <span className="badge badge-neutral">{t('projects.total', language, { count: projects.length })}</span>
                </div>
            </div>

            {
                projects.length === 0 ? (
                    <div className="glass-card empty-state">
                        <div className="empty-state-icon">📂</div>
                        <p>{t('projects.empty', language)}</p>
                        <p style={{ fontSize: '0.875rem', marginTop: 'var(--spacing-sm)' }}>
                            {t('projects.emptyHint', language)}
                        </p>
                        <button
                            className="btn btn-primary"
                            style={{ marginTop: 'var(--spacing-md)' }}
                            onClick={() => setShowImportModal(true)}
                        >
                            <Plus size={14} />
                            {language === 'zh' ? '导入第一个项目' : 'Import your first project'}
                        </button>
                    </div>
                ) : (
                    <div className="grid-3">
                        {projects.map((project) => (
                            <ProjectCard key={project.id} project={project} language={language} />
                        ))}
                    </div>
                )
            }

            <ImportModal
                isOpen={showImportModal}
                onClose={() => setShowImportModal(false)}
                onSubmit={handleImport}
                language={language}
            />

            <style>{`
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div >
    );
}
