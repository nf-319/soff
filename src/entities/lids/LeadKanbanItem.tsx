import {
  ChartCandlestick,
  ClockArrowDown,
  Ellipsis,
  EyeIcon,
  MonitorDown,
  ThermometerSnowflake,
  User
} from 'lucide-react'
import { Box, IconButton, Tooltip, Typography } from '@mui/material'
import { DraggableProvided, DraggableStateSnapshot } from 'react-beautiful-dnd'
import { FC, memo, useState } from 'react'
import { LeadsMenu } from './Menu'
import { MenuOpenType } from './model/type'
import { LidsDragonModal } from '@/views/apps/lids/LidsDragonModal'
import AdminPanelSettingsOutlinedIcon from '@mui/icons-material/AdminPanelSettingsOutlined'
import { useRouter } from 'next/router'
import { useQuery } from '@tanstack/react-query'
import api from '@/@core/utils/api'
import { getFormatDate } from '@/shared/utils/getFormatDate'
import Divider from '@mui/material/Divider'
import { LID_STATUS, LID_TEMPERATURE } from '@/shared/config/sourse'

type Props = {
  provided?: DraggableProvided
  snapshot?: DraggableStateSnapshot
  lead: any
  onClose?: boolean
  defaultId?: any
}

export const LeadKanbanItem: FC<Props> = memo(({ defaultId, provided, snapshot, lead, onClose }) => {
  const [studentModalOpen, setStudentModalOpen] = useState<boolean>(false)
  const [selectedLead, setSelectedLead] = useState<any | null>(null)
  const [currentLead, setCurrentLead] = useState<any>(null)
  const [menuOpen, setMenuOpen] = useState<MenuOpenType>(null)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const { query } = useRouter()

  const handleMenuOpen = (event: any, lead: any) => {
    setStudentModalOpen(true)
    setSelectedLead(lead)
  }
  const fetchLeadById = async (id: number) => {
    const { data } = await api.get(`amocrm/leads/detail/${id}/`)
    return data
  }

  const { refetch } = useQuery({
    queryKey: ['lead', lead.id],
    queryFn: () => fetchLeadById(Number(lead.id)),
    enabled: false
  })

  const handleClick = (event: any, lead: any) => {
    setCurrentLead(lead)
    setAnchorEl(event.currentTarget)
  }

  const handleGetAmoLeadDetail = (id: number) => {
    if(query.is_amocrm) {
      void refetch()
    }
  }

  return (
    <>
      <div
        onClick={() => handleGetAmoLeadDetail(lead.id)}
        className='shadow-sm p-3 rounded'
        ref={provided?.innerRef}
        {...provided?.draggableProps}
        {...provided?.dragHandleProps}
        style={{
          ...provided?.draggableProps.style,
          opacity: snapshot?.isDragging ? '0.5' : '1',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          border: '1px solid #e0e0e0e0',
          marginBottom: 10,
          textAlign: 'center',
          padding: '5px'
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
          <Box style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <Box
              sx={{
                border: '1px solid #666CFF',
                flexShrink: 0,
                display: 'flex',
                alignItems: 'center',
                borderRadius: '100%',
                justifyContent: 'center'
              }}
              width={40}
              height={40}
            >
              <User width={20} height={20} color='#666CFF' />
            </Box>

            <Box width="auto" sx={{ textAlign: 'start' }}>
              <Typography sx={{ fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', wordBreak: 'break-word' }}>
                {lead?.first_name}
              </Typography>

              <Typography fontSize={12}>{lead?.phone}</Typography>
            </Box>
          </Box>

          <Divider />

          <Box
            display='flex'
            flexWrap='wrap'
            alignItems='start'
            justifyContent='start'
            gap={3}
            sx={{
              borderRight: '1px solid #e0e0e0',
              '&:last-child': {
                borderRight: 'none'
              }
            }}
          >
            {lead?.admin_name && (
              <Tooltip title='Ish olib borayotgan hodim'>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: '#666CFF' }}>
                  <AdminPanelSettingsOutlinedIcon style={{ fontSize: 13 }} />
                  <Typography color='inherit' fontSize={11}>
                    {lead?.admin_name}
                  </Typography>
                </div>
              </Tooltip>
            )}
            {lead?.last_activity && (
              <Tooltip title='Oxirgi Faollik'>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: '#059212' }}>
                  <ClockArrowDown size={13} />
                  <Typography color='inherit' fontSize={11}>
                    {getFormatDate(lead?.last_activity)}
                  </Typography>
                </div>
              </Tooltip>
            )}
            {lead?.source && (
              <Tooltip title='Manba'>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: '#FFA955' }}>
                  <MonitorDown size={13} />
                  <Typography color='inherit' fontSize={11}>
                    {lead?.source}
                  </Typography>
                </div>
              </Tooltip>
            )}
            {Boolean(lead?.temperature) && (
              <Tooltip title='Harorat'>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: '#1B56FD' }}>
                  <ThermometerSnowflake size={13} />
                  <Typography color='inherit' fontSize={11}>
                    {LID_TEMPERATURE[lead?.temperature as keyof typeof LID_TEMPERATURE]}
                  </Typography>
                </div>
              </Tooltip>
            )}
            {lead?.status && (
              <Tooltip title='Daraja'>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: '#E83F25' }}>
                  <ChartCandlestick size={13} />
                  <Typography color='inherit' fontSize={11}>
                    {LID_STATUS[lead?.status as keyof typeof LID_STATUS]}
                  </Typography>
                </div>
              </Tooltip>
            )}
          </Box>
        </div>

        <Box display='flex' alignItems='center'>
          <Tooltip title='Liding profiliga kirish'>
            <IconButton onClick={event => handleMenuOpen(event, lead)}>
              <EyeIcon />
            </IconButton>
          </Tooltip>

          <IconButton onClick={event => handleClick(event, lead)}>
            <Ellipsis
              style={{ marginLeft: 'auto', cursor: 'pointer' }}
              aria-haspopup='true'
              aria-controls='customized-menu'
            />
          </IconButton>
        </Box>
      </div>

      <LeadsMenu
        defaultId={defaultId}
        currentId={currentLead}
        currentLead={currentLead}
        menuOpen={menuOpen}
        onClose={onClose}
        setMenuOpen={setMenuOpen}
        setAnchorEl={setAnchorEl}
        anchorEl={anchorEl}
      />

      <LidsDragonModal
        handleClose={() => setStudentModalOpen(false)}
        openModal={studentModalOpen}
        selectedLead={selectedLead}
      />
    </>
  )
})
