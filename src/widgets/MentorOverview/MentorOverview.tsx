import classnames from 'classnames/bind'
import style from './MentorOverview.module.scss'
import { Box, IconButton } from '@mui/material'
import { BookOpen, Calendar, Clock, MapPin, Pencil, Phone, Users } from 'lucide-react'

const cn = classnames.bind(style)

export const MentorOverview = () => {
  const profileDetails = [
    { icon: Calendar, title: 'Royxatdan otkan sana', value: '12.05.2023' },
    { icon: MapPin, title: 'Filial', value: 'Chilonzor filiali' },
    { icon: BookOpen, title: "O'qitayotgan kurslar soni", value: '4' },
    { icon: Users, title: 'Faol guruhlar soni', value: '3' }
  ]

  const groups = [
    {
      name: 'Frontend-24',
      course: 'Web-Dasturlash',
      lesson_time: '14:00-15:00',
      room: '204-xona',
      all_students: '20',
      active_students: '18',
      trial_students: '2'
    },
    {
      name: 'Backend-12',
      course: 'Phyton',
      lesson_time: '16:30-17:30',
      room: '305-xona',
      all_students: '14',
      active_students: '12',
      trial_students: '2'
    },
    {
      name: 'Frontend-24',
      course: 'Web-Dasturlash',
      lesson_time: '14:00-15:00',
      room: '204-xona',
      all_students: '20',
      active_students: '18',
      trial_students: '2'
    },
    {
      name: 'Frontend-24',
      course: 'Web-Dasturlash',
      lesson_time: '14:00-15:00',
      room: '204-xona',
      all_students: '20',
      active_students: '18',
      trial_students: '2'
    }
  ]

  return (
    <Box className={cn('mentor_overview')}>
      <div className={cn('mentor_overview-profile-card')}>
        <div className={cn('mentor_overview-profile-card-header')}>
          <p className={cn('mentor_overview-profile-card-header-title')}>Mening ma'lumotlarim</p>
          <IconButton>
            <Pencil color='#09090B' className='mentor_overview-profile-card-pencil' size={15} />
          </IconButton>
        </div>
        <div className={cn('mentor_overview-profile-card-info')}>
          <div className={cn('mentor_overview-profile-card-info-image')}></div>
          <p className={cn('mentor_overview-profile-card-info-teacher')}>Otabek Ibrohimov</p>
        </div>
        <div className={cn('mentor_overview-profile-card-details')}>
          {profileDetails.map((item, index) => {
            const Icon = item.icon
            return (
              <div key={index} className={cn('mentor_overview-profile-card-details-detail')}>
                <Icon size={20} />
                <div>
                  <div className={cn('mentor_overview-profile-card-details-detail-title')}>{item.title}</div>
                  <div className={cn('mentor_overview-profile-card-details-detail-value')}>{item.value}</div>
                </div>
              </div>
            )
          })}
        </div>
        <div className={cn('mentor_overview-profile-card-contact')}>
          <div className={cn('mentor_overview-profile-card-contact-title')}>Kontakt</div>
          <div className={cn('mentor_overview-profile-card-contact-details')}>
            <Phone size={15} />
            <div className={cn('mentor_overview-profile-card-contact-details-phone')}>+998 90 123 45 67</div>
          </div>
        </div>
      </div>
      <div className={cn('mentor_overview-groups-card')}>
        <div className={cn('mentor_overview-groups-card-title')}>Guruhlar</div>
        <div className={cn('mentor_overview-groups-card-info')}>Hozirgi/Keyingi daras</div>
        <div className={cn('mentor_overview-groups-card-group-current')}>
          <div className={cn('mentor_overview-groups-card-group-current-header')}>
            <div className={cn('mentor_overview-groups-card-group-current-header-name')}>Frontend-24</div>
            <div className={cn('mentor_overview-groups-card-group-current-header-course')}>Web Dasturlash</div>
          </div>
          <div className={cn('mentor_overview-groups-card-group-current-details')}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div className={cn('mentor_overview-groups-card-group-current-details-lesson')}>
                <Clock size={15} />{' '}
                <div className={cn('mentor_overview-groups-card-group-current-details-lesson-title')}>14:30-16:00</div>
              </div>
              <div className={cn('mentor_overview-groups-card-group-current-details-count')}>Jami:21</div>
              <div className={cn('mentor_overview-groups-card-group-current-details-count')}>Sinov:3</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div className={cn('mentor_overview-groups-card-group-current-details-lesson')}>
                <MapPin size={15} />{' '}
                <div className={cn('mentor_overview-groups-card-group-current-details-lesson-title')}>204-xona</div>
              </div>
              <div className={cn('mentor_overview-groups-card-group-current-details-count')}>Faol:18</div>
            </div>
          </div>
        </div>
        <div className={cn('mentor_overview-groups-card-info')}>Barcha guruhlar</div>
        <div className={cn('mentor_overview-groups-card-groups')}>
          {groups.map(item => (
            <div className={cn('mentor_overview-groups-card-group-current')}>
              <div className={cn('mentor_overview-groups-card-group-current-header')}>
                <div className={cn('mentor_overview-groups-card-group-current-header-name')}>{item.name}</div>
                <div className={cn('mentor_overview-groups-card-group-current-header-course')}>{item.course}</div>
              </div>
              <div className={cn('mentor_overview-groups-card-group-current-details')}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <div className={cn('mentor_overview-groups-card-group-current-details-lesson')}>
                    <Clock size={15} />{' '}
                    <div className={cn('mentor_overview-groups-card-group-current-details-lesson-title')}>
                      {item.lesson_time}
                    </div>
                  </div>
                  <div className={cn('mentor_overview-groups-card-group-current-details-count')}>
                    Jami:{item.all_students}
                  </div>
                  <div className={cn('mentor_overview-groups-card-group-current-details-count')}>
                    Sinov:{item.trial_students}
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <div className={cn('mentor_overview-groups-card-group-current-details-lesson')}>
                    <MapPin size={15} />{' '}
                    <div className={cn('mentor_overview-groups-card-group-current-details-lesson-title')}>
                      {item.room}
                    </div>
                  </div>
                  <div className={cn('mentor_overview-groups-card-group-current-details-count')}>
                    Faol:{item.active_students}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Box>
  )
}

MentorOverview.displayName = 'MentorOverview'
