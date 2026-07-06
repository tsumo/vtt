import { useEffect, useMemo, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { StatsGl } from '@react-three/drei'
import { DotGrid } from './DotGrid'
import { Camera } from './Camera'
import { Line } from './Line'
import { Terrain } from './Terrain'
import { Hint } from './Hint'
import { Debug } from './Debug'
import { useCursorCoordinates } from '../hooks/useCursorCoordinates'
import { useKeyPress } from '../hooks/useKeyPress'
import { nullable } from '../utils'
import { globalState, InteractionMode, interactionModes } from '../globalState'

const toggleControlMode = () => {
  globalState.controlMode = globalState.controlMode === 'mouse' ? 'trackpad' : 'mouse'
}

const Dom = () => {
  return (
    <>
      <Hint />
      <Debug />
    </>
  )
}

const CanvasContext = () => {
  useCursorCoordinates()

  const [mode, setMode] = useState<InteractionMode>('terrain')

  useKeyPress(
    useMemo(
      () => ({
        ...Object.fromEntries(interactionModes.map((mode, i) => [`Digit${i + 1}`, () => setMode(mode)])),
        KeyT: toggleControlMode,
      }),
      [],
    ),
  )

  return (
    <>
      <StatsGl />
      <Camera />
      <DotGrid />
      {nullable(mode === 'line', () => (
        <Line />
      ))}
      {nullable(mode === 'terrain', () => (
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
