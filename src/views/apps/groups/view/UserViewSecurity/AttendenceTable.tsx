"use client"

import { Box, IconButton, Tooltip, Typography, ClickAwayListener } from "@mui/material"
import { CalendarCheck, Edit } from "lucide-react"
import { UserViewItem } from "./UserViewItem"
import { EmptyContent } from "src/components/empty-content"
import { TextField, Button } from "@mui/material"
import { useMemo } from 'react'

interface Student {
  id: string | number
  first_name: string
  last_name?: string
  attendance?: any[]
}

interface AttendanceTableProps {
  attendance: {
    students: Student[]
  }
  days: any[]
  isDark: boolean
  isPast: boolean
  opened_id: any
  setOpenedId: (id: any) => void
  openTooltip: string | null
  setOpenTooltip: (id: any) => void
  handleDayClick: (day: any) => void
  handleTopicSubmit: (hour: any) => void
  topic: string
  setTopic: (topic: string) => void
  setUpdateTopic: (open: boolean) => void
  setTopicId: (id: number) => void
  t: (key: string) => string
  query: any
  groupData?: any
}

export const AttendanceTable = ({
  attendance,
  days,
  isDark,
  isPast,
  opened_id,
  setOpenedId,
  openTooltip,
  setOpenTooltip,
  handleDayClick,
  handleTopicSubmit,
  setTopic,
  setUpdateTopic,
  setTopicId,
  t,
  query,
  groupData
}: AttendanceTableProps) => {

  const displayDays = useMemo(() => {
    return days?.length > 0 ? days : Array(7).fill({ date: 'placeholder' });
  }, [days]);

  const students = attendance?.students || []


  const isAfterEndDate = () => {
    if (!groupData?.end_date) return false

    const endDate = new Date(groupData.end_date)
    const currentYear = query?.year ? Number.parseInt(query.year) : new Date().getFullYear()
    const currentMonth = query?.month ? new Date(`${query.month} 1, 2000`).getMonth() : new Date().getMonth()

    const endYear = endDate.getFullYear()
    const endMonth = endDate.getMonth()

    return currentYear > endYear || (currentYear === endYear && currentMonth > endMonth)
  }

  const showCourseEndedNotification = isPast || isAfterEndDate()

  return (
    <Box
      style={{
        width: '100%',
        overflowX: 'auto',
        overflowY: 'hidden'
      }}
    >
      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          backgroundColor: isDark ? '#282A42' : '#fff',
          minWidth: '768px'
        }}
      >
        <thead>
          <tr>
            <td
              style={{
                position: 'sticky',
                left: 0,
                background: isDark ? '#1e2035' : '#f5f5f5',
                zIndex: 2,
                padding: '12px 20px',
                fontWeight: 600,
                borderBottom: `1px solid ${isDark ? '#444' : '#e0e0e0'}`,
                borderRight: `1px solid ${isDark ? '#444' : '#e0e0e0'}`
              }}
            >
              <Typography fontWeight={600}>{t('Mavzular')}</Typography>
            </td>

            {displayDays.map((hour: any, index) => (
              <td
                key={hour.date || `placeholder-${index}`}
                style={{
                  textAlign: 'center',
                  width: '60px',
                  padding: '12px 8px',
                  cursor: hour.date !== 'placeholder' ? 'pointer' : 'default',
                  backgroundColor: hour.exam
                    ? isDark
                      ? '#2a3b2e'
                      : '#e6f4e8'
                    : hour.lesson
                    ? isDark
                      ? '#2a3246'
                      : '#e6f0fa'
                    : isDark
                    ? '#282A42'
                    : '#fff',
                  borderBottom: `1px solid ${isDark ? '#444' : '#e0e0e0'}`,
                  borderRight: `1px solid ${isDark ? '#444' : '#e0e0e0'}`
                }}
              >
                {hour.date !== 'placeholder' && (
                  <div>
                    {hour.exam ? (
                      <Tooltip
                        arrow
                        placement='top'
                        title={
                          <Box style={{ padding: '8px' }}>
                            <Typography style={{ margin: '0', marginBottom: '4px' }}>{hour.exam.title}</Typography>
                            <Typography style={{ margin: '0' }}>
                              Ball: {hour.exam.min_score} / {hour.exam.max_score}
                            </Typography>
                          </Box>
                        }
                      >
                        <Box
                          style={{
                            width: '100%',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            cursor: 'pointer'
                          }}
                        >
                          {hour.exam?.title}
                        </Box>
                      </Tooltip>
                    ) : hour.lesson ? (
                      <Tooltip arrow placement='top' title={hour.lesson.topic}>
                        <Box
                          style={{
                            width: '100%',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '4px'
                          }}
                        >
                          <span
                            style={{ maxWidth: '80%', overflow: 'hidden', textOverflow: 'ellipsis' }}
                            onClick={() => {
                              setUpdateTopic(true)
                              setTopicId(hour.lesson.id)
                              setTopic(hour.lesson.topic)
                            }}
                          >
                            {hour.lesson.topic}
                          </span>
                          <IconButton
                            size='small'
                            onClick={() => {
                              setUpdateTopic(true)
                              setTopicId(hour.lesson.id)
                              setTopic(hour.lesson.topic)
                            }}
                            style={{ padding: '2px' }}
                          >
                            <Edit style={{ width: '14px', height: '14px' }} />
                          </IconButton>
                        </Box>
                      </Tooltip>
                    ) : (
                      <Tooltip
                        arrow
                        placement='top'
                        open={openTooltip === hour.date}
                        onClose={() => setOpenTooltip(null)}
                        title={
                          <ClickAwayListener onClickAway={() => setOpenTooltip(null)}>
                            <Box style={{ padding: '8px', width: '200px', backgroundColor: '#fff' }}>
                              <Typography style={{ marginBottom: '8px', color: '#000' }}>Mavzu qo'shish</Typography>
                              <form
                                style={{
                                  display: 'flex',
                                  flexDirection: 'column',
                                  gap: '8px'
                                }}
                                onSubmit={async e => {
                                  e.preventDefault()
                                  void handleTopicSubmit(hour)
                                }}
                              >
                                <TextField
                                  autoComplete='off'
                                  onChange={e => setTopic(e.target.value)}
                                  size='small'
                                  placeholder='Mavzu..'
                                  fullWidth
                                  style={{ marginBottom: '8px' }}
                                />
                                <Button type='submit' variant='contained' size='small'>
                                  {t('Saqlash')}
                                </Button>
                              </form>
                            </Box>
                          </ClickAwayListener>
                        }
                      >
                        <IconButton
                          style={{ padding: '4px' }}
                          onClick={() => setOpenTooltip((c: any) => (c === hour.date ? null : hour.date))}
                        >
                          <CalendarCheck style={{ width: '18px', height: '18px' }} />
                        </IconButton>
                      </Tooltip>
                    )}
                  </div>
                )}
              </td>
            ))}
          </tr>
          <tr>
            <td
              style={{
                position: 'sticky',
                left: 0,
                background: isDark ? '#1e2035' : '#f5f5f5',
                zIndex: 2,
                padding: '12px 20px',
                fontWeight: 600,
                borderBottom: `1px solid ${isDark ? '#444' : '#e0e0e0'}`,
                borderRight: `1px solid ${isDark ? '#444' : '#e0e0e0'}`,
                width: '200px'
              }}
            >
              <Typography fontWeight={600}>{t("O'quvchilar")}</Typography>
            </td>
            {displayDays.map((hour: any, index) => (
              <th
                key={hour.date || `placeholder-day-${index}`}
                style={{
                  textAlign: 'center',
                  width: '60px',
                  padding: '12px 8px',
                  cursor: hour.date !== 'placeholder' ? 'pointer' : 'default',
                  fontWeight: 600,
                  backgroundColor: isDark ? '#2a3246' : '#e6f0fa',
                  borderBottom: `1px solid ${isDark ? '#444' : '#e0e0e0'}`,
                  borderRight: `1px solid ${isDark ? '#444' : '#e0e0e0'}`
                }}
                onClick={() => hour.date !== 'placeholder' && handleDayClick(hour.date)}
              >
                {hour.date !== 'placeholder' ? (
                  <Box
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '4px'
                    }}
                  >
                    <Typography fontWeight={600} style={{ fontSize: '16px' }}>
                      {`${hour.date.split('-')[2]}`}
                    </Typography>
                  </Box>
                ) : (
                  <Box style={{ height: '24px' }}></Box>
                )}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {showCourseEndedNotification && (
            <tr>
              <td
                colSpan={displayDays.length + 1}
                style={{
                  padding: '20px',
                  backgroundColor: isDark ? '#3a2a2e' : '#ffe4e6',
                  textAlign: 'center',
                  borderBottom: `1px solid ${isDark ? '#444' : '#e0e0e0'}`
                }}
              >
                <Typography
                  variant='h5'
                  style={{
                    color: isDark ? '#ff8a8a' : '#c53030',
                    fontWeight: 600
                  }}
                >
                  Kurs tugagan
                </Typography>
              </td>
            </tr>
          )}

          {students.length ? students.map((student: Student, studentIndex: number) => (
            <tr
              key={student.id || `placeholder-student-${studentIndex}`}
              style={{
                borderBottom: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'}`
              }}
            >
              <td
                style={{
                  position: 'sticky',
                  left: 0,
                  background: isDark ? '#282A42' : '#fff',
                  zIndex: 2,
                  padding: '12px 20px',
                  fontWeight: 500,
                  borderBottom: `1px solid ${isDark ? '#444' : '#e0e0e0'}`,
                  borderRight: `1px solid ${isDark ? '#444' : '#e0e0e0'}`,
                  minWidth: '200px'
                }}
              >
                {student.id !== 'placeholder' ? (
                  <Typography
                    style={{
                      fontWeight: 500,
                      color: isDark ? '#fff' : '#000',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}
                  >
                    {student.first_name}
                  </Typography>
                ) : (
                  <Typography
                    style={{
                      fontWeight: 500,
                      color: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)'
                    }}
                  >
                    {student.first_name}
                  </Typography>
                )}
              </td>

              {displayDays.map((hour: any, dayIndex: number) => {
                if (student.id === 'placeholder' || hour.date === 'placeholder') {
                  return (
                    <td
                      key={`empty-cell-${studentIndex}-${dayIndex}`}
                      style={{
                        padding: '8px 0',
                        textAlign: 'center',
                        height: '50px',
                        borderBottom: `1px solid ${isDark ? '#444' : '#e0e0e0'}`,
                        borderRight: `1px solid ${isDark ? '#444' : '#e0e0e0'}`
                      }}
                    >
                      <UserViewItem
                        currentDate={null}
                        opened_id={opened_id}
                        setOpenedId={setOpenedId}
                        defaultValue={0}
                      />
                    </td>
                  )
                }

                const currentDate = student.attendance?.find((el: any) => el.date === hour.date)

                if (
                  student.attendance?.some((el: any) => el.date === hour.date) &&
                  student.attendance?.find((el: any) => el.date === hour.date && !hour.weekend?.date)
                ) {
                  const attendanceRecord = student.attendance.find((el: any) => el.date === hour.date)
                  return (
                    <td
                      key={`attendance-${student.id}-${hour.date}`}
                      style={{
                        padding: '8px 0',
                        textAlign: 'center',
                        cursor: 'pointer',
                        height: '50px',
                        borderBottom: `1px solid ${isDark ? '#444' : '#e0e0e0'}`,
                        borderRight: `1px solid ${isDark ? '#444' : '#e0e0e0'}`
                      }}
                    >
                      <UserViewItem
                        currentDate={currentDate}
                        opened_id={opened_id}
                        setOpenedId={setOpenedId}
                        defaultValue={attendanceRecord.is_available}
                        groupId={query?.id}
                        userId={student.id}
                        date={hour.date}
                      />
                    </td>
                  )
                } else if (hour.weekend?.date) {
                  // Weekend date
                  return (
                    <td
                      key={`weekend-${student.id}-${hour.date}`}
                      style={{
                        padding: '8px',
                        textAlign: 'center',
                        cursor: 'default',
                        backgroundColor: isDark ? '#3a2a2e' : '#ffe4e6',
                        color: isDark ? '#ff8a8a' : '#c53030',
                        fontSize: '14px',
                        height: '50px',
                        borderBottom: `1px solid ${isDark ? '#444' : '#e0e0e0'}`,
                        borderRight: `1px solid ${isDark ? '#444' : '#e0e0e0'}`
                      }}
                    >
                      <Tooltip title={hour.weekend?.description || ''} arrow placement='top'>
                        <Box
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          <span
                            style={{
                              maxWidth: '60px',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap'
                            }}
                          >
                            {hour.weekend?.description}
                          </span>
                        </Box>
                      </Tooltip>
                    </td>
                  )
                } else {
                  return (
                    <td
                      key={`no-attendance-${student.id}-${hour.date}`}
                      style={{
                        padding: '8px 0',
                        textAlign: 'center',
                        cursor: 'not-allowed',
                        height: '50px',
                        borderBottom: `1px solid ${isDark ? '#444' : '#e0e0e0'}`,
                        borderRight: `1px solid ${isDark ? '#444' : '#e0e0e0'}`
                      }}
                    >
                      <UserViewItem
                        currentDate={currentDate}
                        opened_id={opened_id}
                        setOpenedId={setOpenedId}
                        defaultValue={0}
                      />
                    </td>
                  )
                }
              })}
            </tr>
          )) : null}

          {attendance?.students?.length === 0 && !showCourseEndedNotification && (
            <tr>
              <td
                colSpan={displayDays.length + 1}
                style={{
                  padding: '40px 0',
                  textAlign: 'center',
                  borderBottom: `1px solid ${isDark ? '#444' : '#e0e0e0'}`
                }}
              >
                <EmptyContent />
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </Box>
  )
}

