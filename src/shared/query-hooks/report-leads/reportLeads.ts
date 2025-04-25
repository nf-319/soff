import api from '@utils/api'
import { Endpoints } from '@api/endpoints'
import { useQuery } from '@tanstack/react-query'
import { QueryKeys } from '@/shared/query-hooks/queryKeys'
import { ReportLeadsDashboardTypes } from '@/types'
import { ReportLeadsSourceStats, ReportLeadsYearlyStats } from '@/types/report'

const getReportLeads = async () => {
  try {
    const response = await api.get<ReportLeadsDashboardTypes>(Endpoints.LeadsDashboard)
    return response.data
  } catch (error) {
    console.error(error)
  }
}

export const useGetReportLeads = () =>
  useQuery({
    queryKey: [QueryKeys.ReportLead],
    queryFn: getReportLeads
  })

const getLeadsYearlyStats = async () => {
  try {
    const response = await api.get<ReportLeadsYearlyStats[]>(Endpoints.LeadsYearlyStats)
    return response.data
  } catch (error) {
    console.error(error)
  }
}

export const useGetLeadsYearlyStatus = () =>
  useQuery({
    queryKey: [QueryKeys.ReportLeadsYearlStats],
    queryFn: getLeadsYearlyStats
  })

const getLeadsSourceStats = async () => {
  try {
    const response = await api.get<ReportLeadsSourceStats>(Endpoints.LeadsSourceStats)
    return response.data
  } catch (error) {
    console.error(error)
  }
}

export const useGetLeadsSourceStatus = () =>
  useQuery({
    queryKey: [QueryKeys.ReportLeadsSourceStats],
    queryFn: getLeadsSourceStats
  })
