// components/Citation.tsx
import Heading from "./Heading";
import { LuCopy, LuCopyCheck } from "react-icons/lu";
import React, { useEffect, useState } from "react";
import { useTextColors, hexToRgba } from "./ColorContext";
import { withPrefix } from "gatsby";

// same helpers as VideoGrid
const isExternalUrl = (p: string) => /^https?:\/\//i.test(p);
const toDotPath = (p: string) =>
  p.startsWith("./") ? p : p.startsWith("/") ? `.${p}` : `./${p}`;
const toPrefixedSrc = (p: string) =>
  isExternalUrl(p) ? p : withPrefix(toDotPath(p));

const Citation: React.FC = () => {
  const { textColor, linkColor } = useTextColors();
  const [bibtex, setBibtex] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const backgroundColor = hexToRgba(linkColor, 0.05);

  useEffect(() => {
    const url = toPrefixedSrc("./bibtex.txt"); // EXACTLY like your teaser pattern
    (async () => {
      try {
        const res = await fetch(url, { cache: "no-store" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const text = (await res.text()).trim();
        setBibtex(text);
      } catch (e: any) {
        console.error("Error loading BibTeX:", e);
        setError("Could not load citation.");
      }
    })();
  }, []);

  const copyToClipboard = () => {
    if (!bibtex) return;
    navigator.clipboard.writeText(bibtex).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    });
  };

  return (
    <div>
      <Heading>Citation</Heading>
      <div className="relative p-6 rounded-xl !my-0" style={{ backgroundColor }}>
        <button
          className="absolute top-0 right-0 text-2xl p-1 m-3"
          style={{ color: linkColor }}
          onClick={copyToClipboard}
          title="Copy to clipboard"
          aria-label="Copy citation"
        >
          {copied ? <LuCopyCheck /> : <LuCopy />}
        </button>

        <pre className="whitespace-pre-wrap" style={{ color: textColor }}>
          <code id="citation-bib">
            {bibtex || error || "Loading..."}
          </code>
        </pre>

        {/* Fallback link in case fetch hiccups */}
        {!bibtex && (
          <div className="mt-3">
            <a href={toPrefixedSrc("./bibtex.txt")} style={{ color: linkColor }} download>
              Download bibtex.txt
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default Citation;
