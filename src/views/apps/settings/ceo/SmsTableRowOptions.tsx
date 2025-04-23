import React, { MouseEvent, useState } from 'react';
import { IconButton, Menu, MenuItem } from '@mui/material';
import { MoreVertical, Edit, Trash } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';

// App imports
import { useAppDispatch, useAppSelector } from 'src/store';
import { fetchSmsList, fetchSmsListQuery, setOpenEditSms } from 'src/store/apps/settings';
import api from 'src/@core/utils/api';
import UserSuspendDialog from 'src/views/apps/mentors/view/UserSuspendDialog';

interface SmsTableRowOptionsProps {
  id: number;
  parent_id?: number;
}

const SmsTableRowOptions: React.FC<SmsTableRowOptionsProps> = ({ id, parent_id }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [suspendDialogOpen, setSuspendDialogOpen] = useState<boolean>(false);
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);
  const { t } = useTranslation();

  const { smschild_list, sms_list } = useAppSelector(state => state.settings);
  const dispatch = useAppDispatch();

  const rowOptionsOpen = Boolean(anchorEl);

  const handleRowOptionsClick = (event: MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleRowOptionsClose = () => {
    setAnchorEl(null);
  };

  const handleDeleteClick = () => {
    handleRowOptionsClose();
    setSuspendDialogOpen(true);
  };

  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      await api.delete(`common/sms-form/delete/${id}`);
      toast.success(t("Muvaffaqiyatli o'chirildi"));

      // Refresh appropriate list
      if (parent_id) {
        dispatch(fetchSmsListQuery(parent_id));
      } else {
        dispatch(fetchSmsList());
      }
    } catch (error: any) {
      toast.error(error.response?.data?.msg || t('Xatolik yuz berdi'));
    } finally {
      setDeleteLoading(false);
      setSuspendDialogOpen(false);
    }
  };

  const handleEdit = () => {
    handleRowOptionsClose();
    const item = parent_id
      ? smschild_list.result.find(el => el.id === id)
      : sms_list.result.find(el => el.id === id);

    if (item) {
      dispatch(setOpenEditSms(item));
    }
  };

  return (
    <>
      <IconButton
        size="small"
        onClick={handleRowOptionsClick}
        sx={{
          color: 'text.secondary',
          '&:hover': {
            backgroundColor: 'action.hover'
          }
        }}
      >
        <MoreVertical size={20} />
      </IconButton>

      <Menu
        keepMounted
        anchorEl={anchorEl}
        open={rowOptionsOpen}
        onClose={handleRowOptionsClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
        PaperProps={{
          elevation: 2,
          sx: {
            minWidth: '8rem',
            mt: 0.5,
            '& .MuiMenuItem-root': {
              py: 1.5
            }
          }
        }}
      >
        <MenuItem onClick={handleEdit}>
          <Edit size={18} style={{ marginRight: '0.5rem' }} />
          {t('Tahrirlash')}
        </MenuItem>

        <MenuItem
          onClick={handleDeleteClick}
          sx={{ color: 'error.main' }}
        >
          <Trash size={18} style={{ marginRight: '0.5rem' }} />
          {t("O'chirish")}
        </MenuItem>
      </Menu>

      <UserSuspendDialog
        open={suspendDialogOpen}
        setOpen={setSuspendDialogOpen}
        loading={deleteLoading}
        handleOk={handleDelete}
      />
    </>
  );
};

export default SmsTableRowOptions;
