import { useEffect, useMemo, useState } from 'react'
import * as THREE from 'three'
import { V2 } from '../types'
import { config } from '../config'
import { getCirclePoint, nullable, rads, tripletOrientation } from '../utils'
import { globalState, useGlobalState } from '../globalState'
import { selectionMaterial, terrainMaterial } from '../materials'

const {
  line: { width: lineWidth },
  grid: { step: gridStep },
} = config

const halfLineWidth = lineWidth / 2

const rightClickMoveThreshold = 5

const buildLineVertices = (points: V2[]): number[] => {
  if (points.length < 2) return []
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
  return vertices
}

const constructLineGeometry = (lines: V2[][]): THREE.BufferGeometry => {
  const vertices = lines.flatMap(buildLineVertices)
  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(vertices), 3))
  return geometry
}

type DrawState = { lines: V2[][]; drawing: boolean }

export const Line = () => {
  const {
    cursor: { world },
  } = useGlobalState()

  const [state, setState] = useState<DrawState>({ lines: [], drawing: false })

  useEffect(() => {
    let rightButtonDown = false
    let rightDragged = false
    let rightDownX = 0
    let rightDownY = 0

    const handleMouseDown = (event: MouseEvent) => {
      if (event.button === 0) {
        if (!globalState.cursor.trustedCoordinates) return
        const point: V2 = [globalState.cursor.world.x / gridStep, globalState.cursor.world.y / gridStep]
        setState((prev) => {
          if (!prev.drawing) return { lines: [...prev.lines, [point]], drawing: true }
          const activeLine = prev.lines.at(-1)
          const lastPoint = activeLine?.at(-1)
          if (!activeLine || !lastPoint) return prev
          if (lastPoint[0] === point[0] && lastPoint[1] === point[1]) return prev
          const lines = prev.lines.slice()
          lines[lines.length - 1] = [...activeLine, point]
          return { lines, drawing: true }
        })
      } else if (event.button === 2) {
        rightButtonDown = true
        rightDragged = false
        rightDownX = event.clientX
        rightDownY = event.clientY
      }
    }

    const handleMouseMove = (event: MouseEvent) => {
      if (!rightButtonDown) return
      const dist = Math.hypot(event.clientX - rightDownX, event.clientY - rightDownY)
      if (dist > rightClickMoveThreshold) rightDragged = true
    }

    const handleMouseUp = (event: MouseEvent) => {
      if (event.button !== 2) return
      if (rightButtonDown && !rightDragged) setState((prev) => ({ ...prev, drawing: false }))
      rightButtonDown = false
    }

    window.addEventListener('mousedown', handleMouseDown)
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)
    return () => {
      window.removeEventListener('mousedown', handleMouseDown)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [])

  const geometry = useMemo(() => constructLineGeometry(state.lines), [state.lines])

  const previewGeometry = useMemo(() => {
    const lastPoint = state.drawing ? state.lines.at(-1)?.at(-1) : undefined
    if (!lastPoint) return null
    const pointAtCursor: V2 = [world.x / gridStep, world.y / gridStep]
    return constructLineGeometry([[lastPoint, pointAtCursor]])
  }, [state, world.x, world.y])

  return (
    <>
      <mesh args={[geometry, terrainMaterial]} />
      {nullable(previewGeometry, (geo) => (
        <mesh args={[geo, selectionMaterial]} />
      ))}
    </>
  )
}
