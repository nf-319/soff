import classnames from 'classnames/bind'
import style from './MentorOverview.module.scss'
import { Box, IconButton } from '@mui/material'
import { BookOpen, Calendar, MapPin, Pencil, Phone, Users } from 'lucide-react'
import { groups, ClassGroup } from './constants'
import { GroupCard } from './groupCard'

const cn = classnames.bind(style)

export const MentorOverview = () => {
  const profileDetails = [
    { icon: Calendar, title: 'Royxatdan otkan sana', value: '12.05.2023' },
    { icon: MapPin, title: 'Filial', value: 'Chilonzor filiali' },
    { icon: BookOpen, title: "O'qitayotgan kurslar soni", value: '4' },
    { icon: Users, title: 'Faol guruhlar soni', value: '3' }
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
        {ClassGroup.map(item => (
          <GroupCard title={item.name} course={item.course} lesson_time={item.lesson_time} room={item.room} all_students={item.all_students} active_students={item.active_students} trial_students={item.trial_students} />
        ))}
        <div className={cn('mentor_overview-groups-card-info')}>Barcha guruhlar</div>
        <div className={cn('mentor_overview-groups-card-groups')}>
          {groups.map(item => (
            <GroupCard title={item.name} course={item.course} lesson_time={item.lesson_time} room={item.room} all_students={item.all_students} active_students={item.active_students} trial_students={item.trial_students} />
          ))}
        </div>
      </div>
    </Box>
  )
}

MentorOverview.displayName = 'MentorOverview'
