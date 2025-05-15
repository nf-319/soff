import classnames from 'classnames/bind'
import style from './MentorTable.module.scss'
import { Box, Chip, MenuItem, Select, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { DataGridTable } from '@components/table/DataGridTable'
import { GroupTable, MonthlySalary } from './constants'
import { LEADS_TEMPERATURE_MAP } from '@modules/LeadsStatement/config/constants'
import { Download, SlidersHorizontal } from 'lucide-react';

import { useAppSelector } from '@/store'
import { useEffect, useState } from 'react'
import { uzbekMonths } from '@/shared/constants'
const cn = classnames.bind(style)

export const MentorTable = () => {
    const { t } = useTranslation()

    const { companyInfo } = useAppSelector(item => item.user)
    const [years, setYears] = useState<number[]>([])
    const [currentYears, setCurrentYears] = useState<number>(new Date().getFullYear())
    const [currentMonth, setCurrentMonth] = useState<number>(new Date().getMonth())



    useEffect(() => {
        if (companyInfo?.created_at) {
            const startYear = new Date(companyInfo.created_at).getFullYear()
            const currentYear = new Date().getFullYear()
            const generatedYears = []
            for (let i = startYear; i <= currentYear; i++) {
                generatedYears.push(i)
            }
            setYears(generatedYears) // <-- state ni yangilash
        }
    }, [companyInfo?.created_at])

    const columns = [
        {
            field: 'id',
            headerName: t('ID'),
            width: 70

        },
        {
            field: 'groupName',
            headerName: t('Guruh nomi'),
            minWidth: 100,
            flex: 1,
        },
        {
            field: 'courseName',
            headerName: t('kurs nomi'),
            minWidth: 100,
            flex: 1,
        },
        {
            field: 'allStudents',
            headerName: t("Jami o'quvchilar"),
            minWidth: 100,
            flex: 1,
        },
        {
            field: 'teacherShare',
            headerName: t("O'qituvchi ulushi"),
            minWidth: 100,
            flex: 1,
        }
    ]

    const salaryColumns = [
        {
            field: 'id',
            headerName: t('ID'),
            width: 70

        },
        {
            field: 'month',
            headerName: t('Oy'),
            minWidth: 100,
            flex: 1,
        },
        {
            field: 'countLesson',
            headerName: t('Darslar soni'),
            minWidth: 100,
            flex: 1,
        },
        {
            field: 'bonus',
            headerName: t('Bonus'),
            minWidth: 100,
            flex: 1,
        },
        {
            field: 'penalty',
            headerName: 'Jarima',
            minWidth: 100,
            flex: 1,
        },
        {
            field: 'avance',
            headerName: 'Avans',
            minWidth: 100,
            flex: 1,
        },
        {
            field: 'monthlySalary',
            headerName: 'Oylik ish haqqi',
            minWidth: 100,
            flex: 1,
        },
        {
            field: 'status',
            headerName: 'Status',
            width: 200,
            renderCell: (params: any) => {
                const status = params.value
                const statusInfo = LEADS_TEMPERATURE_MAP[status] || { label: status || 'Belgilanmagan', color: 'default' }
                return (
                    <Chip
                        label={statusInfo.label}
                        variant='outlined'
                        color={statusInfo.color as 'success' | 'error' | 'warning'}
                    />
                )
            }
        },
    ]
    console.log(currentMonth);

    return (
        <Box className={cn('MentorTable')}>
            <Box className={cn('MentorTable-groupColumn')}>
                <Box className={cn('MentorTable-groupColumn-titleBox')} >
                    <Typography className={cn('MentorTable-groupColumn-titleBox-Typography')} gutterBottom sx={{ color: 'black', fontSize: 20 }}>
                        Guruhlar bo'yicha
                    </Typography>
                    <Box className={cn('MentorTable-groupColumn-titleBox')}>
                        <SlidersHorizontal />
                        <Select sx={{ display: 'flex', alignItems: 'center' }}
                            size='small' className={cn('MentorTable-groupColumn-titleBox-year')} value={currentYears} onChange={e => setCurrentYears(e.target.value as number)}>
                            {years.map((year) => (
                                <MenuItem key={year} value={year}>
                                    {year}
                                </MenuItem>
                            ))}

                        </Select>
                        <Select size='small' className={cn('MentorTable-groupColumn-titleBox-month')} value={currentMonth} onChange={e => setCurrentMonth(e.target.value as number)}>
                            <MenuItem>
                                Hammasi
                            </MenuItem>
                            {uzbekMonths.map((month, index) => (
                                <MenuItem key={month} value={index}>
                                    {month}
                                </MenuItem>
                            ))}

                        </Select>
                    </Box>
                    <a className={cn('MentorTable-groupColumn-titleBox-link')} href="/files/myfile.pdf" download target="_blank" rel="noopener noreferrer">
                        <Download size={'14px'}
                            color='black' />
                        Exel
                    </a>
                </Box>

                <DataGridTable
                    rows={GroupTable}
                    columns={columns}
                    hideFooter
                />
            </Box>
            <Box className={cn('MentorTable-sallaryColumn')} >
                <Box className={cn('MentorTable-sallaryColumn-titleBox')} >
                    <Typography gutterBottom sx={{ color: 'black', fontSize: 20 }}>
                        Oylik maoshlar
                    </Typography>
                    <a className={cn('MentorTable-sallaryColumn-titleBox-link')} href="/files/myfile.pdf" download target="_blank" rel="noopener noreferrer">
                        <Download size={'14px'}
                            color='black' />
                        Exel
                    </a>
                </Box>

                <DataGridTable
                    rows={MonthlySalary}
                    columns={salaryColumns}
                    hideFooter
                />
            </Box>

        </Box>
    )
}
