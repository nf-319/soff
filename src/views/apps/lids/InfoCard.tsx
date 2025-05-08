import React, { useEffect, useState } from 'react'
import type { SxProps, Theme } from '@mui/material/styles'
import { Box, FormControl, MenuItem, Select, type SelectChangeEvent, Typography, useTheme } from '@mui/material'
import { PhoneLink } from '@components/PhoneLink'
import { getFormatPhone } from '@/shared/utils'

interface InfoItemProps {
  icon: React.ReactNode
  label: string
  value: string
  canEdit?: boolean
  onValueChange?: (newValue: string) => void
  options?: Array<{ value: string | null; label: string }>
  sx?: SxProps<Theme>
}

const InfoItem: React.FC<InfoItemProps> = ({ icon, label, value, canEdit = false, onValueChange, options, sx }) => {
  const [currentValue, setCurrentValue] = useState<string>(value)
  const theme = useTheme()

  useEffect(() => {
    setCurrentValue(value)
  }, [value])

  const handleValueChange = (event: SelectChangeEvent<string>) => {
    const newValue = event.target.value
    setCurrentValue(newValue)
    if (onValueChange) {
      onValueChange(newValue)
    }
  }

  const filteredOptions = (() => {
    if (label !== "Holat") return options

    if (value === "new") {
      return options
    }

    return options?.filter((o) => o.value !== "new")
  })()

  const STATUS_LABELS = {
    enrolled: "Sotuv bo'ldi",
    test_period: "Sinov darsida",
  }

  const cardStyles = {
    display: "flex",
    alignItems: "center",
    p: 2,
    borderRadius: 1,
    border: `1px solid ${theme.palette.divider}`,
    bgcolor: theme.palette.background.paper,
    transition: "all 0.2s ease",
    height: "100%",
    "&:hover": {
      bgcolor: theme.palette.action.hover,
      boxShadow: 1,
    },
    ...sx,
  }

  if (label === "Telefon raqami") {
    return (
      <PhoneLink phone={value} style={{ textDecoration: "none", height: "100%", display: "block" }}>
        <Box sx={cardStyles}>
          <Box sx={{ color: "primary.main", mr: 2 }}>{icon}</Box>
          <Box sx={{ flex: 1 }}>
            <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: "block" }}>
              {label}
            </Typography>
            <Typography variant="body2" fontWeight="medium">
              {getFormatPhone(value ?? "")}
            </Typography>
          </Box>
        </Box>
      </PhoneLink>
    )
  }

  return (
    <Box sx={cardStyles}>
      <Box sx={{ color: "primary.main", mr: 2 }}>{icon}</Box>
      <Box sx={{ flex: 1 }}>
        <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: "block" }}>
          {label}
        </Typography>

        {currentValue === "test_period" || currentValue === "enrolled" ? (
          <Typography variant="body2" fontWeight="medium">
            {STATUS_LABELS[currentValue as keyof typeof STATUS_LABELS]}
          </Typography>
        ) : canEdit && filteredOptions ? (
          <FormControl fullWidth size="small" variant="outlined">
            <Select
              value={currentValue}
              onChange={handleValueChange}
              displayEmpty
              sx={{
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "divider",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "primary.main",
                  borderWidth: 1,
                },
                minHeight: "32px",
                py: 0,
              }}
            >
              {filteredOptions?.map((option) => (
                <MenuItem key={String(option.value)} value={String(option.value)}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        ) : (
          <Typography variant="body2" fontWeight="medium">
            {currentValue}
          </Typography>
        )}
      </Box>
    </Box>
  )
}

export default InfoItem
