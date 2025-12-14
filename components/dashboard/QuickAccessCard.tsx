import React from 'react'
import Link from 'next/link'

interface QuickAccessCardProps {
  title: string
  subtitle: string
  description: string
  href: string
  gradient: string
  icon?: React.ReactNode
}

export const QuickAccessCard: React.FC<QuickAccessCardProps> = ({
  title,
  subtitle,
  description,
  href,
  gradient,
  icon,
}) => {
  const content = (
    <div
      className={`relative overflow-hidden rounded-lg p-4 border border-slate-700/20 hover:border-slate-600/40 transition-all duration-200 hover:scale-[1.01] hover:shadow-md group ${gradient}`}
    >
        <div className="relative z-10">
          <p className="text-[10px] font-medium text-white/60 uppercase tracking-wide mb-1">
            {subtitle}
          </p>
          <h3 className="text-base font-semibold text-white mb-1.5">{title}</h3>
          <p className="text-xs text-white/70 leading-relaxed">{description}</p>
        </div>
        {icon && (
          <div className="absolute bottom-0 right-0 opacity-5 group-hover:opacity-10 transition-opacity">
            {icon}
          </div>
        )}
      </div>
  )

  if (href === '#') {
    return content
  }

  return <Link href={href}>{content}</Link>
}
