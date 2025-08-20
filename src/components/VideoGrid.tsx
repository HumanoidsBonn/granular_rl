// components/VideoGrid.tsx
import React, { useState, useEffect, useRef, CSSProperties } from "react";
import { withPrefix } from "gatsby";

type VideoItem = { video: string; label: string };

interface VideoGridProps {
  heading?: string;
  text?: string;
  items: VideoItem[];
  /** scale factor multiplied by the largest video edge (defaults to 0.2) */
  scale?: number;
}

/** Fallback max edge so cells have a visible width before metadata arrives */
const FALLBACK_EDGE = 1920;

/** Normalize to the same pattern as your teaser: "./videos/…" */
const toDotPath = (p: string) =>
  p.startsWith("./") ? p : p.startsWith("/") ? `.${p}` : `./${p}`;

const isExternalUrl = (p: string) => /^https?:\/\//i.test(p);

/** Build the final src the same way as your teaser snippet */
const toPrefixedSrc = (p: string) =>
  isExternalUrl(p) ? p : withPrefix(toDotPath(p));

const VideoGrid: React.FC<VideoGridProps> = ({
  heading,
  text,
  items,
  scale = 0.2,
}) => {
  const [maxEdge, setMaxEdge] = useState<number>(0);
  const refs = useRef<(HTMLVideoElement | null)[]>([]);

  useEffect(() => {
    setMaxEdge(0); // reset when items change
    items.forEach((_, i) => {
      const vid = refs.current[i];
      if (!vid) return;

      const onMeta = () => {
        const edge = Math.max(vid.videoWidth || 0, vid.videoHeight || 0);
        if (edge > 0) setMaxEdge((prev) => Math.max(prev, edge));
      };

      if (vid.readyState >= 1) onMeta();
      else vid.addEventListener("loadedmetadata", onMeta, { once: true });
    });
  }, [items]);

  const cellSize = (maxEdge || FALLBACK_EDGE) * scale;

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
          } as CSSProperties
        }
      >
        {items.map((item, i) => (
          <div key={`${item.label}-${item.video}`} className="flex flex-col items-center">
            <div
              className="overflow-hidden rounded-xl border-2 border-slate-100 aspect-[2720/720]"
              style={{ width: "var(--cell-size)" }}
            >
              <video
                ref={(el) => (refs.current[i] = el)}
                autoPlay
                muted
                loop
                controls
                playsInline
                preload="metadata"
                className="w-full h-full object-cover"
                aria-label={item.label}
              >
                <source src={toPrefixedSrc(item.video)} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
            <span className="mt-2 block text-center text-sm text-gray-600">
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VideoGrid;
