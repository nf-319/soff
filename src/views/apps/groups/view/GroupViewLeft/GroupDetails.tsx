'use client'

import { useContext, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useRouter } from 'next/router'
import toast from 'react-hot-toast'
import { AuthContext } from 'src/context/AuthContext'
import { useAppDispatch, useAppSelector } from 'src/store'
import { getSMSTemp, handleEditClickOpen, setOnlineLessonLoading } from 'src/store/apps/groupDetails'
import { getDashboardLessons, getGroupsDetails, handleOpenEdit } from 'src/store/apps/groups'
import api from 'src/@core/utils/api'
import GroupDetailsWrapper from './GroupDetailsWrapper'
import { GroupCreateEditDrawer } from '@/components/GroupDrawerModal'
import { AccessDeniedModal } from '@components/AccessDeniedModal'

export default function GroupDetails() {
  const { groupData, isGettingGroupDetails, onlineLessonLoading } = useAppSelector(state => state.groupDetails)
  const { companyInfo } = useAppSelector(state => state.user)
  const dispatch = useAppDispatch()
      const [openEditModal, setOpenEditModal] = useState<'create'|'edit'|null>(null)

  const [accessModal, setAccessModal] = useState<boolean>(false)
  const { user } = useContext(AuthContext)
  const router = useRouter()

  const handleOpenSendSMSModal = async () => {
    if(companyInfo.access) {
    dispatch(handleEditClickOpen('send-sms'))
    await dispatch(getSMSTemp())
    } else {
      setAccessModal(true)
    }
  }

  const handleEdit = async (id: any) => {
    setOpenEditModal('edit')
    const filtered = { ...groupData }
    const queryString = new URLSearchParams({
      day_of_week: filtered?.day_of_week?.toString(),
      teacher: String(filtered?.teacher_data?.id),
      room: String(filtered?.room_data?.id)
    }).toString()
    await Promise.all([dispatch(getDashboardLessons(queryString)), dispatch(getGroupsDetails(id))])
  }

  async function handleGetMeetLink() {
    dispatch(setOnlineLessonLoading(true))
    await api
      .get(`meets/google/login/`)
      .then(res => {
        if (res.data.url) {
          router.push(res.data.url)
        }
      })
      .catch(err => {
        console.log(err)
        toast.error(err.response.data.msg)
      })
    dispatch(setOnlineLessonLoading(false))
  }

  return (
    <>
      <GroupDetailsWrapper
        setOpen={setOpenEditModal}
        groupData={groupData}
        isGettingGroupDetails={isGettingGroupDetails}
        onlineLessonLoading={onlineLessonLoading}
        user={user}
        handleEdit={handleEdit}
        handleOpenSendSMSModal={handleOpenSendSMSModal}
        handleEditClickOpen={(type: any) => dispatch(handleEditClickOpen(type))}
        handleGetMeetLink={handleGetMeetLink}
      />
      <GroupCreateEditDrawer open={openEditModal} setOpen={setOpenEditModal}/>
      <AccessDeniedModal open={accessModal} onClose={() => setAccessModal(false)} />
      <EditGroupModal />
    </>
  )
}
