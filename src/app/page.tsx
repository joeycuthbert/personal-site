import { listAll } from "@/lib/content";
import { Card } from "@/components/Card";
import Image from "next/image";




export default function Home() {
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
                I'm a Master's student in Computational Science and Engineering at Georgia Tech,
                focused on machine learning, systems engineering, and modeling and simulation. 
              </p>
              <p style={{ margin: "10px 0 0", opacity: 0.85, lineHeight: 1.6 }}>
                This past summer I worked with the National Air and Space Intelligence Center (NASIC) through the Sensors Directorate
                Internship Program, where I studied the robustness of CNNs against noise attacks on synthetic aperture radar images.
                Before Georgia Tech, I studied Math and Computer Science at Berry College, graduating in 2025. 
                My undergraduate research focused on feature-less machine learning for game predictions, and I also competed on the NCAA 
               Men's Lacrosse team. 
              </p>
              <p style={{ margin: "10px 0 0", opacity: 0.85, lineHeight: 1.6 }}>
                I graduate in December 2026 and am looking for full-time roles starting in early 2027. Outside of school,
                I enjoy golfing, chess, hiking, and skiing. 
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

      {/* Projects */}
      <section>
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
      </section>
    </main>
  );
}

