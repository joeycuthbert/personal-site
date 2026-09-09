export default function CV() {
  return (
    <main>
      <h1 style={{ marginBottom: 20 }}>Resume</h1>

      <div
        style={{
          border: "1px solid rgba(255,255,255,0.10)",
          borderRadius: 12,
          overflow: "hidden",
          marginBottom: 12,
        }}
      >
        <iframe
          src="/resume.pdf"
          title="Joey Cuthbert's resume"
          width="100%"
          height="900"
          style={{ display: "block", border: "none" }}
        />
      </div>

      <a href="/resume.pdf" target="_blank" rel="noreferrer" className="subtle-link">
        Open the resume in a new tab ↗
      </a>
    </main>
  );
}
