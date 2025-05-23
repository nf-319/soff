export type MentorSellersType = {
  bonus_amount: string,
  fine_amount: string,
  salary: string,
  prepayment: string,
  date: string,
  checked_date: string,
  updated_salary: number
}

export type MentorSellersRealTimeType = {
  id: number,
  name: string
  course: string
  salary: string | number
  students_count: string | number
}
