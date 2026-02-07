import { useState, useRef, useEffect } from 'react';
import { RefreshCw, Bell, X } from 'lucide-react';
import { useStore } from '../store';
import { t } from '../i18n';

export function Header() {
    const { fetchSystemStatus, fetchProjects, fetchErrorLogs, systemLoading, language, errorLogs, activeView } = useStore();
    const [showNotifications, setShowNotifications] = useState(false);
    const [lastSeenCount, setLastSeenCount] = useState(0);
    const notifRef = useRef<HTMLDivElement>(null);

    const recentErrors = errorLogs.filter(log => log.level === 'error').slice(0, 5);
    const errorCount = recentErrors.length;
    const hasUnread = errorCount > lastSeenCount;

    // Close notifications when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
                setShowNotifications(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleRefresh = () => {
        fetchSystemStatus();
        fetchProjects();
        fetchErrorLogs();
    };

    const handleNotificationClick = () => {
        setShowNotifications(!showNotifications);
        // Mark as read when opening
        if (!showNotifications) {
            setLastSeenCount(errorCount);
        }
    };

    const showDashboardActions = activeView === 'dashboard';

    return (
        <header style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 'var(--spacing-xl)',
            paddingBottom: 'var(--spacing-lg)',
            borderBottom: '1px solid var(--color-glass-border)'
        }}>
            <div>
                <h1 style={{ marginBottom: 'var(--spacing-xs)' }}>
                    {t('header.title', language)}
                </h1>
                <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>
                    {t('header.subtitle', language)}
                </p>
            </div>

            {showDashboardActions && (
                <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
                    <button
                        className="btn btn-ghost"
                        onClick={handleRefresh}
                        disabled={systemLoading}
                        title={t('header.refresh', language)}
                        style={{ opacity: systemLoading ? 0.7 : 1 }}
                    >
                        <RefreshCw
                            size={18}
                            className={systemLoading ? 'spinning' : ''}
                        />
                    </button>

                    {/* Notifications */}
                    <div ref={notifRef} style={{ position: 'relative' }}>
                        <button
                            className="btn btn-ghost"
                            title={t('header.notifications', language)}
                            onClick={handleNotificationClick}
                            style={{ position: 'relative' }}
                        >
                            <Bell size={18} />
                            {hasUnread && (
                                <span style={{
                                    position: 'absolute',
                                    top: 2,
                                    right: 2,
                                    width: 8,
                                    height: 8,
                                    background: 'var(--color-status-error)',
                                    borderRadius: '50%',
                                    boxShadow: '0 0 6px var(--color-status-error)'
                                }} />
                            )}
                        </button>

                        {showNotifications && (
                            <div className="notification-panel">
                                <div className="notification-header">
                                    <span>{language === 'zh' ? '通知' : 'Notifications'}</span>
                                    <button
                                        className="btn btn-ghost"
                                        style={{ padding: 4 }}
                                        onClick={() => setShowNotifications(false)}
                                    >
                                        <X size={14} />
                                    </button>
                                </div>
                                <div className="notification-list">
                                    {recentErrors.length === 0 ? (
                                        <div className="notification-empty">
                                            {language === 'zh' ? '暂无新通知' : 'No new notifications'}
                                        </div>
                                    ) : (
                                        recentErrors.map(err => (
                                            <div key={err.id} className="notification-item">
                                                <div className="notification-dot" />
                                                <div>
                                                    <div className="notification-message">{err.message}</div>
                                                    <div className="notification-time">
                                                        {new Date(err.timestamp).toLocaleString(language === 'zh' ? 'zh-CN' : 'en-US', {
                                                            hour: '2-digit',
                                                            minute: '2-digit'
                                                        })}
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            <style>{`
                .notification-panel {
                    position: absolute;
                    top: 100%;
                    right: 0;
                    margin-top: 8px;
                    width: 320px;
                    background: var(--color-bg-secondary);
                    border: 1px solid var(--color-glass-border);
                    border-radius: var(--radius-md);
                    box-shadow: var(--shadow-lg);
                    z-index: 100;
                    overflow: hidden;
                }
                
                .notification-header {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: var(--spacing-sm) var(--spacing-md);
                    border-bottom: 1px solid var(--color-glass-border);
                    font-weight: 600;
                    font-size: 0.875rem;
                }
                
                .notification-list {
                    max-height: 300px;
                    overflow-y: auto;
                }
                
                .notification-empty {
                    padding: var(--spacing-xl);
                    text-align: center;
                    color: var(--color-text-muted);
                    font-size: 0.875rem;
                }
                
                .notification-item {
                    display: flex;
                    align-items: flex-start;
                    gap: var(--spacing-sm);
                    padding: var(--spacing-sm) var(--spacing-md);
                    border-bottom: 1px solid var(--color-glass-border);
                    transition: background var(--transition-fast);
                }
                
                .notification-item:last-child {
                    border-bottom: none;
                }
                
                .notification-item:hover {
                    background: var(--color-glass);
                }
                
                .notification-dot {
                    width: 8px;
                    height: 8px;
                    background: var(--color-status-error);
                    border-radius: 50%;
                    margin-top: 6px;
                    flex-shrink: 0;
                }
                
                .notification-message {
                    font-size: 0.8125rem;
                    color: var(--color-text-primary);
                    line-height: 1.4;
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }
                
                .notification-time {
                    font-size: 0.75rem;
                    color: var(--color-text-muted);
                    margin-top: 2px;
                }
            `}</style>
        </header>
    );
}
