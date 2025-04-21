'use client'

import { Box, Skeleton } from '@mui/material'
import { useRouter } from 'next/router'
import { FC, ReactNode } from 'react'
import { Placeholder } from 'react-bootstrap'
import { EmptyContent } from '../empty-content'
import useResponsive from '@/@core/hooks/useResponsive'

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

const DataTable: FC<DataTableProps> = ({ columns, loading = false, data, minWidth, maxWidth, rowClick }) => {
  const { query } = useRouter()
  const { isMobile } = useResponsive()
  const extractColors = (str: string) => {
    if (str) {
      return str?.split(',').map(color => color.trim())
    }
  }

  const handleClick = (id: any) => {
    rowClick?.(id)
  }

  return (
    <div style={{ maxWidth: '100%', overflowX: 'auto', padding: '0 5px' }}>
      {!isMobile && (
        <Box
          minWidth={minWidth || '1200px'}
          my={2}
          sx={{
            padding: '15px 10px',
            boxShadow: 'rgba(0, 0, 0, 0.1) 0px 1px 3px 0px, rgba(0, 0, 0, 0.06) 0px 1px 2px 0px',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            border: '1px solid #d3d3d3',
            gap: 1,
            width: '100%',
            cursor: 'pointer',
            maxWidth: maxWidth || null
          }}
        >
          {columns.map((el, i) => (
            <Box key={i} sx={{ textAlign: 'start', flex: el.xs }} pt={'0 !important'} pl={'0 !important'}>
              <Box sx={{ fontSize: 14, fontWeight: 700 }}>
                {loading ? (
                  <Placeholder as='span' animation='glow' style={{ width: '100px', height: '30px' }} />
                ) : (
                  el.title
                )}
              </Box>
            </Box>
          ))}
        </Box>
      )}

      {loading ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Skeleton variant='rounded' height={40} width='100%' />
          <Skeleton variant='rounded' height={40} width='100%' />
          <Skeleton variant='rounded' height={40} width='100%' />
          <Skeleton variant='rounded' height={40} width='100%' />
          <Skeleton variant='rounded' height={40} width='100%' />
          <Skeleton variant='rounded' height={40} width='100%' />
          <Skeleton variant='rounded' height={40} width='100%' />
          <Skeleton variant='rounded' height={40} width='100%' />
        </Box>
      ) : data?.length > 0 ? (
        isMobile ? (
          data?.map((item, index) => {
            const colors = extractColors(item.color)
            return (
              <Box
                key={index}
                my={2}
                sx={{
                  position: 'relative',
                  padding: '15px 12px',
                  boxShadow: 'rgba(0, 0, 0, 0.1) 0px 1px 3px, rgba(0, 0, 0, 0.06) 0px 1px 2px',
                  borderRadius: '8px',
                  border: '1px solid #dddddd',
                  backgroundColor: colors ? colors[0] : '',
                  color: colors ? colors[1] : '',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 1,
                  width: '100%',
                  maxWidth: maxWidth || null,
                  cursor: 'pointer'
                }}
              >
                <Box
                  sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    display: { xs: 'block', md: 'none' }, 
                    zIndex: 2
                  }}
                >
                  {(() => {
                    const lastCol:any = columns[columns.length - 1]
                    return lastCol.render
                      ? lastCol.render(lastCol.dataIndex === 'index' ? index + 1 : item[lastCol.dataIndex])
                      : lastCol.renderItem
                      ? lastCol.renderItem(item)
                      : lastCol.renderSource
                      ? lastCol.renderSource(item[lastCol.dataIndex], item)
                      : lastCol.renderId
                      ? lastCol.renderId(item.id, item[lastCol.dataIndex])
                      : item[lastCol.dataIndex]
                  })()}
                </Box>
                {columns.map((el: any, i) => (
                  <Box
                    key={i}
                    sx={{
                      display: {
                        xs: i === columns.length - 1 ? 'none' : 'flex', 
                        md: 'flex'
                      },
                      gap: 1,
                      alignItems: 'center'
                    }}
                  >
                    <Box sx={{ fontWeight: 600, fontSize: 12, width: '120px' }}>{el.title}:</Box>
                    <Box
                      sx={{
                        fontSize: 12,
                        fontWeight: 500,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        flex: 1
                      }}
                    >
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

                {rowClick && (
                  <Box sx={{ position: 'absolute', inset: 0, zIndex: 1 }} onClick={() => handleClick(item.id)} />
                )}
              </Box>
            )
          })
        ) : (
          data?.map((item, index) => {
            const colors = extractColors(item.color)
            return (
              <Box
                minWidth={minWidth || '1200px'}
                key={index}
                my={2}
                sx={{
                  padding: '5px 10px',
                  boxShadow: 'rgba(0, 0, 0, 0.1) 0px 1px 3px 0px, rgba(0, 0, 0, 0.06) 0px 1px 2px 0px',
                  borderRadius: '8px',
                  display: 'flex',
                  border: '1px solid #dddddd',
                  alignItems: 'center',
                  gap: 1,
                  backgroundColor: colors ? colors[0] : '',
                  color: colors ? colors[1] : '',
                  width: '100%',
                  maxWidth: maxWidth || null,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}
              >
                {columns.map((el: any, i) => (
                  <Box
                    key={i}
                    sx={{
                      textAlign: 'start',
                      flex: el.xs,
                      pb: '5px',
                      overflow: 'hidden'
                    }}
                  >
                    <Box
                      sx={{
                        fontSize: 12,
                        fontWeight: 500,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}
                    >
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

                {rowClick && (
                  <Box
                    sx={{ width: '55%', zIndex: 1, height: '36px', position: 'absolute' }}
                    onClick={() => handleClick(item.id)}
                  ></Box>
                )}
              </Box>
            )
          })
        )
      ) : (
        <EmptyContent />
      )}
    </div>
  )
}

export default DataTable
