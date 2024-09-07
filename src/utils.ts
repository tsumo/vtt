import { Interval } from './types'

const { max, min } = Math

export const clamp = (low: number, high: number, v: number) => max(low, min(v, high))

export const mapInterval = ([in1Start, in1End, in2Start, in2End]: Interval, value: number) =>
  ((value - in1Start) * (in2End - in2Start)) / (in1End - in1Start) + in2Start
