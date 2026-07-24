import { ControlMode, globalState, InteractionMode, interactionModes, useGlobalState } from '../globalState'
import { Icon, IconName } from './icons/Icon'
import { Button } from './ui/Button'
import { Panel } from './ui/Panel'
import { Separator } from './ui/Separator'
import s from './UiLayer.module.css'

const toggleControlMode = () => {
  globalState.controlMode = globalState.controlMode === 'mouse' ? 'trackpad' : 'mouse'
}

const interactionModeToIcon: Record<InteractionMode, IconName> = {
  line: 'line',
  terrain: 'viewGrid',
}

const controlModeToIcon: Record<ControlMode, IconName> = {
  mouse: 'mouse',
  trackpad: 'trackpad',
}

export const UiLayer = () => {
  const { controlMode } = useGlobalState()

  return (
    <div className={s.uiLayer}>
      <Panel direction="vertical">
        {interactionModes.map((mode) => (
          <Button key={mode} title={mode} onClick={() => (globalState.interactionMode = mode)}>
            <Icon name={interactionModeToIcon[mode]} />
          </Button>
        ))}
        <Separator />
        <Button title={controlMode} onClick={toggleControlMode}>
          <Icon name={controlModeToIcon[controlMode]} />
        </Button>
      </Panel>
    </div>
  )
}
