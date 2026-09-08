import { Sparkles, type LucideIcon } from 'lucide-react'
import { iconMap } from '@/utils/icon-map'

const RULES: [RegExp, string][] = [
  [/play|child|kids/i, 'baby'],
  [/club|communit|hall|people|meeting/i, 'users'],
  [/park|green|landscap|garden|tree/i, 'trees'],
  [/light/i, 'zap'],
  [/sec |security|24×7|24x7/i, 'shield-check'],
  [/water|drain/i, 'droplets'],
  [/road|avenue|street|connect/i, 'route'],
  [/gate|boundar/i, 'home'],
  [/hospital|clinic/i, 'building'],
]

/** Best-effort icon for a free-text amenity; falls back to a generic sparkle. */
export function iconForAmenity(name: string): LucideIcon {
  const key = RULES.find(([regex]) => regex.test(name))?.[1]
  return (key && iconMap[key]) || Sparkles
}
