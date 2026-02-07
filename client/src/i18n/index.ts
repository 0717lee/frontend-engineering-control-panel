// Internationalization (i18n) support
export type Language = 'zh' | 'en';

export const translations = {
    zh: {
        // Header
        'header.title': '前端工程控制面板',
        'header.subtitle': '监控前端项目与服务器状态',
        'header.refresh': '刷新数据',
        'header.notifications': '通知',

        // Sidebar
        'nav.dashboard': '仪表盘',
        'nav.projects': '项目管理',
        'nav.errors': '错误日志',
        'nav.settings': '系统设置',

        // Server Status
        'server.title': '服务器状态',
        'server.online': '在线',
        'server.offline': '离线',
        'server.cpu': 'CPU 使用率',
        'server.memory': '内存',
        'server.uptime': '运行时间',
        'server.system': '操作系统',
        'server.cores': '核心',
        'server.cpuUsage': 'CPU 使用率',
        'server.memUsage': '内存使用率',

        // Projects
        'projects.title': '项目管理',
        'projects.total': '共 {count} 个',
        'projects.version': '版本',
        'projects.builtAt': '构建于 {time}',
        'projects.openSite': '访问站点',
        'projects.empty': '暂无项目配置',
        'projects.emptyHint': '通过 API 添加项目以开始监控',
        'platform.selfHosted': '自建服务器',
        'platform.other': '其他',

        // Error Logs
        'errors.title': '错误日志',
        'errors.total': '共 {count} 条',
        'errors.search': '搜索错误...',
        'errors.allProjects': '所有项目',
        'errors.allLevels': '所有级别',
        'errors.filter': '筛选',
        'errors.empty': '暂无错误',
        'errors.emptyHint': '您的项目运行正常',
        'errors.adjustFilter': '尝试调整筛选条件',
        'level.error': '错误',
        'level.warn': '警告',
        'level.info': '信息',

        // Settings
        'settings.title': '系统设置',
        'settings.server': '服务器配置',
        'settings.apiUrl': 'API 地址',
        'settings.refreshInterval': '刷新间隔',
        'settings.seconds': '秒',
        'settings.custom': '自定义',
        'settings.intervalRange': '范围: 5-300 秒',
        'settings.notifications': '通知设置',
        'settings.errorAlert': '错误告警',
        'settings.enabled': '已启用',
        'settings.disabled': '已禁用',
        'settings.notifyMethod': '通知方式',
        'settings.browserNotify': '浏览器通知',
        'settings.noNotify': '不通知',
        'settings.security': '安全设置',
        'settings.apiAuth': 'API 认证',
        'settings.notConfigured': '未配置',
        'settings.accessControl': '访问控制',
        'settings.localAccess': '本地访问',
        'settings.about': '关于',
        'settings.version': '版本',
        'settings.environment': '环境',
        'settings.devEnv': '开发环境',
        'settings.prodEnv': '生产环境',
        'settings.appearance': '外观设置',
        'settings.theme': '主题',
        'settings.language': '语言',
        'theme.dark': '深色',
        'theme.light': '浅色',
        'theme.system': '跟随系统',
        'lang.zh': '中文',
        'lang.en': 'English',

        // Time
        'time.days': '{n}天 {h}小时',
        'time.hours': '{n}小时 {m}分钟',
        'time.minutes': '{n}分钟',
        'time.daysAgo': '{n}天前',
        'time.hoursAgo': '{n}小时前',
        'time.minutesAgo': '{n}分钟前',
    },
    en: {
        // Header
        'header.title': 'Frontend Engineering Control Panel',
        'header.subtitle': 'Monitor your frontend projects and server status',
        'header.refresh': 'Refresh data',
        'header.notifications': 'Notifications',

        // Sidebar
        'nav.dashboard': 'Dashboard',
        'nav.projects': 'Projects',
        'nav.errors': 'Error Logs',
        'nav.settings': 'Settings',

        // Server Status
        'server.title': 'Server Status',
        'server.online': 'Online',
        'server.offline': 'Offline',
        'server.cpu': 'CPU Usage',
        'server.memory': 'Memory',
        'server.uptime': 'Uptime',
        'server.system': 'System',
        'server.cores': 'cores',
        'server.cpuUsage': 'CPU Usage',
        'server.memUsage': 'Memory Usage',

        // Projects
        'projects.title': 'Projects',
        'projects.total': '{count} total',
        'projects.version': 'Version',
        'projects.builtAt': 'Built {time}',
        'projects.openSite': 'Open Site',
        'projects.empty': 'No projects configured yet',
        'projects.emptyHint': 'Add projects via the API to start monitoring',
        'platform.selfHosted': 'Self-Hosted',
        'platform.other': 'Other',

        // Error Logs
        'errors.title': 'Error Logs',
        'errors.total': '{count} total',
        'errors.search': 'Search errors...',
        'errors.allProjects': 'All Projects',
        'errors.allLevels': 'All Levels',
        'errors.filter': 'Filter',
        'errors.empty': 'No errors found',
        'errors.emptyHint': 'Your projects are running smoothly',
        'errors.adjustFilter': 'Try adjusting your filters',
        'level.error': 'Error',
        'level.warn': 'Warning',
        'level.info': 'Info',

        // Settings
        'settings.title': 'Settings',
        'settings.server': 'Server Configuration',
        'settings.apiUrl': 'API URL',
        'settings.refreshInterval': 'Refresh Interval',
        'settings.seconds': 'seconds',
        'settings.custom': 'Custom',
        'settings.intervalRange': 'Range: 5-300 seconds',
        'settings.notifications': 'Notifications',
        'settings.errorAlert': 'Error Alerts',
        'settings.enabled': 'Enabled',
        'settings.disabled': 'Disabled',
        'settings.notifyMethod': 'Notify Method',
        'settings.browserNotify': 'Browser Notification',
        'settings.noNotify': 'None',
        'settings.security': 'Security',
        'settings.apiAuth': 'API Authentication',
        'settings.notConfigured': 'Not Configured',
        'settings.accessControl': 'Access Control',
        'settings.localAccess': 'Local Access',
        'settings.about': 'About',
        'settings.version': 'Version',
        'settings.environment': 'Environment',
        'settings.devEnv': 'Development',
        'settings.prodEnv': 'Production',
        'settings.appearance': 'Appearance',
        'settings.theme': 'Theme',
        'settings.language': 'Language',
        'theme.dark': 'Dark',
        'theme.light': 'Light',
        'theme.system': 'System',
        'lang.zh': '中文',
        'lang.en': 'English',

        // Time
        'time.days': '{n}d {h}h',
        'time.hours': '{n}h {m}m',
        'time.minutes': '{n}m',
        'time.daysAgo': '{n}d ago',
        'time.hoursAgo': '{n}h ago',
        'time.minutesAgo': '{n}m ago',
    }
};

export type TranslationKey = keyof typeof translations.zh;

export function t(key: TranslationKey, lang: Language, params?: Record<string, string | number>): string {
    let text = translations[lang][key] || key;
    if (params) {
        Object.entries(params).forEach(([k, v]) => {
            text = text.replace(`{${k}}`, String(v));
        });
    }
    return text;
}
