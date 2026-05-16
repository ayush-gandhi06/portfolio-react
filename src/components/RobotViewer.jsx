// /**
//  * RobotViewer.js — MRA 6-DOF Robotic Arm
//  *
//  * Files needed in /public/robot/:
//  *   - MRA.gltf
//  *   - assembly1.urdf  (optional, axes are hardcoded from URDF below)
//  *
//  * The URDF was parsed to extract exact joint axes + transforms.
//  * The kinematic chain is built in code from the GLTF's flat hierarchy.
//  * Animation runs procedurally in Three.js — no Blender keyframes needed.
//  */

// import React, {
//   useEffect, useRef, useState, useCallback, Suspense, useMemo
// } from 'react'
// import { Canvas, useThree, useFrame } from '@react-three/fiber'
// import { useGLTF, OrbitControls } from '@react-three/drei'
// import * as THREE from 'three'

// const GLTF_PATH = '/robot/MRA.gltf'
// const D2R = Math.PI / 180

// // ── Joint definitions ─────────────────────────────────────────────────────────
// // Axes tuned to match MRA.gltf coordinate system after OnShape export.
// // URDF uses Z-up; Three.js/GLTF uses Y-up — axes are remapped accordingly:
// //   URDF [0,0,1]  → Three.js [0,1,0]   (Z-up becomes Y-up)
// //   URDF [0,0,-1] → Three.js [0,-1,0]
// //   URDF [0,1,0]  → Three.js [0,0,-1]  (URDF Y → Three.js -Z after -90X rotation)
// //   URDF [-1,0,0] → Three.js [-1,0,0]  (X unchanged)
// const JOINTS = [
//   { key: 'j1', label: 'Base',        axis: new THREE.Vector3(0,  1,  0), min: -150, max: 150 },
//   { key: 'j2', label: 'Shoulder',    axis: new THREE.Vector3(1,  0,  0), min:  -90, max:  90 },
//   { key: 'j3', label: 'Elbow',       axis: new THREE.Vector3(1,  0,  0), min: -120, max: 120 },
//   { key: 'j4', label: 'Wrist Pitch', axis: new THREE.Vector3(0,  1,  0), min:  -90, max:  90 },
//   { key: 'j5', label: 'Wrist Roll',  axis: new THREE.Vector3(0,  0,  1), min: -180, max: 180 },
//   { key: 'j6', label: 'Gripper',     axis: new THREE.Vector3(1,  0,  0), min:  -35, max:   0 },
// ]

// // ── Showcase animation keyframes ─────────────────────────────────────────────
// // t = 0..1 progress through the loop. Angles in degrees per joint.
// // Sequence: rest → rise → sweep → reach → wrist flip 180° → gripper → return
// const KEYFRAMES = [
//   { t: 0.00, j1:   0, j2:   0, j3:   0, j4:   0, j5:   0, j6:   0 },
//   { t: 0.12, j1:   0, j2:  50, j3: -15, j4:   0, j5:   0, j6:   0 },
//   { t: 0.28, j1: 150, j2:  50, j3: -15, j4:   0, j5:   0, j6:   0 },
//   { t: 0.42, j1: 150, j2:  65, j3: -75, j4:  35, j5:   0, j6:   0 },
//   { t: 0.54, j1: 150, j2:  65, j3: -75, j4:  35, j5: 180, j6:   0 },
//   { t: 0.63, j1: 150, j2:  65, j3: -75, j4:  35, j5: 180, j6: -30 },
//   { t: 0.72, j1: 150, j2:  65, j3: -75, j4:  35, j5: 180, j6:   0 },
//   { t: 0.82, j1: 150, j2:  65, j3: -75, j4:  35, j5:   0, j6:   0 },
//   { t: 1.00, j1:   0, j2:   0, j3:   0, j4:   0, j5:   0, j6:   0 },
// ]

// // ── Smooth easing ─────────────────────────────────────────────────────────────
// function easeInOut(t) {
//   return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
// }

