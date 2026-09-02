import fs from "fs";
import path from "path";
import matter from "gray-matter";

export type ContentType = "notes" | "projects";

export type ContentFrontmatter = {
  title: string;
  date: string;        // ISO-ish string like "2025-12-14"
  summary?: string;
  tags?: string[];
  draft?: boolean;
};

export type ContentItem = {
  slug: string;
  type: ContentType;
  frontmatter: ContentFrontmatter;
  content: string;     // raw MDX
};

function contentDir(type: ContentType) {
  return path.join(process.cwd(), "content", type);
}

export function listSlugs(type: ContentType): string[] {
  const dir = contentDir(type);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => f.replace(/\.mdx$/, ""));
}

export function getBySlug(type: ContentType, slug: string): ContentItem {
  const filePath = path.join(contentDir(type), `${slug}.mdx`);
  const raw = fs.readFileSync(filePath, "utf8");
  const parsed = matter(raw);

  // Minimal validation with sensible defaults
  const fm = parsed.data as Partial<ContentFrontmatter>;
  const frontmatter: ContentFrontmatter = {
    title: fm.title ?? slug,
    date: fm.date ?? new Date(0).toISOString().slice(0, 10),
    summary: fm.summary ?? "",
    tags: Array.isArray(fm.tags) ? fm.tags : [],
    draft: Boolean(fm.draft),
  };

  return {
    slug,
    type,
    frontmatter,
    content: parsed.content,
  };
}

export type Heading = { level: number; text: string; id: string };

export function extractHeadings(content: string): Heading[] {
  const headings: Heading[] = [];
  const seen: Record<string, number> = {};
  let inCode = false;

  for (const line of content.split("\n")) {
    if (line.trimStart().startsWith("```")) { inCode = !inCode; continue; }
    if (inCode) continue;

    const m = line.match(/^(#{2,3})\s+(.+)$/);
    if (!m) continue;

    const text = m[2].replace(/\*+/g, "").trim();
    let id = text.toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-");

    // Match rehype-slug/github-slugger duplicate handling
    if (seen.hasOwnProperty(id)) {
      seen[id]++;
      id = `${id}-${seen[id]}`;
    } else {
      seen[id] = 0;
    }

    headings.push({ level: m[1].length, text, id });
  }
  return headings;
}

export function listAll(type: ContentType): ContentItem[] {
  const items = listSlugs(type).map((slug) => getBySlug(type, slug));

  // Hide drafts in production
  const filtered =
    process.env.NODE_ENV === "production"
      ? items.filter((i) => !i.frontmatter.draft)
      : items;

  // Sort newest first by date
  filtered.sort((a, b) => (a.frontmatter.date < b.frontmatter.date ? 1 : -1));
  return filtered;
}
