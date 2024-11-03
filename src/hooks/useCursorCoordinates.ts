import { useEffect, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Point2 } from '../types'
import { globalState } from '../globalState'
import { useThreeRef } from './useThreeRef'

const updateInterval = 5

export const useCursorCoordinates = () => {
  const vecRef = useThreeRef('vector3')
  const mousePos = useRef<Point2>({ x: 0, y: 0 })
  const counter = useRef(0)
  const mouseInterrupt = useRef(false)
  const trustedCoordinates = useRef(false)

  const { camera } = useThree()

  useEffect(() => {
    const mouseHandler = (e: MouseEvent) => {
      mousePos.current.x = (e.clientX / window.innerWidth) * 2 - 1
      mousePos.current.y = -((e.clientY / window.innerHeight) * 2 - 1)
      globalState.cursor.screen.x = mousePos.current.x
      globalState.cursor.screen.y = mousePos.current.y
      mouseInterrupt.current = true
      globalState.cursor.trustedCoordinates = true
      trustedCoordinates.current = true
    }
    window.addEventListener('mousemove', mouseHandler)
    window.addEventListener('mousedown', mouseHandler)
    window.addEventListener('wheel', mouseHandler)
    const blurHandler = () => {
      globalState.cursor.trustedCoordinates = false
      trustedCoordinates.current = false
    }
    window.addEventListener('blur', blurHandler)
    return () => {
      window.removeEventListener('mousemove', mouseHandler)
      window.removeEventListener('mousedown', mouseHandler)
      window.removeEventListener('wheel', mouseHandler)
      window.removeEventListener('blur', blurHandler)
    }
  }, [])

  useFrame(() => {
    if (!trustedCoordinates.current) return
    counter.current = (counter.current + 1) % updateInterval
    if (!mouseInterrupt.current && counter.current !== 0) return
    vecRef.current.set(mousePos.current.x, mousePos.current.y, 0)
    vecRef.current.unproject(camera)
    globalState.cursor.world.x = vecRef.current.x
    globalState.cursor.world.y = vecRef.current.y
    mouseInterrupt.current = false
  })
}
