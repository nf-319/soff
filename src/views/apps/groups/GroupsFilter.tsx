'use client'

import { LoadingButton } from '@mui/lab';
import {
  Autocomplete,
  Box,
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
  TextField,
  Tooltip,
} from '@mui/material';
import { useRouter } from 'next/router';
import { SyntheticEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import Excel from '../../../components/excelButton/Excel';
import IconifyIcon from '../../../components/icon';
import api from 'src/@core/utils/api';
import useDebounce from 'src/hooks/useDebounce';
import { useAppDispatch, useAppSelector } from 'src/store';
import { setOnlineLessonLoading } from 'src/store/apps/groupDetails';
import { updateParams } from 'src/store/apps/groups';
import { useTranslation } from 'react-i18next'

export const GroupsFilter = () => {
  const { queryParams, courses, teachersData } = useAppSelector((state) => state.groups);
  const { onlineLessonLoading } = useAppSelector((state) => state.groupDetails);
  const dispatch = useAppDispatch();
  const [search, setSearch] = useState<string>('');
  const searchVal = useDebounce(search, 600);
  const router = useRouter();
  const { t } = useTranslation();

  const isInitialMount = useRef(true);
  const isUpdating = useRef(false);

  useEffect(() => {
    if (isInitialMount.current) {
      const { search, status, teacher, course, day_of_week } = router.query;
      const newParams = {
        search: (search as string) || '',
        status: (status as string) || '',
        teacher: (teacher as string) || '',
        course: (course as string) || '',
        day_of_week: (day_of_week as string) || '',
      };

      console.log('Initializing queryParams:', { newParams, current: queryParams });

      if (JSON.stringify(newParams) !== JSON.stringify(queryParams)) {
        isUpdating.current = true;
        dispatch(updateParams(newParams));
      }
      isInitialMount.current = false;
    }
  }, [router.query, dispatch, queryParams]);

  useEffect(() => {
    if (searchVal !== queryParams.search && !isUpdating.current) {
      console.log('Updating search:', { searchVal, current: queryParams.search });
      isUpdating.current = true;
      dispatch(updateParams({ search: searchVal }));
    }
  }, [searchVal, dispatch, queryParams.search]);

  useEffect(() => {
    if (!isUpdating.current) return;

    const filteredParams = Object.fromEntries(
      Object.entries(queryParams).filter(([_, value]) => value !== '' && value !== undefined && value !== null)
    );

    const currentQuery = Object.fromEntries(
      Object.entries(router.query).filter(([_, value]) => value !== '' && value !== undefined && value !== null)
    );

    console.log('Syncing URL:', { filteredParams, currentQuery });

    if (JSON.stringify(filteredParams) !== JSON.stringify(currentQuery)) {
      router.push(
        {
          pathname: router.pathname,
          query: filteredParams,
        },
        undefined,
        { shallow: true }
      );
    }

    isUpdating.current = false;
  }, [queryParams, router.pathname]);

  useEffect(() => {
    isUpdating.current = false;
  }, []);

  const handleGetMeetLink = useCallback(async () => {
    dispatch(setOnlineLessonLoading(true));
    try {
      const res = await api.get('meets/google/login/');
      if (res.data.url) {
        void router.push(res.data.url);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.msg || 'An error occurred');
    } finally {
      dispatch(setOnlineLessonLoading(false));
    }
  }, [dispatch, router]);

  const handleChangeStatus = useCallback(
    (e: SelectChangeEvent<string>) => {
      console.log('Status changed:', e.target.value);
      dispatch(updateParams({ status: e.target.value }));
    },
    [dispatch]
  );

  const handleChangeTeacher = useCallback(
    (_event: SyntheticEvent, value: { label: string; value: number | undefined } | null) => {
      console.log('Teacher changed:', value?.value);
      dispatch(updateParams({ teacher: value?.value?.toString() || '' }));
    },
    [dispatch]
  );

  const handleChangeCourse = useCallback(
    (e: SelectChangeEvent<string>) => {
      console.log('Course changed:', e.target.value);
      dispatch(updateParams({ course: e.target.value }));
    },
    [dispatch]
  );

  const handleChangeDateOfWeek = useCallback(
    (e: SelectChangeEvent<string>) => {
      console.log('Day of week changed:', e.target.value);
      dispatch(updateParams({ day_of_week: e.target.value }));
    },
    [dispatch]
  );

  const teacherOptions = useMemo(
    () => teachersData?.map((item) => ({ label: item.first_name, value: item.id })) || [],
    [teachersData]
  );

  const queryString = useMemo(() => {
    const params = Object.fromEntries(
      Object.entries(queryParams).filter(([_, value]) => value !== '' && value !== undefined && value !== null)
    );
    return new URLSearchParams(params).toString();
  }, [queryParams]);

  return (
    <Box
      display="flex"
      gap={{ xs: 1, sm: 2 }}
      flexWrap={{ xs: "wrap", sm: "nowrap" }}
      alignItems="center"
      justifyContent="space-between"
      width="100%"
    >
      <Box
        display="flex"
        width="100%"
        gap={{ xs: 1, sm: 2 }}
        flexWrap={{ xs: "wrap", sm: "nowrap" }}
        flexDirection={{ xs: "column", sm: "row" }}
      >
        <FormControl sx={{ width: '100%' }}>
          <InputLabel size="small" id="search-input">
            {t('Qidirish')}
          </InputLabel>
          <OutlinedInput
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            endAdornment={
              <InputAdornment position="end">
                <IconifyIcon icon="tabler:search" />
              </InputAdornment>
            }
            label={t('Qidirish')}
            id="search-input"
            placeholder={t('Qidirish...')}
            size="small"
          />
        </FormControl>

        <FormControl sx={{ width: '100%' }}>
          <InputLabel size="small" id="status-select-label">
            {t('Holat')}
          </InputLabel>
          <Select
            size="small"
            label={t('Holat')}
            id="status-select"
            labelId="status-select-label"
            value={queryParams.status || ''}
            onChange={handleChangeStatus}
          >
            <MenuItem value="">{t('Barchasi')}</MenuItem>
            <MenuItem value="active">{t('active')}</MenuItem>
            <MenuItem value="archived">{t('archive')}</MenuItem>
            <MenuItem value="new">{t('new')}</MenuItem>
            <MenuItem value="frozen">{t('frozen')}</MenuItem>
          </Select>
        </FormControl>

        {teacherOptions.length > 0 && (
          <FormControl sx={{ width: '100%' }}>
            <Autocomplete
              onChange={handleChangeTeacher}
              size="small"
              disablePortal
              options={teacherOptions}
              value={teacherOptions.find((option) => String(option.value) === queryParams.teacher) || null}
              renderInput={(params) => <TextField {...params} label={t("O'qituvchi")} />}
            />
          </FormControl>
        )}

        <FormControl sx={{ width: '100%' }}>
          <InputLabel size="small" id="course-select-label">
            {t('Kurslar')}
          </InputLabel>
          <Select
            size="small"
            label={t('Kurslar')}
            id="course-select"
            labelId="course-select-label"
            value={queryParams.course || ''}
            onChange={handleChangeCourse}
          >
            <MenuItem value="">{t('Barchasi')}</MenuItem>
            {courses?.map((course) => (
              <MenuItem key={course.id} value={course.id}>
                {course.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl sx={{ width: '100%' }}>
          <InputLabel size="small" id="day-select-label">
            {t('Kunlar')}
          </InputLabel>
          <Select
            size="small"
            label={t('Kunlar')}
            id="day-select"
            labelId="day-select-label"
            value={queryParams.day_of_week || ''}
            onChange={handleChangeDateOfWeek}
          >
            <MenuItem value="">{t('Barchasi')}</MenuItem>
            <MenuItem value="tuesday,thursday,saturday">{t('Juft kunlari')}</MenuItem>
            <MenuItem value="monday,wednesday,friday">{t('Toq kunlari')}</MenuItem>
            <MenuItem value="monday,tuesday,wednesday,thursday,friday,saturday,sunday">{t('Har kuni')}</MenuItem>
          </Select>
        </FormControl>

        <Excel
          tooltip={t('Ko‘rinib turgan jadvalni Excel fayliga yuklab oling.')}
          url="common/groups/export/"
          queryString={queryString}
        />

        <Tooltip title={t('Online darsni boshlash uchun bosing.')}>
          <LoadingButton
            loading={onlineLessonLoading}
            color="success"
            variant="outlined"
            onClick={handleGetMeetLink}
          >
            <IconifyIcon icon="mdi:laptop" />
          </LoadingButton>
        </Tooltip>
      </Box>
    </Box>
  );
};
