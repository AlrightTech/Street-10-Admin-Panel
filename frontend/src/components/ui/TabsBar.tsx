import { Link } from 'react-router-dom'

export type TabItem = {
  label: string
  href: string
  active?: boolean
}

type TabsBarProps = { tabs: TabItem[]; variant?: 'pill' | 'underline' }

export default function TabsBar({ tabs, variant = 'pill' }: TabsBarProps) {
  if (variant === 'underline') {
    return (
      <div className="bg-white rounded-lg border-b border-gray-200">
        <div className="flex space-x-1 px-3 sm:px-6 overflow-x-auto">
          {tabs.map((tab) => (
            <Link
              key={tab.href}
              to={tab.href}
              className={`px-3 py-3 text-xs sm:text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                tab.active
                  ? 'border-orange-500 text-orange-500'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab.label}
            </Link>
          ))}
        </div>
      </div>
    )
  }

  // Default 'pill' variant
  return (
    <div className="bg-white rounded-lg border border-gray-200 px-3 sm:px-4 py-2">
      <div className="flex gap-2 overflow-x-auto">
        {tabs.map((tab) => (
          <Link
            key={tab.href}
            to={tab.href}
            className={`px-3 py-2 text-xs sm:text-sm rounded-md whitespace-nowrap ${
              tab.active
                ? 'bg-orange-100 text-orange-700 font-medium'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            {tab.label}
          </Link>
        ))}
      </div>
    </div>
  )
}


