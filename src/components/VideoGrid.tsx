// components/VideoGrid.tsx
import React, { useState, useEffect, useRef, CSSProperties } from 'react';

type VideoItem = { video: string; label: string };

interface VideoGridProps {
  heading?: string;
  text?: string;
  items: VideoItem[];
  /**  
   * scale factor to multiply the largest video‐edge  
   * (e.g. 0.2→544px when max edge is 2720px)  
   */
  scale?: number;
}

const VideoGrid: React.FC<VideoGridProps> = ({
  heading,
  text,
  items,
  scale = 0.2,
}) => {
  const [maxEdge, setMaxEdge] = useState(0);
  const refs = useRef<(HTMLVideoElement | null)[]>([]);

  useEffect(() => {
    items.forEach((_, i) => {
      const vid = refs.current[i];
      if (!vid) return;
      const onMeta = () => {
        const edge = Math.max(vid.videoWidth, vid.videoHeight);
        setMaxEdge(prev => Math.max(prev, edge));
      };
      if (vid.readyState >= 1) onMeta();
      else vid.addEventListener('loadedmetadata', onMeta, { once: true });
    });
  }, [items]);

  const cellSize = maxEdge * scale;

  return (
    <div className="my-8">
      {heading && <h2 className="text-2xl font-semibold mb-2">{heading}</h2>}
      {text && <p className="mb-4 text-base text-gray-700">{text}</p>}

      <div
        className="grid gap-6 justify-items-center"
        style={
          {
            '--cell-size': `${cellSize}px`,
            gridTemplateColumns: 'repeat(auto-fit, minmax(var(--cell-size), 1fr))',
          } as CSSProperties
        }
      >
        {items.map((item, i) => (
          <div key={i} className="flex flex-col items-center">
            <div
              className="overflow-hidden rounded-xl border-2 border-slate-100 aspect-[2720/720]"
              style={{ width: 'var(--cell-size)' }}
            >
              <video
                ref={el => (refs.current[i] = el)}
                src={item.video}
                autoPlay
                controls
                muted
                loop
                className="w-full h-full object-cover"
              />
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