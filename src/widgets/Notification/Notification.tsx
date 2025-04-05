'use client'

import { FC, useState } from 'react'
import parse from 'html-react-parser';
import { format } from 'date-fns';
import { Bell, BellRing, Check, CheckCheck, ChevronDown, ChevronUp, Clock } from 'lucide-react'
import Divider from '@mui/material/Divider'
import Avatar from '@mui/material/Avatar'
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

type NotificationProps = {
  title: string;
  content: string;
  created_at?: string | Date;
  isRead: boolean;
  truncate?: boolean;
}

export const Notification: FC<NotificationProps> = ({ title, content, created_at, isRead, truncate = false }) => {
  const [expanded, setExpanded] = useState(!truncate)


  const formatTimestamp = (timestamp?: string | Date): string => {
    if (!timestamp) return ''

    try {
      const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp
      return format(date, 'MMM d, h:mm a')
    } catch (error) {
      return ''
    }
  }

  const shouldTruncate = truncate && !expanded

  return (
    <NotificationContainer isRead={isRead}>
      <NotificationHeader>
        <HeaderContent style={{ display: 'flex', gap: 6 }}>
          <Avatar
            sx={{
              width: 40,
              height: 40,
              backgroundColor: isRead ? 'default' : '#666CFF',
              color: isRead ? 'inherit' : 'white'
            }}
          >
            {isRead ? <Bell size={22} /> : <BellRing size={22} />}
          </Avatar>

          <Title>{title}</Title>
        </HeaderContent>


        {created_at && (
          <Timestamp>
            <Clock size={18} />
            {formatTimestamp(created_at)}
          </Timestamp>
        )}
      </NotificationHeader>

      <Divider color='#eef0f5' />

      <Content truncate={shouldTruncate}>{parse(content)}</Content>

      {truncate ? (
        expanded ? (
          <ExpandButton onClick={() => setExpanded(!expanded)}>
            <span>Kamroq ko‘rsatish</span>
            <ChevronUp size={18} />
          </ExpandButton>
        ) : (
          <ExpandButton onClick={() => setExpanded(!expanded)}>
            <span>Ko‘proq ko‘rsatish</span>
            <ChevronDown size={18} />
          </ExpandButton>
        )
      ) : null}

      <ActionFooter>
        {isRead ? (
          <ActionButton disabled>
            <CheckCheck size={18} />
            <span>O‘qilgan</span>
          </ActionButton>
        ) : (
          <ActionButton>
            <Check size={18} />
            <span>O‘qilgan deb belgilash</span>
          </ActionButton>
        )}
      </ActionFooter>
    </NotificationContainer>
  )
}
