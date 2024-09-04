import { useRef, useState } from 'react'
import * as THREE from 'three'
import { useFrame, ThreeElements } from '@react-three/fiber'

export const Box = (props: ThreeElements['mesh']) => {
  const meshRef = useRef<THREE.Mesh>({} as THREE.Mesh)
  const [hovered, setHover] = useState(false)
  const [active, setActive] = useState(false)

  useFrame((_state, delta) => (meshRef.current.rotation.x += delta))

  return (
    <mesh
      {...props}
      ref={meshRef}
      scale={active ? 1.5 : 1}
      onClick={() => setActive(!active)}
      onPointerOver={() => setHover(true)}
      onPointerOut={() => setHover(false)}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={hovered ? 'hotpink' : '#2f74c0'} />
    </mesh>
  )
}
