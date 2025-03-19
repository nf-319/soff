"use client"

import type React from "react"
import type { Dispatch } from "react"
import { useMemo, useCallback } from "react"
import { Box, IconButton, Tooltip, Typography, useMediaQuery } from '@mui/material'
import { CalendarCheck, Edit } from "lucide-react"
import { UserViewItem } from "./UserViewItem"
import { EmptyContent } from "src/components/empty-content"

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
  opened_id: any
  setOpenedId: (id: any) => void
  handleDayClick: (day: any) => void
  handleOpenTopicAdd: (date: string) => void
  setUpdateTopic: (open: boolean) => void
  setTopicId: (id: number) => void
  setTopic: Dispatch<any>
  t: (key: string) => string
  query: any
  groupData?: any
}

export const AttendanceTable = ({
  attendance,
  days,
  isDark,
  opened_id,
  setOpenedId,
  handleDayClick,
  handleOpenTopicAdd,
  setTopic,
  setUpdateTopic,
  setTopicId,
  t,
  query,
}: AttendanceTableProps) => {
  const mediaQuery = useMediaQuery("(max-width: 600px)")
  const displayDays = useMemo(() => {
    return days?.length > 0 ? days : Array(7).fill({ date: 'placeholder' })
  }, [days])

  const students = useMemo(() => {
    return attendance?.students || []
  }, [attendance])

  const tableStyles: React.CSSProperties = useMemo(
    () => ({
      borderCollapse: 'collapse',
      backgroundColor: isDark ? '#282A42' : '#fff',
      tableLayout: 'fixed',
      width: mediaQuery ? "auto" : days?.length > 15 ? 'auto' : '100%'
    }),
    [isDark]
  )

  const stickyHeaderStyles: React.CSSProperties = useMemo(
    () => ({
      position: 'sticky',
      left: 0,
      background: isDark ? '#1e2035' : '#f5f5f5',
      zIndex: 2,
      padding: '12px 20px',
      fontWeight: 600,
      borderBottom: `1px solid ${isDark ? '#444' : '#e0e0e0'}`,
      borderRight: `1px solid ${isDark ? '#444' : '#e0e0e0'}`,
      width: '150px',
      minWidth: '150px',
      maxWidth: '150px'
    }),
    [isDark]
  )

  const dayHeaderStyles: React.CSSProperties = {
    textAlign: 'center',
    width: '60px',
    minWidth: '60px',
    maxWidth: '60px',
    padding: '12px 8px',
    fontWeight: 600,
    backgroundColor: isDark ? '#2a3246' : '#e6f0fa',
    borderBottom: `1px solid ${isDark ? '#444' : '#e0e0e0'}`,
    borderRight: `1px solid ${isDark ? '#444' : '#e0e0e0'}`
  }

  const stickyColumnStyles: React.CSSProperties = useMemo(
    () => ({
      position: 'sticky',
      left: 0,
      background: isDark ? '#282A42' : '#fff',
      zIndex: 2,
      padding: '12px 20px',
      fontWeight: 500,
      borderBottom: `1px solid ${isDark ? '#444' : '#e0e0e0'}`,
      borderRight: `1px solid ${isDark ? '#444' : '#e0e0e0'}`,
      width: '150px',
      minWidth: '150px',
      maxWidth: '150px'
    }),
    [isDark]
  )

  const handleTopicEdit = useCallback(
    (lessonId: any, topic: any) => {
      setUpdateTopic(true)
      setTopicId(lessonId)
      setTopic(topic)
    },
    [setUpdateTopic, setTopicId, setTopic]
  )

  return (
    <Box
      sx={{
        width: '100%',
        overflowX: 'auto',
        overflowY: 'hidden',
        '& table': {
          minWidth: days?.length <= 7 ? '100%' : (150 + (days?.length * 60)) + 'px'
        }
      }}
    >
      <table style={tableStyles}>
        <thead>
          <tr>
            <td style={stickyHeaderStyles}>
              <Typography fontWeight={600}>{t('Mavzular')}</Typography>
            </td>

            {displayDays.map((hour: any, index) => {
              const hourStyles: React.CSSProperties = {
                textAlign: 'center',
                width: '100%',
                padding: '12px 8px',
                minWidth: '60px',
                maxWidth: '80px',
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
              }

              return (
                <td key={hour.date || `placeholder-${index}`} style={hourStyles}>
                  {hour.date !== 'placeholder' && (
                    <div>
                      {hour.exam ? (
                        <Tooltip
                          arrow
                          placement='top'
                          title={
                            <Box style={{ padding: '8px', backgroundColor: '#fff' } as React.CSSProperties}>
                              <Typography style={{ margin: '0', marginBottom: '4px' } as React.CSSProperties}>
                                {hour.exam.title}
                              </Typography>
                              <Typography style={{ margin: '0' } as React.CSSProperties}>
                                Ball: {hour.exam.min_score} / {hour.exam.max_score}
                              </Typography>
                            </Box>
                          }
                        >
                          <Box
                            style={
                              {
                                width: '100%',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                                cursor: 'pointer'
                              } as React.CSSProperties
                            }
                          >
                            {hour.exam?.title}
                          </Box>
                        </Tooltip>
                      ) : hour.lesson ? (
                        <Tooltip arrow placement='top' title={hour.lesson.topic}>
                          <Box
                            style={
                              {
                                width: '100%',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '4px'
                              } as React.CSSProperties
                            }
                          >
                            <span
                              style={
                                {
                                  maxWidth: '80%',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis'
                                } as React.CSSProperties
                              }
                              onClick={() => handleTopicEdit(hour.lesson.id, hour.lesson.topic)}
                            >
                              {hour.lesson.topic}
                            </span>
                            <IconButton
                              size='small'
                              onClick={() => handleTopicEdit(hour.lesson.id, hour.lesson.topic)}
                              style={{ padding: '2px' } as React.CSSProperties}
                            >
                              <Edit style={{ width: '14px', height: '14px' }} />
                            </IconButton>
                          </Box>
                        </Tooltip>
                      ) : (
                        <IconButton size='medium' onClick={() => handleOpenTopicAdd(hour.date)}>
                          <CalendarCheck size={18} />
                        </IconButton>
                      )}
                    </div>
                  )}
                </td>
              )
            })}
          </tr>
          <tr>
            <td style={stickyHeaderStyles}>
              <Typography fontWeight={600}>{t("O'quvchilar")}</Typography>
            </td>
            {displayDays.map((hour: any, index) => (
              <th
                key={hour.date || `placeholder-day-${index}`}
                style={
                  {
                    ...dayHeaderStyles,
                    cursor: hour.date !== 'placeholder' ? 'pointer' : 'default'
                  } as React.CSSProperties
                }
                onClick={() => hour.date !== 'placeholder' && handleDayClick(hour.date)}
              >
                {hour.date !== 'placeholder' ? (
                  <Box
                    style={
                      {
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '4px'
                      } as React.CSSProperties
                    }
                  >
                    <Typography fontWeight={600} style={{ fontSize: '16px' } as React.CSSProperties}>
                      {`${hour.date.split('-')[2]}`}
                    </Typography>
                  </Box>
                ) : (
                  <Box style={{ height: '24px' } as React.CSSProperties}></Box>
                )}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {students.length
            ? students.map((student: Student, studentIndex: number) => (
                <tr
                  key={student.id || `placeholder-student-${studentIndex}`}
                  style={
                    {
                      borderBottom: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'}`
                    } as React.CSSProperties
                  }
                >
                  <td style={stickyColumnStyles}>
                    {student.id !== 'placeholder' ? (
                      <Typography
                        style={
                          {
                            fontWeight: 500,
                            color: isDark ? '#fff' : '#000',
                            whiteSpace: 'normal',
                            wordWrap: 'normal',
                            wordBreak: 'normal',
                            maxWidth: '150px',
                            width: '100%'
                          } as React.CSSProperties
                        }
                      >
                        {student.first_name}
                      </Typography>
                    ) : (
                      <Typography
                        style={
                          {
                            fontWeight: 500,
                            color: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)'
                          } as React.CSSProperties
                        }
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
                          style={
                            {
                              padding: '8px 0',
                              textAlign: 'center',
                              height: '50px',
                              borderBottom: `1px solid ${isDark ? '#444' : '#e0e0e0'}`,
                              borderRight: `1px solid ${isDark ? '#444' : '#e0e0e0'}`
                            } as React.CSSProperties
                          }
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
                          style={
                            {
                              padding: '8px 0',
                              textAlign: 'center',
                              cursor: 'pointer',
                              height: '50px',
                              borderBottom: `1px solid ${isDark ? '#444' : '#e0e0e0'}`,
                              borderRight: `1px solid ${isDark ? '#444' : '#e0e0e0'}`
                            } as React.CSSProperties
                          }
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
                      return (
                        <td
                          key={`weekend-${student.id}-${hour.date}`}
                          style={
                            {
                              padding: '8px',
                              textAlign: 'center',
                              cursor: 'default',
                              backgroundColor: isDark ? '#3a2a2e' : '#ffe4e6',
                              color: isDark ? '#ff8a8a' : '#c53030',
                              fontSize: '14px',
                              height: '50px',
                              borderBottom: `1px solid ${isDark ? '#444' : '#e0e0e0'}`,
                              borderRight: `1px solid ${isDark ? '#444' : '#e0e0e0'}`
                            } as React.CSSProperties
                          }
                        >
                          <Tooltip title={hour.weekend?.description || ''} arrow placement='top'>
                            <Box
                              style={
                                {
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center'
                                } as React.CSSProperties
                              }
                            >
                              <span
                                style={
                                  {
                                    maxWidth: '60px',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap'
                                  } as React.CSSProperties
                                }
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
                          style={
                            {
                              padding: '8px 0',
                              textAlign: 'center',
                              cursor: 'not-allowed',
                              height: '50px',
                              borderBottom: `1px solid ${isDark ? '#444' : '#e0e0e0'}`,
                              borderRight: `1px solid ${isDark ? '#444' : '#e0e0e0'}`
                            } as React.CSSProperties
                          }
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
              ))
            : null}

          {attendance?.students?.length === 0 && (
            <tr>
              <td
                colSpan={displayDays.length + 1}
                style={
                  {
                    padding: '40px 0',
                    textAlign: 'center',
                    borderBottom: `1px solid ${isDark ? '#444' : '#e0e0e0'}`
                  } as React.CSSProperties
                }
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

