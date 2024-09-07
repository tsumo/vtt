import { Interval, V2, V3 } from './types'

export const config = {
  camera: {
    up: [0, 0, 1] as V3,
    far: 150,
    zoomSpeedCoef: 2,
    zoomInterval: [2, 10] as V2,
    zoomSpringConfig: { mass: 1, tension: 35, friction: 11, precision: 0.0001 },
    dragSpringConfig: { mass: 1, tension: 35, friction: 11 },
    zoomToDragSpeedCoef: [2, 10, 0.4, 0.1] as Interval,
  },
  zCoords: {
    grid: -100,
    camera: 10,
  },
}
