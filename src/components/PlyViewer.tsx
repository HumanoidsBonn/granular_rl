// components/PlyViewer.tsx
import React, { Suspense, useEffect, useMemo } from "react";
import { withPrefix } from "gatsby";
import { Canvas, useLoader } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera, Bounds } from "@react-three/drei";
import { PLYLoader } from "three/examples/jsm/loaders/PLYLoader.js";
import { ConvexGeometry } from "three/examples/jsm/geometries/ConvexGeometry.js";
import { Delaunay } from "d3-delaunay";
import * as THREE from "three";

// Simple loading fallback rendered inside the Canvas
const LoadingFallback: React.FC = () => (
  <mesh>
    <boxGeometry args={[1, 1, 1]} />
    <meshStandardMaterial color="gray" />
  </mesh>
);

// ——— URL helpers: mirror your teaser behavior ———
const isExternal = (p: string) => /^https?:\/\//i.test(p);
const normalize = (p: string) =>
  p.startsWith("./") ? p : p.startsWith("/") ? `.${p}` : `./${p}`;
const resolveUrl = (p: string) => (isExternal(p) ? p : withPrefix(normalize(p)));
// ————————————————————————————————————————————————

interface PlyObjectProps {
  url: string;
  color: string;
  useVertexColors: boolean;
  pointSize: number;
  renderMesh?: boolean;
  renderSurface?: boolean;
  center?: boolean;
}

const PlyObject: React.FC<PlyObjectProps> = ({
  url,
  color,
  useVertexColors,
  pointSize,
  renderMesh = false,
  renderSurface = false,
  center = true,
}) => {
  // Final URL that works with Gatsby pathPrefix (GH Pages)
  const finalUrl = useMemo(() => resolveUrl(url), [url]);

  // Load the geometry from PLY
  const geometry = useLoader(PLYLoader, finalUrl) as THREE.BufferGeometry;
  const hasColorAttr = !!geometry.attributes.color;

  // Choose what to render: raw points, convex mesh, or triangulated surface
  const displayGeometry = useMemo<THREE.BufferGeometry>(() => {
    if (renderSurface) {
      // Triangulate XY (Z as height) via Delaunay
      const pos = geometry.attributes.position.array as Float32Array;
      const pts2d: [number, number][] = [];
      for (let i = 0; i < pos.length; i += 3) pts2d.push([pos[i], pos[i + 1]]);
      const tri = Delaunay.from(pts2d).triangles;
      const indices = new Uint32Array(tri);
      const surf = new THREE.BufferGeometry();
      // reuse attributes to avoid copying big buffers
      surf.setAttribute("position", geometry.attributes.position);
      if (hasColorAttr) surf.setAttribute("color", geometry.attributes.color);
      surf.setIndex(new THREE.BufferAttribute(indices, 1));
      return surf;
    }

    if (renderMesh) {
      // If the PLY already has faces, use them; otherwise build a convex hull
      if (geometry.index) return geometry;
      const pos = geometry.attributes.position.array as Float32Array;
      const pts: THREE.Vector3[] = [];
      for (let i = 0; i < pos.length; i += 3) {
        pts.push(new THREE.Vector3(pos[i], pos[i + 1], pos[i + 2]));
      }
      return new ConvexGeometry(pts);
    }

    // Default: points
    return geometry;
  }, [geometry, renderMesh, renderSurface, hasColorAttr]);

  // Center and ensure normals when needed
  useEffect(() => {
    if (center) {
      geometry.computeBoundingBox();
      geometry.center();
      if (displayGeometry !== geometry) {
        displayGeometry.computeBoundingBox();
        displayGeometry.center();
      }
    }
    if (renderMesh || renderSurface) {
      displayGeometry.computeVertexNormals();
    }
  }, [geometry, displayGeometry, center, renderMesh, renderSurface]);

  // Mesh/surface rendering
  if (renderMesh || renderSurface) {
    return (
      <mesh geometry={displayGeometry}>
        <meshStandardMaterial
          vertexColors={useVertexColors && hasColorAttr}
          color={color}
          side={THREE.DoubleSide}
          flatShading={!hasColorAttr}
          transparent
          opacity={0.6}
          depthWrite={false}
        />
      </mesh>
    );
  }

  // Point rendering
  return (
    <points geometry={geometry}>
      <pointsMaterial
        size={pointSize}
        sizeAttenuation
        vertexColors={useVertexColors && hasColorAttr}
        color={color}
      />
    </points>
  );
};

export interface PlyViewerProps {
  urls: string[];
  pointColors: string[];
  useVertexColors?: boolean;
  pointSize?: number;
  renderMesh?: boolean;
  renderSurface?: boolean;
  width?: string;
  height?: string;
  center?: boolean;
}

const PlyViewer: React.FC<PlyViewerProps> = ({
  urls,
  pointColors,
  useVertexColors = true,
  pointSize = 0.0015,
  renderMesh = false,
  renderSurface = false,
  width = "100%",
  height = "400px",
  center = true,
}) => {
  if (!urls.length || urls.length !== pointColors.length) return null;

  return (
    <div style={{ width, height }}>
      <Canvas className="border-2 border-slate-100 rounded-xl">
        <PerspectiveCamera makeDefault position={[0, 0, 5]} />
        <ambientLight intensity={0.7} />
        <pointLight position={[10, 10, 10]} intensity={1} />

        <Suspense fallback={<LoadingFallback />}>
          <Bounds fit clip margin={0.1}>
            {urls.map((url, i) => (
              <PlyObject
                key={`${url}-${i}`}
                url={url} // e.g., "./models/foo.ply" (placed under /static/models)
                color={pointColors[i]}
                useVertexColors={useVertexColors}
                pointSize={pointSize}
                renderMesh={renderMesh}
                renderSurface={renderSurface}
                center={center}
              />
            ))}
          </Bounds>
        </Suspense>

        <OrbitControls enablePan enableZoom enableRotate autoRotate />
      </Canvas>
    </div>
  );
};

export default PlyViewer;