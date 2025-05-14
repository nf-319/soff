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

type Groups = {
  name: string,
    course: string,
    lesson_time: string,
    room: string,
    all_students: number,
    active_students: number,
    trial_students:number
}

export const Groups = [
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
] satisfies Groups[]



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

type GroupTable = {
  groupName:string
  courseName:string
  allStudents:number
  teacherShare:number
   }

export const GroupTable  = [
  {
 groupName:"FrontEnd-25",
 courseName:"Web dasturlash",
 allStudents:24,
 teacherShare:350000
  },
  {
 groupName:"FrontEnd-26",
 courseName:"Python",
 allStudents:21,
 teacherShare:320000
  },
  {
 groupName:"FrontEnd-27",
 courseName:"Flutter",
 allStudents:26,
 teacherShare:380000
  }
] satisfies GroupTable []


type MonthlySalary = {
  month:string
  countLesson:number
  bonus: number
  penalty: number
  avance:number
  monthlySalary:number
  status:string
   }

export const MonthlySalary  = [
  {
month:"Mart 2025",
countLesson:49,
bonus: 5000000,
penalty: 2000000,
avance:1000000,
monthlySalary:45000000,
status:"Tolangan"
  },
  {
month:"Aprel 2025",
countLesson:30,
bonus: 5000000,
penalty: 2000000,
avance:1000000,
monthlySalary:45000000,
status:"Tolangan"
  },
  {
month:"May 2025",
countLesson:52,
bonus: 5000000,
penalty: 2000000,
avance:1000000,
monthlySalary:45000000,
status:"Tolangan"
  },
  {
month:"Iyun 2025",
countLesson:45,
bonus: 5000000,
penalty: 2000000,
avance:1000000,
monthlySalary:45000000,
status:"Tolangan"
  },
  {
month:"Iyul 2025",
countLesson:40,
bonus: 5000000,
penalty: 2000000,
avance:1000000,
monthlySalary:45000000,
status:"Tolangan"
  },
] satisfies MonthlySalary []
