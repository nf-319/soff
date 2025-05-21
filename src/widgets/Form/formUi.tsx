import { revereAmount } from '@/components/amount-input'
import PhoneInput from '@/components/phone-input'
import {
  Box,
  Button,
  Card,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  InputLabel, Radio, Switch,
  TextField, Tooltip,
  Typography
} from '@mui/material'
import Image from 'next/image'
import { FieldType } from '@/pages/settings/forms/create'
import { useState } from 'react'
import { CircleCheck } from 'lucide-react'

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
  companyInfoLogo: string,
  fontFamily: string,
  fontSize: string,
  textColor: string,
  successText: string,
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
  setFields,
  successText,
  fontFamily,
  fontSize,
  textColor
}: Props) => {

  const [end, setEnd] = useState(false)
  const isMobile = displayMode === 'phone'

  return (
    <Box sx={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', gap: 5, position: 'relative' }}>
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
                maxHeight: 500,
                backgroundColor: bg_color
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 100,
                  transition: 'height 0.3s ease-in-out',
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
                    transition: 'height 0.3s ease-in-out',
                    height: isMobile ? '60px' : '100px',
                    objectFit: 'cover'
                  }}
                />
              </Box>
              <Typography
                color={textColor}
                fontWeight={600}
                fontSize={fontSize}
                fontFamily={fontFamily}
                style={{
                  transition: 'font-size 0.3s ease, font-family 0.3s ease'
                }}
              >
                {formName}
              </Typography>

              {!end ? (
                <>
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
                              field?.question_variants.map((variant: any, vIndex: number) => (
                                <FormControlLabel
                                  key={variant.id}
                                  control={
                                    field?.question_type === 'single' ? (
                                      <Radio
                                        checked={field.checkedVariants?.[0] === vIndex}
                                        onChange={() => {
                                          setFields((prev: any) => {
                                            const updated = [...prev]
                                            updated[index].checkedVariants = [vIndex]
                                            return updated
                                          })
                                        }}
                                      />
                                    ) : (
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
                                    )
                                  }
                                  label={variant.value}
                                />
                              ))}
                          </FormGroup>
                        </FormControl>
                      )}
                    </FormControl>
                  ))}

                  <Button variant='contained' fullWidth onClick={() => setEnd(true)}>
                    {sentButtonLabel}
                  </Button>
                </>
              ) : (
                <>
                  <Typography fontSize='18px' textAlign='center' fontFamily={fontFamily}>
                    {successText}
                  </Typography>
                  <CircleCheck fill='#008000' color='#fff' size={100} />
                </>
              )}
            </Card>
          </Box>
        </Card>

        <Box sx={{ position: 'absolute', top: 5, left: 5 }}>
          <Tooltip title="Yakuniy natijani ko'rsatish">
            <Switch checked={end} onChange={e => setEnd(e.target.checked)} />
          </Tooltip>
        </Box>
      </Box>
    </Box>
  )
}

export default FormUi
