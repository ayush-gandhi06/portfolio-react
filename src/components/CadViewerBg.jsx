/**
 * CadViewerBg.jsx — Ghost 3D robot background
 *
 * Design decisions:
 *  - Camera is FIXED. Never moves. Eliminates wide-arc orbiting.
 *  - Model is centered using its own bounding box (pivot = its own center).
 *  - Model is auto-scaled to always fit in frame, regardless of GLTF units.
 *  - Auto-rotates its Y axis slowly using useFrame (no OrbitControls).
 *  - Mouse adds a very subtle X/Z tilt on the model group (±8° max, very slow lerp).
 *  - Fades out as user scrolls past the About section.
 */
import React, { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, useProgress, Html } from "@react-three/drei";
import * as THREE from "three";
import { useTheme } from "../theme/ThemeContext";
import "../styles/cadViewerBg.css";

const MODEL_PATH = "/models/assembly.gltf";

// ── Loading indicator ───────────────────────────────────────────
function ModelLoader() {
  const { progress } = useProgress();
  return (
    <Html center>
      <span style={{ fontSize: "0.55rem", color: "rgba(140,130,220,0.55)", letterSpacing: "0.18em" }}>
        {Math.round(progress)}%
      </span>
    </Html>
  );
}

// ── Ghost model — centered + auto-scaled ────────────────────────
function GhostAssembly({ isDark }) {
  const { scene } = useGLTF(MODEL_PATH);

  const cloneInfo = useMemo(() => {
    const root = scene.clone(true);

    // Build a ghost material
    const mat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(isDark ? "#a89cff" : "#7b6ec4"),
      metalness: 0.25,
      roughness: 0.65,
      transparent: true,
      opacity: 0.5,
    });
    root.traverse((child) => {
      if (child.isMesh) child.material = mat;
    });

    // ── Center the model using its own bounding box ──────────────
    // Reset any existing transforms first so bounding box is accurate
    root.position.set(0, 0, 0);
    root.rotation.set(0, 0, 0);
    root.scale.set(1, 1, 1);
    root.updateMatrixWorld(true);

    const box = new THREE.Box3().setFromObject(root);
    const center = new THREE.Vector3();
    const size = new THREE.Vector3();
    box.getCenter(center);
    box.getSize(size);

    // Shift so the model's geometric center sits at the origin
    root.position.sub(center);

    // ── Auto-scale so the longest dimension = 2.4 units ─────────
    const maxDim = Math.max(size.x, size.y, size.z);
    const targetSize = 2.4;
    const scaleFactor = maxDim > 0 ? targetSize / maxDim : 1;
    root.scale.setScalar(scaleFactor);

    return { root, material: mat };
  }, [scene, isDark]);

  useEffect(() => () => cloneInfo.material.dispose(), [cloneInfo.material]);
  return <primitive object={cloneInfo.root} />;
}

// ── Scene wrapper — self-rotating, cursor-tilting ───────────────
function GhostScene({ isDark, mouseOffset }) {
  const groupRef = useRef();
  const autoAngle = useRef(0);
  const fill = useMemo(() => new THREE.Color(isDark ? "#dde2ff" : "#ffffff"), [isDark]);

  useFrame((_, delta) => {
    if (!groupRef.current) return;

    // Slow continuous Y-axis rotation (the robot spins on its own axis)
    autoAngle.current += delta * 0.22; // ~13°/s — calm, observational pace

    groupRef.current.rotation.y = autoAngle.current;

    // Very subtle cursor tilt — max ±8° (0.14 rad), applied slowly via lerp upstream
    groupRef.current.rotation.x = mouseOffset.y * 0.14;
    groupRef.current.rotation.z = mouseOffset.x * -0.07;
  });

  return (
    <>
      <ambientLight intensity={isDark ? 0.5 : 0.65} />
      <hemisphereLight intensity={0.4} color={fill} groundColor="#100e20" />
      <directionalLight position={[4, 6, 3]} intensity={isDark ? 1.1 : 0.85} color={fill} />
      <directionalLight position={[-4, 2, -2]} intensity={0.3} color={fill} />

      <Suspense fallback={<ModelLoader />}>
        {/*
          Outer group: static 25° upward tilt (rotation.x = -0.44 rad).
          This makes the arm sweep upward as it rotates — the "upright" look.
          Applied AFTER model is centered, so centering is unaffected.
          Inner group (groupRef): handles Y-axis auto-rotation + mouse tilt.
        */}
        <group rotation={[-0.44, 0, 0]}>
          <group ref={groupRef}>
            <GhostAssembly isDark={isDark} />
          </group>
        </group>
      </Suspense>
    </>
  );
}

// ── Main export ─────────────────────────────────────────────────
export default function CadViewerBg() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [opacity, setOpacity] = useState(1);

  // Smoothly lerped mouse position (-1 to +1 on each axis)
  const targetRef = useRef({ x: 0, y: 0 });
  const currentRef = useRef({ x: 0, y: 0 });
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });
  const rafRef = useRef(null);

  useEffect(() => {
    const onMove = (e) => {
      targetRef.current = {
        x: (e.clientX - window.innerWidth / 2) / (window.innerWidth / 2),
        y: (e.clientY - window.innerHeight / 2) / (window.innerHeight / 2),
      };
    };
    window.addEventListener("mousemove", onMove);

    const lerp = (a, b, t) => a + (b - a) * t;
    const LERP_FACTOR = 0.025; // very slow — feels like the robot is heavy

    const tick = () => {
      currentRef.current.x = lerp(currentRef.current.x, targetRef.current.x, LERP_FACTOR);
      currentRef.current.y = lerp(currentRef.current.y, targetRef.current.y, LERP_FACTOR);
      setMouseOffset({ ...currentRef.current });
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMove);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // Fade out as the about section scrolls away
  useEffect(() => {
    const section = document.getElementById("about");
    if (!section) return;
    const onScroll = () => {
      const rect = section.getBoundingClientRect();
      const h = section.offsetHeight;
      const scrolled = -rect.top;
      const fadeStart = h * 0.45;
      const fadeEnd = h * 0.82;
      if (scrolled < fadeStart) setOpacity(1);
      else if (scrolled > fadeEnd) setOpacity(0);
      else setOpacity(1 - (scrolled - fadeStart) / (fadeEnd - fadeStart));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className="cad-bg"
      style={{ opacity, transition: "opacity 0.7s ease" }}
      aria-hidden="true"
    >
      <Canvas
        camera={{
          fov: 38,
          near: 0.1,
          far: 100,
          // Fixed camera at a clean isometric-ish angle, looking at origin
          position: [0, 0.5, 5],
        }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, Math.min(window.devicePixelRatio, 1.5)]}
      >
        <GhostScene isDark={isDark} mouseOffset={mouseOffset} />
      </Canvas>
    </div>
  );
}

useGLTF.preload(MODEL_PATH);
