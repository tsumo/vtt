import { Canvas } from '@react-three/fiber'
import { Grid } from './Grid'
import { Camera } from './Camera'

export const App = () => (
  <Canvas>
    <Camera />
    <ambientLight intensity={Math.PI / 2} />
    <Grid />
  </Canvas>
)
