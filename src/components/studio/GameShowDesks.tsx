import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const TABLE_TOP_H = 0.08
const TABLE_TOP_Y = 0.58
const TABLE_W = 1.7
const TABLE_D = 0.95
const MIC_Y_OFFSET = 0.38

function Microphone() {
  const meshRef = useRef<THREE.Group>(null)
  useFrame((state) => {
    if (!meshRef.current) return
    meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 2) * 0.02
  })
  return (
    <group ref={meshRef} position={[0, TABLE_TOP_Y + TABLE_TOP_H / 2 + MIC_Y_OFFSET, 0]}>
      <mesh castShadow>
        <cylinderGeometry args={[0.025, 0.03, 0.28, 12]} />
        <meshStandardMaterial color="#2a2a2a" roughness={0.3} metalness={0.85} />
      </mesh>
      <mesh position={[0, 0.16, 0]} castShadow>
        <sphereGeometry args={[0.07, 12, 12]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.25} metalness={0.9} />
      </mesh>
      <mesh position={[0, 0.16, 0]}>
        <sphereGeometry args={[0.025, 8, 8]} />
        <meshBasicMaterial color="#00f5ff" />
      </mesh>
      <mesh position={[0, -0.08, 0]} castShadow>
        <cylinderGeometry args={[0.04, 0.04, 0.03, 12]} />
        <meshStandardMaterial color="#2a2a2a" roughness={0.35} metalness={0.8} />
      </mesh>
    </group>
  )
}

function Desk({ position, side }: { position: [number, number, number]; side: 'left' | 'right' }) {
  const ringRef = useRef<THREE.Mesh>(null)
  const stripRef = useRef<THREE.Mesh>(null)
  useFrame((state) => {
    const t = state.clock.elapsedTime * 0.8
    if (ringRef.current?.material) (ringRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.3 + 0.2 * Math.sin(t)
    if (stripRef.current?.material) (stripRef.current.material as THREE.MeshBasicMaterial).opacity = 0.5 + 0.35 * Math.sin(t * 0.5)
  })

  return (
    <group position={position}>
      <mesh castShadow receiveShadow position={[0, TABLE_TOP_Y, 0]}>
        <boxGeometry args={[TABLE_W, TABLE_TOP_H, TABLE_D]} />
        <meshStandardMaterial color="#3d3852" roughness={0.45} metalness={0.2} />
      </mesh>
      <mesh castShadow receiveShadow position={[0, TABLE_TOP_Y - 0.12, 0]} rotation={[0, 0, 0]}>
        <boxGeometry args={[TABLE_W + 0.08, 0.06, TABLE_D + 0.06]} />
        <meshStandardMaterial color="#2d2a3a" roughness={0.6} metalness={0.1} />
      </mesh>
      <mesh ref={ringRef} position={[0, TABLE_TOP_Y + 0.012, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[TABLE_W / 2 - 0.06, TABLE_W / 2, 32]} />
        <meshStandardMaterial color="#00f5ff" emissive="#00f5ff" emissiveIntensity={0.35} side={THREE.DoubleSide} />
      </mesh>
      <mesh ref={stripRef} position={[0, TABLE_TOP_Y - 0.04, TABLE_D / 2 + 0.02]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[TABLE_W - 0.2, 0.04]} />
        <meshBasicMaterial color="#00f5ff" transparent opacity={0.7} side={THREE.DoubleSide} />
      </mesh>
      <Microphone />
    </group>
  )
}

export function GameShowDesks() {
  return (
    <group position={[0, 0, 0]}>
      <Desk position={[-2.4, 0, 0.18]} side="left" />
      <Desk position={[2.4, 0, 0.18]} side="right" />
    </group>
  )
}
