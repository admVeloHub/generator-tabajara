# Gerador de Tickets

<!-- VERSION: v1.0.0 | DATE: 2026-07-01 | AUTHOR: VeloHub Development Team -->

Aplicação standalone para simular **clientes** criando e acompanhando chamados no Velodesk (`chamados_n1`).

**Repositório:** [admVeloHub/generator-tabajara](https://github.com/admVeloHub/generator-tabajara) — projeto separado do Desk.

## Abas

1. **Enviar ticket** — CPF + mensagem inicial + anexos (URLs); status sempre `novo`
2. **Gerador de tickets** — lote 1–20, temas Todos / EP Antecipação / Cupons; Gemini ou fallback estático
3. **Acompanhar** — cards dos chamados criados na sessão; diálogo com polling e resposta como cliente

## Pré-requisitos

- Node.js ≥ 18
- Backend Velodesk rodando (padrão `http://localhost:8001`)
- Credenciais dev: `admin@velodesk.local` / `admin123`

## Setup local

```bash
cd "C:\dev ecossistema\gerador de tickets"
copy .env.example .env
npm install
npm start
```

- App: **http://localhost:8050**
- Rede LAN: **http://\<IP-da-máquina\>:8050** (Vite com `host: true`)

## Variáveis de ambiente

| Variável | Escopo | Descrição |
|----------|--------|-----------|
| `VITE_VELODESK_API_URL` | client | URL do backend Desk (default `http://localhost:8001`) |
| `GEMINI_API_KEY` | server | Google AI Studio — geração de mensagens (opcional) |
| `GEMINI_MODEL` | server | Default `gemini-2.0-flash` |

## Deploy Vercel (projeto separado)

1. Repositório Git próprio apontando para esta pasta
2. Novo projeto Vercel (não reutilizar o do Desk)
3. Root Directory = raiz deste projeto
4. Env Production:
   - `VITE_VELODESK_API_URL` = URL pública do backend Desk de testes
   - `GEMINI_API_KEY` = chave server-side

### Histórico de deploy

| Data | Tipo | Versão | Notas |
|------|------|--------|-------|
| — | — | v1.0.0 | Aguardando primeiro deploy |

## Estrutura

```
gerador de tickets/
├── api/generate-questions.js   # Vercel serverless (Gemini)
├── server/generateQuestions.mjs
├── src/
│   ├── components/             # 3 abas + login + dialog
│   ├── services/               # ticketService, gemini, session
│   └── data/simulationScenarios.js
└── vite.config.js              # porta 8050, middleware Gemini dev
```

## Notas

- Chamados marcados com prefixo `[SIMULACAO]` no título
- Nenhuma alteração no repositório `desk` é necessária
- CPF no gerador é sempre gerado/validado localmente; Gemini gera apenas textos
