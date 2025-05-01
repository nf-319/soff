type LeadDashboardSellerType = {
  id: number
  first_name: string
  phone: string
}

export type ReportLeadsDashboardTypes = {
  best_seller: LeadDashboardSellerType
  best_seller_id: number
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
  id:number,
  count: number
}

export type ReportLeadsSourceType = {
  id: number
  name: string
  count: number
}

export type ReposrtLeadsSellers = {
  conversion_rate: number
  first_name: string
  id: number
  lost_leads: number
  phone: string
  worked_lead_count: number
}

export type ReportsLeadsListType = {
  count: number
  next: string
  previous: any
  results: ReportsLeadsListItemType[]
}

export type ReportsLeadsListItemType = {
  admin: string
  course: any
  created_at: string
  first_name: string
  id: number
  phone: string
  source: string
  status: string
  temperature: any
}

export type ReportsLeadsChartType = {
  count: number
  next: string
  previous: any
  results: ReportsLeadsChartItemType[]
}

export type ReportsLeadsChartItemType = {
  count: string
  month: string
}

export type SellersDetailCourseType = {
  name: string
  count: number
}
