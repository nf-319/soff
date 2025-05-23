import { Box, SxProps } from '@mui/system'
import { CSSProperties, FC, ReactNode } from 'react'
import { Tooltip } from '@mui/material'

type Props = {
  title: string
  children?: ReactNode
  titleActions?: ReactNode
  isDemo?: boolean
  variant?: 'default' | 'compact' | 'large'
  titleSize?: 'small' | 'medium' | 'large'
  sx?: SxProps
  className?: string
  childrenSx?: SxProps
}

export const WidgetHeader: FC<Props> = ({
  title,
  children,
  titleActions,
  isDemo = false,
  variant = 'default',
  titleSize = 'medium',
  sx = {},
  childrenSx,
  className = ''
}) => {
  const getPadding = () => {
    switch (variant) {
      case 'compact':
        return { padding: '0.25rem 0.5rem' }
      case 'large':
        return { padding: '0.75rem 1rem' }
      default:
        return { padding: '0.5rem 0' }
    }
  }

  const getTitleStyle = () => {
    switch (titleSize) {
      case 'small':
        return { fontSize: '1rem' }
      case 'large':
        return { fontSize: '1.5rem' }
      default:
        return { fontSize: '1.125rem' }
    }
  }

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        flexDirection: { xs: 'column', md: 'row' },
        position: 'relative',
        ...getPadding(),
        ...sx
      }}
      className={className}
    >
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem'
        }}
      >
        <div
          style={{
            fontWeight: 600,
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            ...getTitleStyle()
          }}
        >
          {title}
          {isDemo && (
            <Tooltip title='Hozirda hisobot test rejimda ishlamoqda' sx={{ width: '100%' }}>
              <Box
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginLeft: '0.75rem',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: 'white',
                  background: 'linear-gradient(135deg, #4f46e5, #6366f1)',
                  padding: '0.2rem 0.6rem',
                  borderRadius: '0.375rem',
                  boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
                  verticalAlign: 'middle',
                  letterSpacing: '0.03em',
                  textTransform: 'uppercase'
                }}
              >
                BETA
              </Box>
            </Tooltip>
          )}
        </div>
        {titleActions && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem'
            }}
          >
            {titleActions}
          </Box>
        )}
      </Box>
      {children && <Box sx={{ ...childrenSx }}>{children}</Box>}
    </Box>
  )
}

WidgetHeader.displayName = 'WidgetHeader'
