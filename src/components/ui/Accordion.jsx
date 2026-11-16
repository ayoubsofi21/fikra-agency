import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/utils/helpers'

const AccordionPanel = ({ id, open, children }) => (
  <div
    id={id}
    role="region"
    aria-hidden={!open}
    className={cn('overflow-hidden transition-[max-h] duration-300', open ? 'max-h-[500px]' : 'max-h-0')}
  >
    <div className="px-5 pb-4 text-muted">{children}</div>
  </div>
)

export const Accordion = ({ items, defaultOpen = 0, className, icon: Icon = ChevronDown }) => {
  const [open, setOpen] = useState(
    Array.isArray(defaultOpen) ? defaultOpen : Array(items.length).fill(false).map((_, i) => i === defaultOpen)
  )

  const toggle = (i) => {
    setOpen(open.map((v, idx) => (idx === i ? !v : false)))
  }

  return (
    <div className={cn('space-y-3', className)}>
      {items.map((item, i) => (
        <div key={i} className="border border-border rounded-xl bg-surface overflow-hidden">
          <button
            onClick={() => toggle(i)}
            aria-expanded={open[i]}
            aria-controls={`accordion-panel-${i}`}
            id={`accordion-button-${i}`}
            className="w-full flex items-center justify-between gap-3 px-5 py-4 text-start focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary/40 hover:bg-surfaceAlt/50 transition-colors"
          >
            <span className="font-semibold text-text">{item.question}</span>
            {Icon && (
              <Icon
                aria-hidden="true"
                className={cn('h-5 w-5 shrink-0 text-muted transition-transform duration-300', open[i] && 'rotate-180')}
              />
            )}
          </button>
          <AccordionPanel id={`accordion-panel-${i}`} open={open[i]}>
            {item.answer}
          </AccordionPanel>
        </div>
      ))}
    </div>
  )
}

export const AccordionItem = ({ question, answer, isOpen = false, onToggle, id = 'accordion', className, icon: Icon }) => (
  <div className={cn('border border-border rounded-xl bg-surface overflow-hidden', className)}>
    <button
      onClick={onToggle}
      aria-expanded={isOpen}
      aria-controls={`${id}-panel`}
      id={`${id}-button`}
      className="w-full flex items-center justify-between gap-3 px-5 py-4 text-start focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary/40 hover:bg-surfaceAlt/50 transition-colors"
    >
      <span className="font-semibold text-text">{question}</span>
      {Icon && <Icon aria-hidden="true" className={cn('h-5 w-5 shrink-0 text-muted transition-transform duration-300', isOpen && 'rotate-180')} />}
    </button>
    <AccordionPanel id={`${id}-panel`} open={isOpen}>
      {answer}
    </AccordionPanel>
  </div>
)

export default Accordion