// function interpolateKeyframes(progress) {
//   const p = ((progress % 1) + 1) % 1
//   let a = KEYFRAMES[0], b = KEYFRAMES[KEYFRAMES.length - 1]
//   for (let i = 0; i < KEYFRAMES.length - 1; i++) {
//     if (p >= KEYFRAMES[i].t && p <= KEYFRAMES[i + 1].t) {
//       a = KEYFRAMES[i]; b = KEYFRAMES[i + 1]; break
//     }
//   }
//   const span = b.t - a.t
//   const local = span < 0.001 ? 0 : (p - a.t) / span
//   const e = easeInOut(local)
//   const lerp = (ak, bk) => a[ak] + (b[bk] - a[ak]) * e
//   return {
//     j1: lerp('j1','j1'), j2: lerp('j2','j2'), j3: lerp('j3','j3'),
//     j4: lerp('j4','j4'), j5: lerp('j5','j5'), j6: lerp('j6','j6'),
//   }
// }

// // ── Extract geometry + baked world transform from GLTF node by name ──────────
// function extractMesh(scene, nodeName) {
//   let result = null
//   scene.traverse(obj => {
//     if (obj.name !== nodeName || result) return
//     let meshObj = obj.isMesh ? obj : null
//     if (!meshObj) obj.traverse(o => { if (o.isMesh && !meshObj) meshObj = o })
//     if (!meshObj) return
//     meshObj.updateWorldMatrix(true, false)
//     const pos = new THREE.Vector3(), quat = new THREE.Quaternion(), scale = new THREE.Vector3()
//     meshObj.matrixWorld.decompose(pos, quat, scale)
//     result = { geometry: meshObj.geometry, pos, quat, scale }
//   })
//   return result
// }

// // Extract world position of a wrapper node (pivot location)
// function extractPivot(scene, nodeName) {
//   let pos = null
//   scene.traverse(obj => {
//     if (obj.name !== nodeName || pos) return
//     obj.updateWorldMatrix(true, false)
//     const p = new THREE.Vector3()
//     obj.matrixWorld.decompose(p, new THREE.Quaternion(), new THREE.Vector3())
//     pos = p.clone()
//   })
//   return pos || new THREE.Vector3()
// }

// // ── Single mesh rendered at baked world transform ─────────────────────────────
// function BakedMesh({ partData, color, dark, onClick, selected }) {
//   const mat = useMemo(() => new THREE.MeshStandardMaterial({
//     color: new THREE.Color(dark ? '#2a3a4a' : color),
//     metalness: dark ? 0.9 : 0.55,
//     roughness: dark ? 0.15 : 0.35,
//     envMapIntensity: 1.2,
//   }), [color, dark])

//   // Pulse selected part slightly brighter
//   useFrame(({ clock }) => {
//     if (selected) {
//       const pulse = 0.85 + Math.sin(clock.elapsedTime * 4) * 0.15
//       mat.emissive.setStyle(color)
//       mat.emissiveIntensity = pulse * 0.25
//     } else {
//       mat.emissiveIntensity = 0
//     }
//   })

//   if (!partData) return null
//   const { geometry, pos, quat, scale } = partData
//   return (
//     <group position={pos} quaternion={quat} scale={scale}>
//       <mesh geometry={geometry} material={mat} castShadow receiveShadow onClick={onClick} />
//     </group>
//   )
// }

// // ── The full kinematic arm ────────────────────────────────────────────────────
// function RobotArm({ angles, armColor, selected, onSelect, playing }) {
//   const { scene } = useGLTF(GLTF_PATH)

