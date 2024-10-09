import { useEffect } from 'react'

export const useKeyPress = (map: Record<string, VoidFunction>) => {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.code in map) map[e.code]()
    }

    window.addEventListener('keydown', handler)

    return () => window.removeEventListener('keydown', handler)
  }, [map])
}
