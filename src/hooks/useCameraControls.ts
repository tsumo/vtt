import { useCallback } from 'react'
import { Handler, useGesture } from '@use-gesture/react'
import { useThree } from '@react-three/fiber'
import { config } from '../config'
import { clamp, clientToScreen, screenToWorld } from '../utils'
import { useThreeRef } from './useThreeRef'
import { globalState } from '../globalState'

export const useCameraControls = () => {
  const { camera, size } = useThree()
  const vecRef = useThreeRef('vector3')

  const zoomToPoint = useCallback(
    (nextZoomRaw: number, clientX: number, clientY: number) => {
      const [min, max] = config.camera.zoomBounds
      const nextZoom = clamp(nextZoomRaw, min, max)
      if (nextZoom === camera.zoom) return
      const { x: screenX, y: screenY } = clientToScreen(clientX, clientY, size.width, size.height)
      const worldBefore = screenToWorld(camera, vecRef.current, screenX, screenY)
      camera.position.x = worldBefore.x - (screenX * size.width) / 2 / nextZoom
      camera.position.y = worldBefore.y - (screenY * size.height) / 2 / nextZoom
      camera.zoom = nextZoom
      camera.updateProjectionMatrix()
      camera.updateMatrixWorld()
    },
    [camera, size, vecRef],
  )

  const moveHandler = useCallback<Handler<'move'>>(
    ({ delta: [dx, dy], pinching, buttons, event }) => {
      if (pinching) return
      const isTouchPan = event.pointerType === 'touch'
      if (buttons !== 2 && !isTouchPan) return
      camera.position.x -= dx / camera.zoom
      camera.position.y += dy / camera.zoom
      camera.updateMatrixWorld()
    },
    [camera],
  )

  const wheelHandler = useCallback<Handler<'wheel'>>(
    ({ delta: [dx, dy], event }) => {
      // Trackpad pinch-to-zoom is a wheel event with ctrlKey
      // It should be handled by the onPinch
      if (event.ctrlKey) return
      if (globalState.controlMode === 'trackpad') {
        camera.position.x -= dx / camera.zoom
        camera.position.y += dy / camera.zoom
        camera.updateMatrixWorld()
        return
      }
      zoomToPoint(camera.zoom - dy * config.camera.wheelZoomSpeed, event.clientX, event.clientY)
    },
    [camera, zoomToPoint],
  )

  const pinchHandler = useCallback<Handler<'pinch'>>(
    ({ offset: [ox], origin: [ox2, oy2] }) => {
      zoomToPoint(ox, ox2, oy2)
    },
    [zoomToPoint],
  )

  useGesture(
    {
      onPinch: pinchHandler,
      onWheel: wheelHandler,
      onMove: moveHandler,
    },
    {
      target: window,
      pinch: {
        from: () => [camera.zoom, 0],
        scaleBounds: { min: config.camera.zoomBounds[0], max: config.camera.zoomBounds[1] },
      },
      move: { mouseOnly: false },
    },
  )
}
