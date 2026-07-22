import { useEffect, useState } from 'react'
import { useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { V2 } from '../types'
import { config } from '../config'
import { getCirclePoint, nullable, rads, tripletOrientation } from '../utils'
import { globalState, useGlobalState } from '../globalState'
import { selectionMaterial, terrainMaterial } from '../materials'
import { useRenderTrigger } from '../hooks/useRenderTrigger'

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

class LineTool {
  private lines: V2[][] = []
  drawing = false
  geometry: THREE.BufferGeometry = constructLineGeometry([])

  private rightButtonDown = false
  private rightDragged = false
  private rightDownX = 0
  private rightDownY = 0

  private canvasElement: HTMLElement | null = null

  constructor(private renderTrigger: () => void) {}

  private recalculateGeometry() {
    this.geometry = constructLineGeometry(this.lines)
  }

  startLine(point: V2) {
    this.lines.push([point])
    this.drawing = true
    this.recalculateGeometry()
    this.renderTrigger()
  }

  addPoint(point: V2) {
    if (!this.drawing) return
    const activeLine = this.lines.at(-1)
    const lastPoint = activeLine?.at(-1)
    if (!activeLine || !lastPoint) return
    if (lastPoint[0] === point[0] && lastPoint[1] === point[1]) return
    activeLine.push(point)
    this.recalculateGeometry()
    this.renderTrigger()
  }

  endLine() {
    this.drawing = false
    this.renderTrigger()
  }

  getPreviewGeometry(cursorPoint: V2): THREE.BufferGeometry | null {
    if (!this.drawing) return null
    const lastPoint = this.lines.at(-1)?.at(-1)
    if (!lastPoint) return null
    return constructLineGeometry([[lastPoint, cursorPoint]])
  }

  private handleMouseDown = (event: MouseEvent) => {
    if (event.button === 0) {
      if (!globalState.cursor.trustedCoordinates) return
      const point: V2 = [globalState.cursor.world.x / gridStep, globalState.cursor.world.y / gridStep]
      if (this.drawing) {
        this.addPoint(point)
      } else {
        this.startLine(point)
      }
    } else if (event.button === 2) {
      this.rightButtonDown = true
      this.rightDragged = false
      this.rightDownX = event.clientX
      this.rightDownY = event.clientY
    }
  }

  private handleMouseMove = (event: MouseEvent) => {
    if (!this.rightButtonDown) return
    const dist = Math.hypot(event.clientX - this.rightDownX, event.clientY - this.rightDownY)
    if (dist > rightClickMoveThreshold) this.rightDragged = true
  }

  private handleMouseUp = (event: MouseEvent) => {
    if (event.button !== 2) return
    if (this.rightButtonDown && !this.rightDragged) this.endLine()
    this.rightButtonDown = false
  }

  attach(canvasElement: HTMLElement) {
    this.canvasElement = canvasElement
    canvasElement.addEventListener('mousedown', this.handleMouseDown)
    window.addEventListener('mousemove', this.handleMouseMove)
    window.addEventListener('mouseup', this.handleMouseUp)
  }

  dispose() {
    this.canvasElement?.removeEventListener('mousedown', this.handleMouseDown)
    window.removeEventListener('mousemove', this.handleMouseMove)
    window.removeEventListener('mouseup', this.handleMouseUp)
  }
}

export const Line = () => {
  const {
    cursor: { world },
  } = useGlobalState()
  const { gl } = useThree()

  const renderTrigger = useRenderTrigger()
  const [lineTool] = useState(() => new LineTool(renderTrigger))

  useEffect(() => {
    lineTool.attach(gl.domElement)
    return () => lineTool.dispose()
  }, [lineTool, gl])

  const previewGeometry = lineTool.getPreviewGeometry([world.x / gridStep, world.y / gridStep])

  return (
    <>
      <mesh args={[lineTool.geometry, terrainMaterial]} />
      {nullable(previewGeometry, (geo) => (
        <mesh args={[geo, selectionMaterial]} />
      ))}
    </>
  )
}
