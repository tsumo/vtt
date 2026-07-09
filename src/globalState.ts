import { proxy, useSnapshot } from 'valtio'
import { Point2 } from './types'

export const interactionModes = ['line', 'terrain'] as const
export type InteractionMode = (typeof interactionModes)[number]

export const controlModes = ['mouse', 'trackpad'] as const
export type ControlMode = (typeof controlModes)[number]

type GlobalState = {
  cursor: {
    trustedCoordinates: boolean
    screen: Point2
    world: Point2
  }
  interactionMode: InteractionMode
  controlMode: ControlMode
  debug: Record<string, string>
}

export const globalState = proxy<GlobalState>({
  cursor: {
    trustedCoordinates: false,
    screen: { x: 0, y: 0 },
    world: { x: 0, y: 0 },
  },
  interactionMode: 'line',
  controlMode: 'mouse',
  debug: {},
})

export const useGlobalState = () => useSnapshot(globalState)
