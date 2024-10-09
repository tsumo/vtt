import { useMemo, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { Grid } from './Grid'
import { Camera } from './Camera'
import { Line } from './Line'
import { GridSelect } from './GridSelect'
import { useCursorCoordinates } from '../hooks/useCursorCoordinates'
import { useKeyPress } from '../hooks/useKeyPress'
import { nullable } from '../utils'
import s from './App.module.css'

const modes = ['line', 'cell select']

const Dom = () => {
  return (
    <div className={s.domRoot}>
      <div className={s.hint}>
        {modes.map((mode, i) => (
          <span key="mode">
            {i + 1} - {mode}
          </span>
        ))}
      </div>
    </div>
  )
}

const CanvasContext = () => {
  useCursorCoordinates()

  const [mode, setMode] = useState(2)

  useKeyPress(useMemo(() => Object.fromEntries(modes.map((_mode, i) => [`Digit${i + 1}`, () => setMode(i + 1)])), []))

  return (
    <>
      <Camera />
      <Grid />
      {nullable(mode === 1, () => (
        <Line />
      ))}
      {nullable(mode === 2, () => (
        <GridSelect />
      ))}
    </>
  )
}

export const App = () => (
  <div>
    <Dom />
    <Canvas>
      <CanvasContext />
    </Canvas>
  </div>
)
