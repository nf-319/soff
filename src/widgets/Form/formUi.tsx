import { revereAmount } from '@/components/amount-input'
import PhoneInput from '@/components/phone-input'
import { FieldType } from '@/pages/settings/forms/new-create'
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

type Props = {
  formName: string
  fields: FieldType[]
  sentButtonLabel: string
  logoImg: any
  bg_img: any
  setFields: (val: any) => void
  handleFieldChange: any
  displayMode: 'phone' | 'tablet' | 'computer'
  bg_color: string
  companyInfoLogo: string
}

const FormUi = ({
  bg_img,
  bg_color,
  logoImg,
  companyInfoLogo,
  fields,
  formName,
  displayMode,
  sentButtonLabel,
  handleFieldChange,
  setFields
}: Props) => {
  const isMobile = displayMode === 'phone'

  return (
    <Box sx={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', gap: 5 }}>
      <Box display='flex' alignItems='center' justifyContent='center' sx={{ height: '100%' }}>
        <Card
          sx={{
            backgroundImage: `url(${bg_img ? URL.createObjectURL(bg_img) : '/images/request-form-bg.webp'})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            backgroundColor: bg_color || 'lightgray',
            width: '100%',
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            maxWidth: 'auto',
            boxShadow: 'none',
            border: '1px solid lightgray',
            padding: 5
          }}
        >
          <Box display='flex' alignItems='center' justifyContent='center'>
            <Card
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 5,
                overflowY: 'auto',
                padding: 5,
                transition: 'width 0.3s ease-in-out',
                width: isMobile ? 300 : 400,
                height: 'auto',
                backgroundColor: bg_color
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 100,
                  height: isMobile ? 60 : 100
                }}
              >
                <Image
                  priority={false}
                  src={
                    logoImg instanceof File
                      ? URL.createObjectURL(logoImg)
                      : typeof logoImg == 'string'
                      ? logoImg
                      : companyInfoLogo
                  }
                  alt='Yuklangan rasm'
                  width={100}
                  height={100}
                  unoptimized
                  style={{
                    width: 'auto',
                    transition: 'height 0.4s ease-in-out',
                    height: isMobile ? '60px' : '100px',
                    objectFit: 'cover'
                  }}
                />
              </Box>
              <Typography color='black' fontWeight={600}>
                {formName}
              </Typography>

              {fields.map((field, index) => (
                <FormControl fullWidth key={index}>
                  {field.input_type === 'input' && (
                    <TextField
                      sx={{
                        backgroundColor: 'white',
                        borderRadius: '8px',
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '8px'
                        }
                      }}
                      size='small'
                      type='text'
                      label={field.label || field.title}
                      value={field.value}
                      onChange={e => handleFieldChange(index, 'value', e.target.value)}
                    />
                  )}
                  {field.input_type === 'phone' && (
                    <>
                      <InputLabel shrink>{field.label || field.title}</InputLabel>
                      <PhoneInput
                        sx={{ background: 'white' }}
                        label={field.label || field.title}
                        value={field.value}
                        onChange={e => handleFieldChange(index, 'value', revereAmount(e.target.value))}
                      />
                    </>
                  )}
                  {field.input_type === 'text' && (
                    <TextField
                      sx={{
                        background: 'white',
                        borderRadius: '8px',
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '8px'
                        }
                      }}
                      label={field.label || field.title}
                      multiline
                      minRows={3}
                      value={field.value}
                      onChange={e => handleFieldChange(index, 'value', e.target.value)}
                    />
                  )}
                  {field.input_type === 'question' && (
                    <FormControl component='fieldset' variant='standard'>
                      <FormLabel component='legend'>{field.question || field.title}</FormLabel>
                      <FormGroup>
                        {field?.question_variants &&
                          field?.question_variants.map((variant, vIndex: any) => (
                            <FormControlLabel
                              key={variant.id}
                              control={
                                <Checkbox
                                  checked={field.checkedVariants?.includes(vIndex) || false}
                                  onChange={e => {
                                    const isChecked = e.target.checked
                                    setFields((prev: any) => {
                                      const updated = [...prev]
                                      const selected = updated[index].checkedVariants || []
                                      if (isChecked) {
                                        selected.push(vIndex)
                                      } else {
                                        const i = selected.indexOf(vIndex)
                                        if (i !== -1) selected.splice(i, 1)
                                      }
                                      updated[index].checkedVariants = [...selected]
                                      return updated
                                    })
                                  }}
                                />
                              }
                              label={variant.value}
                            />
                          ))}
                      </FormGroup>
                    </FormControl>
                  )}
                </FormControl>
              ))}

              <Button variant='contained' fullWidth>
                {sentButtonLabel}
              </Button>
            </Card>
          </Box>
        </Card>
      </Box>
    </Box>
  )
}

export default FormUi
