import React from 'react'
import { DataGrid, GridColDef, GridLocaleText, GridRowParams } from '@mui/x-data-grid'
import { Box, Typography, CircularProgress } from '@mui/material'

type DataGridWrapperProps<T> = {
  rows: T[]
  columns: GridColDef[]
  loading?: boolean
  getRowId?: (row: T) => string | number
  onRowClick?: (params: GridRowParams<any>) => void
  localeText?: Partial<GridLocaleText>
  hideFooter?: boolean
  emptyText?: string
  sx?: object
  [key: string]: any
}

function DataGridWrapper<T>({
  rows = [],
  columns = [],
  loading = false,
  getRowId = (row: T) => (row as any).id,
  onRowClick,
  localeText = {},
  hideFooter = false,
  emptyText = "Ma'lumot topilmadi",
  sx = {},
  ...restProps
}: DataGridWrapperProps<T>) {
  return (
    <Box sx={{ width: '100%', position: 'relative' }}>
      <DataGrid
        autoHeight
        rows={rows}
        columns={columns}
        loading={loading}
        getRowId={getRowId}
        onRowClick={onRowClick}
        disableSelectionOnClick
        localeText={localeText}
        hideFooter={hideFooter}
        sx={{
          '.MuiDataGrid-root': { border: 'none' },
          '.MuiDataGrid-row': {
            cursor: 'pointer',
            transition: 'background-color 0.3s',
            '&:hover': {
              backgroundColor: 'rgba(0, 0, 0, 0.04)'
            },
            '&.Mui-selected': {
              backgroundColor: 'transparent !important'
            },
            '&.Mui-selected:hover': {
              backgroundColor: 'rgba(0, 0, 0, 0.04) !important'
            }
          },
          ...sx
        }}
        {...restProps}
      />

      {!loading && rows.length === 0 && (
        <Box sx={{ position: 'absolute', top: 64, left: 0, right: 0, textAlign: 'center', py: 4 }}>
          <Typography variant='body1' color='textSecondary'>
            {emptyText}
          </Typography>
        </Box>
      )}

      {loading && (
        <Box
          sx={{ position: 'absolute', top: 64, left: 0, right: 0, display: 'flex', justifyContent: 'center', py: 4 }}
        >
          <CircularProgress size={24} />
        </Box>
      )}
    </Box>
  )
}

export default DataGridWrapper
