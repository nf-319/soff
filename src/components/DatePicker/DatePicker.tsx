import React, { useState, useEffect, useRef, FC } from 'react'
import {
  Box,
  TextField,
  Popover,
  IconButton,
  Grid,
  Typography,
  Button,
  Paper,
  styled,
  useTheme
} from '@mui/material';
import {
  CalendarMonth as CalendarIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';

interface DatePickerProps {
  value?: Date;
  onChange?: (date: Date) => void;
  format?: string;
  placeholder?: string;
  disabled?: boolean;
  minDate?: Date;
  maxDate?: Date;
  showToday?: boolean;
  locale?: string;
  sx?: any;
  label?: string;
  error?: boolean;
  helperText?: string;
  yearRange?: number;
}

const StyledDay = styled(Box)(({ theme }) => ({
  width: 36,
  height: 36,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  borderRadius: '50%',
  transition: theme.transitions.create(['background-color', 'transform', 'box-shadow'], {
    duration: theme.transitions.duration.shorter,
  }),
  '&:hover': {
    backgroundColor: theme.palette.primary.light,
    color: theme.palette.primary.contrastText,
    transform: 'scale(1.1)',
  },
}));

const NavIcon = styled(IconButton)(({ theme }) => ({
  color: theme.palette.primary.main,
  '&:hover': {
    backgroundColor: theme.palette.primary.light + '20',
  },
  transition: theme.transitions.create(['transform'], {
    duration: theme.transitions.duration.shortest,
  }),
  '&:active': {
    transform: 'scale(0.9)',
  },
}));

const MonthYearSelector = styled(Box)(({ theme }) => ({
  display: 'inline-block',
  padding: '6px 12px',
  borderRadius: theme.shape.borderRadius,
  cursor: 'pointer',
  transition: theme.transitions.create(['background-color'], {
    duration: theme.transitions.duration.shortest,
  }),
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
}));

const getDaysInMonth = (year: number, month: number): number => {
  return new Date(year, month + 1, 0).getDate();
};

const formatDate = (date: Date, format: string = "YYYY-MM-DD", locale: string = 'uz'): string => {
  const year = date.getFullYear().toString();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');

  return format
    .replace('YYYY', year)
    .replace('MM', month)
    .replace('DD', day);
};

const MONTHS_UZ = [
  'Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'Iyun',
  'Iyul', 'Avgust', 'Sentyabr', 'Oktyabr', 'Noyabr', 'Dekabr'
];

const WEEKDAYS_UZ = ['Ya', 'Du', 'Se', 'Ch', 'Pa', 'Ju', 'Sh'];

export const DatePicker: FC<DatePickerProps> = ({
  value,
  onChange,
  format = 'DD/MM/YYYY',
  placeholder = 'Sanani tanlang',
  disabled = false,
  minDate,
  maxDate,
  showToday = true,
  locale = 'uz',
  sx = {},
  label = 'Sana',
  error = false,
  helperText = '',
  yearRange = 10
}) => {
  const theme = useTheme()
  const anchorRef = useRef<HTMLDivElement>(null)

  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [currentMonth, setCurrentMonth] = useState<number>(value ? value.getMonth() : new Date().getMonth())
  const [currentYear, setCurrentYear] = useState<number>(value ? value.getFullYear() : new Date().getFullYear())
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(value)
  const [inputValue, setInputValue] = useState<string>(value ? formatDate(value, format, locale) : '')
  const [showYearSelect, setShowYearSelect] = useState<boolean>(false)
  const [showMonthSelect, setShowMonthSelect] = useState<boolean>(false)

  useEffect(() => {
    if (selectedDate) {
      setInputValue(formatDate(selectedDate, format, locale))
    }
  }, [selectedDate, format, locale])

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11)
      setCurrentYear(currentYear - 1)
    } else {
      setCurrentMonth(currentMonth - 1)
    }
  }

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0)
      setCurrentYear(currentYear + 1)
    } else {
      setCurrentMonth(currentMonth + 1)
    }
  }

  const handleDateSelect = (day: number) => {
    const date = new Date(currentYear, currentMonth, day)

    if (minDate && date < minDate) return
    if (maxDate && date > maxDate) return

    setSelectedDate(date)
    if (onChange) onChange(date)
    setIsOpen(false)
  }

  const handleTodayClick = () => {
    const today = new Date()
    setCurrentMonth(today.getMonth())
    setCurrentYear(today.getFullYear())
    setSelectedDate(today)
    if (onChange) onChange(today)
    setIsOpen(false)
  }

  const handleMonthSelect = (monthIndex: number) => {
    setCurrentMonth(monthIndex)
    setShowMonthSelect(false)
  }

  const handleYearSelect = (year: number) => {
    setCurrentYear(year)
    setShowYearSelect(false)
  }

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentYear, currentMonth)
    const firstDay = new Date(currentYear, currentMonth, 1).getDay()
    const days = []

    for (let i = 0; i < firstDay; i++) {
      days.push(<Box key={`empty-${i}`} sx={{ width: 36, height: 36 }} />)
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentYear, currentMonth, day)
      const isSelected =
        selectedDate &&
        selectedDate.getDate() === day &&
        selectedDate.getMonth() === currentMonth &&
        selectedDate.getFullYear() === currentYear

      const isToday =
        today.getDate() === day && today.getMonth() === currentMonth && today.getFullYear() === currentYear

      const isDisabled = (minDate && date < minDate) || (maxDate && date > maxDate)

      days.push(
        <StyledDay
          key={day}
          onClick={() => !isDisabled && handleDateSelect(day)}
          sx={{
            backgroundColor: isSelected
              ? theme.palette.primary.main
              : isToday
              ? theme.palette.primary.light + '30'
              : 'transparent',
            color: isSelected
              ? theme.palette.primary.contrastText
              : isToday
              ? theme.palette.primary.dark
              : theme.palette.text.primary,
            fontWeight: isSelected || isToday ? 600 : 400,
            boxShadow: isSelected ? `0 2px 8px ${theme.palette.primary.main}80` : 'none',
            opacity: isDisabled ? 0.4 : 1,
            pointerEvents: isDisabled ? 'none' : 'auto'
          }}
        >
          {day}
          {isSelected && (
            <Box
              sx={{
                position: 'absolute',
                bottom: -2,
                left: '50%',
                transform: 'translateX(-50%)',
                width: 4,
                height: 4,
                borderRadius: '50%',
                backgroundColor: 'white'
              }}
            />
          )}
        </StyledDay>
      )
    }

    return days
  }

  const renderMonths = () => {
    return (
      <Grid container spacing={1} sx={{ p: 1 }}>
        {MONTHS_UZ.map((month, index) => (
          <Grid item xs={4} key={month}>
            <Box
              sx={{
                p: 1,
                textAlign: 'center',
                borderRadius: 1,
                cursor: 'pointer',
                backgroundColor: currentMonth === index ? 'primary.light' : 'transparent',
                color: currentMonth === index ? 'primary.contrastText' : 'text.primary',
                '&:hover': {
                  backgroundColor: currentMonth === index ? 'primary.main' : 'action.hover'
                }
              }}
              onClick={() => handleMonthSelect(index)}
            >
              {month.substring(0, 3)}
            </Box>
          </Grid>
        ))}
      </Grid>
    )
  }

  const renderYears = () => {
    const startYear = currentYear - yearRange
    const endYear = currentYear + yearRange
    const years = []

    for (let year = startYear; year <= endYear; year++) {
      years.push(
        <Grid item xs={3} key={year}>
          <Box
            sx={{
              p: 1,
              textAlign: 'center',
              borderRadius: 1,
              cursor: 'pointer',
              backgroundColor: currentYear === year ? 'primary.light' : 'transparent',
              color: currentYear === year ? 'primary.contrastText' : 'text.primary',
              '&:hover': {
                backgroundColor: currentYear === year ? 'primary.main' : 'action.hover'
              },
              fontWeight: currentYear === year ? 600 : 400
            }}
            onClick={() => handleYearSelect(year)}
          >
            {year}
          </Box>
        </Grid>
      )
    }

    return (
      <Grid container spacing={1} sx={{ p: 1, maxHeight: 200, overflow: 'auto' }}>
        {years}
      </Grid>
    )
  }

  return (
    <Box ref={anchorRef} sx={{ position: 'relative', ...sx }}>
      <TextField
        fullWidth
        label={label}
        value={inputValue}
        onChange={e => setInputValue(e.target.value)}
        onClick={() => !disabled && setIsOpen(true)}
        placeholder={placeholder}
        disabled={disabled}
        error={error}
        helperText={helperText}
        InputProps={{
          endAdornment: (
            <IconButton
              size='small'
              onClick={() => !disabled && setIsOpen(true)}
              edge='end'
              sx={{ color: 'primary.main' }}
            >
              <CalendarIcon />
            </IconButton>
          )
        }}
        sx={{
          '& .MuiOutlinedInput-root': {
            '&.Mui-focused fieldset': {
              borderColor: 'primary.main',
              borderWidth: 2
            },
            '&:hover fieldset': {
              borderColor: 'primary.light'
            }
          }
        }}
      />

      <Popover
        open={isOpen}
        anchorEl={anchorRef.current}
        onClose={() => setIsOpen(false)}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left'
        }}
        sx={{
          mt: 1,
          '& .MuiPopover-paper': {
            overflow: 'visible',
            boxShadow: theme.shadows[3]
          }
        }}
      >
        <Paper
          elevation={0}
          sx={{
            width: 320,
            p: 2,
            borderRadius: 2,
            overflow: 'hidden',
            '&:before': {
              content: '""',
              position: 'absolute',
              top: -10,
              left: 16,
              width: 20,
              height: 20,
              backgroundColor: 'background.paper',
              transform: 'rotate(45deg)',
              boxShadow: '-3px -3px 5px rgba(0,0,0,0.04)',
              zIndex: 0
            }
          }}
        >
          {!showMonthSelect && !showYearSelect && (
            <>
              <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <NavIcon size='small' onClick={handlePrevMonth}>
                  <ChevronLeftIcon />
                </NavIcon>

                <Box sx={{ display: 'flex', gap: 1 }}>
                  <MonthYearSelector onClick={() => setShowMonthSelect(true)}>
                    <Typography variant='subtitle1' sx={{ fontWeight: 500 }}>
                      {MONTHS_UZ[currentMonth]}
                    </Typography>
                  </MonthYearSelector>

                  <MonthYearSelector onClick={() => setShowYearSelect(true)}>
                    <Typography variant='subtitle1' sx={{ fontWeight: 500 }}>
                      {currentYear}
                    </Typography>
                  </MonthYearSelector>
                </Box>

                <NavIcon size='small' onClick={handleNextMonth}>
                  <ChevronRightIcon />
                </NavIcon>
              </Box>

              <Box sx={{ mb: 1 }}>
                <Grid container spacing={0}>
                  {WEEKDAYS_UZ.map(day => (
                    <Grid item xs={12 / 7} key={day}>
                      <Box sx={{ textAlign: 'center', color: 'text.secondary', fontSize: '0.75rem', fontWeight: 600 }}>
                        {day}
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Grid container spacing={0} sx={{ justifyContent: 'flex-start' }}>
                  {renderCalendarDays().map((day, index) => (
                    <Grid item xs={12 / 7} key={index} sx={{ display: 'flex', justifyContent: 'center' }}>
                      {day}
                    </Grid>
                  ))}
                </Grid>
              </Box>

              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  borderTop: `1px solid ${theme.palette.divider}`,
                  pt: 2
                }}
              >
                {showToday && (
                  <Button
                    size='small'
                    color='primary'
                    onClick={handleTodayClick}
                    sx={{
                      textTransform: 'none',
                      borderRadius: 4,
                      fontSize: '0.85rem',
                      fontWeight: 500
                    }}
                  >
                    Bugun
                  </Button>
                )}

                <Button
                  size='small'
                  variant='contained'
                  onClick={() => setIsOpen(false)}
                  startIcon={<CheckCircleIcon fontSize='small' />}
                  sx={{
                    textTransform: 'none',
                    borderRadius: 4,
                    boxShadow: 2,
                    fontSize: '0.85rem',
                    fontWeight: 500
                  }}
                >
                  Tayyor
                </Button>
              </Box>
            </>
          )}

          {showMonthSelect && (
            <Box>
              <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant='subtitle1' sx={{ fontWeight: 500 }}>
                  Oyni tanlang
                </Typography>
                <IconButton size='small' onClick={() => setShowMonthSelect(false)}>
                  <ChevronLeftIcon />
                </IconButton>
              </Box>
              {renderMonths()}
            </Box>
          )}

          {showYearSelect && (
            <Box>
              <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant='subtitle1' sx={{ fontWeight: 500 }}>
                  Yilni tanlang
                </Typography>
                <IconButton size='small' onClick={() => setShowYearSelect(false)}>
                  <ChevronLeftIcon />
                </IconButton>
              </Box>
              {renderYears()}
            </Box>
          )}
        </Paper>
      </Popover>
    </Box>
  )
}
