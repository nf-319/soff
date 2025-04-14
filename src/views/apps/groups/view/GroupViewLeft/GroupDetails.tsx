"use client"

import { useContext } from "react"
import { useTranslation } from "react-i18next"
import { useRouter } from "next/router"
import toast from "react-hot-toast"
import { AuthContext } from "src/context/AuthContext"
import { useAppDispatch, useAppSelector } from "src/store"
import { getSMSTemp, handleEditClickOpen, setOnlineLessonLoading } from "src/store/apps/groupDetails"
import EditGroupModal from "../../EditGroupModal"
import { getDashboardLessons, getGroupsDetails, handleOpenEdit } from "src/store/apps/groups"
import api from "src/@core/utils/api"
import GroupDetailsWrapper from "./GroupDetailsWrapper"
import DebtorsModal from "../../DebtorsModal"


export default function GroupDetails() {
  const { groupData, isGettingGroupDetails, onlineLessonLoading } = useAppSelector((state) => state.groupDetails)
  const dispatch = useAppDispatch()
  const { user } = useContext(AuthContext)
  const router = useRouter()

  const handleOpenSendSMSModal = async () => {
    dispatch(handleEditClickOpen("send-sms"))
    await dispatch(getSMSTemp())
  }

  const handleEdit = async (id: any) => {
    dispatch(handleOpenEdit(true))
    const filtered = { ...groupData }
    const queryString = new URLSearchParams({
      day_of_week: filtered?.day_of_week?.toString(),
      teacher: String(filtered?.teacher_data?.id),
      room: String(filtered?.room_data?.id),
    }).toString()
    await Promise.all([dispatch(getDashboardLessons(queryString)), dispatch(getGroupsDetails(id))])
  }

  async function handleGetMeetLink() {
    dispatch(setOnlineLessonLoading(true))
    await api
      .get(`meets/google/login/`)
      .then((res) => {
        if (res.data.url) {
          router.push(res.data.url)
        }
      })
      .catch((err) => {
        console.log(err)
        toast.error(err.response.data.msg)
      })
    dispatch(setOnlineLessonLoading(false))
  }

  return (
    <>
      <GroupDetailsWrapper
        groupData={groupData}
        isGettingGroupDetails={isGettingGroupDetails}
        onlineLessonLoading={onlineLessonLoading}
        user={user}
        handleEdit={handleEdit}
        handleOpenSendSMSModal={handleOpenSendSMSModal}
        handleEditClickOpen={(type: any) => dispatch(handleEditClickOpen(type))}
        handleGetMeetLink={handleGetMeetLink}
      />
      <EditGroupModal />
      <DebtorsModal/>
    </>
  )
}

