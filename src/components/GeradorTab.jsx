/** GeradorTab.jsx v1.0.4 */
import { useState } from 'react';
import { THEME_OPTIONS } from '../data/simulationScenarios.js';
import { fetchGeneratedMessages } from '../services/geminiService.js';
import { createSimulatedTicket } from '../services/ticketService.js';
import { randomCpfForTicket, delay } from '../services/randomGenerator.js';
import { getApiErrorMessage } from '../api/velodeskClient.js';
import { formatCpf } from '../utils/cpf.js';
import { formatChamadoReferencia } from '../utils/chamadoLabel.js';

export default function GeradorTab({ onCreated }) {
  const [count, setCount] = useState(5);
  const [theme, setTheme] = useState('all');
  const [mode, setMode] = useState('auto');
  const [loading, setLoading] = useState(false);
  const [log, setLog] = useState([]);
  const [summary, setSummary] = useState(null);

  function appendLog(line) {
    setLog((prev) => [...prev, line]);
  }

  async function handleGenerate() {
    setLoading(true);
    setLog([]);
    setSummary(null);

    try {
      const themeLabel = THEME_OPTIONS.find((t) => t.id === theme)?.label || theme;
      appendLog(`Gerando ${count} mensagem(ns) — tema: ${themeLabel}…`);

      const generated = await fetchGeneratedMessages({ theme, count, mode });
      appendLog(`Fonte: ${generated.source || 'static'}`);

      let ok = 0;
      let fail = 0;

      for (let i = 0; i < generated.messages.length; i += 1) {
        const item = generated.messages[i];
        const cpf = randomCpfForTicket();
        try {
          const { ticket } = await createSimulatedTicket({
            cpf,
            message: item.text,
            themeLabel: themeLabel === 'Todos' ? (item.themeKey || 'Gerador') : themeLabel,
          });
          const ticketId = ticket._id || ticket.id;
          const referencia = formatChamadoReferencia({
            id: ticketId,
            chamadoProtocolo: ticket.chamadoProtocolo,
          });
          ok += 1;
          appendLog(`✓ ${referencia} — CPF ${formatCpf(cpf)}`);
          onCreated?.({
            id: ticketId,
            protocolo: ticket.chamadoProtocolo || '',
          });
        } catch (err) {
          fail += 1;
          appendLog(`✗ Erro: ${getApiErrorMessage(err)}`);
        }
        if (i < generated.messages.length - 1) await delay(300);
      }

      setSummary({ ok, fail, source: generated.source });
    } catch (err) {
      appendLog(`Erro: ${getApiErrorMessage(err)}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="panel">
      <h2>Gerador de tickets</h2>
      <div className="row">
        <div className="field">
          <label htmlFor="count">Quantidade</label>
          <input
            id="count"
            type="number"
            min={1}
            max={20}
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
          />
        </div>
        <div className="field">
          <label htmlFor="theme">Tema</label>
          <select id="theme" value={theme} onChange={(e) => setTheme(e.target.value)}>
            {THEME_OPTIONS.map((t) => (
              <option key={t.id} value={t.id}>{t.label}</option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="mode">Modo</label>
          <select id="mode" value={mode} onChange={(e) => setMode(e.target.value)}>
            <option value="auto">Auto (Gemini → fallback)</option>
            <option value="static">Estático</option>
          </select>
        </div>
      </div>
      <button
        type="button"
        className="btn btn-primary"
        onClick={handleGenerate}
        disabled={loading}
      >
        {loading ? 'Gerando…' : `Gerar ${count} chamado(s)`}
      </button>

      {summary && (
        <div className="alert alert-success">
          Concluído: {summary.ok} criado(s), {summary.fail} erro(s). Fonte: {summary.source}.
        </div>
      )}

      {log.length > 0 && (
        <div className="progress-log">
          {log.map((line, i) => (
            <div key={i}>{line}</div>
          ))}
        </div>
      )}
    </div>
  );
}
