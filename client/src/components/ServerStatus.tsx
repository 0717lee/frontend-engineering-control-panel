import { Cpu, HardDrive, Clock, Server } from 'lucide-react';
import ReactECharts from 'echarts-for-react';
import { useStore } from '../store';
import { t } from '../i18n';

function formatBytes(bytes: number): string {
    const gb = bytes / (1024 * 1024 * 1024);
    return `${gb.toFixed(1)} GB`;
}

function formatUptime(seconds: number, language: 'zh' | 'en'): string {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const mins = Math.floor((seconds % 3600) / 60);

    if (days > 0) return t('time.days', language, { n: days, h: hours });
    if (hours > 0) return t('time.hours', language, { n: hours, m: mins });
    return t('time.minutes', language, { n: mins });
}

export function ServerStatus() {
    const { systemStatus, systemLoading, language } = useStore();

    const cpuChartOption = {
        animation: true,
        series: [{
            type: 'gauge',
            radius: '100%',
            startAngle: 200,
            endAngle: -20,
            min: 0,
            max: 100,
            splitNumber: 5,
            itemStyle: {
                color: {
                    type: 'linear',
                    x: 0, y: 0, x2: 1, y2: 0,
                    colorStops: [
                        { offset: 0, color: '#14b8a6' },
                        { offset: 1, color: '#2dd4bf' }
                    ]
                }
            },
            progress: { show: true, width: 12 },
            pointer: { show: false },
            axisLine: {
                lineStyle: { width: 12, color: [[1, 'rgba(255,255,255,0.1)']] }
            },
            axisTick: { show: false },
            splitLine: { show: false },
            axisLabel: { show: false },
            title: { show: false },
            detail: {
                valueAnimation: true,
                fontSize: 24,
                fontFamily: 'JetBrains Mono',
                color: '#2dd4bf',
                formatter: (value: number) => `${Math.round(value)}%`,
                offsetCenter: [0, 0]
            },
            data: [{ value: Math.round(systemStatus?.cpu.usage || 0) }]
        }]
    };

    const memChartOption = {
        animation: true,
        series: [{
            type: 'gauge',
            radius: '100%',
            startAngle: 200,
            endAngle: -20,
            min: 0,
            max: 100,
            splitNumber: 5,
            itemStyle: {
                color: {
                    type: 'linear',
                    x: 0, y: 0, x2: 1, y2: 0,
                    colorStops: [
                        { offset: 0, color: '#f59e0b' },
                        { offset: 1, color: '#fbbf24' }
                    ]
                }
            },
            progress: { show: true, width: 12 },
            pointer: { show: false },
            axisLine: {
                lineStyle: { width: 12, color: [[1, 'rgba(255,255,255,0.1)']] }
            },
            axisTick: { show: false },
            splitLine: { show: false },
            axisLabel: { show: false },
            title: { show: false },
            detail: {
                valueAnimation: true,
                fontSize: 24,
                fontFamily: 'JetBrains Mono',
                color: '#fbbf24',
                formatter: (value: number) => `${Math.round(value)}%`,
                offsetCenter: [0, 0]
            },
            data: [{ value: Math.round(systemStatus?.memory.usagePercent || 0) }]
        }]
    };

    if (systemLoading && !systemStatus) {
        return (
            <div>
                <div className="section-header">
                    <h2 className="section-title">
                        <Server size={20} />
                        {t('server.title', language)}
                    </h2>
                </div>
                <div className="grid-4">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="glass-card skeleton" style={{ height: 120 }} />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div>
            <div className="section-header">
                <h2 className="section-title">
                    <Server size={20} />
                    {t('server.title', language)}
                </h2>
                {systemStatus && (
                    <span className="badge badge-teal">
                        <span className="status-dot running" />
                        {t('server.online', language)}
                    </span>
                )}
            </div>

            <div className="grid-4">
                <div className="glass-card stat-card">
                    <div className="stat-label">
                        <Cpu size={14} style={{ marginRight: 4, verticalAlign: 'middle' }} />
                        {t('server.cpu', language)}
                    </div>
                    <div className="stat-value teal">{systemStatus?.cpu.usage.toFixed(1)}%</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                        {systemStatus?.cpu.cores} {t('server.cores', language)}
                    </div>
                </div>

                <div className="glass-card stat-card">
                    <div className="stat-label">
                        <HardDrive size={14} style={{ marginRight: 4, verticalAlign: 'middle' }} />
                        {t('server.memory', language)}
                    </div>
                    <div className="stat-value amber">{systemStatus?.memory.usagePercent.toFixed(1)}%</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                        {formatBytes(systemStatus?.memory.used || 0)} / {formatBytes(systemStatus?.memory.total || 0)}
                    </div>
                </div>

                <div className="glass-card stat-card">
                    <div className="stat-label">
                        <Clock size={14} style={{ marginRight: 4, verticalAlign: 'middle' }} />
                        {t('server.uptime', language)}
                    </div>
                    <div className="stat-value" style={{ color: 'var(--color-text-primary)' }}>
                        {formatUptime(systemStatus?.uptime || 0, language)}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                        {systemStatus?.os.hostname}
                    </div>
                </div>

                <div className="glass-card stat-card">
                    <div className="stat-label">{t('server.system', language)}</div>
                    <div style={{ fontSize: '0.875rem', color: 'var(--color-text-primary)', marginTop: 4 }}>
                        {systemStatus?.os.distro || systemStatus?.os.platform}
                    </div>
                    <div className="mono" style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                        {systemStatus?.os.release}
                    </div>
                </div>
            </div>

            <div className="grid-2" style={{ marginTop: 'var(--spacing-lg)' }}>
                <div className="glass-card">
                    <div className="stat-label" style={{ marginBottom: 'var(--spacing-sm)' }}>{t('server.cpuUsage', language)}</div>
                    <div className="chart-container">
                        <ReactECharts option={cpuChartOption} style={{ height: '100%' }} />
                    </div>
                </div>

                <div className="glass-card">
                    <div className="stat-label" style={{ marginBottom: 'var(--spacing-sm)' }}>{t('server.memUsage', language)}</div>
                    <div className="chart-container">
                        <ReactECharts option={memChartOption} style={{ height: '100%' }} />
                    </div>
                </div>
            </div>
        </div>
    );
}
