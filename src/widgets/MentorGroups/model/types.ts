type MentorGroupStatusType = {
  id: number
  status: string
}

type MentorGroupStudentCountsType = {
  active_count: number
  archive_count: number
  new_count: number
  frozen_count: number
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
  student_counts: MentorGroupStudentCountsType
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
