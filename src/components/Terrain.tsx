import { useEffect, useMemo, useState } from 'react'
import { snapshot } from 'valtio'
import * as THREE from 'three'
import { config } from '../config'
import { Point2 } from '../types'
import { globalState, useGlobalState } from '../globalState'
import { terrainMaterial } from '../materials'
import { nullable } from '../utils'

const {
  grid: { step },
  line: { width },
} = config

const halfLineWidth = width / 2

const materialSelection = new THREE.MeshBasicMaterial({
  color: 'indianred',
  opacity: 0.5,
  transparent: true,
})

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

const schema: Record<string, undefined | null> = {}

const generateGeometryFromSchema = (width = 3, height = 3) => {
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

export const Terrain = () => {
  const [geometry, setGeometry] = useState(generateGeometryFromSchema)

  useEffect(() => {
    const handleMouseClick = () => {
      const {
        trustedCoordinates,
        world: { x, y },
      } = snapshot(globalState.cursor)
      if (!trustedCoordinates) return
      const key = getSchemaKey(x, y)
      if (key in schema) {
        // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
        delete schema[key]
      } else {
        schema[key] = null
      }
      setGeometry(generateGeometryFromSchema())
    }
    window.addEventListener('mousedown', handleMouseClick)
    return () => {
      window.removeEventListener('mousedown', handleMouseClick)
    }
  }, [])

  const {
    cursor: { world, trustedCoordinates },
  } = useGlobalState()

  const geometrySelection = useMemo(() => createGeometrySelection(world.x, world.y), [world])

  return (
    <>
      <mesh args={[geometry, terrainMaterial]} />
      {nullable(trustedCoordinates, () => (
        <mesh args={[geometrySelection, materialSelection]} />
      ))}
    </>
  )
}
