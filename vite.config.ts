import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";

// GitHub Pages serves from /Andes_Nova/; Vercel and Cloudflare serve from the domain root.
const isVercel = Boolean(process.env.VERCEL);

function siteFor(mode: string) {
  if (mode === "cloudflare") return { base: "/", siteUrl: "https://andesnova-web.oprbguitar.workers.dev/", outDir: "dist" };
  if (isVercel) return { base: "/", siteUrl: "https://www.andesnova.solutions/", outDir: "docs" };
  return { base: "/Andes_Nova/", siteUrl: "https://oprbguitar.github.io/Andes_Nova/", outDir: "docs" };
}

function seoFiles(siteUrl: string): Plugin {
  const lastmod = new Date().toISOString().slice(0, 10);

  return {
    name: "andesnova-seo-files",
    transformIndexHtml(html) {
      return html.replaceAll("__SITE_URL__", siteUrl);
    },
    generateBundle() {
      this.emitFile({
        type: "asset",
        fileName: "robots.txt",
        source: `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}sitemap.xml\n`,
      });
      this.emitFile({
        type: "asset",
        fileName: "sitemap.xml",
        source:
          `<?xml version="1.0" encoding="UTF-8"?>\n` +
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
          `  <url>\n    <loc>${siteUrl}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>1.0</priority>\n  </url>\n` +
          `</urlset>\n`,
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  const { base, siteUrl, outDir } = siteFor(mode);

  return {
    plugins: [react(), seoFiles(siteUrl)],
    base,
    build: {
      outDir,
    },
  };
});
