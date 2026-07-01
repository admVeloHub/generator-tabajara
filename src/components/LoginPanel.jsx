/** LoginPanel.jsx v1.0.0 */
import { useState } from 'react';
import { login, getApiErrorMessage } from '../api/velodeskClient.js';

export default function LoginPanel({ onSuccess }) {
  const [email, setEmail] = useState('admin@velodesk.local');
  const [password, setPassword] = useState('admin123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const data = await login(email, password);
      onSuccess(data.user || { email });
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="panel login-panel">
      <h2>Login Velodesk</h2>
      <p style={{ fontSize: '0.85rem', marginBottom: 16 }}>
        Autentique-se na API do Desk para criar chamados de simulação.
      </p>
      <form onSubmit={handleSubmit}>
        <div className="field">
          <label htmlFor="email">E-mail</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="field">
          <label htmlFor="password">Senha</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Entrando…' : 'Entrar'}
        </button>
      </form>
      {error && <div className="alert alert-error">{error}</div>}
    </div>
  );
}
