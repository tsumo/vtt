import * as THREE from 'three'
import { V2 } from '../types'
import { config } from '../config'

const {
  line: { width: lineWidth },
  grid: { step: gridStep },
} = config

const halfLineWidth = lineWidth / 2

const points: V2[] = [
  [0, 0],
  [1, 1],
  [1, 2],
]

const vertices: number[] = []
for (let i = 0; i < points.length - 1; i++) {
  const x1 = points[i][0] * gridStep
  const y1 = points[i][1] * gridStep
  const x2 = points[i + 1][0] * gridStep
  const y2 = points[i + 1][1] * gridStep
  const point1 = [x1 - halfLineWidth, y1, 0]
  const point2 = [x1 + halfLineWidth, y1, 0]
  const point3 = [x2 - halfLineWidth, y2, 0]
  const point4 = [x2 + halfLineWidth, y2, 0]
  vertices.push(...point1, ...point2, ...point3)
  vertices.push(...point2, ...point4, ...point3)
}

const geometry = new THREE.BufferGeometry()
geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(vertices), 3))

const material = new THREE.MeshBasicMaterial({
  color: 'lightblue',
})

export const Line = () => {
  return (
    <>
      <mesh args={[geometry, material]} />
    </>
  )
}
