import * as THREE from 'three'
import { config } from '../config'

const extent = config.grid.length * 2
const dotRadius = 0.5
const color = new THREE.Color(config.colors.terrain)

const vertexShader = /* glsl */ `
  varying vec2 vWorldPosition;

  void main() {
    vWorldPosition = (modelMatrix * vec4(position, 1.0)).xy;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const fragmentShader = /* glsl */ `
  varying vec2 vWorldPosition;

  void main() {
    vec2 cell = mod(vWorldPosition + ${(config.grid.step / 2).toFixed(4)}, ${config.grid.step.toFixed(4)}) - ${(config.grid.step / 2).toFixed(4)};
    float dist = length(cell);
    // Smooth over ~1 screen pixel (via fwidth) so edges stay crisp at any zoom level.
    float aa = fwidth(dist);
    float alpha = 1.0 - smoothstep(${dotRadius.toFixed(4)} - aa, ${dotRadius.toFixed(4)} + aa, dist);
    if (alpha <= 0.0) discard;
    gl_FragColor = vec4(${color.r.toFixed(4)}, ${color.g.toFixed(4)}, ${color.b.toFixed(4)}, alpha);
    #include <colorspace_fragment>
  }
`

export const DotGrid = () => {
  return (
    <mesh position={[0, 0, config.zCoords.grid]}>
      <planeGeometry args={[extent, extent]} />
      <shaderMaterial vertexShader={vertexShader} fragmentShader={fragmentShader} transparent />
    </mesh>
  )
}
