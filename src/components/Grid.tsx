import * as THREE from 'three'
import { config } from '../config'

const points: THREE.Vector3[] = []

for (let i = -220; i <= 220; i += 10) {
  for (let j = -220; j <= 220; j += 10) {
    points.push(new THREE.Vector3(i - 0.1, j, config.zCoords.grid))
    points.push(new THREE.Vector3(i + 0.1, j, config.zCoords.grid))
    points.push(new THREE.Vector3(i, j - 0.1, config.zCoords.grid))
    points.push(new THREE.Vector3(i, j + 0.1, config.zCoords.grid))
  }
}

const onUpdate = (self: THREE.BufferGeometry) => {
  self.setFromPoints(points)
}

export const Grid = () => {
  return (
    <lineSegments>
      <bufferGeometry onUpdate={onUpdate} />
      <lineBasicMaterial transparent color="black" linewidth={2} />
    </lineSegments>
  )
}
