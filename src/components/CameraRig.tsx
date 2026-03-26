import { useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useGameStore } from '../store/gameStore'

const POSITIONS: Record<string, { position: [number, number, number]; target: [number, number, number]; fov?: number }> = {
  opening: { position: [0, 5, 24], target: [0, 1.5, 0], fov: 48 },
  round1_name: { position: [0, 3.8, 15], target: [0, 2, 0], fov: 42 },
  round1_company: { position: [0, 3.8, 15], target: [0, 2, 0], fov: 42 },
  round2_email: { position: [0, 3.6, 13], target: [0, 2, 0], fov: 40 },
  round3_category: { position: [0, 5.5, 20], target: [0, 6.5, -22], fov: 46 },
  round4_wheel: { position: [0, 6.2, 15], target: [0, 6.2, 0.5], fov: 34 },
  round4_confirm: { position: [0, 3.8, 14], target: [0, 2, 0], fov: 42 },
  finale: { position: [0, 3.8, 10], target: [0, 2, -1], fov: 42 },
  review: { position: [0, 3.8, 10], target: [0, 2, -1], fov: 42 },
  submitted: { position: [0, 3.8, 10], target: [0, 2, -1], fov: 42 },
}

const LERP_SPEED = 1.4
const FOV_LERP = 1.2

export function CameraRig() {
  const step = useGameStore((s) => s.step)
  const posRef = useRef(new THREE.Vector3(0, 5, 24))
  const targetRef = useRef(new THREE.Vector3(0, 1.5, 0))
  const fovRef = useRef(48)
  const sweepRef = useRef(0)

  useEffect(() => {
    const config = POSITIONS[step] || POSITIONS.opening
    posRef.current.set(...config.position)
    targetRef.current.set(...config.target)
    if (config.fov != null) fovRef.current = config.fov
  }, [step])

  useFrame((state) => {
    const config = POSITIONS[step] || POSITIONS.opening
    const targetPos = new THREE.Vector3(...config.position)
    const targetLook = new THREE.Vector3(...config.target)
    const targetFov = config.fov ?? 48
    const delta = state.clock.getDelta()
    posRef.current.lerp(targetPos, 1 - Math.exp(-delta * LERP_SPEED))
    targetRef.current.lerp(targetLook, 1 - Math.exp(-delta * LERP_SPEED))
    fovRef.current += (targetFov - fovRef.current) * Math.min(1, delta * FOV_LERP)
    sweepRef.current += delta * 0.12
    const sweep = Math.sin(sweepRef.current) * 0.35
    state.camera.position.copy(posRef.current)
    state.camera.position.x += step === 'opening' ? sweep * 2.5 : sweep * 0.4
    state.camera.lookAt(targetRef.current)
    if ('fov' in state.camera) (state.camera as THREE.PerspectiveCamera).fov = fovRef.current
    state.camera.updateProjectionMatrix()
  })

  return null
}
