export const config = {
  camera: {
    up: [0, 0, 1],
    far: 150,
    zoomCoef: 30,
    zoomInterval: [0.003, 0.01],
    springConfig: { mass: 1, tension: 35, friction: 11, precision: 0.0001 },
  },
  zCoords: {
    grid: -100,
    camera: 10,
  },
} as const
