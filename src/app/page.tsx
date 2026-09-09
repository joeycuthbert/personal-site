import { listAll } from "@/lib/content";
import { Card } from "@/components/Card";
import Image from "next/image";




export default function Home() {
  const posts = listAll("notes").slice(0, 3);
  const projects = listAll("projects").slice(0, 3);

  return (
    <main>
       {/* Hero */}
      <section style={{ marginBottom: 28 }}>
        <div
          style={{
            padding: 20,
            borderRadius: 18,
            border: "1px solid rgba(255,255,255,0.12)",
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))",
          }}
        >
          <div
            style={{
              display: "flex",
              gap: 18,
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <div
              style={{
                width: 110,
                height: 110,
                borderRadius: 999,
                overflow: "hidden",
                border: "1px solid rgba(255,255,255,0.18)",
                background: "rgba(255,255,255,0.05)",
              }}
            >
              <Image
                src="/me.jpg"
                alt="Headshot"
                width={110}
                height={110}
                priority
              />
            </div>

            <div style={{ minWidth: 260, flex: 1 }}>
              <h1 style={{ margin: 0, fontSize: 34, letterSpacing: -0.5 }}>
                Joey Cuthbert
              </h1>
              <p style={{ margin: "10px 0 0", opacity: 0.85, lineHeight: 1.6 }}>
                I am a graduate student at Georgia Tech pursuing my Master's degree in Computational Science
                and Engineering. I graduated from Berry College (c/o 2025) where I studied Math and Computer Science while competing
                on the Mens' Lacrosse team. In my free time I enjoy playing chess, golf, hiking, and watching sports.
              </p>
              <p style={{ margin: "10px 0 0", opacity: 0.85, lineHeight: 1.6 }}>
                My interests include data science and machine learning as well as systems engineering. I plan to graduate from
                Georgia Tech in December 2026 and am looking for full-time opportunities starting in early 2027.
              </p>
              <p style={{ margin: "10px 0 0", opacity: 0.85, lineHeight: 1.6 }}>
                My experience includes research in machine learning while attending Berry College as an undergraduate, as well as with the
                National Air and Space Intelligence Center (NASIC) during the Sensors Directorate Internship Program over the summer of 2026.
                My graduate coursework spans Machine Learning, Systems Engineering, Modeling and Simulation, High Performance Computing, and Algorithms,
                with technical electives in Transportation Systems Modeling and Analysis, Machine Learning Systems, and Computer Vision.
              </p>
            </div>
          </div>
        </div>
      </section>
      {/* Featured photo */}
<section style={{ marginBottom: 28 }}>
  <div
    style={{
      borderRadius: 18,
      overflow: "hidden",
      border: "1px solid rgba(255,255,255,0.10)",
      boxShadow: "0 18px 50px rgba(0,0,0,0.45)",
    }}
  >
    <Image
      src="/skypond.jpeg"
      alt="Mountain lake"
      width={1600}
      height={700}
      priority
      style={{
        width: "100%",
        height: "auto",
        display: "block",
      }}
    />
  </div>
</section>

      {/* Two-column sections */}
      <section
        style={{
          display: "grid",
          gridTemplateColumns: "1fr",
          gap: 18,
        }}
      >
        {/* Projects */}
        <div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
            <h2 style={{ margin: "0 0 10px" }}>Recent projects</h2>
            <a href="/projects" className="subtle-link">(all)</a>

          </div>

          <div style={{ display: "grid", gap: 12 }}>
            {projects.map((p) => (
              <Card
                key={p.slug}
                title={p.frontmatter.title}
                href={`/projects/${p.slug}`}
                meta={p.frontmatter.date}
                description={p.frontmatter.summary}
              />
            ))}
            {projects.length === 0 ? (
              <div style={{ opacity: 0.75 }}>
                No projects yet. Add one in <code>content/projects</code>.
              </div>
            ) : null}
          </div>
        </div>

        {/* Blog */}
        <div style={{ marginTop: 18 }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
            <h2 style={{ margin: "0 0 10px" }}>Recent notes</h2>
            <a href="/notes" className="subtle-link">(all)</a>
          </div>

          <div style={{ display: "grid", gap: 12 }}>
            {posts.map((p) => (
              <Card
                key={p.slug}
                title={p.frontmatter.title}
                href={`/notes/${p.slug}`}
                meta={p.frontmatter.date}
                description={p.frontmatter.summary}
              />
            ))}
            {posts.length === 0 ? (
              <div style={{ opacity: 0.75 }}>
                No notes yet.
              </div>
            ) : null}
          </div>
        </div>
      </section>
    </main>
  );
}

