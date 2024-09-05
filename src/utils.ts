const { max, min } = Math

export const clamp = (low: number, high: number, v: number) => max(low, min(v, high))
