import { useState } from 'react';
import { AlertTriangle, Filter, Search } from 'lucide-react';
import { useStore, ErrorLog } from '../store';
import { t, Language } from '../i18n';

function formatTimestamp(timestamp: string, language: Language): string {
    const date = new Date(timestamp);
    return date.toLocaleString(language === 'zh' ? 'zh-CN' : 'en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
}

function getLevelColor(level: ErrorLog['level']) {
    const colors = {
        error: 'var(--color-status-error)',
        warn: 'var(--color-accent-amber)',
        info: 'var(--color-accent-teal)'
    };
    return colors[level];
}

function getLevelLabel(level: ErrorLog['level'], language: Language) {
    const keys: Record<ErrorLog['level'], 'level.error' | 'level.warn' | 'level.info'> = {
        error: 'level.error',
        warn: 'level.warn',
        info: 'level.info'
    };
    return t(keys[level], language);
}

function ErrorLogItem({ log, language }: { log: ErrorLog; language: Language }) {
    const [expanded, setExpanded] = useState(false);
    const { projects } = useStore();
    const project = projects.find(p => p.id === log.projectId);

    return (
        <div
            className="error-log-item"
            style={{
                borderLeftColor: getLevelColor(log.level),
                cursor: log.stack ? 'pointer' : 'default'
            }}
            onClick={() => log.stack && setExpanded(!expanded)}
        >
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <div className="error-log-message">{log.message}</div>
                <span
                    className="badge"
                    style={{
                        background: `${getLevelColor(log.level)}20`,
                        color: getLevelColor(log.level),
                        border: `1px solid ${getLevelColor(log.level)}40`
                    }}
                >
                    {getLevelLabel(log.level, language)}
                </span>
            </div>

            <div className="error-log-meta">
                <span style={{ color: 'var(--color-accent-teal-light)' }}>{project?.name || log.projectId}</span>
                {log.url && <span> • {log.url}</span>}
                <span> • {formatTimestamp(log.timestamp, language)}</span>
            </div>

            {expanded && log.stack && (
                <pre style={{
                    marginTop: 'var(--spacing-sm)',
                    padding: 'var(--spacing-sm)',
                    background: 'rgba(0,0,0,0.3)',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.75rem',
                    overflow: 'auto',
                    maxHeight: 200,
                    fontFamily: 'var(--font-mono)'
                }}>
                    {log.stack}
                </pre>
            )}
        </div>
    );
}

export function ErrorLogViewer() {
    const { errorLogs, errorLogsTotal, errorLogsLoading, projects, fetchErrorLogs, language } = useStore();
    const [searchTerm, setSearchTerm] = useState('');
    const [filterProject, setFilterProject] = useState('');
    const [filterLevel, setFilterLevel] = useState('');

    const handleFilter = () => {
        fetchErrorLogs({
            projectId: filterProject || undefined,
            level: filterLevel || undefined
        });
    };

    const filteredLogs = errorLogs.filter(log =>
        !searchTerm || log.message.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (errorLogsLoading && errorLogs.length === 0) {
        return (
            <div>
                <div className="section-header">
                    <h2 className="section-title">
                        <AlertTriangle size={20} />
                        {t('errors.title', language)}
                    </h2>
                </div>
                <div className="glass-card skeleton" style={{ height: 300 }} />
            </div>
        );
    }

    return (
        <div>
            <div className="section-header">
                <h2 className="section-title">
                    <AlertTriangle size={20} />
                    {t('errors.title', language)}
                </h2>
                <span className="badge badge-neutral">{t('errors.total', language, { count: errorLogsTotal })}</span>
            </div>

            <div className="glass-card" style={{ marginBottom: 'var(--spacing-lg)' }}>
                <div style={{ display: 'flex', gap: 'var(--spacing-md)', flexWrap: 'wrap' }}>
                    <div style={{ flex: 1, minWidth: 200 }}>
                        <div style={{ position: 'relative' }}>
                            <Search
                                size={16}
                                style={{
                                    position: 'absolute',
                                    left: 12,
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    color: 'var(--color-text-muted)'
                                }}
                            />
                            <input
                                type="text"
                                className="input"
                                placeholder={t('errors.search', language)}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                style={{ paddingLeft: 36 }}
                            />
                        </div>
                    </div>

                    <select
                        className="input"
                        style={{ width: 160 }}
                        value={filterProject}
                        onChange={(e) => setFilterProject(e.target.value)}
                    >
                        <option value="">{t('errors.allProjects', language)}</option>
                        {projects.map(p => (
                            <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                    </select>

                    <select
                        className="input"
                        style={{ width: 120 }}
                        value={filterLevel}
                        onChange={(e) => setFilterLevel(e.target.value)}
                    >
                        <option value="">{t('errors.allLevels', language)}</option>
                        <option value="error">{t('level.error', language)}</option>
                        <option value="warn">{t('level.warn', language)}</option>
                        <option value="info">{t('level.info', language)}</option>
                    </select>

                    <button className="btn btn-primary" onClick={handleFilter}>
                        <Filter size={14} />
                        {t('errors.filter', language)}
                    </button>
                </div>
            </div>

            {filteredLogs.length === 0 ? (
                <div className="glass-card empty-state">
                    <div className="empty-state-icon">✓</div>
                    <p>{t('errors.empty', language)}</p>
                    <p style={{ fontSize: '0.875rem', marginTop: 'var(--spacing-sm)' }}>
                        {errorLogsTotal > 0 ? t('errors.adjustFilter', language) : t('errors.emptyHint', language)}
                    </p>
                </div>
            ) : (
                <div className="glass-card" style={{ padding: 'var(--spacing-md)' }}>
                    {filteredLogs.map((log) => (
                        <ErrorLogItem key={log.id} log={log} language={language} />
                    ))}
                </div>
            )}
        </div>
    );
}
