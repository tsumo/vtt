import { useMemo, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { DotGrid } from './DotGrid'
import { Camera } from './Camera'
import { Line } from './Line'
import { Terrain } from './Terrain'
import { Debug } from './Debug'
import { useCursorCoordinates } from '../hooks/useCursorCoordinates'
import { useKeyPress } from '../hooks/useKeyPress'
import { nullable } from '../utils'
import s from './App.module.css'

const modes = ['line', 'terrain'] as const

const Dom = () => {
  return (
    <div className={s.domRoot}>
      <div className={s.hint}>
        {modes.map((mode, i) => (
          <span key={mode}>
            {i + 1} - {mode}
          </span>
        ))}
      </div>
      <Debug />
    </div>
  )
}

const CanvasContext = () => {
  useCursorCoordinates()

  const [mode, setMode] = useState<(typeof modes)[number]>('terrain')

  useKeyPress(useMemo(() => Object.fromEntries(modes.map((mode, i) => [`Digit${i + 1}`, () => setMode(mode)])), []))

  return (
    <>
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

export const App = () => (
  <>
    <Dom />
    <Canvas>
      <CanvasContext />
    </Canvas>
  </>
)
