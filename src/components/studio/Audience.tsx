import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const ROWS = 10
const COLS = 24
const SPACING = 1.4
const OFFSET_Z = -11
const OFFSET_X = -((COLS - 1) * SPACING) / 2
const count = ROWS * COLS

export function Audience() {
  const meshRef = useRef<THREE.InstancedMesh>(null)
  const dummy = useRef(new THREE.Object3D())
  const geometry = useMemo(() => new THREE.BoxGeometry(0.45, 1.1, 0.28), [])
  const material = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#2d2a3a',
        roughness: 0.95,
        metalness: 0,
      }),
    []
  )

  useFrame((state) => {
    if (!meshRef.current) return
    const time = state.clock.elapsedTime
    let i = 0
    for (let row = 0; row < ROWS; row++) {
      for (let col = 0; col < COLS; col++) {
        dummy.current.position.set(
          OFFSET_X + col * SPACING + (row % 2) * 0.4,
          row * 0.65,
          OFFSET_Z - row * 0.9
        )
        dummy.current.scale.setScalar(0.88 + 0.08 * Math.sin(time + i * 0.08))
        dummy.current.updateMatrix()
        meshRef.current.setMatrixAt(i, dummy.current.matrix)
        i++
      }
    }
    meshRef.current.instanceMatrix.needsUpdate = true
  })

  return <instancedMesh ref={meshRef} args={[geometry, material, count]} position={[0, 0, 0]} receiveShadow />
}
