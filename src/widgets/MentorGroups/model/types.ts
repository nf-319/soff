type MentorGroupStatusType = {
  id: number
  status: string
}

export type MentorGroupType = {
  id: number
  name: string
  course_name: string
  teacher_name: string
  room_name: string
  start_date: string
  end_date: string
  start_at: string
  end_at: string
  student_count: number
  week_days: string[]
  month_duration: number
  color: string
  teacher: number
  room_id: number
  price: number
  start_end_at: string
  status: string
  status_data: MentorGroupStatusType
  choices: string[]
}
