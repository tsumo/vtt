import { ReactNode } from 'react'
import c from 'clsx'
import s from './Panel.module.css'

interface PanelProps {
  direction: 'vertical' | 'horizontal'
  children?: ReactNode
}

export const Panel = ({ direction, children }: PanelProps) => {
  return <div className={c(s.panel, direction === 'vertical' && s.vertical)}>{children}</div>
}
