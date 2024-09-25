import { useLayoutEffect, useRef } from 'react'
import * as THREE from 'three'
import { config } from '../config'

const geometry = new THREE.CircleGeometry(0.5, 6)
const material = new THREE.MeshBasicMaterial({ color: config.colors.grid })

const object = new THREE.Object3D()

const count = Math.pow((config.grid.length * 2) / config.grid.step + 1, 2)

export const Grid = () => {
  const ref = useRef<THREE.InstancedMesh>(null)

  useLayoutEffect(() => {
    if (!ref.current) return
    let id = 0
    for (let x = -config.grid.length; x <= config.grid.length; x += config.grid.step) {
      for (let y = -config.grid.length; y <= config.grid.length; y += config.grid.step) {
        object.position.set(x, y, config.zCoords.grid)
        object.updateMatrix()
        ref.current.setMatrixAt(id, object.matrix)
        id++
      }
    }
    ref.current.instanceMatrix.needsUpdate = true
  }, [])

  return <instancedMesh ref={ref} args={[geometry, material, count]} />
}
