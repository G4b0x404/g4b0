// @ts-check

import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";

import remarkDirective from "remark-directive";/* Handle directives */
import remarkMath from "remark-math";
import remarkSectionize from "remark-sectionize";
import { remarkReadingTime } from "./src/plugins/remark-reading-time.mjs";
import remarkSpoiler from "./src/plugins/remark-spoiler.js";

// @ts-ignore
import rehypeCodeBlock from "./src/plugins/rehype-code-block.mjs";
// @ts-ignore
import shikiCodeMetadata from "./src/plugins/shiki-code-metadata.mjs";
import rehypeCodeTitles from "rehype-code-titles";
// @ts-ignore
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeSlug from "rehype-slug";
import rehypeKatex from "rehype-katex";
import rehypePangu from "./src/plugins/rehype-pangu.mjs";

import { asideAutoImport, astroAsides } from "./src/utils/astro-aside";
import AutoImport from "astro-auto-import";

import react from "@astrojs/react";

import expressiveCode from "astro-expressive-code";

import pagefind from "astro-pagefind";

import metaTags from "astro-meta-tags";

import devtoolBreakpoints from "astro-devtool-breakpoints";

import path from "path";
import { fileURLToPath } from "url";
import { config as loadEnv } from "dotenv";
import starlight from "@astrojs/starlight";
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load environment variables from .env file
loadEnv();

// https://astro.build/config
export default defineConfig({
  site: process.env.SITE_URL || "https://sh-blog-next.vercel.app",
  integrations: [AutoImport({
    imports: [asideAutoImport],
  }), astroAsides(), expressiveCode(), mdx(), sitemap({
    filter: (page) =>
      !page.includes("/categories/") && !page.includes("/tags/"),
  }), react(), pagefind(), metaTags(), devtoolBreakpoints(), starlight({
  title: 'G4b0 Wiki',
  description: 'Wiki técnica de Ciberseguridad y Red Team.',
  tagline: 'Telecommunications Engineer | Cybersecurity Enthusiast',

  social:  [
	 { icon: 'github', label: 'Github', href: 'https://github.com/G4b0x404' },
   { icon: 'linkedin', label: 'Linkedin', href: 'https://www.linkedin.com/in/pgarcia-ramos' },
	
  ],

  sidebar: [
    {
      label: '🚀 Panel de Control',
      link: '/arsenal', 
    },
    {
      label: '⚡ Cheat Sheets',
      autogenerate: { directory: 'cheatsheets' },
    },
    {
      label: '🧠 Conceptos Core',
      autogenerate: { directory: 'conceptos' },
    },
    {
      label: '🐍 Exploits y Payloads',
      autogenerate: { directory: 'exploits' },
    },
    {
      label: '⚙️ Pruebas de Concepto',
      collapsed: true, // Lo dejamos cerrado por defecto para mantener limpio el menú
      autogenerate: { directory: 'PoC' },
    },
  ]
})],

  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        "@shConfig": path.resolve(__dirname, "./shblog.config.ts"),
        "@components": path.resolve(__dirname, "./src/components"),
        "@ui": path.resolve(__dirname, "./src/components/ui"),
        "@consts": path.resolve(__dirname, "./src/consts.ts"),
        "@lib": path.resolve(__dirname, "./src/lib"),
      },
    },
    optimizeDeps: {
      include: ["astro/toolbar"],
    },
  },

  experimental: {
    svgo: true,
    // rustCompiler: true,    // 啟用 Rust 編譯器以提升構建性能（需要安裝 @astrojs/compiler-rs 包）
  },

  markdown: {
    shikiConfig: {
      // 添加 Shiki transformer 來處理代碼區塊的 metadata
      transformers: [shikiCodeMetadata()],
    },
    remarkPlugins: [
      remarkMath,
      remarkReadingTime,
      // remarkGithubAdmonitionsToDirectives,
      remarkDirective,
      remarkSectionize,
      remarkSpoiler,
    ],
    rehypePlugins: [
      rehypeKatex,
      rehypeSlug,
      [
        rehypeAutolinkHeadings,
        {
          behavior: "prepend",
          properties: {
            className: ["anchor"],
          },
          content: {
            type: "element",
            tagName: "span",
            properties: {
              className: ["anchor-icon"],
              "data-pagefind-ignore": true,
            },
            children: [
              {
                type: "text",
                value: "#",
              },
            ],
          },
        },
      ],
      rehypeCodeTitles,
      rehypeCodeBlock,
      rehypePangu,
    ],
  },
});