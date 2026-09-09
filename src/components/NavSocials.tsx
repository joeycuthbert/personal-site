"use client";

import { useEffect, useRef } from "react";

export function NavSocials() {
  const ref = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && ref.current.open && !ref.current.contains(e.target as Node)) {
        ref.current.open = false;
      }
    }
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  return (
    <details ref={ref} className="nav-social" style={{ position: "relative" }}>
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
  );
}
