import { useAppSelector } from '@/store'
import FormFields from '@/widgets/Form/formFields'
import FormHeader from '@/widgets/Form/formHeader'
import FormUi from '@/widgets/Form/formUi'
import { Box, Card } from '@mui/material'
import { useState } from 'react'
import Divider from '@mui/material/Divider'

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
  const [logoImg, setLogoImg] = useState<any | null>(companyInfo?.logo)
  const [bg_color, setBgColor] = useState<string>('#f9f9fb')
  const [fontFamily, setFontFamily] = useState<string>('Roboto, sans-serif')
  const [fontSize, setFontSize] = useState<string>('20px')
  const [textColor, setTextColor] = useState<string>('#111827')
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

  const getFormUiWidth = () => {
    switch (displayMode) {
      case 'computer':
        return { xs: '100%', md: '70%' }
      case 'tablet':
        return { xs: '100%', md: '50%' }
      case 'phone':
        return { xs: '100%', md: '30%' }
      default:
        return { xs: '100%', md: '50%' }
    }
  }

  const getFormFieldsWidth = () => {
    switch (displayMode) {
      case 'computer':
        return { xs: '100%', md: '30%' }
      case 'tablet':
        return { xs: '100%', md: '50%' }
      case 'phone':
        return { xs: '100%', md: '70%' }
      default:
        return { xs: '100%', md: '50%' }
    }
  }

  return (
    <Card sx={{ boxShadow: 'none', border: '1px solid lightgray', padding: 5 }}>
      <FormHeader is_update={is_update} displayMode={displayMode} setDisplayMode={setDisplayMode} />

      <Box
        sx={{
          marginTop: 5,
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' }
        }}
      >
        <Box
          sx={{
            width: getFormFieldsWidth(),
            transition: 'width 0.3s ease-in-out',
            overflow: 'hidden',
          }}
        >
          <FormFields
            is_update={is_update}
            bg_color={bg_color}
            bg_img={bg_img}
            companyInfoLogo={companyInfo.logo}
            fields={fields}
            setFontFamily={setFontFamily}
            setFontSize={setFontSize}
            setTextColor={setTextColor}
            fontFamily={fontFamily}
            fontSize={fontSize}
            textColor={textColor}
            formName={formName}
            displayName={displayMode}
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
        </Box>

        <Divider orientation='vertical' flexItem color='#e0e0e0' sx={{ mx: 3 }} />

        <Box
          sx={{
            width: getFormUiWidth(),
            transition: 'width 0.3s ease-in-out',
            overflow: 'hidden'
          }}
        >
          <FormUi
            bg_color={bg_color}
            bg_img={bg_img}
            companyInfoLogo={companyInfo.logo}
            logoImg={logoImg}
            fontFamily={fontFamily}
            fontSize={fontSize}
            textColor={textColor}
            displayMode={displayMode}
            sentButtonLabel={sentButtonLabel}
            setFields={setFields}
            handleFieldChange={handleFieldChange}
            fields={fields}
            formName={formName}
          />
        </Box>
      </Box>
    </Card>
  )
}

export default CreateForm
