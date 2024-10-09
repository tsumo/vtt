import { useGlobalState } from '../globalState'
import s from './Debug.module.css'

export const Debug = () => {
  const {
    cursor: { screen, world },
  } = useGlobalState()

  return (
    <div className={s.debug}>
      <div>cursor world</div>
      <div>
        {world.x.toFixed(5).padStart(10)} {world.y.toFixed(5).padStart(10)}
      </div>
      <div>cursor screen</div>
      <div>
        {screen.x.toFixed(5).padStart(10)} {screen.y.toFixed(5).padStart(10)}
      </div>
    </div>
  )
}
