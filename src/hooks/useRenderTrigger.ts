import { useReducer } from 'react'

export const useRenderTrigger = () => {
  const [_, dispatch] = useReducer((v: number) => v + 1, 0)
  return dispatch
}
