import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { glob } from "astro/loaders";
import { docsLoader } from "@astrojs/starlight/loaders";
import { docsSchema } from "@astrojs/starlight/schema";

// 1. Tu colección de Blog original (Intacta)
const blog = defineCollection({
  loader: glob({ base: "./src/content/blog", pattern: "**/*.{md,mdx}" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      pubDate: z.coerce.date(),
      updatedDate: z.coerce.date().optional(),
      heroImage: image().optional(),
      tags: z.array(z.string()).optional(),
      category: z.union([z.string(), z.array(z.string())]).optional(),
      draft: z.boolean().optional(),
    }),
});

// 2. Tu nueva colección de la Wiki
const docs = defineCollection({
  loader: docsLoader(),
  schema: docsSchema(),
});

// 3. Exportar AMBAS
export const collections = { blog, docs };
