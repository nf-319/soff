'use client'

import { FC, useState, useRef, useEffect } from 'react'
import parse from 'html-react-parser';
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
import { getFormatTimestamp } from '@utils/getFormatTimestamp'

const stripHtml = (html: string): string => {
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = html;
  return tempDiv.textContent || tempDiv.innerText || '';
};

export type NotificationProps = {
  title: string;
  content: string;
  created_at?: string | Date;
  isRead: boolean;
  truncate?: boolean;
  hiddenIsRead?: boolean;
  displayAsText?: boolean;
  sx?: any;
  compact?: boolean;
  onClick?: () => void;
};

export const Notification: FC<NotificationProps> = ({
  title,
  content,
  hiddenIsRead,
  created_at,
  isRead,
  truncate = false,
  displayAsText = false,
  sx = {},
  compact = false,
  onClick
}) => {

  const [expanded, setExpanded] = useState(!truncate)
  const [contentOverflows, setContentOverflows] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (contentRef.current && truncate) {
      const hasOverflow = contentRef.current.scrollHeight > contentRef.current.clientHeight
      setContentOverflows(hasOverflow)
    }
  }, [content, truncate])

  const shouldTruncate = truncate && !expanded

  return (
    <NotificationContainer
      isRead={isRead}
      style={{
        ...sx,
        cursor: onClick ? 'pointer' : 'default'
      }}
      onClick={onClick}
    >
      <NotificationHeader>
        <HeaderContent
          style={{
            display: 'flex',
            gap: compact ? 8 : 12,
            alignItems: 'center'
          }}
        >
          <Avatar
            sx={{
              width: compact ? 32 : 40,
              height: compact ? 32 : 40,
              backgroundColor: isRead ? '#f0f0f0' : '#666CFF',
              color: isRead ? '#666' : 'white'
            }}
          >
            {isRead ? <Bell size={compact ? 18 : 22} /> : <BellRing size={compact ? 18 : 22} />}
          </Avatar>

          <Title
            style={{
              fontSize: compact ? '1rem' : '1.1rem',
              fontWeight: 500,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              maxWidth: compact ? 'calc(100% - 40px)' : undefined
            }}
          >
            {title}
          </Title>
        </HeaderContent>

        {created_at && (
          <Timestamp
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              color: '#666',
              fontSize: compact ? '0.75rem' : '0.8rem'
            }}
          >
            <Clock size={compact ? 14 : 16} />
            {getFormatTimestamp(created_at)}
          </Timestamp>
        )}
      </NotificationHeader>

      {!compact && <Divider sx={{ my: 1.5 }} />}

      <Box sx={{ minHeight: compact ? '40px' : '80px' }}>
        <Content
          ref={contentRef}
          truncate={shouldTruncate}
          style={{
            padding: compact ? '4px 8px' : '8px 16px',
            lineHeight: 1.6,
            fontSize: displayAsText ? '0.85rem' : '0.95rem',
            maxHeight: shouldTruncate ? (compact ? '60px' : '120px') : 'none',
            overflow: shouldTruncate ? 'hidden' : 'visible'
          }}
        >
          {displayAsText ? stripHtml(content) : parse(content)}
        </Content>
      </Box>

      {truncate && contentOverflows && !compact ? (
        expanded ? (
          <ExpandButton
            onClick={e => {
              e.stopPropagation()
              setExpanded(!expanded)
            }}
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
            onClick={e => {
              e.stopPropagation()
              setExpanded(!expanded)
            }}
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

      {!hiddenIsRead && !compact && (
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
              onClick={e => {
                e.stopPropagation()
              }}
              style={{
                color: '#666CFF',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 1
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
