import React from 'react'

interface StatsCardProps {
  title: string
  value: string | number
  icon?: React.ReactNode
  trend?: {
    value: number
    isPositive: boolean
  }
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon,
  trend,
}) => {
  return (
    <div className="bg-slate-800/20 backdrop-blur-sm rounded-lg p-4 border border-slate-700/20 hover:border-slate-600/40 transition-all duration-200">
      <div className="flex items-start justify-between mb-2.5">
        <p className="text-[10px] font-medium text-slate-500 uppercase tracking-wide">
          {title}
        </p>
        {icon && (
          <div className="text-slate-600">
            {icon}
          </div>
        )}
      </div>
      <div className="flex items-baseline justify-between">
        <p className="text-xl font-semibold text-white">
          {value}
        </p>
        {trend && (
          <span
            className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${
              trend.isPositive
                ? 'bg-emerald-500/15 text-emerald-400'
                : 'bg-red-500/15 text-red-400'
            }`}
          >
            {trend.isPositive ? '+' : ''}
            {trend.value}%
          </span>
        )}
      </div>
    </div>
  )
}
