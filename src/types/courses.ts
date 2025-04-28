type BranchesType = {
  name: string
  id: number
}

export type ChecklistCoursesType = {
  branch: BranchesType[]
  color: string
  description: string
  id: number
  is_delete: boolean
  lesson_count: number
  month_duration: number
  name: string
  price: string
}
