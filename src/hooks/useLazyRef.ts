import { MutableRefObject, useRef } from 'react'

export const useLazyRef = <T>(init: () => T): MutableRefObject<T> => {
  const ref = useRef<T>()

  if (ref.current === undefined) ref.current = init()

  return ref as MutableRefObject<T>
}
