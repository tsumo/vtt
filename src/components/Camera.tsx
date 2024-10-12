import { useLayoutEffect, useRef } from 'react'
import * as THREE from 'three'
import { useFrame, useThree } from '@react-three/fiber'
import { a } from '@react-spring/three'
import { useCamera } from '../hooks/useCamera'
import { config } from '../config'

export const Camera = () => {
  const ref = useRef<THREE.OrthographicCamera>(null)

  const { set, setSize } = useThree()

  const { x, y, zoom } = useCamera()

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
