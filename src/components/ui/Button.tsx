import { ButtonHTMLAttributes, forwardRef } from 'react'
import c from 'clsx'
import s from './Button.module.css'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(({ className, children, ...props }, ref) => {
  return (
    <button ref={ref} className={c(s.button, className)} {...props}>
      {children}
    </button>
  )
})

Button.displayName = 'Button'
