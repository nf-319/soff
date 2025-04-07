'use client'

import { FC, useState, useRef, useEffect } from 'react'
import parse from 'html-react-parser';
import { format } from 'date-fns';
import { Bell, BellRing, Check, CheckCheck, ChevronDown, ChevronUp, Clock } from 'lucide-react'
import Divider from '@mui/material/Divider'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import {
  NotificationContainer,
  NotificationHeader,
  HeaderContent,
  Content,
  Title,
  ActionFooter,
  ActionButton,
  ExpandButton,
  Timestamp
} from './Notification.styles'

export type NotificationProps = {
  title: string;
  content: string;
  created_at?: string | Date;
  isRead: boolean;
  truncate?: boolean;
  hiddenIsRead?: boolean;
}

export const Notification: FC<NotificationProps> = ({ title, content, hiddenIsRead, created_at, isRead, truncate = false }) => {
  const [expanded, setExpanded] = useState(!truncate)
  const [contentOverflows, setContentOverflows] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (contentRef.current && truncate) {
      const hasOverflow = contentRef.current.scrollHeight > contentRef.current.clientHeight
      setContentOverflows(hasOverflow)
    }
  }, [content, truncate])

  const formatTimestamp = (timestamp?: string | Date): string => {
    if (!timestamp) return ''

    try {
      const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp
      return format(date, 'MMM d, HH:mm')
    } catch (error) {
      return ''
    }
  }

  const shouldTruncate = truncate && !expanded

  return (
    <NotificationContainer isRead={isRead}>
      <NotificationHeader>
        <HeaderContent style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <Avatar
            sx={{
              width: 40,
              height: 40,
              backgroundColor: isRead ? '#f0f0f0' : '#666CFF',
              color: isRead ? '#666' : 'white'
            }}
          >
            {isRead ? <Bell size={22} /> : <BellRing size={22} />}
          </Avatar>

          <Title style={{ fontSize: '1.1rem', fontWeight: 500 }}>{title}</Title>
        </HeaderContent>

        {created_at && (
          <Timestamp style={{ display: 'flex', alignItems: 'center', gap: 1, color: '#666' }}>
            <Clock size={16} />
            {formatTimestamp(created_at)}
          </Timestamp>
        )}
      </NotificationHeader>

      <Divider sx={{ my: 1.5 }} />

      <Box sx={{ minHeight: '80px' }}>
        <Content
          ref={contentRef}
          truncate={shouldTruncate}
          style={{
            padding: '8px 16px',
            lineHeight: 1.6,
            fontSize: '0.95rem',
            maxHeight: shouldTruncate ? '120px' : 'none',
            overflow: shouldTruncate ? 'hidden' : 'visible'
          }}
        >
          {parse(content)}
        </Content>
      </Box>

      {truncate && contentOverflows ? (
        expanded ? (
          <ExpandButton
            onClick={() => setExpanded(!expanded)}
            style={{
              color: '#666CFF',
              marginTop: 1,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 1
            }}
          >
            <span>Kamroq ko'rsatish</span>
            <ChevronUp size={18} />
          </ExpandButton>
        ) : (
          <ExpandButton
            onClick={() => setExpanded(!expanded)}
            style={{
              color: '#666CFF',
              marginTop: 1,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 1
            }}
          >
            <span>Ko'proq ko'rsatish</span>
            <ChevronDown size={18} />
          </ExpandButton>
        )
      ) : null}

      {!hiddenIsRead && (
        <ActionFooter style={{ marginTop: 2, display: 'flex', justifyContent: 'flex-end' }}>
          {isRead ? (
            <ActionButton
              disabled
              style={{
                opacity: 0.7,
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}
            >
              <CheckCheck size={18} />
              <span>O'qilgan</span>
            </ActionButton>
          ) : (
            <ActionButton
              style={{
                color: '#666CFF',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}
            >
              <Check size={18} />
              <span>O'qilgan deb belgilash</span>
            </ActionButton>
          )}
        </ActionFooter>
      )}
    </NotificationContainer>
  )
}
