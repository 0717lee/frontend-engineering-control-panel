import { useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { ServerStatus } from './components/ServerStatus';
import { ProjectList } from './components/ProjectList';
import { ErrorLogViewer } from './components/ErrorLogViewer';
import { Settings } from './components/Settings';
import { useStore } from './store';

function App() {
    const { activeView, fetchSystemStatus, fetchProjects, fetchErrorLogs, fetchIntegrationStatus, syncPlatforms } = useStore();

    useEffect(() => {
        // Initial fetch
        fetchSystemStatus();
        fetchProjects();
        fetchErrorLogs();
        fetchIntegrationStatus();

        // Auto-sync from platforms on initial load
        syncPlatforms();

        // Setup polling (every 30 seconds)
        const interval = setInterval(() => {
            fetchSystemStatus();
            fetchProjects();
        }, 30000);

        return () => clearInterval(interval);
    }, [fetchSystemStatus, fetchProjects, fetchErrorLogs, fetchIntegrationStatus, syncPlatforms]);

    const renderContent = () => {
        switch (activeView) {
            case 'dashboard':
                return (
                    <section className="section">
                        <ServerStatus />
                    </section>
                );
            case 'projects':
                return (
                    <section className="section">
                        <ProjectList />
                    </section>
                );
            case 'errors':
                return (
                    <section className="section">
                        <ErrorLogViewer />
                    </section>
                );
            case 'settings':
                return (
                    <section className="section">
                        <Settings />
                    </section>
                );
            default:
                return null;
        }
    };

    return (
        <div className="app-layout">
            <Sidebar />
            <main className="main-content">
                <Header />
                {renderContent()}
            </main>
        </div>
    );
}

export default App;
