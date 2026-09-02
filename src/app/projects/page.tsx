import { listAll } from "@/lib/content";
import { Card } from "@/components/Card";

export default function ProjectsIndex() {
  const projects = listAll("projects");

  return (
    <main>
      <h1 style={{ marginBottom: 16 }}>Projects</h1>

      <div style={{ display: "grid", gap: 12 }}>
        {projects.map((p) => (
          <Card
            key={p.slug}
            title={p.frontmatter.title}
            href={`/projects/${p.slug}`}
            description={p.frontmatter.summary}
          />
        ))}
        {projects.length === 0 ? (
          <div style={{ opacity: 0.75 }}>No projects yet.</div>
        ) : null}
      </div>
    </main>
  );
}
