import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Group } from 'three'
import { animated, useSpring } from '@react-spring/three'

interface ChessPiece3DProps {
  type: 'p' | 'n' | 'b' | 'r' | 'q' | 'k'
  color: 'w' | 'b'
  position: [number, number, number]
  isSelected?: boolean
  onClick?: () => void
}

export function ChessPiece3D({
  type,
  color,
  position,
  isSelected = false,
  onClick
}: ChessPiece3DProps) {
  const groupRef = useRef<Group>(null)
  const [hovered, setHovered] = useState(false)

  const pieceColor = color === 'w' ? '#f5f5dc' : '#2d1810'
  const emissiveColor = color === 'w' ? '#ffffff' : '#4a3728'

  const { scale, posY } = useSpring({
    scale: isSelected ? 1.1 : hovered ? 1.05 : 1,
    posY: isSelected ? 0.15 : 0,
    config: { tension: 300, friction: 20 }
  })

  useFrame((state) => {
    if (groupRef.current && isSelected) {
      groupRef.current.position.y =
        position[1] + 0.15 + Math.sin(state.clock.elapsedTime * 3) * 0.03
    }
  })

  const Material = ({ emissive = false }: { emissive?: boolean }) => (
    <meshStandardMaterial
      color={pieceColor}
      roughness={0.3}
      metalness={0.1}
      emissive={emissive && (isSelected || hovered) ? emissiveColor : '#000000'}
      emissiveIntensity={isSelected ? 0.3 : hovered ? 0.15 : 0}
    />
  )

  const renderPiece = () => {
    switch (type) {
      case 'p': // Pawn
        return (
          <>
            <mesh position={[0, 0.05, 0]} castShadow>
              <cylinderGeometry args={[0.25, 0.3, 0.1, 32]} />
              <Material />
            </mesh>
            <mesh position={[0, 0.25, 0]} castShadow>
              <cylinderGeometry args={[0.12, 0.22, 0.3, 32]} />
              <Material />
            </mesh>
            <mesh position={[0, 0.45, 0]} castShadow>
              <sphereGeometry args={[0.12, 32, 32]} />
              <Material emissive />
            </mesh>
          </>
        )

      case 'r': // Rook
        return (
          <>
            <mesh position={[0, 0.06, 0]} castShadow>
              <cylinderGeometry args={[0.28, 0.32, 0.12, 32]} />
              <Material />
            </mesh>
            <mesh position={[0, 0.32, 0]} castShadow>
              <cylinderGeometry args={[0.18, 0.24, 0.4, 32]} />
              <Material />
            </mesh>
            <mesh position={[0, 0.55, 0]} castShadow>
              <cylinderGeometry args={[0.22, 0.2, 0.1, 32]} />
              <Material />
            </mesh>
            {[0, 1, 2, 3].map((i) => (
              <mesh
                key={i}
                position={[
                  Math.cos((i * Math.PI) / 2) * 0.15,
                  0.68,
                  Math.sin((i * Math.PI) / 2) * 0.15
                ]}
                castShadow
              >
                <boxGeometry args={[0.1, 0.15, 0.1]} />
                <Material emissive={i === 0} />
              </mesh>
            ))}
          </>
        )

      case 'n': // Knight
        return (
          <>
            <mesh position={[0, 0.06, 0]} castShadow>
              <cylinderGeometry args={[0.28, 0.32, 0.12, 32]} />
              <Material />
            </mesh>
            <mesh position={[0, 0.28, 0]} castShadow>
              <cylinderGeometry args={[0.15, 0.24, 0.32, 32]} />
              <Material />
            </mesh>
            <mesh position={[0, 0.5, 0.05]} rotation={[0.3, 0, 0]} castShadow>
              <boxGeometry args={[0.18, 0.25, 0.15]} />
              <Material />
            </mesh>
            <mesh position={[0, 0.65, 0.12]} rotation={[0.5, 0, 0]} castShadow>
              <boxGeometry args={[0.15, 0.18, 0.25]} />
              <Material emissive />
            </mesh>
            <mesh position={[0, 0.72, -0.02]} castShadow>
              <coneGeometry args={[0.08, 0.15, 4]} />
              <Material />
            </mesh>
          </>
        )

      case 'b': // Bishop
        return (
          <>
            <mesh position={[0, 0.06, 0]} castShadow>
              <cylinderGeometry args={[0.26, 0.3, 0.12, 32]} />
              <Material />
            </mesh>
            <mesh position={[0, 0.35, 0]} castShadow>
              <cylinderGeometry args={[0.1, 0.22, 0.45, 32]} />
              <Material />
            </mesh>
            <mesh position={[0, 0.62, 0]} castShadow>
              <sphereGeometry args={[0.14, 32, 16]} />
              <Material />
            </mesh>
            <mesh position={[0, 0.78, 0]} castShadow>
              <sphereGeometry args={[0.06, 16, 16]} />
              <Material emissive />
            </mesh>
          </>
        )

      case 'q': // Queen
        return (
          <>
            <mesh position={[0, 0.07, 0]} castShadow>
              <cylinderGeometry args={[0.28, 0.34, 0.14, 32]} />
              <Material />
            </mesh>
            <mesh position={[0, 0.38, 0]} castShadow>
              <cylinderGeometry args={[0.12, 0.25, 0.5, 32]} />
              <Material />
            </mesh>
            <mesh position={[0, 0.68, 0]} castShadow>
              <cylinderGeometry args={[0.16, 0.14, 0.12, 32]} />
              <Material />
            </mesh>
            {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
              <mesh
                key={i}
                position={[
                  Math.cos((i * Math.PI) / 4) * 0.12,
                  0.8,
                  Math.sin((i * Math.PI) / 4) * 0.12
                ]}
                castShadow
              >
                <sphereGeometry args={[0.04, 16, 16]} />
                <Material />
              </mesh>
            ))}
            <mesh position={[0, 0.88, 0]} castShadow>
              <sphereGeometry args={[0.06, 16, 16]} />
              <Material emissive />
            </mesh>
          </>
        )

      case 'k': // King
        return (
          <>
            <mesh position={[0, 0.07, 0]} castShadow>
              <cylinderGeometry args={[0.3, 0.36, 0.14, 32]} />
              <Material />
            </mesh>
            <mesh position={[0, 0.4, 0]} castShadow>
              <cylinderGeometry args={[0.14, 0.27, 0.55, 32]} />
              <Material />
            </mesh>
            <mesh position={[0, 0.72, 0]} castShadow>
              <cylinderGeometry args={[0.18, 0.16, 0.1, 32]} />
              <Material />
            </mesh>
            <mesh position={[0, 0.9, 0]} castShadow>
              <boxGeometry args={[0.06, 0.25, 0.06]} />
              <Material emissive />
            </mesh>
            <mesh position={[0, 0.92, 0]} castShadow>
              <boxGeometry args={[0.18, 0.06, 0.06]} />
              <Material />
            </mesh>
          </>
        )

      default:
        return null
    }
  }

  return (
    <animated.group
      ref={groupRef}
      position-x={position[0]}
      position-y={posY.to((v) => position[1] + v)}
      position-z={position[2]}
      scale={scale}
      onClick={(e) => {
        e.stopPropagation()
        onClick?.()
      }}
      onPointerOver={(e) => {
        e.stopPropagation()
        setHovered(true)
        document.body.style.cursor = 'pointer'
      }}
      onPointerOut={() => {
        setHovered(false)
        document.body.style.cursor = 'default'
      }}
    >
      {renderPiece()}
    </animated.group>
  )
}
