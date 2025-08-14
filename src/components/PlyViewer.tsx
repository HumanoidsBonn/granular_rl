import React, { Suspense, useEffect, useMemo } from 'react';
import { Canvas, useLoader } from '@react-three/fiber';
import { PLYLoader } from 'three/examples/jsm/loaders/PLYLoader.js';
import { OrbitControls, PerspectiveCamera, Bounds } from '@react-three/drei';
import { ConvexGeometry } from 'three/examples/jsm/geometries/ConvexGeometry';
import { Delaunay } from 'd3-delaunay';
import * as THREE from 'three';

// Fallback while loading
const LoadingFallback: React.FC = () => (
  <mesh>
    <boxGeometry args={[1, 1, 1]} />
    <meshStandardMaterial color="grey" />
  </mesh>
);

// Render one PLY as points, convex-hull mesh, or heightmap surface
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
  const geometry = useLoader(PLYLoader, url);
  const hasColorAttr = !!geometry.attributes.color;

  // Decide which geometry to display:
  // 1) Heightmap surface via Delaunay on XY-plane using Z as height
  // 2) Convex-hull mesh
  // 3) Raw points
  const displayGeometry = useMemo<THREE.BufferGeometry>(() => {
    if (renderSurface) {
      // Build heightmap surface: triangulate on XY plane
      const positions = geometry.attributes.position.array as Float32Array;
      const pts2d: [number, number][] = [];
      for (let i = 0; i < positions.length; i += 3) {
        const x = positions[i];
        const y = positions[i + 1];
        // Z is height
        pts2d.push([x, y]);
      }
      // Triangulate based on XY coordinates
      const delaunay = Delaunay.from(pts2d);
      const indices = Array.from(delaunay.triangles);
      // Create new geometry with same attributes and computed indices
      const surfGeom = new THREE.BufferGeometry();
      surfGeom.setAttribute('position', geometry.attributes.position);
      if (hasColorAttr) surfGeom.setAttribute('color', geometry.attributes.color);
      surfGeom.setIndex(indices);
      return surfGeom;
    }
    if (renderMesh) {
      // Legacy convex hull mesh
      if (geometry.index) {
        return geometry;
      }
      const posArr = geometry.attributes.position.array as Float32Array;
      const pts: THREE.Vector3[] = [];
      for (let i = 0; i < posArr.length; i += 3) {
        pts.push(new THREE.Vector3(
          posArr[i], posArr[i + 1], posArr[i + 2]
        ));
      }
      return new ConvexGeometry(pts);
    }
    // Default: raw points
    return geometry;
  }, [geometry, renderMesh, renderSurface, hasColorAttr]);

  useEffect(() => {
    // Always recenter original and display geometries
    if (center) {
      geometry.computeBoundingBox();
      geometry.center();
      if (displayGeometry !== geometry) {
        displayGeometry.computeBoundingBox();
        displayGeometry.center();
      }
    }
    // Compute normals when using mesh or surface
    if (renderMesh || renderSurface) {
      displayGeometry.computeVertexNormals();
    }
  }, [geometry, displayGeometry, center, renderMesh, renderSurface]);

  // Render mesh or surface
  if (renderMesh || renderSurface) {
    return (
      <mesh geometry={displayGeometry}>
        <meshStandardMaterial
          vertexColors={useVertexColors && hasColorAttr}
          color={color}
          side={THREE.DoubleSide}
          flatShading={!hasColorAttr}
          transparent={true}
          opacity={0.6}      // tweak 0.0–1.0 as you like
          depthWrite={false} // so back-facing surfaces still render through
        />
      </mesh>
    );
  }

  // Render points
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

interface PlyViewerProps {
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
  width = '100%',
  height = '400px',
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
                url={url}
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
