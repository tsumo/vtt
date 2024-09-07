import { useLayoutEffect, useRef } from 'react'
import * as THREE from 'three'
import { useFrame, useThree } from '@react-three/fiber'
import { a } from '@react-spring/three'
import { useCameraZoom } from '../hooks/useCameraZoom'
import { config } from '../config'
import { useCameraDrag } from '../hooks/useCameraDrag'

export const Camera = () => {
  const ref = useRef<THREE.OrthographicCamera>(null)

  const { set, setSize } = useThree()

  const zoom = useCameraZoom()

  const [x, y] = useCameraDrag(zoom)

  useLayoutEffect(() => {
    if (ref.current) set({ camera: ref.current })
    setSize(window.innerWidth, window.innerHeight)
  }, [set, setSize])

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
