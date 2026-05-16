import React, {
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Canvas, useThree } from "@react-three/fiber";
import {
  Bounds,
  Html,
  OrbitControls,
  useBounds,
  useGLTF,
  useProgress,
} from "@react-three/drei";
import * as THREE from "three";
import { useTheme } from "../theme/ThemeContext";
import "../styles/cadViewer.css";

const MODEL_PATH = "/models/assembly.gltf";

/** Isometric-style viewing direction (used before Bounds fits the model). */
const ISO_DIR = new THREE.Vector3(1.15, 0.88, 1.08).normalize();

function ModelLoader() {
  const { progress } = useProgress();
  return (
    <Html center>
      <span className="cad-section__loading">{Math.round(progress)}%</span>
    </Html>
  );
}

/** Stores latest Bounds api for reset-from-outside behavior. */
function FitBridge({ fitApiRef }) {
  const api = useBounds();
  useEffect(() => {
    fitApiRef.current = () => api.refresh().reset();
    return () => {
      fitApiRef.current = null;
    };
  }, [api, fitApiRef]);
  return null;
}

/** Applies camera tilt once so “reset” restores a consistent isometric look. */
function IsoCameraBias() {
  const { camera } = useThree();
  useEffect(() => {
    const d = ISO_DIR.clone().multiplyScalar(1.4);
    camera.position.copy(d);
    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();
  }, [camera]);
  return null;
}

function StaticAssembly({ isDark }) {
  const { scene } = useGLTF(MODEL_PATH);

  const clone = useMemo(() => {
    const c = scene.clone(true);
    const baseHex = isDark ? "#bea6ff" : "#6b52c9";
    const emissiveHex = isDark ? "#6d4ad6" : "#2d2468";

    const mat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(baseHex),
      metalness: isDark ? 0.7 : 0.58,
      roughness: isDark ? 0.26 : 0.34,
      emissive: new THREE.Color(emissiveHex),
      emissiveIntensity: isDark ? 0.16 : 0.06,
      envMapIntensity: 1,
    });

    c.traverse((child) => {
      if (!child.isMesh) return;
      child.castShadow = true;
      child.receiveShadow = true;
      child.material = mat;
    });
    return { root: c, material: mat };
  }, [scene, isDark]);

  useEffect(
    () => () => clone.material.dispose(),
    [clone.material]
  );

  return <primitive object={clone.root} />;
}

function Scene({ isDark, fitApiRef }) {
  const fill = useMemo(() => new THREE.Color(isDark ? "#eef1fc" : "#ffffff"), [isDark]);
  const cool = useMemo(() => new THREE.Color(isDark ? "#b8aaf0" : "#6b52c9"), [isDark]);

  return (
    <>
      <IsoCameraBias />

      <ambientLight intensity={isDark ? 0.58 : 0.72} />
      <hemisphereLight intensity={isDark ? 0.52 : 0.45} color={fill} groundColor="#1a1540" />

      <directionalLight position={[5, 7, 4]} intensity={isDark ? 1.55 : 1.15} color={fill} castShadow />

      <directionalLight position={[-4, 2, -2]} intensity={isDark ? 0.45 : 0.38} color={cool} />

      <pointLight position={[2, 1.8, -1.8]} intensity={isDark ? 0.42 : 0.22} color={cool} />

      <Suspense fallback={<ModelLoader />}>
        <Bounds fit clip observe margin={1.34}>
          <FitBridge fitApiRef={fitApiRef} />
          <StaticAssembly isDark={isDark} />
        </Bounds>
      </Suspense>
    </>
  );
}

export default function CadViewer() {
  const fitApiRef = useRef(null);
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [showHint, setShowHint] = useState(true);

  const resetView = useCallback(() => {
    fitApiRef.current?.();
  }, []);

  useEffect(() => {
    const t = window.setTimeout(() => setShowHint(false), 8500);
    return () => window.clearTimeout(t);
  }, []);

  return (
    <section className="cad-section" aria-label="3D mechanical assembly preview">
      <header className="cad-section__header">
        <span className="cad-section__dot" aria-hidden="true" />
        <h2 className="cad-section__title">Assembly</h2>
        <button
          type="button"
          className="cad-section__reset"
          onClick={resetView}
          aria-label="Reset view"
        >
          Reset view
        </button>
      </header>

      <div className="cad-section__viewport">
        <Canvas
          shadows
          camera={{
            near: 0.02,
            far: 200,
            fov: 40,
            position: ISO_DIR.clone().multiplyScalar(4).toArray(),
          }}
          gl={{ antialias: true, alpha: true }}
          dpr={[1, Math.min(window.devicePixelRatio, 2)]}
        >
          <Scene isDark={isDark} fitApiRef={fitApiRef} />
          <OrbitControls
            enablePan={false}
            minPolarAngle={0.2}
            maxPolarAngle={Math.PI / 2}
            dampingFactor={0.08}
            enableDamping
            makeDefault
          />
        </Canvas>
        {showHint && (
          <p className="cad-section__hint" role="status">
            Drag — rotate · Scroll — zoom
          </p>
        )}
      </div>

      <p className="cad-section__message">
        Here&apos;s a little something I&apos;ve been working on — drag to orbit and take a closer look.
      </p>
    </section>
  );
}

useGLTF.preload(MODEL_PATH);
