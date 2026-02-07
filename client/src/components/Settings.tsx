import { useState } from 'react';
import { Settings as SettingsIcon, Server, Bell, Shield, Palette, Globe } from 'lucide-react';
import { useStore, Theme } from '../store';
import { t, Language } from '../i18n';

export function Settings() {
    const {
        theme, setTheme,
        language, setLanguage,
        refreshInterval, setRefreshInterval,
        errorAlertEnabled, setErrorAlertEnabled,
        notifyMethod, setNotifyMethod
    } = useStore();

    const [intervalError, setIntervalError] = useState('');

    const themeOptions: { value: Theme; labelKey: 'theme.dark' | 'theme.light' | 'theme.system' }[] = [
        { value: 'dark', labelKey: 'theme.dark' },
        { value: 'light', labelKey: 'theme.light' },
        { value: 'system', labelKey: 'theme.system' },
    ];

    const langOptions: { value: Language; labelKey: 'lang.zh' | 'lang.en' }[] = [
        { value: 'zh', labelKey: 'lang.zh' },
        { value: 'en', labelKey: 'lang.en' },
    ];

    return (
        <div>
            <div className="section-header">
                <h2 className="section-title">
                    <SettingsIcon size={20} />
                    {t('settings.title', language)}
                </h2>
            </div>

            <div className="grid-2">
                {/* Appearance Settings */}
                <div className="glass-card">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)', marginBottom: 'var(--spacing-md)' }}>
                        <Palette size={18} />
                        <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>{t('settings.appearance', language)}</h3>
                    </div>
                    <div className="project-meta">
                        <div className="project-meta-item" style={{ justifyContent: 'space-between' }}>
                            <span style={{ color: 'var(--color-text-muted)' }}>{t('settings.theme', language)}:</span>
                            <select
                                className="input"
                                style={{ width: 120 }}
                                value={theme}
                                onChange={(e) => setTheme(e.target.value as Theme)}
                            >
                                {themeOptions.map(opt => (
                                    <option key={opt.value} value={opt.value}>
                                        {t(opt.labelKey, language)}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="project-meta-item" style={{ justifyContent: 'space-between', marginTop: 'var(--spacing-sm)' }}>
                            <span style={{ color: 'var(--color-text-muted)' }}>{t('settings.language', language)}:</span>
                            <select
                                className="input"
                                style={{ width: 120 }}
                                value={language}
                                onChange={(e) => setLanguage(e.target.value as Language)}
                            >
                                {langOptions.map(opt => (
                                    <option key={opt.value} value={opt.value}>
                                        {t(opt.labelKey, language)}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Server Config */}
                <div className="glass-card">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)', marginBottom: 'var(--spacing-md)' }}>
                        <Server size={18} />
                        <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>{t('settings.server', language)}</h3>
                    </div>
                    <div className="project-meta">
                        <div className="project-meta-item">
                            <span style={{ color: 'var(--color-text-muted)' }}>{t('settings.apiUrl', language)}:</span>
                            <code className="mono" style={{ color: 'var(--color-accent-teal-light)' }}>
                                http://localhost:3001
                            </code>
                        </div>
                        <div className="project-meta-item" style={{ justifyContent: 'space-between', marginTop: 'var(--spacing-sm)', flexDirection: 'column', alignItems: 'flex-start', gap: 'var(--spacing-xs)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                                <span style={{ color: 'var(--color-text-muted)' }}>{t('settings.refreshInterval', language)}:</span>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)' }}>
                                    <input
                                        type="number"
                                        className="input"
                                        style={{ width: 70, borderColor: intervalError ? 'var(--color-status-error)' : undefined }}
                                        min={5}
                                        max={300}
                                        value={refreshInterval}
                                        onChange={(e) => {
                                            const val = Number(e.target.value);
                                            setRefreshInterval(val || 5);
                                            if (val < 5 || val > 300) {
                                                setIntervalError(t('settings.intervalRange', language));
                                            } else {
                                                setIntervalError('');
                                            }
                                        }}
                                        onBlur={(e) => {
                                            const val = Number(e.target.value);
                                            if (val < 5) {
                                                setRefreshInterval(5);
                                                setIntervalError('');
                                            } else if (val > 300) {
                                                setRefreshInterval(300);
                                                setIntervalError('');
                                            }
                                        }}
                                    />
                                    <span style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>{t('settings.seconds', language)}</span>
                                </div>
                            </div>
                            {intervalError && (
                                <span style={{ color: 'var(--color-status-error)', fontSize: '0.75rem' }}>{intervalError}</span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Notifications */}
                <div className="glass-card">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)', marginBottom: 'var(--spacing-md)' }}>
                        <Bell size={18} />
                        <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>{t('settings.notifications', language)}</h3>
                    </div>
                    <div className="project-meta">
                        <div className="project-meta-item" style={{ justifyContent: 'space-between' }}>
                            <span style={{ color: 'var(--color-text-muted)' }}>{t('settings.errorAlert', language)}:</span>
                            <label className="toggle-switch">
                                <input
                                    type="checkbox"
                                    checked={errorAlertEnabled}
                                    onChange={(e) => setErrorAlertEnabled(e.target.checked)}
                                />
                                <span className="toggle-slider"></span>
                                <span className={`badge ${errorAlertEnabled ? 'badge-teal' : 'badge-error'}`} style={{ marginLeft: 'var(--spacing-sm)' }}>
                                    {errorAlertEnabled ? t('settings.enabled', language) : t('settings.disabled', language)}
                                </span>
                            </label>
                        </div>
                        <div className="project-meta-item" style={{ justifyContent: 'space-between', marginTop: 'var(--spacing-sm)' }}>
                            <span style={{ color: 'var(--color-text-muted)' }}>{t('settings.notifyMethod', language)}:</span>
                            <select
                                className="input"
                                style={{ width: 120 }}
                                value={notifyMethod}
                                onChange={(e) => setNotifyMethod(e.target.value as 'browser' | 'none')}
                            >
                                <option value="browser">{t('settings.browserNotify', language)}</option>
                                <option value="none">{t('settings.noNotify', language)}</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Security */}
                <div className="glass-card">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)', marginBottom: 'var(--spacing-md)' }}>
                        <Shield size={18} />
                        <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>{t('settings.security', language)}</h3>
                    </div>
                    <div className="project-meta">
                        <div className="project-meta-item">
                            <span style={{ color: 'var(--color-text-muted)' }}>{t('settings.apiAuth', language)}:</span>
                            <span className="badge badge-neutral">{t('settings.notConfigured', language)}</span>
                        </div>
                        <div className="project-meta-item">
                            <span style={{ color: 'var(--color-text-muted)' }}>{t('settings.accessControl', language)}:</span>
                            <span>{t('settings.localAccess', language)}</span>
                        </div>
                    </div>
                </div>

                {/* About */}
                <div className="glass-card">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)', marginBottom: 'var(--spacing-md)' }}>
                        <Globe size={18} />
                        <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>{t('settings.about', language)}</h3>
                    </div>
                    <div className="project-meta">
                        <div className="project-meta-item">
                            <span style={{ color: 'var(--color-text-muted)' }}>{t('settings.version', language)}:</span>
                            <code className="mono">v1.0.0</code>
                        </div>
                        <div className="project-meta-item">
                            <span style={{ color: 'var(--color-text-muted)' }}>{t('settings.environment', language)}:</span>
                            <span>{t('settings.devEnv', language)}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
