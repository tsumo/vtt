import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { useFrame, useThree } from '@react-three/fiber'
import { a } from '@react-spring/three'
import { useCameraZoom } from '../hooks/useCameraZoom'
import { config } from '../config'

export const Camera = () => {
  const ref = useRef<THREE.OrthographicCamera>(null)

  const { camera, set } = useThree()

  const zoom = useCameraZoom()

  useEffect(() => {
    if (ref.current) set({ camera: ref.current })
  }, [set])

  useFrame(() => {
    camera.updateProjectionMatrix()
  })

  return <a.orthographicCamera ref={ref} zoom={zoom} up={config.camera.up} far={config.camera.far} />
}
