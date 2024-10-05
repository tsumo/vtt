import { useCallback, useEffect } from 'react'
import { useSpring } from '@react-spring/web'
import { Handler, usePinch, useWheel } from '@use-gesture/react'
import { globalState, useGlobalState } from '../globalState'
import { config } from '../config'
import { clamp } from '../utils'

export const useCameraZoom = () => {
  const state = useGlobalState()

  const [{ zoom }, set] = useSpring(() => ({
    zoom: state.camera.zoom,
    config: config.camera.zoomSpringConfig,
  }))

  const wheelOrPinchHandler = useCallback<Handler<'wheel' | 'pinch'>>(
    ({ delta: [_dx, dy], event, movement: [_mx, my] }) => {
      const isWheel = event.type === 'wheel'
      const y = isWheel ? dy : my
      void set({
        zoom: clamp(
          zoom.get() + Math.sign(y) * config.camera.zoomSpeedCoef * (isWheel ? -1 : 1),
          config.camera.zoomInterval[0],
          config.camera.zoomInterval[1],
        ),
      })
    },
    [set, zoom],
  )

  useWheel(wheelOrPinchHandler, { target: window })
  usePinch(wheelOrPinchHandler, { target: window })

  useEffect(() => {
    globalState.camera.setZoom = (zoom: number) => {
      void set({ zoom })
    }
  }, [set])

  return zoom
}
