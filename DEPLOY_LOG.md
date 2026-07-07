# Deploy Log — Gerador de Tickets (generator-tabajara)

<!-- VERSION: v1.0.5 | DATE: 2026-07-07 | AUTHOR: VeloHub Development Team -->

Histórico de deploys e pushes do repositório [admVeloHub/generator-tabajara](https://github.com/admVeloHub/generator-tabajara).

---

## GitHub — Push inicial

| Campo | Valor |
|-------|-------|
| **Data/Hora** | 2026-07-01 |
| **Tipo** | GitHub Push |
| **Versão** | v1.0.0 |
| **Branch** | master |
| **Arquivos** | README.md, DEPLOY_LOG.md, package.json, package-lock.json, vite.config.js, vercel.json, index.html, .gitignore, .env.example, api/, server/, src/ |
| **Descrição** | Commit inicial do Gerador de Tickets — app standalone para simulação de chamados clientes no Velodesk (3 abas: enviar ticket, gerador em lote, acompanhar). |

---

## GitHub — Proxy Velodesk para Vercel

| Campo | Valor |
|-------|-------|
| **Data/Hora** | 2026-07-01 |
| **Tipo** | GitHub Push |
| **Versão** | v1.0.1 |
| **Branch** | master |
| **Arquivos** | DEPLOY_LOG.md, .env.example, src/config.js, src/api/velodeskClient.js, src/App.jsx, vite.config.js, server/velodeskProxy.mjs, api/velodesk/[...path].js |
| **Descrição** | Corrige login na Vercel: proxy same-origin `/api/velodesk` evita chamadas do browser a localhost (CORS + Private Network Access). Dev local/LAN continua usando API direta; produção exige `VELODESK_API_URL` apontando para backend público. |

---

## GitHub — Gravação direta MongoDB

| Campo | Valor |
|-------|-------|
| **Data/Hora** | 2026-07-01 |
| **Tipo** | GitHub Push |
| **Versão** | v1.0.2 |
| **Branch** | master |
| **Arquivos** | DEPLOY_LOG.md, .env.example, package.json, package-lock.json, api/desk/[...path].js, server/deskApi.mjs, server/mongo/, src/config.js, src/api/velodeskClient.js, src/App.jsx, vite.config.js; removidos LoginPanel, velodeskProxy, api/velodesk |
| **Descrição** | Remove login e proxy da API Desk. Tickets/clientes/mensagens gravados direto no MongoDB Atlas (`b2c_chamados` + `b2c_cadastros`) via `/api/desk` server-side. Vercel exige `MONGO_URI`; sem CORS nem backend intermediário. |

---

## GitHub — Fix rotas /api/desk na Vercel

| Campo | Valor |
|-------|-------|
| **Data/Hora** | 2026-07-01 |
| **Tipo** | GitHub Push |
| **Versão** | v1.0.3 |
| **Branch** | master |
| **Arquivos** | DEPLOY_LOG.md, vercel.json, api/desk/clients.js, api/desk/tickets.js, api/desk/tickets/[id].js, api/desk/tickets/[id]/messages.js, api/generate-questions.js, server/vercelUtils.mjs; removido api/desk/[...path].js |
| **Descrição** | Corrige 405 na Vercel: catch-all `[...path]` não era roteado; substituído por rotas explícitas. Rewrite SPA passa a excluir `/api/*`. Parser JSON reforçado em generate-questions. |

---

## GitHub — Protocolo atribuído pelo CRM

| Campo | Valor |
|-------|-------|
| **Data/Hora** | 2026-07-03 |
| **Tipo** | GitHub Push |
| **Versão** | v1.0.4 |
| **Branch** | master |
| **Arquivos** | DEPLOY_LOG.md, server/mongo/chamadoService.mjs, server/mongo/schemas.mjs, src/utils/chamadoLabel.js, src/services/ticketService.js, src/services/sessionStore.js, src/components/GeradorTab.jsx, src/components/EnviarTicketTab.jsx, src/components/AcompanharTab.jsx, src/components/TicketDialog.jsx |
| **Descrição** | Remove geração automática de `chamadoProtocolo` (VD-…). Chamados são gravados sem protocolo; UI exibe ID curto até o CRM atribuir. Sessão atualiza protocolo ao refresh quando disponível. |

---

## GitHub — Fix índice unique chamadoProtocolo (null)

| Campo | Valor |
|-------|-------|
| **Data/Hora** | 2026-07-07 |
| **Tipo** | GitHub Push |
| **Versão** | v1.0.5 |
| **Branch** | master |
| **Arquivos** | DEPLOY_LOG.md, server/mongo/chamadoService.mjs, server/mongo/protocoloUtils.mjs, src/utils/chamadoLabel.js, src/services/sessionStore.js |
| **Descrição** | Corrige E11000 duplicate key `{ chamadoProtocolo: null }`: índice unique do Atlas exige valor único por documento. Usa marcador interno `__SIMULACAO_PENDENTE__:<ObjectId>` até o CRM atribuir protocolo oficial; UI continua sem exibir protocolo gerado. |

---
