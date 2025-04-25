export type ReportLeadsDashboardTypes = {
  best_seller: string
  best_seller_leads_count: number
  best_seller_progress: number
  conversion: number
  conversion_progress: number
  lost_leads: number
  lost_leads_progress: number
  new_leads: number
  new_leads_progress: number
  top_lead_source: string
  top_lead_source_count: number
  top_lead_source_progress: number
}

export type ReportLeadsYearlyStats = {
  enrolled_count: string
  lost_count: string
  month: string
  new_count: string
}

export type ReportLeadsSourceStats = {
  courses: ReportLeadsCourseType[]
  sources: ReportLeadsSourceType[]
}

export type ReportLeadsCourseType = {
  name: string
  count: number
}

export type ReportLeadsSourceType = {
  id: number
  name: string
  count: number
}
