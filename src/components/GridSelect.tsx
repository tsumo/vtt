import { useEffect, useState } from 'react'
import * as THREE from 'three'
import { config } from '../config'
import { Point2 } from '../types'
import { useGlobalState } from '../globalState'

const {
  grid: { step },
} = config

const constructPlaneGeometry = ({ x, y }: Point2 = { x: 1, y: 1 }) => {
  const geometry = new THREE.BufferGeometry()
  const p1 = [x * step - step, y * step - step, 0]
  const p2 = [x * step - step, y * step, 0]
  const p3 = [x * step, y * step, 0]
  const p4 = [x * step, y * step - step, 0]
  const f32points = new Float32Array([...p1, ...p2, ...p3, ...p1, ...p3, ...p4])
  geometry.setAttribute('position', new THREE.BufferAttribute(f32points, 3))
  return geometry
}

const material = new THREE.MeshBasicMaterial({
  color: config.colors.line,
  //   transparent: true,
  // opacity: 0.5,
  side: THREE.DoubleSide,
  // wireframe: true,
})

const getCell = ({ x, y }: Point2) => {
  return {
    x: Math.ceil(x / step),
    y: Math.ceil(y / step),
  }
}

export const GridSelect = () => {
  const {
    cursor: { world },
  } = useGlobalState()

  const [geometry, setGeometry] = useState(constructPlaneGeometry)

  useEffect(() => {
    setGeometry(constructPlaneGeometry(getCell(world)))
  }, [world])

  return <mesh args={[geometry, material]} />
}
