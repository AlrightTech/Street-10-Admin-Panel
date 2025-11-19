
import { useLanguage } from '@/contexts/LanguageContext'

interface SalesChartProps {
  salesData?: {
    labels: string[]
    data: number[]
  }
}

export default function SalesChart({ salesData }: SalesChartProps) {
  const { t } = useLanguage()
  
  if (!salesData || !salesData.labels || !salesData.data) {
    return <div className="flex items-center justify-center h-64 text-gray-500">{t('loadingChart')}</div>
  }

  // Chart configuration matching the image exactly
  const maxValue = 6000
  const chartHeight = 250
  const chartWidth = 500
  const padding = { top: 40, right: 40, bottom: 60, left: 80 }
  const graphWidth = chartWidth - padding.left - padding.right
  const graphHeight = chartHeight - padding.top - padding.bottom
  
  // Calculate data points
  const dataPoints = salesData.data.map((value, index) => {
    const x = padding.left + (index / (salesData.data.length - 1)) * graphWidth
    const y = padding.top + graphHeight - (value / maxValue) * graphHeight
    return { x, y }
  })

  // Y-axis ticks
  const yTicks = [0, 2000, 4000, 6000]

  return (
    <div className="w-full">
      <svg 
        className="w-full" 
        viewBox="0 0 500 250" 
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Y-axis grid lines */}
        {yTicks.map((tick) => {
          const y = padding.top + graphHeight - (tick / maxValue) * graphHeight
          return (
            <g key={tick}>
              <line
                x1={padding.left}
                y1={y}
                x2={chartWidth - padding.right}
                y2={y}
                stroke="#E5E7EB"
                strokeWidth="0.5"
              />
              {/* Y-axis labels */}
              <text
                x={padding.left - 10}
                y={y + 4}
                textAnchor="end"
                style={{ fontSize: '12', fill: '#6B7280', fontFamily: 'system-ui, -apple-system, sans-serif' }}
              >
                {tick === 0 ? '0' : `${tick / 1000}k`}
              </text>
            </g>
          )
        })}

        {/* Y-axis label */}
        <text
          x={30}
          y={chartHeight / 2}
          textAnchor="middle"
          transform={`rotate(-90, 30, ${chartHeight / 2})`}
          style={{ fontSize: '14', fill: '#6B7280', fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: '500' }}
        >
          Sales ($)
        </text>

        {/* Chart line */}
        <path
          d={`M ${dataPoints.map((pt) => `${pt.x},${pt.y}`).join(' L ')}`}
          fill="none"
          stroke="#3B82F6"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        
        {/* Data points */}
        {dataPoints.map((pt, i) => (
          <circle
            key={i}
            cx={pt.x}
            cy={pt.y}
            r="5"
            fill="#3B82F6"
            stroke="#fff"
            strokeWidth="2"
          />
        ))}

        {/* X-axis labels */}
        <g>
          {salesData.labels.map((label, i) => {
            const x = padding.left + (i / (salesData.labels.length - 1)) * graphWidth
            return (
              <text
                key={i}
                x={x}
                y={chartHeight - 20}
                textAnchor="middle"
                style={{ fontSize: '12', fill: '#6B7280', fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: '500' }}
              >
                {label}
              </text>
            )
          })}
        </g>

        {/* Legend - below chart */}
        <g>
          {/* Line segment */}
          <line
            x1={chartWidth / 2 - 25}
            y1={chartHeight - 8}
            x2={chartWidth / 2 - 8}
            y2={chartHeight - 8}
            stroke="#3B82F6"
            strokeWidth="2.5"
          />
          {/* Dot */}
          <circle
            cx={chartWidth / 2 - 8}
            cy={chartHeight - 8}
            r="4"
            fill="#3B82F6"
            stroke="#fff"
            strokeWidth="2"
          />
          {/* Text */}
          <text
            x={chartWidth / 2 + 5}
            y={chartHeight - 4}
            style={{ fontSize: '14', fill: '#111827', fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: '700' }}
          >
            Sales
          </text>
        </g>
      </svg>
    </div>
  )
}

