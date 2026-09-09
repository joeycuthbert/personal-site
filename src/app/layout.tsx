import type { Metadata } from "next";
import "katex/dist/katex.min.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "Joey Cuthbert",
  description: "Projects and notes",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        style={{
          maxWidth: 920,
          margin: "40px auto",
          padding: "0 18px",
          backgroundColor: "#0b0f14",
          color: "rgba(255,255,255,0.92)",
          fontFamily:
            "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial",
        }}
      >
        <header style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
          <a href="/" style={{ fontWeight: 700 }}>
            Home
          </a>
          <a href="/projects">Projects</a>
          <a href="/notes">Notes</a>
          <a href="/cv">Resume</a>
          <details className="nav-social" style={{ position: "relative" }}>
            <summary>Socials</summary>
            <div className="nav-social-panel">
              <a
                href="https://www.linkedin.com/in/joey-cuthbert/"
                target="_blank"
                rel="noreferrer"
                className="social-pill"
              >
                LinkedIn
              </a>
              <a
                href="https://www.chess.com/member/joeycuthbert19"
                target="_blank"
                rel="noreferrer"
                className="social-pill"
              >
                Chess.com
              </a>
              <a href="mailto:joeycuthbert19@gmail.com" className="social-pill">
                Email
              </a>
            </div>
          </details>
        </header>

        {children}

        <footer style={{ marginTop: 48, opacity: 0.6, fontSize: 14 }}>
          © {new Date().getFullYear()}
        </footer>
      </body>
    </html>
  );
}
