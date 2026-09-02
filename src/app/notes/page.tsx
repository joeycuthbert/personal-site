import { listAll } from "@/lib/content";
import { Card } from "@/components/Card";

export default function NotesIndex() {
  const notes = listAll("notes");

  return (
    <main>
      <h1 style={{ marginBottom: 16 }}>Notes</h1>

      <div style={{ display: "grid", gap: 12 }}>
        {notes.map((n) => (
          <Card
            key={n.slug}
            title={n.frontmatter.title}
            href={`/notes/${n.slug}`}
            meta={n.frontmatter.date}
            description={n.frontmatter.summary}
          />
        ))}
        {notes.length === 0 ? (
          <div style={{ opacity: 0.75 }}>No notes yet.</div>
        ) : null}
      </div>
    </main>
  );
}
