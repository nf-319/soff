'use client'

import { KanbanItemMenu } from '@components/card-statistics/kanban-item/KanbanItemMenu'
import { FC, Fragment, type Dispatch, type SetStateAction } from 'react'
import useSMS from '../../hooks/useSMS'
import useBranches from '../../hooks/useBranch'
import { MenuOpenType } from './model/type'
import { LeadNoteModal } from './modals/NodeModal'
import { SmsModal } from './modals/SmsModal'
import { BranchModal } from './modals/BranchModal'
import { EditAnonimDialogDialog } from '@/views/apps/lids/anonimUser/EditAnonimUserDialog'
import { AddGroup } from './modals/AddGroupModal'
import { LeadDeleteModal } from './modals/LeadDeleteModal'
import { AddDepartmantModal } from './modals/AddDepartmantModal'
import { LeadRecoverModal } from './modals/LeadRecoverModal'

type Props = {
  anchorEl: HTMLElement | null
  setAnchorEl: Dispatch<SetStateAction<HTMLElement | null>>
  setMenuOpen: Dispatch<SetStateAction<MenuOpenType>>
  menuOpen: any
  currentId: string
  defaultId?:any,
  currentLead: any
  onClose?: boolean
}

export const LeadsMenu: FC<Props> = ({
  anchorEl,
  setAnchorEl,
  onClose,
  currentLead,
  currentId,
  menuOpen,
  defaultId,
  setMenuOpen
}) => {
  const { getSMSTemps } = useSMS()
  const { getBranches } = useBranches()

  return (
    <Fragment>
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
          <LeadNoteModal open={menuOpen} onClose={onClose} setOpen={setMenuOpen} leadId={currentLead.id} />
          <SmsModal onClose={onClose} open={menuOpen} setOpen={setMenuOpen} leadId={currentLead.id} />

          <BranchModal
            onClose={onClose}
            open={menuOpen}
            setOpen={setMenuOpen}
            leadId={currentLead.id}
            leadFirstName={currentLead.first_name}
            phone={currentLead.phone}
          />
          <EditAnonimDialogDialog
            onClose={onClose}
            department={currentLead.id}
            open={menuOpen}
            lead={currentLead}
            setOpen={setMenuOpen}
          />

          <AddGroup defaultId={defaultId} onClose={onClose} open={menuOpen} leadId={currentLead.id} setOpen={setMenuOpen} />

          <LeadDeleteModal
            defaultId={defaultId}
            onClose={onClose}
            open={menuOpen}
            setOpen={setMenuOpen}
            leadId={currentLead.id}
            leadFirstName={currentLead.first_name}
            leadPhone={currentLead.phone}
          />
          <LeadRecoverModal
            onClose={onClose}
            open={menuOpen}
            setOpen={setMenuOpen}
            leadId={currentLead.id}
            leadFirstName={currentLead.first_name}
            leadPhone={currentLead.phone}
          />

          <AddDepartmantModal
            defaultId={defaultId}
            onClose={onClose}
            currentId={currentId}
            open={menuOpen}
            setOpen={setMenuOpen}
            leadId={currentLead.id}
          />
        </Fragment>
      )}
    </Fragment>
  )
}

LeadsMenu.displayName = 'LeadsMenu'
