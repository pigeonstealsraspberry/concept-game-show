import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const RADII = [10, 12, 14]
const COUNT_PER_RING = [24, 32, 40]

function PersonSilhouette({ position, seed }: { position: [number, number, number]; seed: number }) {
  const groupRef = useRef<THREE.Group>(null)
  const armLRef = useRef<THREE.Group>(null)
  const armRRef = useRef<THREE.Group>(null)
  useFrame((state) => {
    if (!groupRef.current) return
    const t = state.clock.elapsedTime + seed
    groupRef.current.position.y = position[1] + Math.sin(t * 2) * 0.08
    groupRef.current.scale.setScalar(0.95 + Math.sin(t * 1.5) * 0.05)
    if (armLRef.current) armLRef.current.rotation.x = -0.6 - Math.sin(t * 3) * 0.3
    if (armRRef.current) armRRef.current.rotation.x = -0.6 - Math.sin(t * 3 + 0.5) * 0.3
  })
  const angleY = Math.atan2(position[0], position[2])
  return (
    <group ref={groupRef} position={position} rotation={[0, angleY, 0]}>
      <mesh castShadow position={[0, 0.5, 0]}>
        <sphereGeometry args={[0.2, 10, 10]} />
        <meshStandardMaterial color="#4b5563" roughness={0.9} metalness={0} />
      </mesh>
      <mesh castShadow position={[0.06, 0.48, 0.16]} scale={[0.12, 0.12, 0.05]}>
        <sphereGeometry args={[1, 8, 8]} />
        <meshBasicMaterial color="#1e293b" />
      </mesh>
      <mesh castShadow position={[-0.06, 0.48, 0.16]} scale={[0.12, 0.12, 0.05]}>
        <sphereGeometry args={[1, 8, 8]} />
        <meshBasicMaterial color="#1e293b" />
      </mesh>
      <mesh castShadow position={[0, 0.15, 0]}>
        <boxGeometry args={[0.5, 0.55, 0.22]} />
        <meshStandardMaterial color="#374151" roughness={0.85} metalness={0} />
      </mesh>
      <group ref={armLRef} position={[-0.28, 0.2, 0]} rotation={[-0.6, 0, 0]}>
        <mesh castShadow position={[0, 0.2, 0]}>
          <boxGeometry args={[0.12, 0.35, 0.1]} />
          <meshStandardMaterial color="#4b5563" roughness={0.9} metalness={0} />
        </mesh>
      </group>
      <group ref={armRRef} position={[0.28, 0.2, 0]} rotation={[-0.6, 0, 0]}>
        <mesh castShadow position={[0, 0.2, 0]}>
          <boxGeometry args={[0.12, 0.35, 0.1]} />
          <meshStandardMaterial color="#4b5563" roughness={0.9} metalness={0} />
        </mesh>
      </group>
      <mesh castShadow position={[-0.12, -0.22, 0.04]}>
        <boxGeometry args={[0.14, 0.4, 0.12]} />
        <meshStandardMaterial color="#374151" roughness={0.85} metalness={0} />
      </mesh>
      <mesh castShadow position={[0.12, -0.22, 0.04]}>
        <boxGeometry args={[0.14, 0.4, 0.12]} />
        <meshStandardMaterial color="#374151" roughness={0.85} metalness={0} />
      </mesh>
    </group>
  )
}

export function AudienceCircle() {
  const positions = useMemo(() => {
    const out: [number, number, number][] = []
    RADII.forEach((r, ring) => {
      const n = COUNT_PER_RING[ring]
      for (let i = 0; i < n; i++) {
        const angle = (i / n) * Math.PI * 2 + (ring * 0.1)
        const x = Math.cos(angle) * r
        const z = Math.sin(angle) * r
        const y = ring * 0.25
        out.push([x, y, z])
      }
    })
    return out
  }, [])

  return (
    <group>
      {positions.map((pos, i) => (
        <PersonSilhouette key={i} position={pos} seed={i * 0.2} />
      ))}
    </group>
  )
}
