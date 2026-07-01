# Deploy Log — Gerador de Tickets (generator-tabajara)

<!-- VERSION: v1.0.2 | DATE: 2026-07-01 | AUTHOR: VeloHub Development Team -->

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
