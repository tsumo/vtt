import { RefObject, useRef } from 'react'

export const useLazyRef = <T>(init: () => T): RefObject<T> => {
  const ref = useRef<T | undefined>(undefined)

  if (ref.current === undefined) ref.current = init()

  return ref as RefObject<T>
}
