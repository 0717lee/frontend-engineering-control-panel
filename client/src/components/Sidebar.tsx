import {
    LayoutDashboard,
    FolderKanban,
    AlertTriangle,
    Settings,
    Terminal
} from 'lucide-react';
import { useStore } from '../store';
import { t } from '../i18n';

export function Sidebar() {
    const { activeView, setActiveView, language } = useStore();

    const navItems = [
        { id: 'dashboard' as const, labelKey: 'nav.dashboard' as const, icon: LayoutDashboard },
        { id: 'projects' as const, labelKey: 'nav.projects' as const, icon: FolderKanban },
        { id: 'errors' as const, labelKey: 'nav.errors' as const, icon: AlertTriangle },
        { id: 'settings' as const, labelKey: 'nav.settings' as const, icon: Settings },
    ];

    return (
        <aside className="sidebar">
            <div className="logo">
                <div className="logo-icon">
                    <Terminal size={18} color="#0f1419" />
                </div>
                <span>FECP</span>
            </div>

            <nav>
                <ul className="nav-list">
                    {navItems.map((item) => (
                        <li key={item.id}>
                            <div
                                className={`nav-item ${activeView === item.id ? 'active' : ''}`}
                                onClick={() => setActiveView(item.id)}
                            >
                                <item.icon size={18} />
                                <span>{t(item.labelKey, language)}</span>
                            </div>
                        </li>
                    ))}
                </ul>
            </nav>
        </aside>
    );
}