//   const parts = useMemo(() => ({
//     base:  extractMesh(scene, 'BASE'),
//     jaw1:  extractMesh(scene, 'JAW 1'),
//     jaw2:  extractMesh(scene, 'JAW 2'),
//     jaw3:  extractMesh(scene, 'JAW 3'),
//     jaw4:  extractMesh(scene, 'JAW 4'),
//     jaw5:  extractMesh(scene, 'JAW 5'),
//     wrist: extractMesh(scene, 'Wrist'),
//     g1:    extractMesh(scene, 'Gripper1'),
//     g2:    extractMesh(scene, 'Gripper 2'),
//   }), [scene])

//   const pivots = useMemo(() => ({
//     base: extractPivot(scene, 'Immobile Base'),
//     j1:   extractPivot(scene, 'Rotating Jaw Attachment 1'),
//     j2:   extractPivot(scene, 'Limited Rotating Jaw 1'),
//     j3:   extractPivot(scene, 'Limited rotating Jaw 3'),
//     j4:   extractPivot(scene, 'Immobile Jaw 4'),
//     j5:   extractPivot(scene, 'Limited Rotating Jaw 5'),
//     w:    extractPivot(scene, 'Rotating Wrist'),
//     g1:   extractPivot(scene, 'Limited Rotating Gripper 1'),
//     g2:   extractPivot(scene, 'Limited Gripper 2'),
//   }), [scene])

//   const refJ1  = useRef()
//   const refJ2  = useRef()
//   const refJ3  = useRef()
//   const refJ4  = useRef()
//   const refJ5  = useRef()
//   const refJ6a = useRef()
//   const refJ6b = useRef()

//   useFrame(() => {
//     const setQ = (ref, axis, deg) => {
//       if (ref.current) ref.current.quaternion.setFromAxisAngle(axis, deg * D2R)
//     }
//     setQ(refJ1,  JOINTS[0].axis, angles.j1)
//     setQ(refJ2,  JOINTS[1].axis, angles.j2)
//     setQ(refJ3,  JOINTS[2].axis, angles.j3)
//     setQ(refJ4,  JOINTS[3].axis, angles.j4)
//     setQ(refJ5,  JOINTS[4].axis, angles.j5)
//     // Grippers open symmetrically on X axis
//     if (refJ6a.current) refJ6a.current.quaternion.setFromAxisAngle(new THREE.Vector3(1, 0, 0),  angles.j6 * D2R)
//     if (refJ6b.current) refJ6b.current.quaternion.setFromAxisAngle(new THREE.Vector3(1, 0, 0), -angles.j6 * D2R)
//   })

//   const pick = (key, e) => { e.stopPropagation(); onSelect(key) }
//   const np = key => pivots[key].clone().negate()
//   const center = pivots.base.clone().negate()

//   return (
//     <group position={center} scale={3.5}>

//       {/* Static base */}
//       <BakedMesh partData={parts.base} color={armColor} dark
//         selected={selected === 'j1'}
//         onClick={e => pick('j1', e)} />

//       {/* J1 — Base rotation */}
//       <group position={pivots.j1}>
//         <group ref={refJ1}>
//           <group position={np('j1')}>
//             <BakedMesh partData={parts.jaw1} color={armColor}
//               selected={selected === 'j1'}
//               onClick={e => pick('j1', e)} />

//             {/* J2 — Shoulder */}
//             <group position={pivots.j2}>
//               <group ref={refJ2}>
//                 <group position={np('j2')}>
//                   <BakedMesh partData={parts.jaw2} color={armColor}
//                     selected={selected === 'j2'}
//                     onClick={e => pick('j2', e)} />

//                   {/* J3 — Elbow */}
//                   <group position={pivots.j3}>
//                     <group ref={refJ3}>
//                       <group position={np('j3')}>
//                         <BakedMesh partData={parts.jaw3} color={armColor}
//                           selected={selected === 'j3'}
//                           onClick={e => pick('j3', e)} />

//                         {/* J4 — Wrist Pitch */}
//                         <group position={pivots.j4}>
//                           <group ref={refJ4}>
//                             <group position={np('j4')}>
//                               <BakedMesh partData={parts.jaw4} color={armColor}
//                                 selected={selected === 'j4'}
//                                 onClick={e => pick('j4', e)} />

