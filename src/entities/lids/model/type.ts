export type LeadsType<T> = {
  count: number
  next: string | null
  previous: string | null
  results: T
}

type LeadsChild = {
  id: number
  first_name: string
  phone: string
}

export  type LeadsResult = {
  id: number
  name: string
  leads: LeadsChild[]
}



export type MenuOpenType =
  | 'note'
  | 'sms'
  | 'merge-to-amo'
  | 'merge-to'
  | 'add-group'
  | 'branch'
  | 'edit'
  | 'delete'
  | 'recover'
  | null
