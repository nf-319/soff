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
