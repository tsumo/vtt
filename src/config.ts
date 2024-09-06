type V2 = [number, number]
type V3 = [number, number, number]

export const config = {
  camera: {
    up: [0, 0, 1] as V3,
    far: 150,
    zoomSpeedCoef: 2,
    zoomInterval: [2, 10] as V2,
    springConfig: { mass: 1, tension: 35, friction: 11, precision: 0.0001 },
  },
  zCoords: {
    grid: -100,
    camera: 10,
  },
}
