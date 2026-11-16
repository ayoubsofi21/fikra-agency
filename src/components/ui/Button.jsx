import { forwardRef } from 'react'
import { cva } from 'class-variance-authority'
import { cn } from '@/utils/helpers'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 font-medium transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
  {
    variants: {
      variant: {
        primary:
          'bg-primary text-white hover:bg-indigo-600',
        secondary:
          'bg-surfaceAlt text-text hover:bg-border/60 border-0',
        ghost:
          'bg-transparent hover:bg-surfaceAlt/50 text-text hover:text-primary',
        outline:
          'border border-border bg-transparent hover:bg-surfaceAlt/50 text-text',
        white: 'bg-white text-primary hover:bg-surface/90 shadow-lg',
        link: 'text-primary hover:underline px-0 h-auto',
      },
      size: {
        xs: 'text-xs px-3 py-1.5 rounded-md',
        sm: 'text-sm px-4 py-2 rounded-lg',
        md: 'text-base px-6 py-2.5 rounded-lg',
        lg: 'text-lg px-8 py-3.5 rounded-lg',
        icon: 'p-2.5 rounded-lg',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
)

export const Button = forwardRef(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      children,
      icon: Icon,
      iconPosition = 'left',
      ...props
    },
    ref
  ) => {
    const renderChildren = () => {
      if (isLoading) {
        return (
          <svg
            className="h-5 w-5 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
        )
      }
      return children
    }

    return (
      <button
        ref={ref}
        {...props}
        className={cn(
          buttonVariants({ variant, size }),
          {
            'pointer-events-none': isLoading,
          },
          className
        )}
        disabled={isLoading || props.disabled}
      >
        {iconPosition === 'left' && Icon && !isLoading && (
          <Icon className="h-5 w-5" />
        )}
        {renderChildren()}
        {Icon && iconPosition === 'right' && !isLoading && (
          <Icon className="h-5 w-5" />
        )}
      </button>
    )
  }
)

Button.displayName = 'Button'

export default Button
