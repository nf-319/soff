'use client'

import { SyntheticEvent, useState, useEffect, useContext, FC } from 'react'
import { useRouter } from 'next/router'
import Box from '@mui/material/Box'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import TabContext from '@mui/lab/TabContext'
import { styled } from '@mui/material/styles'
import MuiTab, { TabProps } from '@mui/material/Tab'
import UserViewBilling from 'src/views/apps/groups/view/UserViewBilling'
import UserViewOverview from 'src/views/apps/groups/view/GroupsNotes/UserViewOverview'
import UserViewSecurity from './UserViewSecurity'
import GroupExamsList from './GroupExamList/GroupExamsList'
import { useTranslation } from 'react-i18next'
import { AuthContext } from 'src/context/AuthContext'
import { getAttendanceTeacher, setResultId } from 'src/store/apps/groupDetails'
import { useAppDispatch, useAppSelector } from 'src/store'
import GroupStudentGrades from './GroupStudentGrades/GroupStudentGradesList'
import AttendanceTable from './GroupAttandance'
import dayjs from 'dayjs'
import { BadgePercent, BellPlus, Flag, GraduationCap, UserRoundCheck } from 'lucide-react'

type Props = {
  tab: string
}

const Tab = styled(MuiTab)<TabProps>(({ theme }) => ({
  minHeight: 48,
  flexDirection: 'row',
  '& svg': {
    marginBottom: '0 !important',
    marginRight: theme.spacing(1)
  }
}))

const UserViewRight: FC<Props> = ({ tab }) => {
  const [activeTab, setActiveTab] = useState<string>(tab)
  const { t } = useTranslation()
  const { user } = useContext(AuthContext)
  const router = useRouter()
  const dispatch = useAppDispatch()
  const [buttonActive, setButtonActive] = useState(true)
  const today = dayjs().format('YYYY-MM-DD')
  const { attendance } = useAppSelector(state => state.groupDetails)

  const handleChange = (event: SyntheticEvent, value: string) => {
    setActiveTab(value)
    const path = router.route.replace('[tab]', value.toLowerCase())
    dispatch(setResultId(null))

    void router.push({
      pathname: path,
      query: { id: router.query.id, month: router.query.month }
    })
  }

  const handleChangeButton = async (status: boolean) => {
    if (!status) {
      dispatch(
        getAttendanceTeacher({ date: today, group: router.query.id, queryString: 'status=active&is_teacher=true' })
      )
    }
    setButtonActive(status)
  }

  useEffect(() => {
    if (tab && tab !== activeTab) {
      setActiveTab(tab)
    }
  }, [tab])

  return (
    <TabContext value={activeTab}>
      <Box>
        {/*{user?.currentRole === 'teacher' && user.role.includes('teacher') && (*/}
        {/*  <ButtonGroup fullWidth aria-label='Basic button group'>*/}
        {/*    <Button*/}
        {/*      variant={buttonActive ? 'contained' : 'outlined'}*/}
        {/*      onClick={() => {*/}
        {/*        void handleChangeButton(true)*/}
        {/*        setActiveTab('security')*/}
        {/*      }}*/}
        {/*    >*/}
        {/*      Oylik*/}
        {/*    </Button>*/}

        {/*    <Button*/}
        {/*      variant={!buttonActive ? 'contained' : 'outlined'}*/}
        {/*      onClick={() => {*/}
        {/*        void handleChangeButton(false)*/}
        {/*        setActiveTab('attendance')*/}
        {/*      }}*/}
        {/*    >*/}
        {/*      Kunlik*/}
        {/*    </Button>*/}
        {/*  </ButtonGroup>*/}
        {/*)}*/}

        <TabList
          variant='scrollable'
          scrollButtons='auto'
          onChange={handleChange}
          aria-label='forced scroll tabs example'
          sx={{ borderBottom: theme => `1px solid ${theme.palette.divider}` }}
        >
          {buttonActive && <Tab value='security' label={t('Davomat')} icon={<UserRoundCheck />} />}
          {!buttonActive && <Tab value='attendance' label={t('Davomatlar')} icon={<UserRoundCheck />} />}
          {buttonActive && <Tab value='grade' label={t('Baho')} icon={<GraduationCap />} />}
          {!(user?.role.length === 1 && user?.role.includes('teacher')) && (
            <Tab value='notes' label={t('Eslatmalar')} icon={<BellPlus />} />
          )}
          {<Tab value='exams' label={t('Imtixon')} icon={<Flag />} />}
          {!(user?.role.length === 1 && user?.role.includes('teacher')) && (
            <Tab value='discount' label={t('Chegirmalar')} icon={<BadgePercent />} />
          )}
        </TabList>
      </Box>

      <Box sx={{ mt: 2 }}>
        <TabPanel sx={{ p: 0 }} value='security'>
          <UserViewSecurity />
        </TabPanel>

        {!buttonActive && (
          <TabPanel sx={{ p: 0 }} value='attendance'>
            <AttendanceTable attendance={attendance} />
          </TabPanel>
        )}

        <TabPanel sx={{ p: 0 }} value='grade'>
          <GroupStudentGrades />
        </TabPanel>

        <TabPanel sx={{ p: 0 }} value='exams'>
          <GroupExamsList />
        </TabPanel>

        <TabPanel sx={{ p: 0 }} value='notes'>
          <UserViewOverview />
        </TabPanel>

        <TabPanel sx={{ p: 0 }} value='discount'>
          <UserViewBilling />
        </TabPanel>
      </Box>
    </TabContext>
  )
}

UserViewRight.displayName = 'UserViewRight'
export default UserViewRight
