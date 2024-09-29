import { MutableRefObject } from 'react'
import * as THREE from 'three'
import { useLazyRef } from './useLazyRef'

const factories = {
  vector3: () => new THREE.Vector3(),
}

type ThreeObject = keyof typeof factories

type HookReturn<T extends ThreeObject> = MutableRefObject<ReturnType<(typeof factories)[T]>>

export const useThreeRef = <T extends ThreeObject>(object: T): HookReturn<T> => {
  const ref = useLazyRef(factories[object])

  return ref as HookReturn<T>
}
