import { useEffect } from 'react'
import { globalState } from '../globalState'

export const useDebugOutput = (title: string, value: string | number) => {
  useEffect(() => {
    globalState.debug[title] = typeof value === 'number' ? value.toFixed(5).padStart(10) : value
    return () => {
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete globalState.debug[title]
    }
  }, [title, value])
}
