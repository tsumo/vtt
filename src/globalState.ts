import { proxy, useSnapshot } from 'valtio'
import { Point2 } from './types'

export const controlModes = ['mouse', 'trackpad'] as const
export type ControlMode = (typeof controlModes)[number]

type GlobalState = {
  cursor: {
    trustedCoordinates: boolean
    screen: Point2
    world: Point2
  }
  controlMode: ControlMode
  debug: Record<string, string>
}

export const globalState = proxy<GlobalState>({
  cursor: {
    trustedCoordinates: false,
    screen: { x: 0, y: 0 },
    world: { x: 0, y: 0 },
  },
  controlMode: 'mouse',
  debug: {},
})

export const useGlobalState = () => useSnapshot(globalState)
