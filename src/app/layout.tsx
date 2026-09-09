import type { Metadata } from "next";
import "katex/dist/katex.min.css";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import { NavSocials } from "@/components/NavSocials";

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
          <a href="/cv">Resume</a>
          <NavSocials />
        </header>

        {children}

        <footer style={{ marginTop: 48, opacity: 0.6, fontSize: 14 }}>
          © {new Date().getFullYear()}
        </footer>

        <Analytics />
      </body>
    </html>
  );
}
