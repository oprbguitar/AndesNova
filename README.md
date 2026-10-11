# AndesNova

Sitio de AndesNova (*Tu negocio más lejos*): una sola página, sin scroll en escritorio, con la ruta **Activa → Implementa → Acompaña → Optimiza**, el toolbox de **Herramientas**, asistente con IA y diagnóstico de 2 minutos. Contacto: consultas@andesnova.solutions. Construido con React, Vite, TypeScript, Framer Motion y Lucide.

## Sitios publicados

| Destino | URL | Cómo se publica |
|---|---|---|
| Cloudflare Workers (sitio + API del chat) | https://andesnova-web.oprbguitar.workers.dev | `npm run deploy:cf` |
| GitHub Pages | https://oprbguitar.github.io/Andes_Nova/ | carpeta `docs/` en `main` del repo `Andes_Nova` |
| Dominio principal (Vercel) | https://www.andesnova.solutions | push a `main` de `oprbguitar/AndesNova` |

## Estructura

```text
src/
  App.tsx                 Página única; la fase activa se sincroniza con la URL (#activa, #implementa…)
  data/phases.ts          Contenido de las 4 fases (hero, chips del chat, panel)
  data/site.ts            Contacto y proyectos (BEDOIA, CAPTA, AMAUTA)
  components/HeroScene    Montaña centrada con nubes animadas (3 capas) + ruta de fases + chat
  components/PhasePanel   Pestañas, contenido por fase y proyectos
  components/ChatPanel    Asistente AndesNova
  services/chatService.ts Cloudflare primero, Gemini como respaldo
worker/
  index.js                Worker de Cloudflare: sirve dist/ y responde POST /api/chat
  knowledge.js            Guía interna con la que responde el asistente
wrangler.jsonc            Configuración del Worker (Workers AI, KV, límite diario)
```

Identidad visual: colores, tipografías (Sora + Inter) y logotipo según `design and logo/andesnova_manual_identidad_visual.md`.

## Chatbot

1. El sitio envía la consulta a `POST /api/chat` del Worker `andesnova-web`.
2. El Worker responde con **Workers AI** (`@cf/meta/llama-3.3-70b-instruct-fp8-fast`) usando la guía de `worker/knowledge.js`.
3. Un contador diario en KV (`CHAT_QUOTA`) limita las respuestas con IA a **56 por día** (hora de Lima), para quedarse dentro del plan gratuito de Cloudflare. Los saludos no consumen cupo.
4. Al llegar al límite, o si el Worker falla, el sitio usa la API de Gemini existente (`andesnova-chat-api.vercel.app`).

Cambiar el límite o el modelo: editar `DAILY_AI_LIMIT` / `AI_MODEL` en `wrangler.jsonc` y volver a desplegar.

## Ejecutar localmente

```bash
npm install
npm run dev
```

## Scripts

| Script | Uso |
|---|---|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` / `build:github` | Build en `docs/` (base `/Andes_Nova/`, o `/` en Vercel) |
| `npm run build:cf` | Build en `dist/` para Cloudflare (base `/`) |
| `npm run deploy:cf` | Build + `wrangler deploy` del sitio y la API |
