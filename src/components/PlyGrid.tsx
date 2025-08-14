import React from 'react';
import PlyViewer from './PlyViewer';

// Define a single PLY grid item, supporting multiple PLYs per cell
export type PlyItem = {
  urls: string[];            // one or more PLY URLs to render together
  label: string;             // caption under the viewer
  pointColors?: string[];    // matching array of CSS colors (defaults to ['steelblue', 'crimson', ...])
  useVertexColors?: boolean; // override per-vertex colors (default false)
  pointSize?: number;        // point size override (default 0.002)
  renderMesh?: boolean;      // whether to render as mesh instead of points (default false)
  renderSurface?: boolean;      // whether to render as mesh instead of points (default false)
};

interface PlyGridProps {
  heading?: string;
  text?: string;
  items: PlyItem[];
  /**
   * Cell size in pixels for width & height
   * Default: 300
   */
  cellSize?: number;
}

const PlyGrid: React.FC<PlyGridProps> = ({
  heading,
  text,
  items,
  cellSize = 300,
}) => {
  return (
    <div className="my-8">
      {heading && <h2 className="text-2xl font-semibold mb-2">{heading}</h2>}
      {text && <p className="mb-4 text-base text-gray-700">{text}</p>}

      <div
        className="grid gap-6 justify-items-center"
        style={{
          '--cell-size': `${cellSize}px`,
          gridTemplateColumns: 'repeat(auto-fit, minmax(var(--cell-size), 1fr))',
        } as React.CSSProperties}
      >
        {items.map((item, idx) => {
          // Prepare colors array: if not provided, set to default colors
          const colors = item.pointColors 
            ? item.pointColors 
            : item.urls.map((_, i) => i === 0 ? 'steelblue' : 'gray');
          return (
            <div key={idx} className="flex flex-col items-center">
              <div
                className="overflow-hidden rounded-xl border-2 border-slate-100"
                style={{ width: 'var(--cell-size)', height: 'var(--cell-size)' }}
              >
                <PlyViewer
                  urls={item.urls}
                  pointColors={colors}
                  useVertexColors={item.useVertexColors ?? false}
                  pointSize={item.pointSize ?? 0.002}
                  renderMesh={item.renderMesh ?? false}
                  renderSurface={item.renderSurface ?? false}
                  width="100%"
                  height="100%"
                />
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
