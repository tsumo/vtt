import { Interval } from './types'

const { max, min, PI, sin, cos } = Math

export const clamp = (low: number, high: number, v: number) => max(low, min(v, high))

export const mapInterval = ([in1Start, in1End, in2Start, in2End]: Interval, value: number) =>
  ((value - in1Start) * (in2End - in2Start)) / (in1End - in1Start) + in2Start

const DEG = 180 / PI
const RAD = PI / 180

export const rad2deg = (rad: number) => rad * DEG

export const deg2rad = (deg: number) => deg * RAD

export const rotateAround = (centerX: number, centerY: number, x: number, y: number, rad: number): [number, number] => {
  const cosR = cos(rad)
  const sinR = sin(rad)
  const rx = (x - centerX) * cosR + (y - centerY) * sinR + centerX
  const ry = (y - centerY) * cosR - (x - centerX) * sinR + centerY
  return [rx, ry]
}

export const getCirclePoint = (angle: number, radius = 1, offsetX = 0, offsetY = 0): [number, number] => [
  cos(angle) * radius + offsetX,
  sin(angle) * radius + offsetY,
]

export const rads = {
  45: PI / 4,
  90: PI / 2,
  135: (3 * PI) / 4,
  180: PI,
  225: (5 * PI) / 4,
  270: (3 * PI) / 2,
  315: (7 * PI) / 4,
}
