"use client"

import type React from "react"

import { Box, Button, Chip, Typography } from "@mui/material"
import { useRouter } from "next/router"
import IconifyIcon from "src/components/icon"
import Tooltip from "@mui/material/Tooltip"
import { useState } from "react"
import getMontName from "src/@core/utils/gwt-month-name"
import { useTranslation } from "react-i18next"
import { EmptyContent } from "src/components/empty-content"
import { useAppDispatch, useAppSelector } from "src/store"
import { getDays, getStudentsGrades, updateGradeParams } from "src/store/apps/groupDetails"
import { useSettings } from "src/@core/hooks/useSettings"
import SubLoader from "src/views/apps/loaders/SubLoader"
import dayjs from "dayjs"
import { ListItem } from './ListItem'
import { useGet } from 'src/hooks/useApi'

const GroupStudentGrades = () => {
  const { gradeQueryParams, isGettingGrades, days, month_list } = useAppSelector((state) => state.groupDetails)
  const dispatch = useAppDispatch()
  const currentDate = dayjs().format("YYYY-MM-DD")

  const { pathname, query, push } = useRouter()
  const { settings } = useSettings()
  const [opened_id, setOpenedId] = useState<any>(null)
  const { t } = useTranslation()

  const { data: grades, isLoading, refetch }  = useGet(`common/group-student/rating/list/${query.id}/`, {
    params: { date: currentDate },
    deps: ["rating"]
  })

  const handleClick = async (date: any) => {
    const value: {
      month: string
      year: string
    } = {
      month: date.date.split("-")[1],
      year: date.date.split("-")[0],
    }
    await dispatch(getDays({ date: `${value.year}-${value.month}`, group: query?.id }))
    await dispatch(getStudentsGrades({ id: query?.id, queryString: `date=${value.year}-${value.month}-1` }))

    void push({
      pathname,
      query: { ...query, month: getMontName(Number(value.month)), year: value.year, id: query?.id },
    })
  }

  return isLoading ? (
    <SubLoader />
  ) : (
    <Box className="demo-space-y">
      <ul
        className="hide-scrollbar"
        style={{
          display: "flex",
          listStyle: "none",
          margin: 0,
          padding: 0,
          gap: "15px",
          marginBottom: 12,
          overflow: "auto",
        }}
      >
        {month_list.map((item) => (
          <li
            key={item.date}
            onClick={() => handleClick(item)}
            style={{
              borderBottom:
                query?.month === getMontName(Number(item.date.split("-")[1]))
                  ? "2px solid #c3cccc"
                  : "2px solid transparent",
              cursor: "pointer",
            }}
          >
            {item.month}
          </li>
        ))}
      </ul>
      <Box sx={{ display: "flex", width: "100%", paddingBottom: 3, maxWidth: "100%", overflowX: "auto" }}>
        <Box>
          <table>
            <thead>
            <tr style={{ borderBottom: "1px solid #c3cccc" }}>
              <td
                style={{
                  position: "sticky",
                  left: 0,
                  background: settings.mode == "dark" ? "#282A42" : "#ffffff",
                  color: settings.mode == "dark" ? "#f0f0f0" : "#000000",
                  zIndex: 1,
                  padding: "8px 20px",
                  textAlign: "start",
                  fontSize: "14px",
                  borderRight: `1px solid ${settings.mode == "dark" ? "#444" : "#c3cccc"}`,
                }}
              >
                <Typography>{t("O'quvchilar")}</Typography>
              </td>
              {grades &&
                days?.map((hour: any) => (
                  <th
                    key={hour.date}
                    style={{ textAlign: "center", width: "60px", padding: "8px 0", cursor: "pointer" }}
                  >
                    <Typography>{`${hour.date.split("-")[2]}`}</Typography>
                  </th>
                ))}
            </tr>
            </thead>
            {grades?.result.length > 0 ? (
              <tbody>
              {grades &&
                grades.result.map((student: any) => (
                  <tr key={student.id} style={{}}>
                    <td
                      style={{
                        position: "sticky",
                        left: 0,
                        background: settings.mode == "dark" ? "#282A42" : "#ffffff",
                        zIndex: 1,
                        padding: "8px 20px",
                        textAlign: "start",
                        fontSize: "14px",
                        borderRight: `1px solid ${settings.mode == "dark" ? "#444" : "#c3cccc"}`,
                      }}
                    >
                      <Box display="flex" alignItems="center" justifyContent={"space-between"} gap={3}>
                        <Typography>{student.first_name}</Typography>
                        <Chip
                          color="error"
                          size="small"
                          sx={{
                            color: Number(student?.gpa) >= 4 ? "green" : Number(student?.gpa) >= 3 ? "orange" : "red",
                            borderColor:
                              Number(student?.gpa) >= 4 ? "green" : Number(student?.gpa) >= 3 ? "orange" : "red",
                          }}
                          variant="outlined"
                          label={student?.gpa}
                        />
                      </Box>
                    </td>
                    {days?.map((hour: any) => {
                      const currentDate = student.ratings?.find((el: any) => el.date === hour.date)
                      const matchedRating = student?.ratings?.find(
                        (el: any) => el.date === hour.date && !hour.weekend?.date,
                      )

                      return student?.ratings?.some((el: any) => el.date === hour.date) &&
                      student?.ratings?.find((el: any) => el.date === hour.date && !hour.weekend?.date) ? (
                        <td
                          key={student.ratings.find((el: any) => el.date === hour.date).date}
                          style={{ padding: "8px 10px", textAlign: "center", cursor: "pointer" }}
                        >
                          {matchedRating.score != null ? (
                            <ListItem
                              refetch={refetch}
                              currentDate={currentDate}
                              opened_id={opened_id}
                              setOpenedId={setOpenedId}
                              defaultValue={matchedRating?.score}
                              groupId={query?.id}
                              userId={student.id}
                              date={hour.date}
                            />
                          ) : (
                            <ListItem
                              refetch={refetch}
                              currentDate={currentDate}
                              opened_id={opened_id}
                              setOpenedId={setOpenedId}
                              defaultValue={"-"}
                              groupId={query?.id}
                              userId={student.id}
                              date={hour.date}
                            />
                          )}
                        </td>
                      ) : hour.weekend?.date ? (
                        <td
                          key={hour.date}
                          style={{
                            padding: "10px 8px",
                            textAlign: "center",
                            cursor: "default",
                            backgroundColor: "#ffe4e6",
                            color: "#c53030",
                            borderRadius: "4px",
                            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
                            fontSize: "14px",
                            fontWeight: "500",
                            position: "relative",
                          }}
                        >
                          <Tooltip title={hour.weekend?.description || ""} arrow placement="top">
                              <span
                                style={{
                                  display: "inline-block",
                                  maxWidth: "100px",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  whiteSpace: "nowrap",
                                  cursor: "pointer",
                                }}
                              >
                                {hour.weekend?.description}
                              </span>
                          </Tooltip>
                        </td>
                      ) : (
                        <td key={hour.date} style={{ padding: "8px 0", textAlign: "center", cursor: "not-allowed" }}>
                            <span>
                              <ListItem
                                refetch={refetch}
                                currentDate={currentDate}
                                opened_id={opened_id}
                                setOpenedId={setOpenedId}
                                defaultValue={null}
                              />
                            </span>
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            ) : (
              <tr>
                <td colSpan={14}>
                  <EmptyContent />
                </td>
              </tr>
            )}
          </table>
          {!isGettingGrades && (
            <Box sx={{ width: "100%", display: "flex", pt: "10px" }}>
              <Button
                startIcon={
                  <IconifyIcon
                    style={{ fontSize: "12px" }}
                    icon={`icon-park-outline:to-${gradeQueryParams.status === "archive" ? "top" : "bottom"}`}
                  />
                }
                sx={{ fontSize: "10px", marginLeft: "auto" }}
                size="small"
                color={gradeQueryParams.status === "archive" ? "primary" : "error"}
                variant="text"
                onClick={() => {
                  if (gradeQueryParams?.status === "archive") {
                    dispatch(updateGradeParams({ status: "active,new" }))
                  } else dispatch(updateGradeParams({ status: "archive" }))
                }}
              >
                {gradeQueryParams.status === "archive" ? t("Arxivni yopish") : t("Arxivdagi o'quvchilarni ko'rish")}
              </Button>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  )
}

export default GroupStudentGrades

