/** AcompanharTab.jsx v1.0.0 */
import { useCallback, useEffect, useState } from 'react';
import { listChamados } from '../services/sessionStore.js';
import { formatCpf } from '../utils/cpf.js';
import TicketDialog from './TicketDialog.jsx';

export default function AcompanharTab() {
  const [chamados, setChamados] = useState([]);
  const [selected, setSelected] = useState(null);

  const reload = useCallback(() => {
    setChamados(listChamados());
  }, []);

  useEffect(() => {
    reload();
    const onFocus = () => reload();
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }, [reload]);

  return (
    <>
      <div className="panel">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h2 style={{ margin: 0 }}>Acompanhar</h2>
          <button type="button" className="btn btn-secondary" onClick={reload}>
            Atualizar lista
          </button>
        </div>

        {chamados.length === 0 ? (
          <div className="empty-state">
            Nenhum chamado nesta sessão. Crie tickets nas abas Enviar ou Gerador.
          </div>
        ) : (
          <div className="cards-grid">
            {chamados.map((c) => (
              <div
                key={c.id}
                className="ticket-card"
                onClick={() => setSelected(c)}
                onKeyDown={(e) => e.key === 'Enter' && setSelected(c)}
                role="button"
                tabIndex={0}
              >
                <strong>{c.protocolo}</strong>
                <small>{c.titulo}</small>
                <small>CPF: {formatCpf(c.cpf)}</small>
                <span className="status-badge">{c.status || 'novo'}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {selected && (
        <TicketDialog
          chamado={selected}
          onClose={() => setSelected(null)}
          onUpdate={reload}
        />
      )}
    </>
  );
}
