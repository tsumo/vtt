import { interactionModes, useGlobalState } from '../globalState'
import s from './Hint.module.css'

export const Hint = () => {
  const { controlMode } = useGlobalState()

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
