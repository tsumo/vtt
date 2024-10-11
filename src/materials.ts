import * as THREE from 'three'
import { config } from './config'

export const dotGridMaterial = new THREE.MeshBasicMaterial({
  color: config.colors.terrain,
})

export const terrainMaterial = new THREE.MeshBasicMaterial({
  color: config.colors.terrain,
  transparent: false,
  opacity: 0.5,
  wireframe: false,
})
