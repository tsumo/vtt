import { useLayoutEffect, useRef } from 'react'
import * as THREE from 'three'
import { useFrame, useThree } from '@react-three/fiber'
import { a } from '@react-spring/three'
import { useCamera } from '../hooks/useCamera'
import { config } from '../config'

export const Camera = () => {
  const ref = useRef<THREE.OrthographicCamera>(null)

  const { set, size } = useThree()

  const { x, y, zoom } = useCamera()

  useLayoutEffect(() => {
    const camera = ref.current
    if (!camera) return
    // R3F only recomputes a camera's frustum on `size` changes, not on `camera` changes
    camera.left = size.width / -2
    camera.right = size.width / 2
    camera.top = size.height / 2
    camera.bottom = size.height / -2
    camera.updateProjectionMatrix()
    set({ camera })
  }, [set, size])

  useFrame(({ camera }) => {
    camera.updateProjectionMatrix()
  })

  return (
    <a.orthographicCamera
      position-x={x}
      position-y={y}
      position-z={config.zCoords.camera}
      ref={ref}
      zoom={zoom}
      up={config.camera.up}
      far={config.camera.far}
    />
  )
}
