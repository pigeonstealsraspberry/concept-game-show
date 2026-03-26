import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { useGameStore } from '../../store/gameStore'

const SCALE = 2.6
const DESK_X = 2.4

export function Host() {
  const groupRef = useRef<THREE.Group>(null)
  const armLRef = useRef<THREE.Group>(null)
  const armRRef = useRef<THREE.Group>(null)
  const { camera } = useThree()
  const overlayPhase = useGameStore((s) => s.overlayPhase)
  const step = useGameStore((s) => s.step)

  useFrame((state) => {
    if (!groupRef.current) return
    const t = state.clock.elapsedTime
    const camX = camera.position.x
    const camZ = camera.position.z
    groupRef.current.position.set(DESK_X, -0.1, 0.1)
    groupRef.current.rotation.y = Math.atan2(camZ - 0.1, camX - DESK_X) - Math.PI

    const isAsking = (overlayPhase === 'intro' || overlayPhase === 'question') && ['round1_name', 'round1_company', 'round2_email', 'round3_category', 'round4_wheel'].includes(step)
    if (armRRef.current) {
      if (isAsking) {
        armRRef.current.rotation.x = -0.5 - 0.25 * Math.sin(t * 1.8)
        armRRef.current.rotation.z = 0.1 * Math.sin(t * 1.2)
      } else {
        armRRef.current.rotation.x = 0.35
        armRRef.current.rotation.z = 0
      }
    }
    if (armLRef.current) armLRef.current.rotation.x = 0.35
  })

  return (
    <group ref={groupRef} scale={SCALE}>
      <group position={[0, 0.55, 0]}>
        <mesh castShadow position={[0, 0.5, 0]}>
          <sphereGeometry args={[0.2, 10, 10]} />
          <meshStandardMaterial color="#3b4b63" roughness={0.9} metalness={0} />
        </mesh>
        <mesh castShadow position={[0.07, 0.48, 0.18]} scale={[0.14, 0.14, 0.06]}>
          <sphereGeometry args={[1, 8, 8]} />
          <meshBasicMaterial color="#0f172a" />
        </mesh>
        <mesh castShadow position={[-0.07, 0.48, 0.18]} scale={[0.14, 0.14, 0.06]}>
          <sphereGeometry args={[1, 8, 8]} />
          <meshBasicMaterial color="#0f172a" />
        </mesh>
        <mesh castShadow position={[0, 0.15, 0]}>
          <boxGeometry args={[0.5, 0.55, 0.22]} />
          <meshStandardMaterial color="#2d3a4a" roughness={0.85} metalness={0} />
        </mesh>
        <group ref={armLRef} position={[-0.28, 0.15, 0]} rotation={[0.35, 0, 0]}>
          <mesh castShadow position={[0, 0.18, 0]}>
            <boxGeometry args={[0.12, 0.35, 0.1]} />
            <meshStandardMaterial color="#3b4b63" roughness={0.9} metalness={0} />
          </mesh>
        </group>
        <group ref={armRRef} position={[0.28, 0.15, 0]} rotation={[0.35, 0, 0]}>
          <mesh castShadow position={[0, 0.2, 0]}>
            <boxGeometry args={[0.12, 0.35, 0.1]} />
            <meshStandardMaterial color="#3b4b63" roughness={0.9} metalness={0} />
          </mesh>
        </group>
        <mesh castShadow position={[-0.12, -0.22, 0.04]}>
          <boxGeometry args={[0.14, 0.4, 0.12]} />
          <meshStandardMaterial color="#2d3a4a" roughness={0.85} metalness={0} />
        </mesh>
        <mesh castShadow position={[0.12, -0.22, 0.04]}>
          <boxGeometry args={[0.14, 0.4, 0.12]} />
          <meshStandardMaterial color="#2d3a4a" roughness={0.85} metalness={0} />
        </mesh>
      </group>
    </group>
  )
}
