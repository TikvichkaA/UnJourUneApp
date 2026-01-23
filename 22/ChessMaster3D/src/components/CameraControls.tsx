import { useRef, useEffect } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { Vector3 } from 'three'
import { useSettingsStore } from '../store/settingsStore'

interface CameraControlsProps {
  onResetCamera?: () => void
}

export function CameraControls({ onResetCamera }: CameraControlsProps) {
  const controlsRef = useRef<any>(null)
  const { camera } = useThree()
  const { cameraAutoRotate, cameraSensitivity } = useSettingsStore()

  // Default camera position
  const defaultPosition = new Vector3(0, 8, 10)
  const defaultTarget = new Vector3(0, 0, 0)

  useEffect(() => {
    camera.position.copy(defaultPosition)
    camera.lookAt(defaultTarget)
  }, [camera])

  // Expose reset function
  useEffect(() => {
    if (onResetCamera) {
      const resetFn = () => {
        camera.position.copy(defaultPosition)
        if (controlsRef.current) {
          controlsRef.current.target.copy(defaultTarget)
          controlsRef.current.update()
        }
      }
      // Store in window for external access
      ;(window as any).resetChessCamera = resetFn
    }
  }, [camera, onResetCamera])

  useFrame(() => {
    if (controlsRef.current && cameraAutoRotate) {
      controlsRef.current.autoRotate = true
      controlsRef.current.autoRotateSpeed = 0.5
    } else if (controlsRef.current) {
      controlsRef.current.autoRotate = false
    }
  })

  return (
    <OrbitControls
      ref={controlsRef}
      enablePan={false}
      minDistance={5}
      maxDistance={20}
      minPolarAngle={Math.PI / 6}
      maxPolarAngle={Math.PI / 2.2}
      rotateSpeed={cameraSensitivity}
      target={defaultTarget}
    />
  )
}
