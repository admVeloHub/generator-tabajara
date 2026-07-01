/** simulationScenarios.js v1.0.1 — temas + fallback estático via POPs */
import { getStaticMessagesFromPops } from './popKnowledge.js';

export const THEME_OPTIONS = [
  { id: 'all', label: 'Todos' },
  { id: 'epAntecipacao', label: 'EP Antecipação' },
  { id: 'cupons', label: 'Cupons' },
];

export function generateStaticMessages(theme, count) {
  const messages = getStaticMessagesFromPops(theme, count);
  return { source: 'static-pop', messages };
}
