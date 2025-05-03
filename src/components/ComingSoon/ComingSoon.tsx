import React, { FC } from 'react';
import { Box, Typography, Paper, SxProps, Theme } from '@mui/material';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

type ComingSoonProps = {
  children: React.ReactNode;
  text?: string;
  title?: string;
  releaseDate?: string;
  active?: boolean;
  textColor?: string;
  hidden?: boolean;
  showBackground?: boolean;
  size?: 'small' | 'medium' | 'large';
  sx?: SxProps<Theme>;
  brightness?: string;
  blur?: string;
}

export const ComingSoon: FC<ComingSoonProps> = ({
  children,
  text,
  title,
  releaseDate,
  active = false,
  blur = '3px',
  brightness = '0.8',
  textColor = 'white',
  hidden = false,
  showBackground = true,
  size = 'medium',
  sx,
}) => {

  if (hidden) {
    return null
  }

  if (active) {
    return <>{children}</>
  }

  const sizeConfig = {
    small: {
      padding: '6px 16px',
      fontSize: '0.75rem',
      borderRadius: '8px'
    },
    medium: {
      padding: '10px 24px',
      fontSize: '0.9rem',
      borderRadius: '12px'
    },
    large: {
      padding: '14px 32px',
      fontSize: '1rem',
      borderRadius: '16px'
    }
  }

  const currentSize = sizeConfig[size]

  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        pointerEvents: 'none',
        ...sx
      }}
    >
      <Box
        sx={{
          filter: `brightness(${brightness}) blur(${blur})`,
          opacity: 0.75,
          width: '100%',
          height: '100%',
          userSelect: 'none'
        }}
      >
        {children}
      </Box>

      <Paper
        elevation={4}
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%) scale(1)',
          bgcolor: showBackground ? 'rgba(102, 108, 255, 0.85)' : 'transparent',
          color: 'white',
          padding: currentSize.padding,
          borderRadius: currentSize.borderRadius,
          textAlign: 'center',
          zIndex: 10,
          backdropFilter: showBackground ? 'blur(6px)' : 'none',
          boxShadow: showBackground ? '0 8px 20px rgba(102, 108, 255, 0.3), 0 4px 6px rgba(0, 0, 0, 0.1)' : 'none',
          border: showBackground ? '1px solid rgba(255, 255, 255, 0.25)' : 'none',
          transition: 'all 0.3s ease',
          '&:hover': showBackground
            ? {
                transform: 'translate(-50%, -50%) scale(1.03)',
                boxShadow: '0 10px 25px rgba(102, 108, 255, 0.4), 0 3px 6px rgba(0, 0, 0, 0.15)'
              }
            : {},
          minWidth: 'min-content',
          maxWidth: '90%'
        }}
      >
        {title && (
          <Typography
            variant='subtitle1'
            fontWeight='700'
            sx={{
              mb: 1,
              color: 'white',
              fontSize: `calc(${currentSize.fontSize} + 0.1rem)`,
              textShadow: !showBackground ? '0 2px 4px rgba(0, 0, 0, 0.5)' : 'none'
            }}
          >
            {title}
          </Typography>
        )}

        <Typography
          variant='body1'
          fontWeight='600'
          sx={{
            letterSpacing: '0.8px',
            color: textColor,
            textTransform: 'uppercase',
            fontSize: currentSize.fontSize,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            textShadow: !showBackground ? '0 2px 4px rgba(0, 0, 0, 0.5)' : 'none'
          }}
        >
          {text}
        </Typography>

        {releaseDate && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexWrap: 'nowrap',
              whiteSpace: 'nowrap',
              fontSize: `calc(${currentSize.fontSize} - 0.1rem)`,
              opacity: 0.9,
              textShadow: !showBackground ? '0 2px 4px rgba(0, 0, 0, 0.5)' : 'none'
            }}
          >
            <CalendarTodayIcon sx={{ fontSize: 'inherit', mr: 0.5 }} />
            <Typography variant='caption' sx={{ fontSize: 'inherit', color: textColor, whiteSpace: 'nowrap' }}>
              {releaseDate}
            </Typography>
          </Box>
        )}
      </Paper>
    </Box>
  )
}

ComingSoon.displayName = 'ComingSoon';
