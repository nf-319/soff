'use client'

import React, { FC, useEffect, useState } from 'react'
import {
  Box,
  Button,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Skeleton,
  useTheme,
  useMediaQuery,
  Paper, Chip, Dialog, DialogTitle, DialogContent
} from '@mui/material'
import { Plus, ChevronDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';

import { useAppDispatch, useAppSelector } from '@/store';
import {
  fetchSmsList,
  fetchSmsListQuery,
  setOpenCreateSms,
  setOpenCreateSmsCategory
} from '@/store/apps/settings';
import api from '../../@core/utils/api';
import VideoHeader from '../../components/video-header/video-header';

import SmsTableRowOptions from '../../views/apps/settings/ceo/SmsTableRowOptions';
import CreateSmsDialog from '../../views/apps/settings/ceo/CreateSmsDialog';
import CreateSmsCategoryDialog from '../../views/apps/settings/ceo/CreateSmsCategoryDialog';
import EditSmsDialog from '../../views/apps/settings/ceo/EditSmsDialog';
import UserSuspendDialog from '../../views/apps/mentors/view/UserSuspendDialog';
import { ChipProps } from '@mui/material/Chip'
import { PLACEHOLDERS } from '@/views/apps/sms-settings/constants'
import { AccessDeniedModal } from '@components/AccessDeniedModal'

interface SmsCategory {
  id: number;
  description: string;
}

interface SmsTemplate {
  id: number;
  description: string;
}

const LoadingSkeleton: FC = () => (
  <>
    {[1, 2, 3].map((item) => (
      <Skeleton
        key={item}
        variant="rounded"
        width="100%"
        height={60}
        sx={{ mb: 2 }}
      />
    ))}
  </>
);



const EmptyState: React.FC = () => {
  const { t } = useTranslation();

  return (
    <Box
      sx={{
        py: 6,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 1,
        border: '1px dashed #ddd',
        backgroundColor: 'rgba(0, 0, 0, 0.02)'
      }}
    >
      <Typography variant="body1" color="text.secondary" mb={1}>
        {t('Ma\'lumot yo\'q')}
      </Typography>
      <Typography variant="caption" color="text.secondary">
        {t('Bu kategoriya bo\'sh')}
      </Typography>
    </Box>
  );
};

const RoomsPage: React.FC = () => {
  const { sms_list, smschild_list, is_pending, is_childpending } = useAppSelector(state => state.settings);
  const dispatch = useAppDispatch();
  const [parentId, setParentId] = useState<number | null>(null);
  const { t } = useTranslation();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);
  const [suspendDialogOpen, setSuspendDialogOpen] = useState<boolean>(false);
  const [deleteItemId, setDeleteItemId] = useState<number | null>(null);
  const [accessDeniedOpen, setAccessDeniedOpen] = useState<boolean>(false)

  const handleDeleteRequest = (id: number) => {
    setDeleteItemId(id);
    setSuspendDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteItemId) return;

    setDeleteLoading(true);
    try {
      await api.delete(`common/sms-form/delete/${deleteItemId}`);
      toast.success(t("Kategoriya o'chirildi"));
      dispatch(fetchSmsList());
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.msg || t('Serverda xatolik yuz berdi'));
    } finally {
      setDeleteLoading(false);
      setSuspendDialogOpen(false);
    }
  };

  const toggleAccordion = (id: number) => {
    setParentId(parentId === id ? null : id);
  };

  const renderTextWithPlaceholders = (value: string) => {
    return value
      .split(/(\$\{(?:group|balance|first_name|reason|score|amount|date|payment_type|payment_date|exam|)})/)
      .map((part, index) => {
        const placeholder = PLACEHOLDERS.birthdate.find((p: any) => p.value === part)
        if (placeholder) {
          return (
            <Chip
              key={index}
              label={placeholder.label}
              color={placeholder.color as ChipProps['color']}
              size='small'
              sx={{ mx: 0.5, verticalAlign: 'middle' }}
            />
          )
        }
        return part
      })
  }

  useEffect(() => {
    dispatch(fetchSmsList());
  }, [dispatch]);

  useEffect(() => {
    if (parentId) {
      dispatch(fetchSmsListQuery(parentId));
    }
  }, [parentId, dispatch]);

  useEffect(() => {
    if (sms_list?.access === false) {
      setAccessDeniedOpen(true)
    }
  }, [sms_list])

  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 2, md: 3 },
        backgroundColor: 'background.paper',
        borderRadius: 1
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: { xs: 'flex-start', md: 'center' },
          justifyContent: 'space-between',
          mb: 3
        }}
      >
        <Typography
          variant="h5"
          sx={{
            mb: { xs: 2, md: 0 },
            fontWeight: 600
          }}
        >
          SMS shablonlar
        </Typography>

        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 2,
            width: { xs: '100%', md: 'auto' }
          }}
        >
          <VideoHeader
            item={{ url: '', title: t('SMS qo\'llanmasi') }}
          />

          <Button
            onClick={() => dispatch(setOpenCreateSmsCategory(true))}
            variant="outlined"
            color="primary"
            fullWidth={isSmallScreen}
            startIcon={<Plus size={18} />}
            sx={{ ml: { sm: 1 } }}
          >
            {t('SMS kategoriya')}
          </Button>

          <Button
            onClick={() => dispatch(setOpenCreateSms(true))}
            variant="contained"
            color="primary"
            fullWidth={isSmallScreen}
            startIcon={<Plus size={18} />}
            sx={{ ml: { sm: 1 } }}
          >
            {t('SMS shablon')}
          </Button>
        </Box>
      </Box>

      <Box sx={{ mt: 3 }}>
        {is_pending ? (
          <LoadingSkeleton />
        ) : sms_list?.result?.length === 0 ? (
          <EmptyState />
        ) : (
          sms_list?.result?.map((item: SmsCategory) => (
            <Accordion
              key={item.id}
              expanded={parentId === item.id}
              onChange={() => toggleAccordion(item.id)}
              sx={{
                mb: 2,
                borderRadius: 1,
                border: `1px solid ${theme.palette.divider}`,
                overflow: 'hidden',
                '&:before': { display: 'none' },
                boxShadow: 'none'
              }}
            >
              <AccordionSummary
                expandIcon={<ChevronDown size={20} />}
                aria-controls={`panel-${item.id}-content`}
                id={`panel-${item.id}-header`}
                sx={{
                  px: 3,
                  '&.Mui-expanded': {
                    marginBottom: 1,
                    borderBottom: `1px solid ${theme.palette.divider}`
                  }
                }}
              >
                <Box sx={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <Typography fontWeight={500}>{item.description}</Typography>

                  <Box onClick={e => e.stopPropagation()}>
                    <SmsTableRowOptions id={item.id} />
                  </Box>
                </Box>
              </AccordionSummary>

              <AccordionDetails sx={{ p: 2 }}>
                {item.id === parentId && is_childpending ? (
                  <LoadingSkeleton />
                ) : smschild_list.result.length === 0 ? (
                  <EmptyState />
                ) : (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {smschild_list.result.map((child: SmsTemplate) => (
                      <Box
                        key={child.id}
                        sx={{
                          p: { xs: 2, sm: 3 },
                          borderRadius: 1,
                          backgroundColor: theme.palette.background.default,
                          display: 'flex',
                          flexDirection: { xs: 'column', sm: 'row' },
                          alignItems: { xs: 'flex-start', sm: 'center' },
                          justifyContent: 'space-between',
                          gap: 2
                        }}
                      >
                        <Typography
                          variant="body1"
                          component='div'
                          sx={{
                            wordBreak: 'break-word',
                            flexGrow: 1
                          }}
                        >
                          {renderTextWithPlaceholders(child.description)}
                        </Typography>
                        <Box sx={{ ml: 'auto', flexShrink: 0 }}>
                          <SmsTableRowOptions parent_id={item.id} id={child.id} />
                        </Box>
                      </Box>
                    ))}
                  </Box>
                )}
              </AccordionDetails>
            </Accordion>
          ))
        )}
      </Box>

      <CreateSmsDialog />
      <CreateSmsCategoryDialog />
      <EditSmsDialog />
      <UserSuspendDialog
        open={suspendDialogOpen}
        setOpen={setSuspendDialogOpen}
        loading={deleteLoading}
        handleOk={handleDelete}
      />

      <AccessDeniedModal open={accessDeniedOpen} />
    </Paper>
  );
};

export default RoomsPage;
