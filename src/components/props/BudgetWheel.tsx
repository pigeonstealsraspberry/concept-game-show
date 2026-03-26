import { useRef, useState, useEffect, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import { useGameStore } from '../../store/gameStore'
import { FIXED_BUDGET, WHEEL_LABELS, SEGMENT_INDEX_BY_CATEGORY } from '../../config/budgetRanges'
import type { CategoryId } from '../../config/budgetRanges'

const SEGMENTS = WHEEL_LABELS.length
const WHEEL_R = 4.5
const WHEEL_BASE_COLOR = '#1e1b4b'
const SEGMENT_BORDER_COLOR = '#818cf8'

function WheelBorders() {
  const points = useMemo(() => {
    const pts: number[] = []
    for (let k = 0; k <= SEGMENTS; k++) {
      const a = (k / SEGMENTS) * Math.PI * 2
      pts.push(0, 0, 0, Math.cos(a) * WHEEL_R, Math.sin(a) * WHEEL_R, 0)
    }
    return new Float32Array(pts)
  }, [])
  return (
    <lineSegments position={[0, 0, 0.02]}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={(SEGMENTS + 1) * 2} array={points} itemSize={3} />
      </bufferGeometry>
      <lineBasicMaterial color={SEGMENT_BORDER_COLOR} />
    </lineSegments>
  )
}

export function BudgetWheel() {
  const wheelRef = useRef<THREE.Group>(null)
  const [spinning, setSpinning] = useState(false)
  const [rotationEnd, setRotationEnd] = useState(0)
  const spinStart = useRef(0)
  const spinDuration = useRef(0)
  const step = useGameStore((s) => s.step)
  const formData = useGameStore((s) => s.formData)
  const spinWheelRequest = useGameStore((s) => s.spinWheelRequest)
  const setFormField = useGameStore((s) => s.setFormField)
  const setWheelSpun = useGameStore((s) => s.setWheelSpun)
  const nextStep = useGameStore((s) => s.nextStep)

  const categoryId = (formData.category || 'custom') as CategoryId
  const fixedBudget = FIXED_BUDGET[categoryId] ?? FIXED_BUDGET.custom
  const currentRotation = useRef(0)
  const spinEndHandledRef = useRef(false)
  const targetSegmentRef = useRef(0)
  const spinCategoryBudgetRef = useRef(fixedBudget)
  const CONFIRM_DELAY_MS = 2500

  const doSpin = () => {
    if (spinning) return
    const state = useGameStore.getState()
    const cat = (state.formData.category || 'custom') as CategoryId
    const segmentIndex = SEGMENT_INDEX_BY_CATEGORY[cat] ?? 0
    spinCategoryBudgetRef.current = FIXED_BUDGET[cat] ?? FIXED_BUDGET.custom
    targetSegmentRef.current = segmentIndex
    spinEndHandledRef.current = false
    setSpinning(true)
    spinStart.current = currentRotation.current
    const extraTurns = 4 + Math.random() * 2
    const segmentAngle = (Math.PI * 2) / SEGMENTS
    const targetSegmentCenter = segmentIndex * segmentAngle + segmentAngle / 2
    const endAngle = targetSegmentCenter + Math.PI * 2 * extraTurns
    setRotationEnd(endAngle)
    spinDuration.current = 3.5
  }

  const lastRequestRef = useRef(0)

  useEffect(() => {
    if (spinWheelRequest > 0 && spinWheelRequest !== lastRequestRef.current && step === 'round4_wheel' && !spinning) {
      lastRequestRef.current = spinWheelRequest
      doSpin()
    }
  }, [spinWheelRequest, step, spinning])

  useFrame((_, delta) => {
    if (!wheelRef.current) return
    if (spinning && spinDuration.current > 0) {
      spinDuration.current -= delta
      const progress = 1 - spinDuration.current / 3.5
      const eased = 1 - Math.pow(1 - progress, 3)
      currentRotation.current = spinStart.current + (rotationEnd - spinStart.current) * eased
      wheelRef.current.rotation.z = currentRotation.current
      if (spinDuration.current <= 0) {
        spinDuration.current = -1
        setSpinning(false)
        setFormField('budget', spinCategoryBudgetRef.current)
        setWheelSpun(true)
        if (!spinEndHandledRef.current) {
          spinEndHandledRef.current = true
          setTimeout(() => {
            nextStep()
          }, CONFIRM_DELAY_MS)
        }
      }
    }
  })

  const showWheel = step === 'round4_wheel' || step === 'round4_confirm'
  const wheelCenterY = 6.2
  const yPos = showWheel ? wheelCenterY : -4
  const zPos = showWheel ? 0.8 : -8

  return (
    <group position={[0, yPos, zPos]}>
      {/* Achtergrond en boog achter het rad (z laag); rad voor podium zodat boog niet ervoor staat */}
      <mesh position={[0, 0, -0.6]}>
        <circleGeometry args={[WHEEL_R + 1.2, 64]} />
        <meshStandardMaterial color="#1e293b" roughness={0.8} metalness={0.2} />
      </mesh>
      <mesh position={[0, 0, -0.55]}>
        <ringGeometry args={[WHEEL_R + 0.12, WHEEL_R + 0.45, 64]} />
        <meshStandardMaterial color="#0f172a" emissive="#6366f1" emissiveIntensity={0.4} side={THREE.DoubleSide} />
      </mesh>

      <group ref={wheelRef} rotation={[0, 0, currentRotation.current]} position={[0, 0, 0]}>
        {WHEEL_LABELS.map((label, i) => {
          const startAngle = (i / SEGMENTS) * Math.PI * 2
          const endAngle = ((i + 1) / SEGMENTS) * Math.PI * 2
          const midAngle = (startAngle + endAngle) / 2
          const shape = new THREE.Shape()
          shape.moveTo(0, 0)
          shape.absarc(0, 0, WHEEL_R, startAngle, endAngle, false)
          shape.closePath()
          const labelRadius = WHEEL_R * 0.58
          const labelX = Math.cos(midAngle) * labelRadius
          const labelY = Math.sin(midAngle) * labelRadius
          const labelRot = -midAngle
          return (
            <group key={i}>
              <mesh position={[0, 0, 0.05]}>
                <shapeGeometry args={[shape]} />
                <meshStandardMaterial
                  color={WHEEL_BASE_COLOR}
                  emissive={WHEEL_BASE_COLOR}
                  emissiveIntensity={0.25}
                  roughness={0.4}
                  metalness={0.2}
                  side={THREE.DoubleSide}
                />
              </mesh>
              <group position={[labelX, labelY, 0.1]} rotation={[0, 0, labelRot]}>
                <Html center transform sprite style={{ color: '#c7d2fe', fontSize: 14, fontWeight: 'bold', whiteSpace: 'nowrap', pointerEvents: 'none', textShadow: '0 0 4px #000' }}>
                  {label}
                </Html>
              </group>
            </group>
          )
        })}
        <WheelBorders />
      </group>

      {/* Pijl aan de rechterkant van het rad: vast (draait niet mee), wijst naar het vakje van de gekozen categorie (+X = rechts) */}
      <group position={[WHEEL_R + 0.6, 0, 1.5]}>
        <mesh rotation={[0, 0, Math.PI / 2]} position={[0, 0, 0.7]}>
          <coneGeometry args={[0.8, 2, 32]} />
          <meshBasicMaterial color="#dc2626" depthTest={true} depthWrite={true} />
        </mesh>
        <mesh position={[0, 0, 0.2]}>
          <cylinderGeometry args={[0.3, 0.35, 0.4, 16]} />
          <meshBasicMaterial color="#b91c1c" />
        </mesh>
      </group>
    </group>
  )
}
