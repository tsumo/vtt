import { ButtonHTMLAttributes, Ref } from 'react'
import c from 'clsx'
import s from './Button.module.css'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & { ref?: Ref<HTMLButtonElement> }

export const Button = ({ className, children, ref, ...props }: ButtonProps) => {
  return (
    <button ref={ref} className={c(s.button, className)} {...props}>
      {children}
    </button>
  )
}
