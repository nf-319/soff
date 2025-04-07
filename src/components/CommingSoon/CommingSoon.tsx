import React, { FC } from 'react'
import { Box, Typography, Paper } from '@mui/material';
import { SxProps, Theme } from '@mui/material/styles';

type Props = {
  children: React.ReactNode
  text?: string
  hidden?: boolean
  sx?: SxProps<Theme>
}

export const ComingSoon: FC<Props> = ({ children, text = 'Tez kunda', hidden = false, sx }) => {
  if (hidden) {
    return null;
  }

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
          filter: 'brightness(0.7) blur(0.5px)',
          opacity: 0.75,
          width: '100%',
          userSelect: 'none',
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
          bgcolor: 'rgba(102, 108, 255, 0.85)',
          color: 'white',
          padding: '10px 24px',
          borderRadius: '12px',
          textAlign: 'center',
          zIndex: 10,
          backdropFilter: 'blur(6px)',
          boxShadow: '0 8px 20px rgba(102, 108, 255, 0.3), 0 4px 6px rgba(0, 0, 0, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.25)',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translate(-50%, -50%) scale(1.03)',
            boxShadow: '0 10px 25px rgba(102, 108, 255, 0.4), 0 3px 6px rgba(0, 0, 0, 0.15)',
          }
        }}
      >
        <Typography
          variant='body1'
          fontWeight='600'
          sx={{
            letterSpacing: '0.8px',
            color: 'white',
            textTransform: 'uppercase',
            fontSize: '0.9rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 1
          }}
        >
          <Box
            component="span"
            sx={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              bgcolor: 'white',
              display: 'inline-block',
              boxShadow: '0 0 8px rgba(255, 255, 255, 0.8)',
              animation: 'pulse 1.5s infinite'
            }}
          />
          {text}
        </Typography>
      </Paper>
    </Box>
  );
}

ComingSoon.displayName = 'ComingSoon'
