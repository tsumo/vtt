import { useCallback } from 'react'
import { Handler, useDrag } from '@use-gesture/react'
import { SpringValue, useSpring } from '@react-spring/three'
import { config } from '../config'
import { mapInterval } from '../utils'

export const useCameraDrag = (zoom: SpringValue<number>): [SpringValue<number>, SpringValue<number>] => {
  const [{ x, y }, set] = useSpring(() => ({ x: 0, y: 0, config: config.camera.dragSpringConfig }))

  const dragHandler = useCallback<Handler<'drag'>>(
    ({ offset: [ox, oy] }) => {
      const xCoef = mapInterval(config.camera.zoomToDragSpeedCoef, zoom.get())
      const yCoef = mapInterval(config.camera.zoomToDragSpeedCoef, zoom.get())
      void set({ x: -ox * xCoef, y: oy * yCoef })
    },
    [set, zoom],
  )

  useDrag(dragHandler, { target: window })

  return [x, y]
}