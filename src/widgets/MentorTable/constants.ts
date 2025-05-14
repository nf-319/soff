type GroupTableType = {
  id: number
  groupName: string
  courseName: string
  allStudents: number
  teacherShare: number
   }

export const GroupTable  = [
  {
    id: 1,
    groupName: "FrontEnd-25",
    courseName: "Web dasturlash",
    allStudents: 24,
    teacherShare: 350000
  },
  {
 id: 2,
 groupName:"FrontEnd-26",
 courseName:"Python",
 allStudents:21,
 teacherShare:320000
  },
  {    
 id: 3,
 groupName:"FrontEnd-27",
 courseName:"Flutter",
 allStudents:26,
 teacherShare:380000
  }
] satisfies GroupTableType[]


type MonthlySalaryType = {
  id:number
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
    id:1,
    month:"Mart 2025",
    countLesson:49,
    bonus: 5000000,
    penalty: 2000000,
    avance:1000000,
    monthlySalary:45000000,
    status:"Tolangan"
  },
  {
    id:2,
    month:"Aprel 2025",
    countLesson:30,
    bonus: 5000000,
    penalty: 2000000,
    avance:1000000,
    monthlySalary:45000000,
    status:"Tolangan"
  },
  {
    id:3,
    month:"May 2025",
    countLesson:52,
    bonus: 5000000,
    penalty: 2000000,
    avance:1000000,
    monthlySalary:45000000,
    status:"Tolangan"
  },
  {
    id:4,
    month:"Iyun 2025",
    countLesson:45,
    bonus: 5000000,
    penalty: 2000000,
    avance:1000000,
    monthlySalary:45000000,
    status:"Tolangan"
  },
  {
    id:5,
    month:"Iyul 2025",
    countLesson:40,
    bonus: 5000000,
    penalty: 2000000,
    avance:1000000,
    monthlySalary:45000000,
    status:"Tolangan"
  },
] satisfies MonthlySalaryType []
