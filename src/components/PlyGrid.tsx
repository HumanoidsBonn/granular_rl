// components/PlyGrid.tsx
import React, { useEffect, useState } from "react";
import PlyViewer from "./PlyViewer";

export type PlyItem = {
  urls: string[];            // one or more PLY URLs (e.g., "./models/foo.ply")
  label: string;             // caption under the viewer
  pointColors?: string[];    // optional colors per URL
  useVertexColors?: boolean; // default false
  pointSize?: number;        // default 0.002
  renderMesh?: boolean;      // default false
  renderSurface?: boolean;   // default false
};

interface PlyGridProps {
  heading?: string;
  text?: string;
  items: PlyItem[];
  /** Cell size in pixels for width & height (default: 300) */
  cellSize?: number;
}

const PlyGrid: React.FC<PlyGridProps> = ({
  heading,
  text,
  items,
  cellSize = 300,
}) => {
  // Guard against SSR since three/fiber needs the browser
  const [isClient, setIsClient] = useState(false);
  useEffect(() => setIsClient(true), []);

  return (
    <div className="my-8">
      {heading && <h2 className="text-2xl font-semibold mb-2">{heading}</h2>}
      {text && <p className="mb-4 text-base text-gray-700">{text}</p>}

      <div
        className="grid gap-6 justify-items-center"
        style={
          {
            "--cell-size": `${cellSize}px`,
            gridTemplateColumns: "repeat(auto-fit, minmax(var(--cell-size), 1fr))",
          } as React.CSSProperties
        }
      >
        {items.map((item, idx) => {
          const colors =
            item.pointColors ?? item.urls.map((_, i) => (i === 0 ? "steelblue" : "gray"));

          return (
            <div key={`${item.label}-${idx}`} className="flex flex-col items-center">
              <div
                className="overflow-hidden rounded-xl border-2 border-slate-100"
                style={{ width: "var(--cell-size)", height: "var(--cell-size)" }}
              >
                {isClient ? (
                  <PlyViewer
                    urls={item.urls}                 // pass through; PlyViewer resolves prefixes
                    pointColors={colors}
                    useVertexColors={item.useVertexColors ?? false}
                    pointSize={item.pointSize ?? 0.002}
                    renderMesh={item.renderMesh ?? false}
                    renderSurface={item.renderSurface ?? false}
                    width="100%"
                    height="100%"
                  />
                ) : null}
              </div>
              <span className="mt-2 block text-center text-sm text-gray-600">
                {item.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PlyGrid;