'use client'

import { Box, Skeleton } from '@mui/material'
import { useRouter } from 'next/router'
import { FC, ReactNode } from 'react'
import { Placeholder } from 'react-bootstrap'
import { EmptyContent } from '../empty-content'

export type customTableDataProps = {
  xs: number
  title: ReactNode
  dataIndex?: string | ReactNode
  renderItem?: (source: any) => any | undefined
  render?: (source: string) => any | undefined
  renderId?: (id: any, source: any) => any | undefined
  renderSource?: (source: any, item: any) => any | undefined
}

type DataTableProps = {
  columns: customTableDataProps[]
  data: any[]
  minWidth?: string | undefined
  maxWidth?: string | undefined
  rowClick?: any
  color?: boolean | undefined
  text_color?: boolean | undefined
  loading?: boolean
}

const DebtorsDataTable: FC<DataTableProps> = ({ columns, loading = false, data, minWidth, maxWidth, rowClick }) => {
  const { query } = useRouter()

  const extractColors = (str: string) => str?.split(',').map(color => color.trim())

  const handleClick = (id: any) => {
    rowClick?.(id)
  }

  return (
    <Box sx={{ maxWidth: '100%', overflowX: 'auto', padding: '10px' }}>
      {/* Table Header */}
      <Box
        minWidth={minWidth || '1200px'}
        sx={{
          padding: '12px 15px',
          boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.1)',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          border: '1px solid #d3d3d3',
          gap: 2,
          backgroundColor: '#f8f9fa',
          fontWeight: 'bold'
        }}
      >
        {columns.map((el, i) => (
          <Box key={i} sx={{ textAlign: 'start', flex: el.xs }}>
            {loading ? (
              <Placeholder as='span' animation='glow' style={{ width: '100px', height: '30px' }} />
            ) : (
              <Box sx={{ fontSize: 14, fontWeight: 'bold', color: '#333' }}>{el.title}</Box>
            )}
          </Box>
        ))}
      </Box>

      {/* Table Body */}
      {loading ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
          {[...Array(6)].map((_, index) => (
            <Skeleton key={index} variant='rounded' height={40} width='100%' />
          ))}
        </Box>
      ) : data?.length > 0 ? (
        data?.map((item, index) => {
          const colors = extractColors(item.color)
          return (
            <Box
              key={index}
              minWidth={minWidth || '1200px'}
              sx={{
                padding: '8px 15px',
                boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.06)',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                backgroundColor: colors ? colors[0] : '',
                color: colors ? colors[1] : '',
                cursor: 'pointer',
                '&:hover': { backgroundColor: '#f1f3f5' }
              }}
            >
              {columns.map((el, i) => (
                <Box key={i} sx={{ textAlign: 'start', flex: el.xs, pb: '5px' }}>
                  <Box sx={{ fontSize: 12, fontWeight: 500, color: '#555' }}>
                    {el.render
                      ? el.render(el.dataIndex === 'index' ? index + 1 : item[`${el.dataIndex}`])
                      : el.renderItem
                      ? el.renderItem(item)
                      : el.renderSource
                      ? el.renderSource(item[`${el.dataIndex}`], item)
                      : el.renderId
                      ? el.renderId(item.id, item[`${el.dataIndex}`])
                      : el.dataIndex === 'index'
                      ? `${
                          query.page && Number(query.page) > 1
                            ? (Number(query?.page) - 1) * 10 + index + 1
                            : 1 + index
                        }.`
                      : item[`${el.dataIndex}`]}
                  </Box>
                </Box>
              ))}
            </Box>
          )
        })
      ) : (
        <EmptyContent />
      )}
    </Box>
  )
}

export default DebtorsDataTable
