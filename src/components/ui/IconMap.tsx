import { Gem } from 'lucide-react'
import { iconMap } from '@/utils/icon-map'

interface MapIconProps {
  name: string
  className?: string
}

export function MapIcon({ name, className }: MapIconProps) {
  const Icon = iconMap[name] ?? Gem
  return <Icon className={className} aria-hidden />
}
