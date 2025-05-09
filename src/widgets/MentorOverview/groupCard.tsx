import { type FC } from 'react'
import { Clock, MapPin } from 'lucide-react'
import classnames from 'classnames/bind'
import style from './MentorOverview.module.scss'

const cn = classnames.bind(style)

type Props = {
    title: string
    course?: string
    lesson_time?: string
    room: string
    all_students: number
    active_students: number
    trial_students: number

}

export const GroupCard: FC<Props> = ({ title, course, lesson_time, room, all_students, active_students, trial_students }) => (
    <div className={cn('GroupCard')}>
        <div className={cn('GroupCard-header')}>
            <div className={cn('GroupCard-header-name')}>{title}</div>
            <div className={cn('GroupCard-header-course')}>{course}</div>
        </div>
        <div className={cn('GroupCard-details')}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div className={cn('GroupCard-details-lesson')}>
                    <Clock size={15} />
                    <div className={cn('GroupCard-details-lesson-title')}>{lesson_time}</div>
                </div>
                <div className={cn('GroupCard-details-count')}>Jami:{all_students}</div>
                <div className={cn('GroupCard-details-count')}>Sinov:{trial_students}</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div className={cn('GroupCard-details-lesson')}>
                    <MapPin size={15} />
                    <div className={cn('GroupCard-details-lesson-title')}>{room}</div>
                </div>
                <div className={cn('GroupCard-details-count')}>Faol:{active_students}</div>
            </div>
        </div>
    </div>
)

GroupCard.displayName = 'GroupCard'