//                               {/* J5 — Wrist Roll */}
//                               <group position={pivots.j5}>
//                                 <group ref={refJ5}>
//                                   <group position={np('j5')}>
//                                     <BakedMesh partData={parts.jaw5} color={armColor}
//                                       selected={selected === 'j5'}
//                                       onClick={e => pick('j5', e)} />
//                                     <BakedMesh partData={parts.wrist} color={armColor} dark
//                                       selected={selected === 'j5'}
//                                       onClick={e => pick('j5', e)} />

//                                     {/* Gripper A */}
//                                     <group position={pivots.g1}>
//                                       <group ref={refJ6a}>
//                                         <group position={np('g1')}>
//                                           <BakedMesh partData={parts.g1} color={armColor}
//                                             selected={selected === 'j6'}
//                                             onClick={e => pick('j6', e)} />
//                                         </group>
//                                       </group>
//                                     </group>

//                                     {/* Gripper B */}
//                                     <group position={pivots.g2}>
//                                       <group ref={refJ6b}>
//                                         <group position={np('g2')}>
//                                           <BakedMesh partData={parts.g2} color={armColor}
//                                             selected={selected === 'j6'}
//                                             onClick={e => pick('j6', e)} />
//                                         </group>
//                                       </group>
//                                     </group>

//                                   </group>
//                                 </group>
//                               </group>

//                             </group>
//                           </group>
//                         </group>
//                       </group>
//                     </group>
//                   </group>
//                 </group>
//               </group>
//             </group>
//           </group>
//         </group>
//       </group>

//     </group>
//   )
// }

// // ── Camera ────────────────────────────────────────────────────────────────────
// function CameraSetup() {
//   const { camera } = useThree()
//   useEffect(() => {
//     camera.position.set(0.8, 0.6, 0.8)
//     camera.lookAt(0, 0.1, 0)
//     camera.updateProjectionMatrix()
//   }, [camera])
//   return null
// }

// // ── Color options matching your site's blue-purple palette ────────────────────
// const COLOR_OPTS = [
//   { label: 'Blue',   value: '#3230ff' },
//   { label: 'Cyan',   value: '#0084ff' },
//   { label: 'Purple', value: '#6200ff' },
//   { label: 'Steel',  value: '#9ab4c4' },
//   { label: 'Gold',   value: '#d4891a' },
//   { label: 'White',  value: '#e8f0f8' },
// ]

// const ACCENT = 'rgb(50, 48, 255)'
// const BORDER = 'rgba(50, 48, 255, 0.2)'

// // ── Main component ────────────────────────────────────────────────────────────
// export default function RobotViewer() {
//   const initAngles = { j1: 0, j2: 0, j3: 0, j4: 0, j5: 0, j6: 0 }
//   const [angles,    setAngles]    = useState(initAngles)
//   const [selected,  setSelected]  = useState(null)
//   const [dragging,  setDragging]  = useState(false)
//   const [orbit,     setOrbit]     = useState(true)
//   const [playing,   setPlaying]   = useState(true)
//   const [armColor,  setArmColor]  = useState('#3230ff')
//   const [showColor, setShowColor] = useState(false)
//   const [hint,      setHint]      = useState(true)

//   const lastX    = useRef(0)
//   const progress = useRef(0)
//   const animReq  = useRef(null)
//   const lastTime = useRef(null)
//   const LOOP_DURATION = 9000 // ms for one full loop

//   // Procedural animation loop
//   useEffect(() => {
//     if (!playing || selected) return
//     const tick = (now) => {
//       if (lastTime.current === null) lastTime.current = now
//       const dt = now - lastTime.current
//       lastTime.current = now
//       progress.current = (progress.current + dt / LOOP_DURATION) % 1
//       const kf = interpolateKeyframes(progress.current)
//       setAngles(kf)
//       animReq.current = requestAnimationFrame(tick)
//     }
//     animReq.current = requestAnimationFrame(tick)
//     return () => {
//       cancelAnimationFrame(animReq.current)
//       lastTime.current = null
//     }
//   }, [playing, selected])

