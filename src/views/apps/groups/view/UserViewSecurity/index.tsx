"use client"

import { useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from "next/router"
import { Box, Button, Paper, Tabs, Tab, Typography } from "@mui/material"
import { Archive, ArrowUp } from "lucide-react"
import api from "src/@core/utils/api"
import getMontName, { getMontNumber } from "src/@core/utils/gwt-month-name"
import { toast } from "react-hot-toast"
import { useAppDispatch, useAppSelector } from "src/store"
import { getAttendance, getDays, setGettingAttendance, updateParams } from "src/store/apps/groupDetails"
import { useSettings } from "src/@core/hooks/useSettings"
import { useTranslation } from "react-i18next"
import { DateChangeDialog } from './DateChangeDialog'
import { TopicEditDialog } from './TopicEditDialog'
import { AttendanceTable } from './AttendenceTable'
import { AttendanceTableSkeleton } from './AttendanceTableSkeleton'

const UserViewSecurity = () => {
  const { queryParams, attendance, isGettingAttendance, days, groupData, month_list } = useAppSelector(
    (state) => state.groupDetails,
  )
  const dispatch = useAppDispatch()
  const [changeDateLoader, setChangeDateLoader] = useState(false)
  const [changeTopicLoader, setChangeTopicLoader] = useState(false)
  const [selectedOldDate, setSelectedOldDate] = useState(null)
  const [selectedNewDate, setSelectedNewDate] = useState(null)
  const [openDialog, setOpenDialog] = useState(false)
  const { pathname, query, push } = useRouter()
  const { settings } = useSettings()
  const [opened_id, setOpenedId] = useState<any>(null)
  const [openTooltip, setOpenTooltip] = useState<null | string>(null)
  const [topic, setTopic] = useState<any>("")
  const [updateTopic, setUpdateTopic] = useState(false)
  const [topicId, setTopicId] = useState<number | null>(null)
  const { t } = useTranslation()
  const queryString = new URLSearchParams(queryParams).toString()
  const [currentMonth, setCurrentMonth] = useState(0)
  const [loading, setLoading] = useState(false)
  const isDark = settings.mode === "dark"
  const initialized = useRef(false)

  const isDatePast = (dateString: string): boolean => {
    if (!dateString) return false
    const inputDate = new Date(dateString)
    const currentDate = new Date()
    return inputDate < currentDate
  }

  const isPast = isDatePast(groupData?.end_date)

  const handleDateChange = async () => {
    setChangeDateLoader(true)
    try {
      await api.post(`common/group/lesson/transfer/`, {
        group: query.id,
        old_date: selectedOldDate,
        new_date: selectedNewDate ? new Date(selectedNewDate).toISOString().split("T")[0] : "",
      })

      toast.success("Dars kuni o'zgartirildi")

      setSelectedNewDate(null)
      setSelectedOldDate(null)
      setOpenDialog(false)

      dispatch(
        getAttendance({
          date: `${query?.year || new Date().getFullYear()}-${getMontNumber(query?.month)}`,
          group: query?.id,
          queryString: queryString,
        }),
      )

      dispatch(
        getDays({
          date: `${query?.year || new Date().getFullYear()}-${getMontNumber(query?.month)}`,
          group: query?.id,
        }),
      )
    } catch (err: any) {
      console.error(err)
      toast.error(t(err.response?.data?.new_date) || "Xatolik")
    }
    setChangeDateLoader(false)
  }

  const handleTopicChange = async (newTopic: string) => {
    setChangeTopicLoader(true)
    try {
      await api.patch(`common/topic/update/${topicId}`, {
        topic: newTopic,
      })

      toast.success("Dars nomi o'zgartirildi")
      setUpdateTopic(false)

      dispatch(
        getAttendance({
          date: `${query?.year || new Date().getFullYear()}-${getMontNumber(query?.month)}`,
          group: query?.id,
          queryString: queryString,
        }),
      )

      dispatch(
        getDays({
          date: `${query?.year || new Date().getFullYear()}-${getMontNumber(query?.month)}`,
          group: query?.id,
        }),
      )
    } catch (err) {
      console.error(err)
      toast.error("Xatolik")
    }
    setChangeTopicLoader(false)
  }

  const handleDayClick = (day: any) => {
    setSelectedOldDate(day)
    setOpenDialog(true)
  }

  const handleClick = async (date: any, index: number) => {
    setCurrentMonth(index)
    setLoading(true)

    const value: {
      month: string
      year: string
    } = {
      month: date.date.split("-")[1],
      year: date.date.split("-")[0],
    }

    await push({
      pathname,
      query: { ...query, month: getMontName(Number(value.month)), year: value.year, id: query?.id },
    })

    dispatch(setGettingAttendance(true))
    await dispatch(getDays({ date: `${value.year}-${value.month}`, group: query?.id }))
    await dispatch(getAttendance({ date: `${value.year}-${value.month}`, group: query?.id, queryString: queryString }))
    dispatch(setGettingAttendance(false))

    setLoading(false)
  }

  const handleTopicSubmit = async (hour: any) => {
    try {
      const response = await api.post("common/topic/create/", { topic, group: query?.id, date: hour.date })
      if (response.status == 201) {
        setTopic(null)
        setOpenTooltip(null)
        if (query.month) {
          await dispatch(
            getDays({
              date: `${query?.year || new Date().getFullYear()}-${getMontNumber(query?.month)}`,
              group: query?.id,
            }),
          )
        } else {
          toast.error(`Saqlangan ma'lumotni bolmadi`, { duration: 2000 })
        }
      } else {
        toast.error("Saqlab bo'lmadi", { duration: 2000 })
      }
    } catch (err) {
      console.error(err)
      toast.error("Saqlab bo'lmadi", { duration: 2000 })
    }
  }

  const attendanceDate = useMemo(() => {
    const year = query?.year || new Date().getFullYear()
    const monthNumber = getMontNumber(query?.month)
    return `${year}-${monthNumber}`
  }, [query?.year, query?.month])

  useEffect(() => {
    if (!initialized.current && month_list.length > 0) {
      initialized.current = true

      const initializeData = async () => {
        if (query?.month) {
          const index = month_list.findIndex((item) => getMontName(Number(item.date.split("-")[1])) === query.month)
          if (index !== -1) {
            setCurrentMonth(index)
            dispatch(setGettingAttendance(true))
            await dispatch(getDays({ date: month_list[index].date, group: query?.id }))
            await dispatch(getAttendance({
              date: `${query?.year || new Date().getFullYear()}-${getMontNumber(query?.month)}`,
              group: query?.id,
              queryString: queryString
            }))
            dispatch(setGettingAttendance(false))
          }
        }
      }

      void initializeData()
    }
  }, [month_list, query.month, query?.id, queryString, dispatch])

  useEffect(() => {
    const fetchAttendance = async () => {
      if (query?.month && query?.id && !isGettingAttendance) {
        dispatch(setGettingAttendance(true))
        await dispatch(getAttendance({ date: attendanceDate, group: query?.id, queryString }))
        await dispatch(getDays({ date: attendanceDate, group: query?.id }))
        dispatch(setGettingAttendance(false))
      }
    }

    void fetchAttendance()
  }, [queryParams.status, queryString])

  return (
    <Paper
      elevation={0}
      style={{
        padding: "16px",
        backgroundColor: isDark ? "#282A42" : "#fff",
        boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
        borderRadius: "8px",
      }}
    >
      <Box style={{ marginBottom: "16px" }}>
        <Typography
          variant="h6"
          style={{
            fontWeight: 600,
            marginBottom: "16px",
          }}
        >
          Davomat
        </Typography>

        <Tabs
          value={currentMonth}
          onChange={(_, newValue) => {
            if (month_list[newValue]) {
              void handleClick(month_list[newValue], newValue)
            }
          }}
          variant="scrollable"
          scrollButtons="auto"
          style={{
            marginBottom: "16px",
            borderBottom: `1px solid ${isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)"}`,
          }}
        >
          {month_list.map((item, index) => (
            <Tab
              key={item.date}
              label={item.month}
              style={{
                textTransform: "none",
                fontWeight: currentMonth === index ? 600 : 400,
              }}
            />
          ))}
        </Tabs>
      </Box>

      {isGettingAttendance || loading ? (
        <AttendanceTableSkeleton isDark={isDark} />
      ) : (
        <>
          <AttendanceTable
            attendance={attendance}
            days={days}
            isDark={isDark}
            isPast={isPast}
            opened_id={opened_id}
            setOpenedId={setOpenedId}
            openTooltip={openTooltip}
            setOpenTooltip={setOpenTooltip}
            handleDayClick={handleDayClick}
            handleTopicSubmit={handleTopicSubmit}
            topic={topic}
            setTopic={setTopic}
            setUpdateTopic={setUpdateTopic}
            setTopicId={setTopicId}
            t={t}
            query={query}
            groupData={groupData}
          />

          <Box
            style={{
              width: "100%",
              display: "flex",
              padding: "16px 0",
              borderTop: `1px solid ${isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)"}`,
            }}
          >
            <Button
              startIcon={
                queryParams.status === "archive" ? (
                  <ArrowUp style={{ width: "16px", height: "16px" }} />
                ) : (
                  <Archive style={{ width: "16px", height: "16px" }} />
                )
              }
              style={{
                marginLeft: "auto",
                textTransform: "none",
              }}
              size="small"
              color={queryParams.status === "archive" ? "primary" : "error"}
              variant="text"
              onClick={() => {
                if (queryParams?.status === "archive") {
                  dispatch(updateParams({ status: "active,new" }))
                } else dispatch(updateParams({ status: "archive" }))
              }}
            >
              {queryParams.status === "archive" ? t("Arxivni yopish") : t("Arxivdagi o'quvchilarni ko'rish")}
            </Button>
          </Box>
        </>
      )}

      <DateChangeDialog
        open={openDialog}
        setOpen={setOpenDialog}
        selectedOldDate={selectedOldDate}
        selectedNewDate={selectedNewDate}
        setSelectedOldDate={setSelectedOldDate}
        setSelectedNewDate={setSelectedNewDate}
        changeDateLoader={changeDateLoader}
        handleDateChange={handleDateChange}
      />

      <TopicEditDialog
        open={updateTopic}
        setOpen={setUpdateTopic}
        initialTopic={topic}
        setTopic={setTopic}
        changeTopicLoader={changeTopicLoader}
        handleTopicChange={handleTopicChange}
      />
    </Paper>
  )
}

export default UserViewSecurity

