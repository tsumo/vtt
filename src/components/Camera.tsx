import { useLayoutEffect, useRef } from 'react'
import * as THREE from 'three'
import { useThree } from '@react-three/fiber'
import { useCameraControls } from '../hooks/useCameraControls'
import { config } from '../config'

export const Camera = () => {
  const ref = useRef<THREE.OrthographicCamera>(null)
  const zoomInitialized = useRef(false)

  const { set, size } = useThree()

  useCameraControls()

  useLayoutEffect(() => {
    const camera = ref.current
    if (!camera) return
    if (!zoomInitialized.current) {
      camera.zoom = config.camera.zoomBounds[1]
      zoomInitialized.current = true
    }
    // R3F only recomputes a camera's frustum on `size` changes, not on `camera` changes
    camera.left = size.width / -2
    camera.right = size.width / 2
    camera.top = size.height / 2
    camera.bottom = size.height / -2
    camera.updateProjectionMatrix()
    set({ camera })
  }, [set, size])

  return (
    <orthographicCamera position-z={config.zCoords.camera} ref={ref} up={config.camera.up} far={config.camera.far} />
  )
}
