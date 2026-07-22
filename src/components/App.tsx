import { useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { StatsGl } from '@react-three/drei'
import { DotGrid } from './DotGrid'
import { Camera } from './Camera'
import { Line } from './Line'
import { Terrain } from './Terrain'
import { Debug } from './Debug'
import { useCursorCoordinates } from '../hooks/useCursorCoordinates'
import { nullable } from '../utils'
import { useGlobalState } from '../globalState'
import { UiLayer } from './UiLayer'

const Dom = () => {
  return (
    <>
      <Debug />
      <UiLayer />
    </>
  )
}

const CanvasContext = () => {
  useCursorCoordinates()

  const { interactionMode } = useGlobalState()

  return (
    <>
      <StatsGl />
      <Camera />
      <DotGrid />
      {nullable(interactionMode === 'line', () => (
        <Line />
      ))}
      {nullable(interactionMode === 'terrain', () => (
        <Terrain />
      ))}
    </>
  )
}

export const App = () => {
  useEffect(() => {
    const canvasRoot = document.getElementById('canvasRoot')
    const contextHandler = (event: MouseEvent) => event.preventDefault()
    canvasRoot?.addEventListener('contextmenu', contextHandler)
    return () => canvasRoot?.removeEventListener('contextmenu', contextHandler)
  }, [])

  return (
    <>
      <Canvas id="canvasRoot">
        <CanvasContext />
      </Canvas>
      <Dom />
    </>
  )
}
