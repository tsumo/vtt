import * as THREE from 'three'
import { config } from './config'

export const terrainMaterial = new THREE.MeshBasicMaterial({
  color: config.colors.terrain,
  transparent: false,
  opacity: 0.5,
  wireframe: false,
})

export const selectionMaterial = new THREE.MeshBasicMaterial({
  color: 'indianred',
  opacity: 0.5,
  transparent: true,
})
