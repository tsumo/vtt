import { Canvas } from '@react-three/fiber'
import { Grid } from './Grid'
import { Camera } from './Camera'
import { RoundedBox } from '@react-three/drei'

export const App = () => (
  <Canvas>
    <Camera />
    <ambientLight intensity={Math.PI / 2} />
    <Grid />
    <RoundedBox args={[10, 10, 10]}>
      <meshPhongMaterial color="#f3f3f3" wireframe />
    </RoundedBox>
  </Canvas>
)
