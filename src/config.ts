import { Interval, V2, V3 } from './types'

export const config = {
  camera: {
    up: [0, 0, 1] as V3,
    far: 150,
    zoomBounds: [2, 10] as V2,
    zoomSpringConfig: { mass: 1, tension: 35, friction: 11, precision: 0.0001 },
    dragSpringConfig: { mass: 1, tension: 35, friction: 21, precision: 0.0001 },
    zoomToDragSpeedCoef: [2, 10, 15.0, 3.0] as Interval,
  },
  zCoords: {
    grid: -100,
    camera: 10,
  },
  colors: {
    terrain: '#4493be',
  },
  line: {
    width: 2,
  },
  grid: {
    length: 200,
    step: 10,
  },
}
