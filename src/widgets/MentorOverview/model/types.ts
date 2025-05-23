import { RoleType } from '@/types'

export type MentorType = {
  activated_at: string
  active_groups: number
  amount: number
  birth_date: string
  branches: RoleType[]
  first_name: string
  gender: string
  id: number
  image: string | null
  lesson_amount: number
  percentage: number
  phone: string
  qr_code: string
  roles: RoleType[]
}
