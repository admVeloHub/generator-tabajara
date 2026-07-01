/** geminiService.js v1.0.0 */
import { generateStaticMessages } from '../data/simulationScenarios.js';

export async function fetchGeneratedMessages({ theme, count, mode = 'auto' }) {
  if (mode === 'static') {
    return generateStaticMessages(theme, count);
  }

  try {
    const res = await fetch('/api/generate-questions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ theme, count }),
    });
    const data = await res.json();
    if (res.ok && data.messages?.length) {
      return data;
    }
  } catch {
    /* fallback below */
  }

  return generateStaticMessages(theme, count);
}
