import { proxy, useSnapshot } from 'valtio'
import { Point2 } from './types'

type GlobalState = {
  cursor: {
    trustedCoordinates: boolean
    screen: Point2
    world: Point2
  }
  debug: Record<string, string>
}

export const globalState = proxy<GlobalState>({
  cursor: {
    trustedCoordinates: false,
    screen: { x: 0, y: 0 },
    world: { x: 0, y: 0 },
  },
  debug: {},
})

export const useGlobalState = () => useSnapshot(globalState)
