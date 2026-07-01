/** App.jsx v1.0.3 */
import { useState } from 'react';
import EnviarTicketTab from './components/EnviarTicketTab.jsx';
import GeradorTab from './components/GeradorTab.jsx';
import AcompanharTab from './components/AcompanharTab.jsx';
import { getDeskDisplayLabel } from './config.js';

const TABS = [
  { id: 'enviar', label: 'Enviar ticket' },
  { id: 'gerador', label: 'Gerador de tickets' },
  { id: 'acompanhar', label: 'Acompanhar' },
];

export default function App() {
  const [tab, setTab] = useState('enviar');
  const [refreshKey, setRefreshKey] = useState(0);

  function handleCreated() {
    setRefreshKey((k) => k + 1);
  }

  return (
    <div className="app-shell">
      <header className="app-header">
        <h1 className="app-title">Personal Ticket Generator Tabajara</h1>
        <p>Destino: {getDeskDisplayLabel()}</p>
        <div className="banner-warning">
          Ferramenta de simulação — chamados entram no ambiente real de testes (prefixo [SIMULACAO]).
        </div>
      </header>

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
