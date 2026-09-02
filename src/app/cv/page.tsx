function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: 36 }}>
      <h2 style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", opacity: 0.5, marginBottom: 14 }}>
        {title}
      </h2>
      {children}
    </section>
  );
}

function Entry({
  title,
  subtitle,
  period,
  bullets,
}: {
  title: string;
  subtitle?: string;
  period?: string;
  bullets?: string[];
}) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", gap: 4 }}>
        <span style={{ fontWeight: 650, fontSize: 16 }}>{title}</span>
        {period && <span style={{ fontSize: 13, opacity: 0.55 }}>{period}</span>}
      </div>
      {subtitle && <div style={{ fontSize: 14, opacity: 0.7, marginTop: 2 }}>{subtitle}</div>}
      {bullets && bullets.length > 0 && (
        <ul style={{ margin: "8px 0 0", paddingLeft: 18, display: "flex", flexDirection: "column", gap: 4 }}>
          {bullets.map((b, i) => (
            <li key={i} style={{ fontSize: 14, opacity: 0.85, lineHeight: 1.5 }}>{b}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function CV() {
  return (
    <main style={{ maxWidth: 680 }}>
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          <h1 style={{ fontSize: 32, marginBottom: 6 }}>Joseph C. Cuthbert</h1>
          <a
            href="/resume.pdf"
            target="_blank"
            rel="noreferrer"
            className="social-pill"
            style={{ fontSize: 13, padding: "8px 14px" }}
          >
            View Resume ↗
          </a>
        </div>
        <div style={{ fontSize: 14, opacity: 0.65, display: "flex", flexWrap: "wrap", gap: "6px 16px" }}>
          <span>(615) 815-8577</span>
          <a href="mailto:joeycuthbert19@gmail.com" className="subtle-link">joeycuthbert19@gmail.com</a>
          <a href="https://www.linkedin.com/in/joey-cuthbert/" target="_blank" rel="noreferrer" className="subtle-link">LinkedIn</a>
        </div>
      </div>

      <Section title="Publications">
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 14, lineHeight: 1.6, opacity: 0.9 }}>
            Ye, X., Mayo, E., <strong>Cuthbert, J.</strong>, & Head, A.{" "}
            <em>Learning Team Synergy from Team Composition with a Siamese Transformer.</em>{" "}
            Proceedings of the 39th International Florida Artificial Intelligence Research Society Conference (FLAIRS-39), 2026.
          </div>
          <div style={{ marginTop: 6, fontSize: 13, opacity: 0.55 }}>
            Siamese transformer architecture that learns intra-team synergy from composition alone, outperforming MLP and non-Siamese baselines across NBA, League of Legends, Valorant, and synthetic datasets.
          </div>
        </div>
      </Section>

      <Section title="Education">
        <Entry
          title="Georgia Institute of Technology"
          subtitle="M.S. Computational Science and Engineering · Atlanta, Georgia"
          period="Aug 2025 – Dec 2026"
          bullets={[
            "Georgia Tech AI Safety Initiative",
            "Relevant coursework: Computational Data Analysis, Monte Carlo Methods, Modeling & Simulation, High Performance Computing, Algorithms, High Dimensional Data Analytics",
          ]}
        />
        <Entry
          title="Berry College"
          subtitle="B.S. Computer Science and Mathematics · Mount Berry, Georgia"
          period="Aug 2021 – May 2025"
          bullets={[
            "Cumulative GPA: 3.76/4.00 — Putnam Exam: 2",
            "NCAA Men's Lacrosse Team, Defensive Problem Solving Club, National College Athlete Honor Society",
          ]}
        />
      </Section>

      <Section title="Experience">
        <Entry
          title="Machine Learning Research Assistant"
          subtitle="Berry College Department of Computer Science · Mount Berry, Georgia"
          period="June 2023 – Jan 2025"
          bullets={[
            "Co-authored a peer-reviewed paper published at FLAIRS-39 (2026) investigating whether team synergy can be extracted from team composition alone for sports outcome prediction.",
            "Designed a two-branch Siamese Transformer: each player is treated as a token, a shared transformer encoder captures intra-team interactions via self-attention, and a coordinate-wise difference between team representations drives win-probability prediction.",
            "Evaluated across 6 datasets (NBA, LoL Pro, LoL Amateur, Valorant, Heroes10, Heroes20); the Siamese Transformer consistently outperformed MLP, non-Siamese transformer, and Siamese MLP baselines — reaching 63.3% accuracy on NBA and 96.8% on the synthetic Heroes10 benchmark.",
            "Extended the model with a parallel Siamese MLP branch for optional auxiliary features, achieving 94.9% accuracy on LoL Amateur and 97.2% on Valorant when auxiliary data was available.",
          ]}
        />
        <Entry
          title="Data and AI Intern"
          subtitle="Premise Health · Nashville, Tennessee"
          period="May 2024 – Aug 2024"
          bullets={[
            "Developed a predictive model for visit volumes across hundreds of the company's health centers; integrated Databricks NLP capabilities to allow no-code users to query forecasts via generated SQL.",
            "Documented a 12-week assessment of the company's new AI infrastructure to identify where ML could have the most impact and what tooling a large-scale ML project would require.",
          ]}
        />
        <Entry
          title="Computer Science Teaching Assistant"
          subtitle="Berry College Department of Computer Science · Mount Berry, Georgia"
          period="Aug 2023 – Dec 2023"
          bullets={[
            "Provided guidance and demonstrations in CSC 120, an introductory CS course, supporting students through lectures and lab sessions.",
            "Delivered lectures and ran lab sessions independently during the professor's absence, ensuring continuity of the curriculum.",
          ]}
        />
      </Section>

      <Section title="Projects">
        <Entry
          title="Mechanistic Interpretability Research"
          subtitle="Independent Research"
          period="Jan 2025 – present"
          bullets={[
            "Used TransformerLens to investigate how GPT-2 forms acronyms using attention and MLP circuits; ran activation patching experiments to isolate components responsible for token prediction behavior.",
            "Designed a corruption-based evaluation framework to analyze how attention heads process capitalized context tokens and their influence on acronym completion.",
            "Gained hands-on experience with transformer internals, interpretability tooling, and experimental reproducibility.",
          ]}
        />
        <Entry
          title="Siamese Transformer for Sports Outcome Prediction"
          subtitle="Berry College · Published at FLAIRS-39"
          period="June 2023 – Jan 2025"
          bullets={[
            "See Publications section. Full architecture, datasets, and results described in the co-authored paper.",
          ]}
        />
        <Entry
          title="Simulated Annealing for Minimum Vertex Cover"
          subtitle="Georgia Tech · CSE 6140 Course Project"
          period="Mar 2026 – Apr 2026"
          bullets={[
            "Designed and implemented a hybrid NuMVC / simulated-annealing local search algorithm for the Minimum Vertex Cover problem, combining edge-weighting, conflict-change tracking, and an adaptive cooling schedule with Metropolis-criterion acceptance.",
            "Benchmarked across 20 random seeds on large real-world graphs (1,000+ vertices): matched the best-known cover size on every run of one benchmark in under 0.05s, and landed within 0.7% of best-known on a second, harder benchmark while converging to within 1% of optimal in under 25s across all seeds.",
          ]}
        />
        <Entry
          title="Go Applet"
          period="Aug 2023 – present"
          bullets={[
            "Originally built in Java: implemented capture detection via recursive liberty checking, ko rule enforcement, suicide prevention, and territory scoring via flood-fill (Japanese rules).",
            "Translated to JavaScript with an HTML Canvas front-end; live demo embedded on this site.",
          ]}
        />
      </Section>

      <Section title="Skills">
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {["Python", "Java", "JavaScript", "TypeScript", "R", "SQL", "HTML/CSS", "PyTorch", "TransformerLens", "Databricks", "NumPy", "Pandas", "LaTeX"].map((s) => (
            <span
              key={s}
              style={{
                fontSize: 13,
                padding: "4px 10px",
                borderRadius: 999,
                border: "1px solid rgba(255,255,255,0.12)",
                background: "rgba(255,255,255,0.04)",
              }}
            >
              {s}
            </span>
          ))}
        </div>
      </Section>

      <Section title="Interests">
        <p style={{ fontSize: 14, opacity: 0.85, margin: 0 }}>
          Chess, Golf, Skiing, Hiking, Guitar, Classic Novels, 1990s Rock
        </p>
      </Section>
    </main>
  );
}
