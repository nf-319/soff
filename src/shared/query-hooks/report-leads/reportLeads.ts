import api from '@utils/api'
import { Endpoints } from '@api/endpoints'
import { useQuery } from '@tanstack/react-query'
import { QueryKeys } from '@/shared/query-hooks/queryKeys'
import { ReportLeadsDashboardTypes } from '@/types'
import {
  ReportLeadsSourceStats,
  ReportLeadsYearlyStats,
  ReportsLeadsChartType,
  ReportsLeadsListType,
  ReposrtLeadsSellers
} from '@/types/report'

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

const getLeadsSellers = async () => {
  try {
    const response = await api.get<ReposrtLeadsSellers[]>(Endpoints.ReportLeadsSellers)
    return response.data
  } catch (error) {
    console.error(error)
  }
}

export const useGetLeadsSellers = () =>
  useQuery({
    queryKey: [QueryKeys.ReportsLeadsSellers],
    queryFn: getLeadsSellers
  })

const getReportLeadsList = async (params?: { page?: number; limit?: number }) => {
  try {
    const response = await api.get<ReportsLeadsListType>(Endpoints.ReportLeadsList, {
      params
    })
    return response.data
  } catch (error) {
    console.error(error)
    throw error
  }
}

export const useGetReportLeadsList = (params?: { page?: number; limit?: number }) =>
  useQuery({
    queryKey: [QueryKeys.ReportLeadsList, params],
    queryFn: () => getReportLeadsList(params)
  })

const getReportLeadsChart = async (params?: { status: string }) => {
  try {
    const response = await api.get<ReportsLeadsChartType>(Endpoints.ReportLeadsChart, {
      params
    })
    return response.data
  } catch (error) {
    console.error(error)
    throw error
  }
}

export const useGetReportLeadsChart = (params?: { status: string }) =>
  useQuery({
    queryKey: [QueryKeys.ReportLeadsChart, params],
    queryFn: () => getReportLeadsChart(params),
    enabled: !!params?.status
  })
