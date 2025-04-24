import api from '@utils/api'
import { Endpoints } from '@api/endpoints'
import { useQuery } from '@tanstack/react-query'
import { QueryKeys } from '@/shared/query-hooks/queryKeys'
import { ReportLeadsDashboardTypes } from '@/types'

const getReportLeads = async () => {
  try {
    const response = await api.get<ReportLeadsDashboardTypes>(Endpoints.LeadsDashboard);
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

export const useGetReportLeads = () => useQuery({
  queryKey: [QueryKeys.ReportLead],
  queryFn: getReportLeads
})
