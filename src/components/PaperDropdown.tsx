// components/PaperDropdown.tsx
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { useTextColors } from "./ColorContext";

type Props = {
  arxivUrl?: string;
  pdfUrl?: string;
};

const isValid = (u?: string) => !!u && u !== "/" && u.trim() !== "";

const PaperDropdown: React.FC<Props> = ({ arxivUrl, pdfUrl }) => {
  const { linkColor } = useTextColors();
  const [isOpen, setIsOpen] = useState(false);
  const [menuPos, setMenuPos] = useState<{ top: number; left: number } | null>(
    null
  );
  const btnRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const items = [
    isValid(arxivUrl) ? { href: arxivUrl as string, label: "View on arXiv", isArxiv: true } : null,
    isValid(pdfUrl)   ? { href: pdfUrl as string,   label: "View PDF",      isArxiv: false } : null,
  ].filter(Boolean) as { href: string; label: string; isArxiv: boolean }[];

  const close = () => setIsOpen(false);
  const toggle = () => setIsOpen(v => !v);

  // Position the menu next to the button (viewport coords)
  const positionMenu = () => {
    if (!btnRef.current) return;
    const r = btnRef.current.getBoundingClientRect();
    setMenuPos({ top: r.bottom + 8, left: r.left }); // 8px gap below button
  };

  useLayoutEffect(() => {
    if (!isOpen) return;
    positionMenu();
    const onScrollOrResize = () => positionMenu();
    window.addEventListener("scroll", onScrollOrResize, true);
    window.addEventListener("resize", onScrollOrResize);
    return () => {
      window.removeEventListener("scroll", onScrollOrResize, true);
      window.removeEventListener("resize", onScrollOrResize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  // Close on outside click / ESC
  useEffect(() => {
    if (!isOpen) return;
    const onDocMouseDown = (e: MouseEvent) => {
      const t = e.target as Node;
      if (btnRef.current?.contains(t)) return;
      if (menuRef.current?.contains(t)) return;
      close();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("mousedown", onDocMouseDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocMouseDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [isOpen]);

  return (
    <>
      <div className="relative inline-block text-left mr-6">
        <button
          ref={btnRef}
          onClick={toggle}
          className="flex text-base items-center pl-5 pr-4 py-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors duration-300"
          style={{ color: linkColor }}
          aria-haspopup="true"
          aria-expanded={isOpen}
        >
          Paper {isOpen ? <IoIosArrowUp className="ml-2" /> : <IoIosArrowDown className="ml-2" />}
        </button>
      </div>

      {isOpen && items.length > 0 && typeof document !== "undefined" &&
        ReactDOM.createPortal(
          <div
            ref={menuRef}
            role="menu"
            aria-orientation="vertical"
            tabIndex={0}
            // Render ABOVE everything: fixed + very high z-index
            className="bg-white rounded-xl shadow-lg border"
            style={{
              position: "fixed",
              top: menuPos?.top ?? 0,
              left: menuPos?.left ?? 0,
              zIndex: 9999,
              minWidth: 160,
            }}
          >
            {items.map((it, idx) =>
              it.isArxiv ? (
                <a
                  key={`m-${idx}`}
                  href={it.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm whitespace-nowrap flex items-center rounded-t-xl pl-3 pr-1.5 py-2 hover:bg-gray-100 transition-colors duration-200"
                  style={{ color: linkColor }}
                  role="menuitem"
                  tabIndex={0}
                  onClick={close}
                >
                  <span className="mr-1">View on</span>
                  <svg className="w-12 h-5 me-2 fill-current" aria-hidden="true" viewBox="0 0 246.978 111.119">
                    <path d="M427.571,255.154c1.859,0,3.1,1.24,3.985,3.453..." fill="currentColor" />
                  </svg>
                </a>
              ) : (
                <a
                  key={`m-${idx}`}
                  href={it.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`text-sm block px-3 py-2 hover:bg-gray-100 transition-colors duration-200 ${items.length === 1 ? "rounded-xl" : "rounded-b-xl"}`}
                  style={{ color: linkColor }}
                  role="menuitem"
                  tabIndex={0}
                  onClick={close}
                >
                  View PDF
                </a>
              )
            )}
          </div>,
          document.body
        )}
    </>
  );
};

export default PaperDropdown;
