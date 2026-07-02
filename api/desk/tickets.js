/** api/desk/tickets.js v1.0.0 */
import { runDeskHandler } from '../../server/vercelUtils.mjs';

export default async function handler(req, res) {
  return runDeskHandler(req, res, 'tickets');
}
