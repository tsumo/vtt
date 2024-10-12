import { useCallback } from 'react'
import { useSpring } from '@react-spring/web'
import { Handler, useGesture } from '@use-gesture/react'
import { config } from '../config'
import { rangeMap } from '../utils'

export const useCamera = () => {
  const [{ x, y }, setPosition] = useSpring(() => ({
    x: 0,
    y: 0,
    config: config.camera.dragSpringConfig,
  }))

  const [{ zoom }, setZoom] = useSpring(() => ({
    zoom: config.camera.zoomBounds[1],
    config: config.camera.zoomSpringConfig,
  }))

  const wheelHandler = useCallback<Handler<'wheel'>>(
    ({ delta: [dx, dy], pinching }) => {
      if (pinching) return
      const xCoef = rangeMap(config.camera.zoomToDragSpeedCoef, zoom.get())
      const yCoef = rangeMap(config.camera.zoomToDragSpeedCoef, zoom.get())
      void setPosition((_, state) => {
        const { x: xx, y: yy } = state.get()
        return { x: xx + dx * xCoef, y: yy + -dy * yCoef }
      })
    },
    [setPosition, zoom],
  )

  const pinchHandler = useCallback<Handler<'pinch'>>(
    ({ offset: [ox] }) => {
      void setZoom({ zoom: ox })
    },
    [setZoom],
  )

  useGesture(
    {
      onPinch: pinchHandler,
      onWheel: wheelHandler,
    },
    {
      target: window,
      pinch: { scaleBounds: { min: config.camera.zoomBounds[0], max: config.camera.zoomBounds[1] } },
    },
  )

  return { x, y, zoom }
}
