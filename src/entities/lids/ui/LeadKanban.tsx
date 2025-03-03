'use client'

import { Box, IconButton, Typography } from '@mui/material'
import { Ellipsis, EyeIcon, Phone, User } from 'lucide-react'
import { FC, Fragment, useState } from 'react'
import { DraggableProvided, DraggableStateSnapshot } from 'react-beautiful-dnd'
import { KanbanItemMenu } from 'src/@core/components/card-statistics/kanban-item/KanbanItemMenu'
import { useSettings } from 'src/@core/hooks/useSettings'
import { MenuOpenType } from '../LeadsKaban'
import useSMS from 'src/hooks/useSMS'
import useBranches from 'src/hooks/useBranch'
import { LeadNoteModal } from '../modals/NodeModal'
import { SmsModal } from '../modals/SmsModal'
import { BranchModal } from '../modals/BranchModal'
import { EditAnonimDialogDialog } from 'src/views/apps/lids/anonimUser/EditAnonimUserDialog'
import { AddGroup } from '../modals/AddGroupModal'
import { LeadDeleteModal } from '../modals/LeadDeleteModal'
import { AddDepartmantModal } from '../modals/AddDepartmantModal'
import { LidsDragonModal } from 'src/views/apps/lids/LidsDragonModal'

type LeadType = {
  first_name: string
  phone: string
}

type Props = {
  currentId: string
  provided?: DraggableProvided
  snapshot?: DraggableStateSnapshot
  lead: LeadType
}

export const LeadKabanItem: FC<Props> = ({ provided, snapshot, lead, currentId }) => {
  const { settings } = useSettings()
  const [studentModalOpen, setStudentModalOpen] = useState<boolean>(false)
  const [selectedLead, setSelectedLead] = useState<any | null>(null)
  const [currentLead, setCurrentLead] = useState<any>(null)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [menuOpen, setMenuOpen] = useState<MenuOpenType>(null)
  const { getSMSTemps } = useSMS()
  const { getBranches } = useBranches()

  const handleMenuOpen = (event: any, lead: any) => {
    setStudentModalOpen(true)
    setSelectedLead(lead)
  }

  const handleClick = (event: any, lead: any) => {
    setCurrentLead(lead)
    setAnchorEl(event.currentTarget)
  }

  return (
    <div
      className={`shadow-sm p-3 ${settings.mode == 'dark' ? 'bg-#282A42' : 'bg-light'} rounded`}
      ref={provided && provided.innerRef}
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

      <KanbanItemMenu
        is_amocrm={false} // is_amocrm -> store
        anchorEl={anchorEl}
        setAnchorEl={setAnchorEl}
        getSMSTemps={getSMSTemps}
        getBranches={getBranches}
        setOpen={setMenuOpen}
      />

      {currentLead && (
        <Fragment>
          <LeadNoteModal open={menuOpen} setOpen={setMenuOpen} leadId={currentLead.id} />
          <SmsModal open={menuOpen} setOpen={setMenuOpen} leadId={currentLead.id} />
          <BranchModal
            open={menuOpen}
            setOpen={setMenuOpen}
            leadId={currentLead.id}
            leadFirstName={currentLead.first_name}
            phone={currentLead.phone}
          />
          <EditAnonimDialogDialog
            department={currentLead.id}
            open={menuOpen}
            lead={currentLead}
            setOpen={setMenuOpen}
          />
          <AddGroup open={menuOpen} leadId={currentLead.id} setOpen={setMenuOpen} />
          <LeadDeleteModal
            open={menuOpen}
            setOpen={setMenuOpen}
            leadId={currentLead.id}
            leadFirstName={currentLead.first_name}
            leadPhone={currentLead.phone}
          />

          <AddDepartmantModal currentId={currentId} open={menuOpen} setOpen={setMenuOpen} leadId={currentLead.id} />
        </Fragment>
      )}

      <LidsDragonModal
        handleClose={() => setStudentModalOpen(false)}
        openModal={studentModalOpen}
        selectedLead={selectedLead}
      />
    </div>
  )
}

LeadKabanItem.displayName = 'LeadsKaban'
