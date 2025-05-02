export const enum Endpoints {
  SendGlobalNotification = 'owner/send-global-notification/',
  GlobalNotifications = 'owner/global-notifications/',
  OwnerListClient = 'owner/list/client/',
  Notifications = 'common/notifications/',
  ChecklistTeacher = 'employee/check-list/?role=teacher',
  ChecklistCourses = 'common/course/checklist/',
  NotificationRead = 'common/notification-read/{id}/',
  Branches = 'common/branches/',
  LeadsDashboard = 'leads/dashboard/',
  LeadsYearlyStats = 'leads/yearly-stats/',
  LeadsSourceStats = 'leads/source-stats/',
  ReportLeadsSellers = 'leads/sellers/',
  ReportLeadsList = 'leads/list/',
  ReportLeadsChart = 'leads/separate-leads-chart/',
  ReportLeadsSellerDetail = 'leads/course-distribution/'
}
