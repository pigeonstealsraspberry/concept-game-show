import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const RADIUS = 6
const HEIGHT = 0.3

export function Podium() {
  const ringRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (ringRef.current?.material) {
      const mat = ringRef.current.material as THREE.MeshStandardMaterial
      mat.emissiveIntensity = 0.35 + 0.2 * Math.sin(state.clock.elapsedTime * 0.8)
    }
  })

  return (
    <group position={[0, 0, 0]}>
      <mesh position={[0, HEIGHT / 2, 0]} receiveShadow castShadow>
        <cylinderGeometry args={[RADIUS, RADIUS + 0.2, HEIGHT, 64]} />
        <meshStandardMaterial color="#3d3850" roughness={0.65} metalness={0.2} />
      </mesh>
      <mesh ref={ringRef} position={[0, HEIGHT + 0.02, 0]}>
        <torusGeometry args={[RADIUS + 0.1, 0.08, 16, 64]} />
        <meshStandardMaterial color="#00f5ff" emissive="#00f5ff" emissiveIntensity={0.5} />
      </mesh>
    </group>
  )
}
