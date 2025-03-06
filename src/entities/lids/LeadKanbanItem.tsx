import { Ellipsis, EyeIcon, Phone, User } from 'lucide-react'
import { Box, IconButton, Typography } from '@mui/material'
import { DraggableProvided, DraggableStateSnapshot } from 'react-beautiful-dnd'
import { FC, useState } from 'react'
import { useSettings } from '../../@core/hooks/useSettings'
import { LeadsMenu } from './Menu'
import { MenuOpenType } from './LeadsKanban'
import { LidsDragonModal } from '../../views/apps/lids/LidsDragonModal'

type Props = {
  provided?: DraggableProvided
  snapshot?: DraggableStateSnapshot
  lead: any
  onClose?: boolean
}

export const LeadKanbanItem: FC<Props> = ({ provided, snapshot, lead, onClose }) => {
  const { settings } = useSettings()
  const [studentModalOpen, setStudentModalOpen] = useState<boolean>(false)
  const [selectedLead, setSelectedLead] = useState<any | null>(null)
  const [currentLead, setCurrentLead] = useState<any>(null)
  const [menuOpen, setMenuOpen] = useState<MenuOpenType>(null)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const handleMenuOpen = (event: any, lead: any) => {
    setStudentModalOpen(true)
    setSelectedLead(lead)
  }

  const handleClick = (event: any, lead: any) => {
    setCurrentLead(lead)
    setAnchorEl(event.currentTarget)
  }

  return (
    <>
      <div
        className={`shadow-sm p-3 ${settings.mode == 'dark' ? 'bg-#282A42' : 'bg-light'} rounded`}
        ref={provided?.innerRef}
        {...provided?.draggableProps}
        {...provided?.dragHandleProps}
        style={{
          ...provided?.draggableProps.style,
          opacity: snapshot?.isDragging ? '0.5' : '1',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderRadius: 10,
          marginBottom: 10,
          textAlign: 'center',
          padding: '5px'
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <User width={20} height={20} color='blue' />

            {lead.first_name}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <Phone width={18} height={18} color='blue' />
            <Typography fontSize={12}>{lead?.phone}</Typography>
          </div>
        </div>

        <Box display='flex' alignItems='center'>
          <IconButton onClick={event => handleMenuOpen(event, lead)}>
            <EyeIcon />
          </IconButton>

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
        currentId={currentLead}
        currentLead={currentLead}
        menuOpen={menuOpen}
        onClose={onClose}
        setMenuOpen={setMenuOpen}
        setAnchorEl={setAnchorEl}
        anchorEl={anchorEl}
      />

      <LidsDragonModal handleClose={() => setStudentModalOpen(false)} openModal={studentModalOpen} selectedLead={selectedLead} />
    </>
  )
}
