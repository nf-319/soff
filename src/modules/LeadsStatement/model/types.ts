import { LucideIcon } from 'lucide-react'

export type LeadsStatementCardType = {
  title: string;
  id?: string | number;
  count: string | number;
  icon: LucideIcon;
  iconColor?: string;
  hidden: boolean;
  process?: string | number;
  trendDirection?: 'up' | 'down';
  trendColor?: string;
  pillColor?: string;
};
