import { useEffect, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Point2 } from '../types'
import { globalState } from '../globalState'
import { useThreeRef } from './useThreeRef'

export const useCursorCoordinates = () => {
  const vecRef = useThreeRef('vector3')
  const mousePos = useRef<Point2>({ x: 0, y: 0 })
  const mouseMoved = useRef(false)

  const { camera } = useThree()

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current.x = (e.clientX / window.innerWidth) * 2 - 1
      mousePos.current.y = -((e.clientY / window.innerHeight) * 2 - 1)
      globalState.cursor.screen.x = mousePos.current.x
      globalState.cursor.screen.y = mousePos.current.y
      mouseMoved.current = true
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  useFrame(() => {
    if (!mouseMoved.current) return
    vecRef.current.set(mousePos.current.x, mousePos.current.y, 0)
    vecRef.current.unproject(camera)
    globalState.cursor.world.x = vecRef.current.x
    globalState.cursor.world.y = vecRef.current.y
    mouseMoved.current = false
  })
}
