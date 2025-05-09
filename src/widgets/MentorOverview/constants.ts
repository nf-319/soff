import { BookCopy, Calendar, LucideIcon, MapPin, Users } from 'lucide-react'



type MentorInfo = {
  title: string,
  icon: LucideIcon,
  value: string
}
export const MentorInfo = [
  {
    title: "Ro'yxatdan o'tgan sana",
    icon: Calendar,
    value: '12.05.2023'
  },
  {
    title: 'Filial',
    icon: MapPin,
    value: 'Chilonzor filiali'
  },
  {
    title: "O'qitayotgan kurslar soni",
    icon: BookCopy,
    value: '4'
  },
  {
    title: 'Faol guruhlar soni',
    icon: Users,
    value: '4'
  }
] satisfies MentorInfo[]

type GroupsType = {
  name: string,
    course: string,
    lesson_time: string,
    room: string,
    all_students: number,
    active_students: number,
    trial_students:number
}

export const groups = [
  {
    name: 'Frontend-24',
    course: 'Web-Dasturlash',
    lesson_time: '14:00-15:00',
    room: '204-xona',
    all_students: 20,
    active_students: 18,
    trial_students: 2
  },
  {
    name: 'Backend-12',
    course: 'Phyton',
    lesson_time: '16:30-17:30',
    room: '305-xona',
    all_students: 14,
    active_students: 12,
    trial_students: 2
  },
  {
    name: 'Frontend-24',
    course: 'Web-Dasturlash',
    lesson_time: '14:00-15:00',
    room: '204-xona',
    all_students: 20,
    active_students: 18,
    trial_students: 2
  },
  {
    name: 'Frontend-24',
    course: 'Web-Dasturlash',
    lesson_time: '14:00-15:00',
    room: '204-xona',
    all_students: 20,
    active_students: 18,
    trial_students: 2
  }
] satisfies GroupsType[]



type ClassGroup = {
  name: string,
    course: string,
    lesson_time: string,
    room: string,
    all_students: number,
    active_students: number,
    trial_students:number
}
export const ClassGroup  = [
  {
    name: 'Frontend-24',
    course: 'Web-Dasturlash',
    lesson_time: '14:00-15:00',
    room: '204-xona',
    all_students: 20,
    active_students: 18,
    trial_students: 2
  }
] satisfies ClassGroup []