//   // When user selects a joint — pause animation
//   useEffect(() => {
//     if (selected) { setPlaying(false); setHint(false) }
//     else          { setPlaying(true); lastTime.current = null }
//   }, [selected])

//   const onSelect = useCallback(key => {
//     setSelected(prev => prev === key ? null : key)
//   }, [])

//   // Drag to manually rotate selected joint
//   useEffect(() => {
//     const move = e => {
//       if (!dragging || !selected) return
//       const x = e.clientX ?? e.touches?.[0]?.clientX ?? 0
//       const delta = x - lastX.current
//       lastX.current = x
//       setAngles(prev => {
//         const jDef = JOINTS.find(j => j.key === selected)
//         const next = prev[selected] + delta * 0.5
//         return { ...prev, [selected]: Math.max(jDef.min, Math.min(jDef.max, next)) }
//       })
//     }
//     const up = () => { setDragging(false); setOrbit(true) }
//     window.addEventListener('mousemove', move)
//     window.addEventListener('mouseup',   up)
//     window.addEventListener('touchmove', move, { passive: true })
//     window.addEventListener('touchend',  up)
//     return () => {
//       window.removeEventListener('mousemove', move)
//       window.removeEventListener('mouseup',   up)
//       window.removeEventListener('touchmove', move)
//       window.removeEventListener('touchend',  up)
//     }
//   }, [dragging, selected])

//   const onDown = useCallback(e => {
//     if (!selected) return
//     setDragging(true); setOrbit(false)
//     lastX.current = e.clientX ?? e.touches?.[0]?.clientX ?? 0
//   }, [selected])

//   const selDef   = JOINTS.find(j => j.key === selected)
//   const selAngle = selected ? Math.round(angles[selected]) : 0
//   const selPct   = selDef
//     ? ((angles[selected] - selDef.min) / (selDef.max - selDef.min)) * 100
//     : 0

//   return (
//     <div style={S.widget}>

//       {/* Header */}
//       <div style={S.header}>
//         <div style={S.headerLeft}>
//           <span style={{ ...S.dot, background: playing ? armColor : '#888', boxShadow: playing ? `0 0 6px ${armColor}` : 'none' }} />
//           <span style={S.headerTitle}>MRA — 6 DOF</span>
//         </div>
//         <button
//           style={{ ...S.iconBtn, borderColor: armColor, color: armColor }}
//           onClick={() => setShowColor(p => !p)}
//           title="Change arm color"
//         >◉</button>
//       </div>

//       {/* Color picker */}
//       {showColor && (
//         <div style={S.colorPanel}>
//           <div style={S.colorRow}>
//             {COLOR_OPTS.map(c => (
//               <button
//                 key={c.value}
//                 title={c.label}
//                 style={{
//                   ...S.swatch,
//                   background: c.value,
//                   boxShadow: armColor === c.value
//                     ? `0 0 0 2px #fff, 0 0 0 4px ${c.value}`
//                     : 'none',
//                 }}
//                 onClick={() => { setArmColor(c.value); setShowColor(false) }}
//               />
//             ))}
//             <input
//               type="color"
//               value={armColor}
//               onChange={e => setArmColor(e.target.value)}
//               style={S.colorInput}
//               title="Custom"
//             />
//           </div>
//         </div>
//       )}

