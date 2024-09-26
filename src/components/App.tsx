import { Canvas } from '@react-three/fiber'
import { Grid } from './Grid'
import { Camera } from './Camera'
import { Line } from './Line'

export const App = () => (
  <Canvas>
    <Camera />
    <Grid />
    <Line />
  </Canvas>
)
