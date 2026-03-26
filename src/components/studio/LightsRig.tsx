import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useGameStore } from '../../store/gameStore'

export function LightsRig() {
  const spot1 = useRef<THREE.SpotLight>(null)
  const spot2 = useRef<THREE.SpotLight>(null)
  const spot3 = useRef<THREE.SpotLight>(null)
  const spot4 = useRef<THREE.SpotLight>(null)
  const spot5 = useRef<THREE.SpotLight>(null)
  const spot6 = useRef<THREE.SpotLight>(null)
  const pointRef = useRef<THREE.PointLight>(null)
  const fill1 = useRef<THREE.PointLight>(null)
  const fill2 = useRef<THREE.PointLight>(null)
  const wheelLightRef = useRef<THREE.PointLight>(null)
  const rim1 = useRef<THREE.PointLight>(null)
  const rim2 = useRef<THREE.PointLight>(null)
  const step = useGameStore((s) => s.step)

  useFrame((state) => {
    const t = state.clock.elapsedTime
    const sweep = Math.sin(t * 0.6) * 2.5
    const sweep2 = Math.sin(t * 0.5 + 1.2) * 2
    if (spot1.current) {
      spot1.current.position.x = Math.sin(t * 0.5) * 7
      spot1.current.position.z = Math.cos(t * 0.35) * 5
      if (spot1.current.target) {
        spot1.current.target.position.set(sweep * 0.8, 0, 0)
        spot1.current.target.updateMatrixWorld()
      }
    }
    if (spot2.current) {
      spot2.current.position.x = Math.sin(t * 0.4 + 2) * 9
      spot2.current.position.z = Math.cos(t * 0.4 + 1) * 5
      if (spot2.current.target) {
        spot2.current.target.position.set(sweep2, -0.5, 0.5)
        spot2.current.target.updateMatrixWorld()
      }
    }
    if (spot3.current) {
      spot3.current.position.x = Math.sin(t * 0.45 + 4) * 6
      spot3.current.position.z = Math.cos(t * 0.38 + 3) * 5
      if (spot3.current.target) {
        spot3.current.target.position.set(-sweep * 0.6, 0.2, 0)
        spot3.current.target.updateMatrixWorld()
      }
    }
    if (spot4.current) {
      spot4.current.position.set(-6 + Math.sin(t * 0.35) * 2, 12, 6)
      spot4.current.intensity = 60 + Math.sin(t * 1.2) * 15
    }
    if (spot5.current) {
      spot5.current.position.set(6 + Math.cos(t * 0.4) * 2, 11, 6)
      spot5.current.intensity = 50 + Math.sin(t * 0.9 + 2) * 12
    }
    if (spot6.current) {
      spot6.current.position.set(0, 14, 10 + Math.sin(t * 0.3) * 1)
      spot6.current.intensity = 45 + Math.sin(t * 0.8) * 10
    }
    if (pointRef.current) pointRef.current.intensity = 5 + Math.sin(t * 0.7) * 0.5
    if (fill1.current) fill1.current.intensity = 4 + Math.sin(t * 0.5) * 0.3
    if (fill2.current) fill2.current.intensity = 4 + Math.sin(t * 0.5 + 1) * 0.3
    if (rim1.current) {
      rim1.current.intensity = 3 + Math.sin(t * 1.5) * 1.2
      rim1.current.position.x = -9 + Math.sin(t * 0.4) * 0.5
    }
    if (rim2.current) {
      rim2.current.intensity = 3 + Math.sin(t * 1.5 + 0.7) * 1.2
      rim2.current.position.x = 9 + Math.cos(t * 0.4) * 0.5
    }
    const showWheel = step === 'round4_wheel' || step === 'round4_confirm'
    if (wheelLightRef.current) wheelLightRef.current.intensity = showWheel ? 8 : 0
  })

  return (
    <group>
      <ambientLight intensity={0.75} />
      <pointLight ref={pointRef} position={[0, 11, 4]} color="#00f5ff" intensity={5} distance={60} />
      <pointLight ref={fill1} position={[-8, 6, 2]} color="#c4b5fd" intensity={4} distance={45} />
      <pointLight ref={fill2} position={[8, 6, 2]} color="#67e8f9" intensity={4} distance={45} />
      <pointLight position={[0, 8, 0]} color="#ffffff" intensity={3} distance={40} />
      <pointLight ref={rim1} position={[-9, 5, 3]} color="#a855f7" intensity={3} distance={35} />
      <pointLight ref={rim2} position={[9, 5, 3]} color="#00f5ff" intensity={3} distance={35} />
      <pointLight ref={wheelLightRef} position={[0, 6, -3]} color="#ffffff" intensity={0} distance={24} />
      <spotLight
        ref={spot1}
        position={[5, 15, 9]}
        angle={0.45}
        penumbra={0.5}
        color="#ffffff"
        intensity={140}
        castShadow
      />
      <spotLight
        ref={spot2}
        position={[-4, 14, 7]}
        angle={0.4}
        penumbra={0.6}
        color="#00f5ff"
        intensity={100}
      />
      <spotLight
        ref={spot3}
        position={[2, 13, 8]}
        angle={0.4}
        penumbra={0.5}
        color="#a855f7"
        intensity={80}
      />
      <spotLight
        ref={spot4}
        position={[-6, 12, 6]}
        angle={0.5}
        penumbra={0.5}
        color="#fbbf24"
        intensity={60}
      />
      <spotLight
        ref={spot5}
        position={[6, 11, 6]}
        angle={0.5}
        penumbra={0.5}
        color="#34d399"
        intensity={50}
      />
      <spotLight
        ref={spot6}
        position={[0, 14, 10]}
        angle={0.5}
        penumbra={0.4}
        color="#f8fafc"
        intensity={45}
      />
      <spotLight
        position={[0, 16, 10]}
        angle={0.5}
        penumbra={0.4}
        color="#f8fafc"
        intensity={70}
      />
    </group>
  )
}