//       {/* 3D Canvas */}
//       <div
//         style={{
//           flex: 1, minHeight: 0,
//           cursor: dragging ? 'grabbing' : selected ? 'grab' : 'default',
//         }}
//         onMouseDown={onDown}
//         onTouchStart={e => {
//           if (!selected) return
//           setDragging(true); setOrbit(false)
//           lastX.current = e.touches[0].clientX
//         }}
//       >
//         <Canvas
//           camera={{ position: [0.8, 0.6, 0.8], fov: 40 }}
//           gl={{ antialias: true, alpha: true }}
//           shadows
//           style={{ width: '100%', height: '100%' }}
//         >
//           <CameraSetup />
//           <ambientLight intensity={0.5} color="#ddeeff" />
//           <directionalLight
//             position={[3, 6, 4]} intensity={1.6} castShadow
//             shadow-mapSize={[1024, 1024]}
//           />
//           <pointLight position={[-3, 4, -2]} intensity={0.8} color={armColor} />
//           <pointLight position={[3, -1,  3]} intensity={0.3} color="#ffffff" />
//           <gridHelper
//             args={[5, 14, BORDER, 'rgba(50,48,255,0.07)']}
//             position={[0, -0.52, 0]}
//           />
//           <Suspense fallback={null}>
//             <RobotArm
//               angles={angles}
//               armColor={armColor}
//               selected={selected}
//               onSelect={onSelect}
//               playing={playing}
//             />
//           </Suspense>
//           <OrbitControls
//             enabled={orbit}
//             enablePan={false}
//             minDistance={0.4}
//             maxDistance={2.5}
//             minPolarAngle={Math.PI / 10}
//             maxPolarAngle={Math.PI / 2.05}
//             dampingFactor={0.08}
//             enableDamping
//           />
//         </Canvas>
//       </div>

//       {/* Angle readout */}
//       <div style={S.readout}>
//         {selected ? (
//           <>
//             <span style={{ ...S.readDot, background: armColor, boxShadow: `0 0 6px ${armColor}` }} />
//             <span style={S.readName}>{selDef?.label}</span>
//             <div style={S.bar}>
//               <div style={{ ...S.barFill, width: `${selPct}%`, background: armColor }} />
//             </div>
//             <span style={{ ...S.readAngle, color: armColor }}>{selAngle}°</span>
//           </>
//         ) : (
//           <span style={S.readIdle}>
//             {hint ? 'click a part to take control' : 'drag ← → to rotate  ·  click again to release'}
//           </span>
//         )}
//       </div>

//       {/* Joint buttons */}
//       <div style={S.btnRow}>
//         {JOINTS.map(j => (
//           <button
//             key={j.key}
//             style={{
//               ...S.jBtn,
//               ...(selected === j.key ? {
//                 background: `${armColor}18`,
//                 borderColor: armColor,
//                 color: armColor,
//               } : {}),
//             }}
//             onClick={() => setSelected(prev => prev === j.key ? null : j.key)}
//           >
//             {j.label}
//           </button>
//         ))}
//       </div>

//       {/* Reset / Play */}
//       <div style={S.footer}>
//         <button style={S.footBtn} onClick={() => { setAngles(initAngles); setSelected(null); progress.current = 0 }}>
//           ↺ Reset
//         </button>
//         <button
//           style={{ ...S.footBtn, color: playing && !selected ? armColor : 'rgba(50,48,255,0.4)' }}
//           onClick={() => { setSelected(null); setPlaying(p => !p) }}
//         >
//           {playing && !selected ? '⏸ Pause' : '▶ Play'}
//         </button>
//       </div>

//     </div>
//   )
// }

// // ── Styles ────────────────────────────────────────────────────────────────────
// const S = {
//   widget: {
//     position: 'fixed',
//     bottom: 24, right: 24,
//     width: 380, height: 520,
//     zIndex: 50,
//     display: 'flex',
//     flexDirection: 'column',
//     borderRadius: 14,
//     overflow: 'hidden',
//     background: 'rgba(255,255,255,0.92)',
//     backdropFilter: 'blur(20px)',
//     border: '1px solid ' + BORDER,
//     boxShadow: '0 8px 40px rgba(50,48,255,0.12), 0 2px 8px rgba(0,0,0,0.08)',
//   },

