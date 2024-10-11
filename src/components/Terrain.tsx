import { useMemo } from 'react'
import * as THREE from 'three'
import { config } from '../config'
import { Point2 } from '../types'
import { useGlobalState } from '../globalState'

const {
  grid: { step },
  line: { width },
} = config

const halfLineWidth = width / 2

const material = new THREE.MeshBasicMaterial({
  color: config.colors.line,
  // transparent: true,
  // opacity: 0.5,
  wireframe: true,
})

const materialSelection = new THREE.MeshBasicMaterial({
  color: 'indianred',
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

const createGeometrySelection = (worldX: number, worldY: number) => {
  const xSteps = Math.floor((worldX + halfLineWidth) / step)
  const x = worldX - xSteps * step
  const ySteps = Math.floor((worldY + halfLineWidth) / step)
  const y = worldY - ySteps * step
  const left = x >= p1.x && x < p4.x
  const down = y >= p1.y && y < p2.y
  const kind = left && down ? 'center' : left ? 'vertical' : down ? 'horizontal' : 'square'
  const geo = new THREE.BufferGeometry()
  const positions: number[] = []
  if (kind === 'center') positions.push(...getCenter(xSteps * step, ySteps * step))
  if (kind === 'horizontal') positions.push(...getHorizontal(xSteps * step, ySteps * step))
  if (kind === 'vertical') positions.push(...getVertical(xSteps * step, ySteps * step))
  if (kind === 'square') positions.push(...getSquare(xSteps * step, ySteps * step))
  const f32 = new Float32Array(positions)
  geo.setAttribute('position', new THREE.BufferAttribute(f32, 3))
  return geo
}

export const Terrain = () => {
  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry()
    const positions: number[] = []
    for (let x = -3 * step; x < 3 * step; x += step) {
      for (let y = -3 * step; y < 3 * step; y += step) {
        positions.push(...concatArrays(getSquare(x, y), getCenter(x, y), getVertical(x, y), getHorizontal(x, y)))
      }
    }
    const f32 = new Float32Array(positions)
    geo.setAttribute('position', new THREE.BufferAttribute(f32, 3))
    return geo
  }, [])

  const {
    cursor: { world },
  } = useGlobalState()

  const geometrySelection = useMemo(() => createGeometrySelection(world.x, world.y), [world])

  return (
    <>
      <mesh args={[geometry, material]} />
      <mesh args={[geometrySelection, materialSelection]} />
    </>
  )
}
