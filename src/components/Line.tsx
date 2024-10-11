import { useEffect, useState } from 'react'
import * as THREE from 'three'
import { V2 } from '../types'
import { config } from '../config'
import { getCirclePoint, rads, tripletOrientation } from '../utils'
import { useGlobalState } from '../globalState'
import { terrainMaterial } from '../materials'

const {
  line: { width: lineWidth },
  grid: { step: gridStep },
} = config

const halfLineWidth = lineWidth / 2

const constructLineGeometry = (points: V2[]): THREE.BufferGeometry => {
  const vertices: number[] = []
  const paddedPoints = [...points, points.at(-1) as V2]
  for (let i = 0; i < points.length - 1; i++) {
    const start = { x: paddedPoints[i][0] * gridStep, y: paddedPoints[i][1] * gridStep }
    const end = { x: paddedPoints[i + 1][0] * gridStep, y: paddedPoints[i + 1][1] * gridStep }
    const next = { x: paddedPoints[i + 2][0] * gridStep, y: paddedPoints[i + 2][1] * gridStep }

    // All lines start at this position and then get rotated
    //    p1 +------------------+ p2
    //       |                  |
    // start +                  + end
    //       |                  |
    //    p4 +------------------+ p3

    const angle = Math.atan2(end.y - start.y, end.x - start.x)
    const upperPointsAngle = angle - rads[90]
    const lowerPointsAngle = angle + rads[90]
    const p1 = [...getCirclePoint(upperPointsAngle, halfLineWidth, start.x, start.y), 0]
    const p2 = [...getCirclePoint(upperPointsAngle, halfLineWidth, end.x, end.y), 0]
    const p3 = [...getCirclePoint(lowerPointsAngle, halfLineWidth, end.x, end.y), 0]
    const p4 = [...getCirclePoint(lowerPointsAngle, halfLineWidth, start.x, start.y), 0]

    const orientationEnd = tripletOrientation(start, end, next)
    const patchTriangle: number[] = []
    const nextAngle = Math.atan2(next.y - end.y, next.x - end.x)
    if (orientationEnd > 0) {
      const nextP4 = [...getCirclePoint(nextAngle + rads[90], halfLineWidth, end.x, end.y), 0]
      patchTriangle.push(...p3, end.x, end.y, 0, ...nextP4)
    }
    if (orientationEnd < 0) {
      const nextP1 = [...getCirclePoint(nextAngle - rads[90], halfLineWidth, end.x, end.y), 0]
      patchTriangle.push(end.x, end.y, 0, ...p2, ...nextP1)
    }

    vertices.push(...p1, ...p2, ...p3)
    vertices.push(...p1, ...p3, ...p4)
    vertices.push(...patchTriangle)
  }

  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(vertices), 3))
  return geometry
}

const points: V2[] = [
  [0, 0],
  [1, 1],
  [1, 2],
  [0, 1],
  [-1, 1],
  [-1, 3],
]

export const Line = () => {
  const {
    cursor: { world },
  } = useGlobalState()

  const [geometry, setGeometry] = useState(() => constructLineGeometry(points))

  useEffect(() => {
    setGeometry(constructLineGeometry([...points, [world.x / gridStep, world.y / gridStep]]))
  }, [world.x, world.y])

  return (
    <>
      <mesh args={[geometry, terrainMaterial]} />
    </>
  )
}
