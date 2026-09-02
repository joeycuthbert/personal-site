import { getBySlug, listSlugs, extractHeadings } from "@/lib/content";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";

export function generateStaticParams() {
  return listSlugs("projects").map((slug) => ({ slug }));
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getBySlug("projects", slug);
  const headings = extractHeadings(project.content);

  return (
    <main>
      <a href="/projects" className="subtle-link" style={{ fontSize: 14, display: "inline-block", marginBottom: 20 }}>
        ← Projects
      </a>
      <h1 style={{ marginBottom: 20 }}>{project.frontmatter.title}</h1>

      {headings.length > 0 && (
        <nav
          style={{
            marginBottom: 32,
            padding: "14px 18px",
            borderRadius: 12,
            border: "1px solid rgba(255,255,255,0.10)",
            background: "rgba(255,255,255,0.03)",
            fontSize: 14,
          }}
        >
          <div style={{ fontWeight: 600, marginBottom: 8, opacity: 0.6, letterSpacing: "0.05em", fontSize: 12, textTransform: "uppercase" }}>
            Contents
          </div>
          <ol style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 4 }}>
            {headings.map((h) => (
              <li key={h.id} style={{ paddingLeft: h.level === 3 ? 16 : 0 }}>
                <a href={`#${h.id}`} className="subtle-link" style={{ opacity: 0.85 }}>
                  {h.text}
                </a>
              </li>
            ))}
          </ol>
        </nav>
      )}

      <article style={{ lineHeight: 1.65 }}>
        <MDXRemote
          source={project.content}
          options={{
            mdxOptions: {
              remarkPlugins: [remarkGfm, remarkMath],
              rehypePlugins: [
                rehypeSlug,
                rehypeKatex,
                [rehypePrettyCode, { theme: "github-dark" }],
              ],
            },
          }}
        />
      </article>
    </main>
  );
}
