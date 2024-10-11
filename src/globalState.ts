import { proxy, useSnapshot } from 'valtio'
import { config } from './config'
import { Point2 } from './types'

const functionPlaceholder = () => void 0

type SetNumber = (n: number) => void

type GlobalState = {
  camera: {
    zoom: number
    setZoom: SetNumber
  }
  cursor: {
    screen: Point2
    world: Point2
  }
  debug: Record<string, string | number>
}

export const globalState = proxy<GlobalState>({
  camera: {
    zoom: config.camera.zoomInterval[1],
    setZoom: functionPlaceholder,
  },
  cursor: {
    screen: { x: 0, y: 0 },
    world: { x: 0, y: 0 },
  },
  debug: {},
})

export const useGlobalState = () => useSnapshot(globalState)
