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
  ReposrtLeadsSellers,
  SellersDetailCourseType
} from '@/types/report'

const getReportLeads = async (branch?: string) => {
  try {
    const params = branch ? { branch } : {}
    const response = await api.get<ReportLeadsDashboardTypes>(Endpoints.LeadsDashboard, { params })
    return response.data
  } catch (error) {
    console.error(error)
    throw error;
  }
}

export const useGetReportLeads = (branch?: string) =>
  useQuery({
    queryKey: [QueryKeys.ReportLead, branch],
    queryFn: () => getReportLeads(branch),
    enabled: true,
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

const getReportLeadsChart = async (params?: any) => {
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

export const useGetReportLeadsChart = (params?: any) =>
  useQuery({
    queryKey: [QueryKeys.ReportLeadsChart, params],
    queryFn: () => getReportLeadsChart(params),
    enabled: !!params
  })

const getLeadsSellerDetail = async (admin_id?: string) => {
  try {
    const response = await api.get<SellersDetailCourseType[]>(`leads/course-distribution/${admin_id}/`)
    return response.data
  } catch (error) {
    console.error(error)
  }
}

export const useGetLeadsSellerDetail = (params?: { id: string }) =>
  useQuery({
    queryKey: [QueryKeys.ReportsLeadsSellers, params],
    queryFn: () => getLeadsSellerDetail(params?.id),
    enabled: !!params?.id
  })
