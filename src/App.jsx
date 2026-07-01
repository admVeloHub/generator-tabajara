/** App.jsx v1.0.1 */
import { useState } from 'react';
import LoginPanel from './components/LoginPanel.jsx';
import EnviarTicketTab from './components/EnviarTicketTab.jsx';
import GeradorTab from './components/GeradorTab.jsx';
import AcompanharTab from './components/AcompanharTab.jsx';
import { logout } from './api/velodeskClient.js';
import { VELODESK_API_BASE } from './config.js';

const TABS = [
  { id: 'enviar', label: 'Enviar ticket' },
  { id: 'gerador', label: 'Gerador de tickets' },
  { id: 'acompanhar', label: 'Acompanhar' },
];

export default function App() {
  const [user, setUser] = useState(null);
  const [tab, setTab] = useState('enviar');
  const [refreshKey, setRefreshKey] = useState(0);

  function handleCreated() {
    setRefreshKey((k) => k + 1);
  }

  function handleLogout() {
    logout();
    setUser(null);
  }

  if (!user) {
    return (
      <div className="app-shell">
        <header className="app-header">
          <h1 className="app-title">Personal Ticket Generator Tabajara</h1>
          <p>Simulação de chamados clientes para Velodesk</p>
        </header>
        <LoginPanel onSuccess={setUser} />
      </div>
    );
  }

  return (
    <div className="app-shell">
      <header className="app-header">
        <h1 className="app-title">Personal Ticket Generator Tabajara</h1>
        <p>API Desk: {VELODESK_API_BASE}</p>
        <div className="banner-warning">
          Ferramenta de simulação — chamados entram no ambiente real de testes (prefixo [SIMULACAO]).
        </div>
      </header>

      <div className="user-bar">
        <span>{user.name || user.email}</span>
        <button type="button" className="btn btn-secondary" onClick={handleLogout}>
          Sair
        </button>
      </div>

      <nav className="tabs">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            className={`tab-btn ${tab === t.id ? 'active' : ''}`}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </nav>

      {tab === 'enviar' && <EnviarTicketTab onCreated={handleCreated} />}
      {tab === 'gerador' && <GeradorTab onCreated={handleCreated} />}
      {tab === 'acompanhar' && <AcompanharTab key={refreshKey} />}
    </div>
  );
}
