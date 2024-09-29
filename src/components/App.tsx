import { Canvas } from '@react-three/fiber'
import { Grid } from './Grid'
import { Camera } from './Camera'
import { Line } from './Line'
import { useCursorCoordinates } from '../hooks/useCursorCoordinates'

const CanvasContext = () => {
  useCursorCoordinates()
  return (
    <>
      <Camera />
      <Grid />
      <Line />
    </>
  )
}

export const App = () => (
  <Canvas>
    <CanvasContext />
  </Canvas>
)
