import { globalState, interactionModes, useGlobalState } from '../globalState'
import { Button } from './ui/Button'
import { Panel } from './ui/Panel'
import { Separator } from './ui/Separator'
import s from './UiLayer.module.css'

const toggleControlMode = () => {
  globalState.controlMode = globalState.controlMode === 'mouse' ? 'trackpad' : 'mouse'
}

export const UiLayer = () => {
  const { controlMode } = useGlobalState()

  return (
    <div className={s.uiLayer}>
      <Panel direction="vertical">
        {interactionModes.map((mode) => (
          <Button key={mode} onClick={() => (globalState.interactionMode = mode)}>
            {mode}
          </Button>
        ))}
        <Separator />
        <Button onClick={toggleControlMode}>{controlMode}</Button>
      </Panel>
    </div>
  )
}
