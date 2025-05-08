'use client'

import { FC, useState, useRef, useEffect } from 'react'
import parse from 'html-react-parser'
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
  const tempDiv = document.createElement('div')
  tempDiv.innerHTML = html
  return tempDiv.textContent || tempDiv.innerText || ''
}

export type NotificationProps = {
  title: string
  content: string
  created_at?: string | Date
  isRead: boolean
  truncate?: boolean
  hiddenIsRead?: boolean
  displayAsText?: boolean
  sx?: any
  compact?: boolean
  onClick?: () => void
}

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
    <Box sx={{minHeight: compact ? '40px' : '80px' }}>
      <Content
        ref={contentRef}
        truncate={shouldTruncate}
        style={{
          lineHeight: 1.6,
          fontSize: displayAsText ? '0.85rem' : '0.95rem',
          maxHeight: shouldTruncate ? (compact ? '60px' : '120px') : 'none',
          overflow: shouldTruncate ? 'hidden' : 'visible'
        }}
      >
        {displayAsText ? stripHtml(content) : parse(content)}
      </Content>
    </Box>
  )
}
