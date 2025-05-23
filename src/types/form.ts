export type FieldType = {
  input_type: 'input' | 'name'  | 'text' | 'question' | 'phone'
  label: string
  title: string
  value?: string
  order?: number
  question?: string
  variants?: string[]
  checkedVariants?: any[]
  question_variants?: any[]
  question_type?: 'single' | 'multiple'
  is_required: boolean
}
