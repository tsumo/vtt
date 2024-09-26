import * as THREE from 'three'
import { V2 } from '../types'
import { config } from '../config'
import { getCirclePoint, rads } from '../utils'

const {
  line: { width: lineWidth },
  grid: { step: gridStep },
} = config

const halfLineWidth = lineWidth / 2

const points: V2[] = [
  [0, 0],
  [1, 1],
  [1, 2],
  [0, 1],
  [-1, 1],
  [-1, 3],
]

const vertices: number[] = []
for (let i = 0; i < points.length - 1; i++) {
  const x1 = points[i][0] * gridStep
  const y1 = points[i][1] * gridStep
  const x2 = points[i + 1][0] * gridStep
  const y2 = points[i + 1][1] * gridStep
  const angle = Math.atan2(y2 - y1, x2 - x1)

  // All lines start at this position and then get rotated
  //    p1 +--------------+ p2
  //       |              |
  // x1,y1 +              + x2,y2
  //       |              |
  //    p4 +--------------+ p3

  const upperPointsAngle = angle - rads[90]
  const lowerPointsAngle = angle + rads[90]
  const p1 = [...getCirclePoint(upperPointsAngle, halfLineWidth, x1, y1), 0]
  const p2 = [...getCirclePoint(upperPointsAngle, halfLineWidth, x2, y2), 0]
  const p3 = [...getCirclePoint(lowerPointsAngle, halfLineWidth, x2, y2), 0]
  const p4 = [...getCirclePoint(lowerPointsAngle, halfLineWidth, x1, y1), 0]

  vertices.push(...p1, ...p2, ...p3)
  vertices.push(...p1, ...p3, ...p4)
}

const geometry = new THREE.BufferGeometry()
geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(vertices), 3))

const material = new THREE.MeshBasicMaterial({
  color: config.colors.line,
  transparent: true,
  opacity: 0.5,
  // side: THREE.DoubleSide,
  wireframe: true,
})

export const Line = () => {
  return (
    <>
      <mesh args={[geometry, material]} />
    </>
  )
}
