/** api/desk/tickets/[id].js v1.0.0 */
import { runDeskHandler } from '../../../server/vercelUtils.mjs';

export default async function handler(req, res) {
  const id = String(req.query.id || '').trim();
  return runDeskHandler(req, res, `tickets/${id}`);
}
