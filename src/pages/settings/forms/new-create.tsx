import { revereAmount } from '@/components/amount-input'
import PhoneInput from '@/components/phone-input'
import { useAppSelector } from '@/store'
import FormFields from '@/widgets/Form/formFields'
import FormHeader from '@/widgets/Form/formHeader'
import FormUi from '@/widgets/Form/formUi'
import {
  Box,
  Button,
  Card,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  InputLabel,
  TextField,
  Typography
} from '@mui/material'
import Image from 'next/image'
import { useState } from 'react'

export type FieldType = {
  input_type: 'input' | 'text' | 'question' | 'phone'
  label: string
  title: string
  value?: string
  question?: string
  variants?: string[]
  checkedVariants?: string[]
  question_variants?: any[]
  is_required: boolean
}

type Props = {
  is_update?: boolean
}

const CreateForm = ({ is_update }: Props) => {
  const [formName, setFormName] = useState<string>('Aloqa uchun kontakt')
  const [displayMode, setDisplayMode] = useState<'computer' | 'tablet' | 'phone'>('computer')
  const { companyInfo } = useAppSelector(state => state.user)
  const [bg_img, setBgImg] = useState<any | null>(null)
  const [logoImg, setLogoImg] = useState<any | null>(null)
  const [bg_color, setBgColor] = useState<string>('#f9f9fb')
  const [sentButtonLabel, setSendButtonLabel] = useState<string>('Yuborish')
  const [fields, setFields] = useState<FieldType[]>([
    { input_type: 'input', label: 'Ism', title: 'Ism', value: '', is_required: false },
    { input_type: 'phone', label: 'Telefon', title: 'Telefon', value: '', is_required: false }
  ])
  const handleFieldChange = (index: number, key: keyof FieldType, val: any) => {
    const updated = [...fields]
    // @ts-ignore
    updated[index][key] = val
    setFields(updated)
  }

  return (
    <Card sx={{ boxShadow: 'none', border: '1px solid lightgray', padding: 5 }}>
      <FormHeader is_update={is_update} displayMode={displayMode} setDisplayMode={setDisplayMode} />
      <Box sx={{ marginTop: 5 }} display={'flex'} flexDirection={{ xs: 'column', md: 'row' }} gap={5}>
        <FormFields
          is_update={is_update}
          bg_color={bg_color}
          bg_img={bg_img}
          companyInfoLogo={companyInfo.logo}
          fields={fields}
          formName={formName}
          handleFieldChange={handleFieldChange}
          logoImg={logoImg}
          sentButtonLabel={sentButtonLabel}
          setBgColor={setBgColor}
          setBgImg={setBgImg}
          setFields={setFields}
          setFormName={setFormName}
          setLogoImg={setLogoImg}
          setSendButtonLabel={setSendButtonLabel}
        />
        <FormUi
          bg_color={bg_color}
          bg_img={bg_img}
          companyInfoLogo={companyInfo.logo}
          displayMode={displayMode}
          logoImg={logoImg}
          sentButtonLabel={sentButtonLabel}
          setFields={setFields}
          handleFieldChange={handleFieldChange}
          fields={fields}
          formName={formName}
        />
      </Box>
    </Card>
  )
}

export default CreateForm
