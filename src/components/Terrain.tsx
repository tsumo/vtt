import { useEffect, useMemo, useState } from 'react'
import { useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { config } from '../config'
import { Point2 } from '../types'
import { globalState, useGlobalState } from '../globalState'
import { selectionMaterial, terrainMaterial } from '../materials'
import { nullable } from '../utils'
import { useRenderTrigger } from '../hooks/useRenderTrigger'

const {
  grid: { step },
  line: { width },
} = config

const halfLineWidth = width / 2

const concatArrays = <T,>(first: T[], ...rest: T[][]) => first.concat(...rest)

// P2 +---+ P3
//    | / |
// P1 +---+ P4

const pointsToPositions = (p1: Point2, p2: Point2, p3: Point2, p4: Point2, offsetX = 0, offsetY = 0): number[] => {
  return concatArrays(
    [p1.x + offsetX, p1.y + offsetY, 0],
    [p3.x + offsetX, p3.y + offsetY, 0],
    [p2.x + offsetX, p2.y + offsetY, 0],
    [p1.x + offsetX, p1.y + offsetY, 0],
    [p4.x + offsetX, p4.y + offsetY, 0],
    [p3.x + offsetX, p3.y + offsetY, 0],
  )
}

//        P6
// P5 +--+-------+ P7
//    |  |       |
//    |  |P3     |
// P2 +--+-------+ P8
//    |  | P4    |
// P1 +--+-------+ P9

const p1 = { x: -halfLineWidth, y: -halfLineWidth }
const p2 = { x: -halfLineWidth, y: halfLineWidth }
const p3 = { x: halfLineWidth, y: halfLineWidth }
const p4 = { x: halfLineWidth, y: -halfLineWidth }
const p5 = { x: -halfLineWidth, y: -halfLineWidth + step }
const p6 = { x: halfLineWidth, y: -halfLineWidth + step }
const p7 = { x: -halfLineWidth + step, y: -halfLineWidth + step }
const p8 = { x: -halfLineWidth + step, y: halfLineWidth }
const p9 = { x: -halfLineWidth + step, y: -halfLineWidth }

const getSquare = (offsetX: number, offsetY: number) => {
  return pointsToPositions(p3, p6, p7, p8, offsetX, offsetY)
}

const getCenter = (offsetX: number, offsetY: number) => {
  return pointsToPositions(p1, p2, p3, p4, offsetX, offsetY)
}

const getVertical = (offsetX: number, offsetY: number) => {
  return pointsToPositions(p2, p5, p6, p3, offsetX, offsetY)
}

const getHorizontal = (offsetX: number, offsetY: number) => {
  return pointsToPositions(p4, p3, p8, p9, offsetX, offsetY)
}

type TerrainSchema = Record<string, undefined | null>

const generateGeometryFromSchema = (schema: TerrainSchema, width = 3, height = 3) => {
  const geo = new THREE.BufferGeometry()
  const positions: number[] = []
  for (let x = -width; x < width; x++) {
    for (let y = -height; y < height; y++) {
      const xx = x * step
      const yy = y * step
      if (!(`c${x}.${y}` in schema)) positions.push(...getCenter(xx, yy))
      if (!(`v${x}.${y}` in schema)) positions.push(...getVertical(xx, yy))
      if (!(`h${x}.${y}` in schema)) positions.push(...getHorizontal(xx, yy))
      if (!(`s${x}.${y}` in schema)) positions.push(...getSquare(xx, yy))
    }
  }
  const f32 = new Float32Array(positions)
  geo.setAttribute('position', new THREE.BufferAttribute(f32, 3))
  return geo
}

type TerrainKind = 'c' | 'h' | 'v' | 's'

const getTerrainCoordinates = (worldX: number, worldY: number): { kind: TerrainKind; x: number; y: number } => {
  const xSteps = Math.floor((worldX + halfLineWidth) / step)
  const x = worldX - xSteps * step
  const ySteps = Math.floor((worldY + halfLineWidth) / step)
  const y = worldY - ySteps * step
  const left = x >= p1.x && x < p4.x
  const down = y >= p1.y && y < p2.y
  const kind = left && down ? 'c' : left ? 'v' : down ? 'h' : 's'
  return { kind, x: xSteps, y: ySteps }
}

const getSchemaKey = (worldX: number, worldY: number) => {
  const { kind, x, y } = getTerrainCoordinates(worldX, worldY)
  return `${kind}${x}.${y}`
}

const createGeometrySelection = (worldX: number, worldY: number) => {
  const { kind, x, y } = getTerrainCoordinates(worldX, worldY)
  const geo = new THREE.BufferGeometry()
  const positions: number[] = []
  if (kind === 'c') positions.push(...getCenter(x * step, y * step))
  if (kind === 'h') positions.push(...getHorizontal(x * step, y * step))
  if (kind === 'v') positions.push(...getVertical(x * step, y * step))
  if (kind === 's') positions.push(...getSquare(x * step, y * step))
  const f32 = new Float32Array(positions)
  geo.setAttribute('position', new THREE.BufferAttribute(f32, 3))
  return geo
}

class TerrainTool {
  private schema: TerrainSchema = {}
  geometry: THREE.BufferGeometry = generateGeometryFromSchema(this.schema)

  private canvasElement: HTMLElement | null = null

  constructor(private renderTrigger: () => void) {}

  private recalculateGeometry() {
    this.geometry = generateGeometryFromSchema(this.schema)
  }

  toggleTile(worldX: number, worldY: number) {
    const key = getSchemaKey(worldX, worldY)
    if (key in this.schema) {
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete this.schema[key]
    } else {
      this.schema[key] = null
    }
    this.recalculateGeometry()
    this.renderTrigger()
  }

  getSelectionGeometry(worldX: number, worldY: number): THREE.BufferGeometry {
    return createGeometrySelection(worldX, worldY)
  }

  private handleMouseDown = (event: MouseEvent) => {
    if (event.buttons !== 1) return
    const { trustedCoordinates, world } = globalState.cursor
    if (!trustedCoordinates) return
    this.toggleTile(world.x, world.y)
  }

  attach(canvasElement: HTMLElement) {
    this.canvasElement = canvasElement
    canvasElement.addEventListener('mousedown', this.handleMouseDown)
  }

  dispose() {
    this.canvasElement?.removeEventListener('mousedown', this.handleMouseDown)
  }
}

export const Terrain = () => {
  const {
    cursor: { world, trustedCoordinates },
  } = useGlobalState()
  const { gl } = useThree()

  const renderTrigger = useRenderTrigger()
  const [terrainTool] = useState(() => new TerrainTool(renderTrigger))

  useEffect(() => {
    terrainTool.attach(gl.domElement)
    return () => terrainTool.dispose()
  }, [terrainTool, gl])

  const selectionGeometry = useMemo(
    () => terrainTool.getSelectionGeometry(world.x, world.y),
    [terrainTool, world.x, world.y],
  )

  return (
    <>
      <mesh args={[terrainTool.geometry, terrainMaterial]} />
      {nullable(trustedCoordinates, () => (
        <mesh args={[selectionGeometry, selectionMaterial]} />
      ))}
    </>
  )
}
