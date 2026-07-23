import line from './line.svg'
import viewGrid from './view-grid.svg'
import mouse from './mouse.svg'
import trackpad from './trackpad.svg'
import s from './Icon.module.css'

const icons = {
  line,
  viewGrid,
  mouse,
  trackpad,
}

export type IconName = keyof typeof icons

interface IconProps {
  name: IconName
}

export const Icon = ({ name }: IconProps) => {
  return <img src={icons[name]} className={s.icon} />
}
