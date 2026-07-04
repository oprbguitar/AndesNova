# AndesNova

Portal corporativo demo para AndesNova Consultores S.A.C., construido con React, Vite, TypeScript, Tailwind CSS y Lucide React.

## Demo en GitHub Pages

Sitio publicado: [https://oprbguitar.github.io/Andes_Nova/](https://oprbguitar.github.io/Andes_Nova/)

La publicación se realiza con GitHub Actions mediante `.github/workflows/pages.yml`. Cada push a `main` compila el proyecto con Vite y publica el contenido de `dist` en la rama `gh-pages`.

## Características

- Portal corporativo responsive en español.
- Identidad visual AndesNova con paleta navy, dorado y teal.
- Grid de servicios con detalle modal.
- Chatbot simulado AndesNova IA+ con respuestas rápidas.
- Secciones de metodología, paquetes, coordinación interna, clientes ficticios, CTA y footer.

## Ejecutar localmente

```bash
npm install
npm run dev
```

## Scripts

```bash
npm run dev
npm run build
npm run build:github
npm run preview
```

Use `npm run build` para Vercel y `npm run build:github` para GitHub Pages.
