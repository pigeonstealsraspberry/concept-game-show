import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const FLOOR_RADIUS = 25
const LED_RING_RADIUS = 23
const PULSE_SPEED = 1.2

export function StudioEnvironment() {
  const ledStripRef = useRef<THREE.Group>(null)
  const ceilingRingRef = useRef<THREE.Mesh>(null)
  const ringPulseRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    const t = state.clock.elapsedTime * PULSE_SPEED
    if (ledStripRef.current) {
      ledStripRef.current.children.forEach((c, i) => {
        const m = (c as THREE.Mesh).material as THREE.MeshBasicMaterial
        if (m?.opacity !== undefined) m.opacity = 0.6 + 0.35 * Math.sin(t + i * 0.4)
      })
    }
    if (ceilingRingRef.current?.material) {
      const mat = ceilingRingRef.current.material as THREE.MeshBasicMaterial
      mat.opacity = 0.8 + 0.2 * Math.sin(t * 0.8)
    }
    if (ringPulseRef.current?.material) {
      const mat = ringPulseRef.current.material as THREE.MeshBasicMaterial
      mat.opacity = 0.25 + 0.2 * Math.sin(t * 1.2)
    }
  })

  return (
    <group>
      <fog attach="fog" args={['#3d3850', 25, 55]} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <circleGeometry args={[FLOOR_RADIUS, 64]} />
        <meshStandardMaterial
          color="#3a3548"
          roughness={0.8}
          metalness={0.1}
          envMapIntensity={0.5}
        />
      </mesh>
      <group ref={ledStripRef}>
        {Array.from({ length: 48 }).map((_, i) => {
          const a = (i / 48) * Math.PI * 2
          return (
            <mesh
              key={i}
              position={[Math.cos(a) * LED_RING_RADIUS, 0.02, Math.sin(a) * LED_RING_RADIUS]}
              rotation={[-Math.PI / 2, 0, -a]}
            >
              <planeGeometry args={[1.8, 0.08]} />
              <meshBasicMaterial color="#00f5ff" transparent opacity={0.9} />
            </mesh>
          )
        })}
      </group>
      <mesh ref={ringPulseRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <ringGeometry args={[8, 8.5, 64]} />
        <meshBasicMaterial color="#00f5ff" transparent opacity={0.5} side={THREE.DoubleSide} />
      </mesh>
      <mesh ref={ceilingRingRef} position={[0, 12, 0]}>
        <torusGeometry args={[22, 0.45, 16, 64]} />
        <meshBasicMaterial color="#00f5ff" transparent opacity={0.9} />
      </mesh>
      {/* Back wall */}
      <mesh position={[0, 8, -28]} receiveShadow>
        <planeGeometry args={[60, 20]} />
        <meshStandardMaterial color="#36324a" roughness={1} metalness={0} />
      </mesh>
      {/* Left wall */}
      <mesh position={[-26, 6, -10]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[25, 14]} />
        <meshStandardMaterial color="#3a3648" roughness={1} metalness={0} />
      </mesh>
      {/* Right wall */}
      <mesh position={[26, 6, -10]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[25, 14]} />
        <meshStandardMaterial color="#3a3648" roughness={1} metalness={0} />
      </mesh>
    </group>
  )
}
