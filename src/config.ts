import { V2, V3 } from './types'

export const config = {
  camera: {
    up: [0, 0, 1] as V3,
    far: 150,
    zoomBounds: [2, 10] as V2,
    wheelZoomSpeed: 0.01,
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
