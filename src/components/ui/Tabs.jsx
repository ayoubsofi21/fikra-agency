import { cn } from '@/utils/helpers'

export const Tabs = ({ tabs, value, onChange, className }) => (
  <div className={cn('w-full', className)}>
    <div role="tablist" className="flex flex-wrap gap-2 mb-6">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          role="tab"
          id={`tab-${tab.value}`}
          aria-selected={value === tab.value}
          aria-controls={`tabpanel-${tab.value}`}
          onClick={() => onChange(tab.value)}
          className={cn(
            'px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40',
            value === tab.value
              ? 'bg-primary text-white'
              : 'bg-surface text-muted hover:text-text hover:bg-surfaceAlt'
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
    <div
      role="tabpanel"
      id={`tabpanel-${value}`}
      aria-labelledby={`tab-${value}`}
      className="mt-8"
    >
      {tabs.find((t) => t.value === value)?.content}
    </div>
  </div>
)

export const TabItem = ({ children, value, className }) => (
  <div className={cn('tab-content', className)} data-value={value}>{children}</div>
)

export default Tabs
