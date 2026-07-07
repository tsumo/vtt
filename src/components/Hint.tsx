import { useMemo } from 'react'
import { globalState, interactionModes, useGlobalState } from '../globalState'
import { useKeyPress } from '../hooks/useKeyPress'
import s from './Hint.module.css'

const toggleControlMode = () => {
  globalState.controlMode = globalState.controlMode === 'mouse' ? 'trackpad' : 'mouse'
}

export const Hint = () => {
  const { controlMode } = useGlobalState()

  useKeyPress(
    useMemo(
      () => ({
        ...Object.fromEntries(
          interactionModes.map((mode, i) => [`Digit${i + 1}`, () => (globalState.interactionMode = mode)]),
        ),
        KeyT: toggleControlMode,
      }),
      [],
    ),
  )

  return (
    <div className={s.hint}>
      {interactionModes.map((mode, i) => (
        <span key={mode}>
          {i + 1} - {mode}
        </span>
      ))}
      <span>t - controls: {controlMode}</span>
    </div>
  )
}