//   header: {
//     display: 'flex', alignItems: 'center', justifyContent: 'space-between',
//     padding: '9px 14px',
//     borderBottom: '1px solid ' + BORDER,
//     background: 'rgba(255,255,255,0.6)',
//   },
//   headerLeft: { display: 'flex', alignItems: 'center', gap: 8 },
//   dot: { width: 7, height: 7, borderRadius: '50%', flexShrink: 0, transition: 'all .3s' },
//   headerTitle: {
//     fontFamily: "'Courier New', monospace",
//     fontSize: 9, letterSpacing: 3,
//     color: 'rgba(50,48,255,0.6)',
//     textTransform: 'uppercase',
//   },
//   iconBtn: {
//     background: 'transparent', border: '1px solid',
//     fontFamily: 'monospace', fontSize: 13,
//     padding: '1px 7px', borderRadius: 4, cursor: 'pointer',
//   },

//   colorPanel: {
//     padding: '8px 14px 10px',
//     borderBottom: '1px solid ' + BORDER,
//     background: 'rgba(255,255,255,0.7)',
//   },
//   colorRow: { display: 'flex', gap: 8, alignItems: 'center' },
//   swatch: {
//     width: 22, height: 22, borderRadius: '50%',
//     border: 'none', cursor: 'pointer', transition: 'box-shadow .15s',
//   },
//   colorInput: {
//     width: 22, height: 22, borderRadius: '50%',
//     border: '1px solid rgba(50,48,255,0.2)',
//     padding: 0, cursor: 'pointer', background: 'transparent',
//   },

//   readout: {
//     display: 'flex', alignItems: 'center', gap: 8,
//     padding: '5px 14px',
//     borderTop: '1px solid ' + BORDER,
//     background: 'rgba(255,255,255,0.6)',
//     minHeight: 28,
//   },
//   readDot:   { width: 6, height: 6, borderRadius: '50%', flexShrink: 0 },
//   readName:  { fontFamily: "'Courier New', monospace", fontSize: 8, letterSpacing: 2, color: '#333', textTransform: 'uppercase', minWidth: 65 },
//   bar:       { flex: 1, height: 2, background: 'rgba(50,48,255,0.1)', borderRadius: 2, overflow: 'hidden' },
//   barFill:   { height: '100%', borderRadius: 2, transition: 'width .04s' },
//   readAngle: { fontFamily: "'Courier New', monospace", fontSize: 11, fontWeight: 700, minWidth: 36, textAlign: 'right' },
//   readIdle:  { fontFamily: "'Courier New', monospace", fontSize: 8, letterSpacing: 1, color: 'rgba(50,48,255,0.35)', textAlign: 'center', flex: 1 },

//   btnRow: {
//     display: 'flex', flexWrap: 'wrap', gap: 4,
//     padding: '6px 10px',
//     borderTop: '1px solid ' + BORDER,
//     background: 'rgba(255,255,255,0.5)',
//   },
//   jBtn: {
//     background: 'transparent',
//     border: '1px solid rgba(50,48,255,0.2)',
//     color: 'rgba(50,48,255,0.45)',
//     fontFamily: "'Courier New', monospace",
//     fontSize: 8, letterSpacing: 1.5,
//     padding: '3px 9px', borderRadius: 3,
//     cursor: 'pointer', textTransform: 'uppercase',
//     transition: 'all .12s',
//   },

//   footer: {
//     display: 'flex', gap: 6,
//     padding: '6px 10px 8px',
//     borderTop: '1px solid ' + BORDER,
//     background: 'rgba(255,255,255,0.5)',
//   },
//   footBtn: {
//     flex: 1, padding: '4px 0',
//     background: 'transparent',
//     border: '1px solid rgba(50,48,255,0.15)',
//     color: 'rgba(50,48,255,0.4)',
//     fontFamily: "'Courier New', monospace",
//     fontSize: 8, letterSpacing: 2,
//     cursor: 'pointer', borderRadius: 3,
//     transition: 'all .15s',
//   },
// }