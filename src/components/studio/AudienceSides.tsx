import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const ROWS_LEFT = 6
const COLS_LEFT = 8
const ROWS_RIGHT = 6
const COLS_RIGHT = 8
const X_LEFT = -7.5
const X_RIGHT = 7.5
const Z_START = -10
const Z_END = -3
const SPACING_Z = (Z_END - Z_START) / Math.max(1, ROWS_LEFT - 1)
const SPACING_COL = 1.2

function PersonSilhouette({ position }: { position: [number, number, number] }) {
  const groupRef = useRef<THREE.Group>(null)
  useFrame((state) => {
    if (!groupRef.current) return
    groupRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime + position[0]) * 0.015
  })
  return (
    <group ref={groupRef} position={position}>
      <mesh castShadow position={[0, 0.48, 0]}>
        <sphereGeometry args={[0.18, 12, 12]} />
        <meshStandardMaterial color="#4b5563" roughness={0.9} metalness={0} />
      </mesh>
      <mesh castShadow position={[0, 0.12, 0]}>
        <boxGeometry args={[0.45, 0.5, 0.2]} />
        <meshStandardMaterial color="#374151" roughness={0.85} metalness={0} />
      </mesh>
      <mesh castShadow position={[-0.2, 0.08, 0]}>
        <boxGeometry args={[0.1, 0.3, 0.08]} />
        <meshStandardMaterial color="#4b5563" roughness={0.9} metalness={0} />
      </mesh>
      <mesh castShadow position={[0.2, 0.08, 0]}>
        <boxGeometry args={[0.1, 0.3, 0.08]} />
        <meshStandardMaterial color="#4b5563" roughness={0.9} metalness={0} />
      </mesh>
    </group>
  )
}

function makePositions(xSide: number, rows: number, cols: number) {
  const positions: [number, number, number][] = []
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const x = xSide === -1 ? X_LEFT - col * SPACING_COL : X_RIGHT + col * SPACING_COL
      const z = Z_START + row * SPACING_Z + (col % 2) * 0.25
      const y = row * 0.3
      positions.push([x, y, z])
    }
  }
  return positions
}

const leftPositions = makePositions(-1, ROWS_LEFT, COLS_LEFT)
const rightPositions = makePositions(1, ROWS_RIGHT, COLS_RIGHT)
const allPositions = [...leftPositions, ...rightPositions]

export function AudienceSides() {
  return (
    <group>
      {allPositions.map((pos, i) => (
        <PersonSilhouette key={i} position={pos} />
      ))}
    </group>
  )
}
