import PhoneInput from '@/components/phone-input'
import { useGet } from '@/hooks/useApi'
import { useAppSelector } from '@/store'
import { VisuallyHiddenInput } from '@/views/apps/mentors/AddMentorsModal'
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Card,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Tab,
  Tabs,
  TextField,
  Typography
} from '@mui/material'
import { GridExpandMoreIcon } from '@mui/x-data-grid'
import { Image as ImageIcon, LaptopMinimal, Plus, PlusCircle, Smartphone, Trash, Trash2, Upload } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

type FieldType = {
  type: 'input' | 'text' | 'question' | 'phone'
  label: string
  name: string
  value?: string
  question?: string
  variants?: string[]
  checkedVariants?: string[]
  question_variants?: any[]
}

const NewCreate = () => {
  const [isElement, setIsElement] = useState(true)
  const { t } = useTranslation()
  const [departmentValue, setDepartmentValue] = useState<number | null>(null)
  const [sourceValue, setSourceValue] = useState<number | null>(null)
  const [formName, setFormName] = useState<string | null>(null)
  const { push } = useRouter()
  const [successText, setSuccessText] = useState<string>(
    "So'rovingiz muvaffaqiyatli yuborildi! Tez orada siz bilan bog'lanamiz."
  )
  const [displayMode, setDisplayMode] = useState<'computer' | 'tablet' | 'phone'>('computer')
  const { companyInfo } = useAppSelector(state => state.user)
  const [bg_img, setBgImg] = useState<string | null>(null)
  const [logoImg, setLogoImg] = useState<string | null>(null)
  const [bg_color, setBgColor] = useState<string>('#f9f9fb')
  const [sentButtonLabel, setSendButtonLabel] = useState<string>('Yuborish')
  const { data: departments } = useGet(`leads/department/list/`)
  const { data: sources } = useGet('leads/source/')
  const [fields, setFields] = useState<FieldType[]>([
    { type: 'input', label: 'Ism', name: 'Ism', value: '' },
    { type: 'phone', label: 'Telefon', name: 'Telefon', value: '' }
  ])

  const handleAddField = (type: FieldType['type']) => {
    const newField: FieldType = {
      type,
      label: type === 'text' ? 'Yangi matn' : type === 'question' ? 'Yangi savol' : 'Yangi input',
      name: type === 'input' ? 'Yangi input' : type === 'text' ? 'Yangi Matn' : 'Yangi savol',
      ...(type === 'question'
        ? {
            question: 'Yangi savol',
            question_variants: [
              {
                id: crypto.randomUUID(),
                order: 1,
                value: 'variant 1'
              }
            ]
          }
        : { value: '' })
    }

    setFields([...fields, newField])
  }

  const [value, setValue] = useState('one')

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue)
  }

  const handleFieldChange = (index: number, key: keyof FieldType, val: any) => {
    const updated = [...fields]
    // @ts-ignore
    updated[index][key] = val
    setFields(updated)
  }

  const handleVariantChange = (fieldIndex: number, variantIndex: number, val: string) => {
    const updated = [...fields]
    updated[fieldIndex].variants![variantIndex] = val
    setFields(updated)
  }

  const addVariant = (fieldIndex: number) => {
    const updated = [...fields]
    const variants = updated[fieldIndex].question_variants || []
    const newVariant = {
      id: crypto.randomUUID(),
      order: variants.length,
      value: `Yangi variant ${variants.length + 1}`
    }
    updated[fieldIndex].question_variants = [...variants, newVariant]
    console.log(updated)

    setFields(updated)
  }

  const removeVariant = (fieldIndex: number, variantIndex: number) => {
    const updated = [...fields]
    updated[fieldIndex].question_variants!.splice(variantIndex, 1)
    setFields(updated)
  }
  const removeField = (index: number) => {
    const updated = [...fields]
    updated.splice(index, 1)
    setFields(updated)
  }

  return (
    <Card sx={{ boxShadow: 'none', border: '1px solid lightgray', padding: 5 }}>
      <Box display={'flex'} alignItems={'center'} justifyContent={'space-between'}>
        <Typography variant='h5'>Forma yaratish</Typography>
        <Card sx={{width:'100%',maxWidth:650, padding: 2, display: 'flex', justifyContent: 'center', gap: 2 }}>
          <Button
            onClick={() => setDisplayMode('phone')}
            startIcon={<Smartphone size={20} />}
            size='medium'
            variant={displayMode == 'phone' ? 'contained' : 'outlined'}
          >
            Telefon
          </Button>
          <Button
            onClick={() => setDisplayMode('tablet')}
            startIcon={<Smartphone size={20} />}
            size='medium'
            variant={displayMode == 'tablet' ? 'contained' : 'outlined'}
          >
            Planshet
          </Button>
          <Button
            onClick={() => setDisplayMode('computer')}
            startIcon={<LaptopMinimal size={20} />}
            size='medium'
            variant={displayMode == 'computer' ? 'contained' : 'outlined'}
          >
            Kompyuter
          </Button>
        </Card>
      </Box>
      <Box sx={{ marginTop: 5 }} display={'flex'} flexDirection={{ xs: 'column', md: 'row' }} gap={5}>
        <Card
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 5,
            width: '100%',
            boxShadow: 'none',
            border: '1px solid lightgray',
            padding: 5
          }}
        >
          <Box display={'flex'} gap={5}>
            <Button fullWidth onClick={() => setIsElement(true)} variant={isElement ? 'contained' : 'outlined'}>
              Elementlar
            </Button>
            <Button fullWidth onClick={() => setIsElement(false)} variant={isElement ? 'outlined' : 'contained'}>
              {' '}
              Dizayn
            </Button>
          </Box>
          {isElement ? (
            <Box display={'flex'} flexDirection={'column'} gap={5}>
              <Box display={'flex'} gap={5}>
                <FormControl fullWidth>
                  <InputLabel size='small' id='user-view-language-label'>
                    {t("Bo'lim")}
                  </InputLabel>
                  <Select
                    size='small'
                    label={t("Bo'lim")}
                    id='user-view-language'
                    labelId='user-view-language-label'
                    name='department'
                    defaultValue={''}
                    onChange={e => setDepartmentValue(Number(e.target.value))}
                  >
                    {departments?.map((item: any) => (
                      <MenuItem key={item.id} value={item.id}>
                        {item.name}
                      </MenuItem>
                    ))}
                    <MenuItem sx={{ fontWeight: 600 }} onClick={() => push('/lids')}>
                      {t('Yangi yaratish')}
                      <Plus size={18} />
                    </MenuItem>
                  </Select>
                </FormControl>

                <FormControl fullWidth>
                  <InputLabel size='small' id='fsdgsdgsgsdfsd-label'>
                    {t('Manba')}
                  </InputLabel>
                  <Select
                    size='small'
                    label={t('Manba')}
                    id='fsdgsdgsgsdfsd'
                    labelId='fsdgsdgsgsdfsd-label'
                    name='source'
                    onChange={(e: any) => setSourceValue(e?.target?.value)}
                    sx={{ mb: 1 }}
                  >
                    {sources?.results.map((lead: any) => (
                      <MenuItem key={lead.id} value={lead.id}>
                        {lead.name}
                      </MenuItem>
                    ))}
                    <MenuItem sx={{ fontWeight: 600 }} onClick={() => push('/lids/stats')}>
                      {t('Yangi yaratish')}
                      <Plus size={18} />
                    </MenuItem>
                  </Select>
                </FormControl>
              </Box>
              <FormControl fullWidth>
                <TextField
                  size='small'
                  onChange={e => setFormName(e.target.value)}
                  value={formName}
                  label='Forma nomini kiriting'
                  id='input-form'
                />
              </FormControl>
              <Box display={'flex'} gap={2}>
                <Button variant='outlined' onClick={() => handleAddField('input')} startIcon={<PlusCircle size={15} />}>
                  Input
                </Button>
                <Button
                  variant='outlined'
                  onClick={() => handleAddField('question')}
                  startIcon={<PlusCircle size={15} />}
                >
                  Savol
                </Button>
                <Button variant='outlined' onClick={() => handleAddField('text')} startIcon={<PlusCircle size={15} />}>
                  Matn
                </Button>
              </Box>
              <Accordion>
                <AccordionSummary expandIcon={<GridExpandMoreIcon />} aria-controls='panel1-content' id='panel1-header'>
                  <Typography>Formalar</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  {!fields.length ? (
                    <Typography textAlign={'center'}>Ma'lumot yo'q</Typography>
                  ) : (
                    fields.map((field, index) => (
                      <Accordion sx={{ marginY: 4 }} key={index}>
                        <AccordionSummary
                          expandIcon={<GridExpandMoreIcon />}
                          sx={{ display: 'flex', justifyContent: 'space-between' }}
                        >
                          <Box display='flex' alignItems='center' justifyContent='space-between' width='100%'>
                            <Typography>{field.name}</Typography>
                            <IconButton
                              onClick={e => {
                                e.stopPropagation()
                                removeField(index)
                              }}
                              color='error'
                            >
                              <Trash2 size={18} />
                            </IconButton>
                          </Box>
                        </AccordionSummary>

                        <AccordionDetails>
                          {field.type === 'input' && (
                            <TextField
                              fullWidth
                              label={'Label'}
                              value={field.label}
                              onChange={e => handleFieldChange(index, 'label', e.target.value)}
                            />
                          )}
                          {field.type === 'phone' && (
                            <TextField
                              fullWidth
                              label={'Label'}
                              value={field.label}
                              onChange={e => handleFieldChange(index, 'label', e.target.value)}
                            />
                          )}

                          {field.type === 'text' && (
                            <TextField
                              fullWidth
                              multiline
                              minRows={3}
                              label={field.label}
                              value={field.label}
                              onChange={e => handleFieldChange(index, 'label', e.target.value)}
                            />
                          )}

                          {field.type === 'question' && (
                            <Box>
                              <TextField
                                fullWidth
                                label='Savol'
                                value={field.question}
                                onChange={e => handleFieldChange(index, 'question', e.target.value)}
                                sx={{ mb: 2 }}
                              />
                              {field.question_variants?.map((variant, vIndex) => (
                                <Box display='flex' alignItems='center' gap={1} mb={3} key={vIndex}>
                                  <TextField
                                    fullWidth
                                    label={`Variant ${vIndex + 1}`}
                                    value={variant.value}
                                    onChange={e => handleVariantChange(index, vIndex, e.target.value)}
                                  />
                                  <IconButton onClick={() => removeVariant(index, vIndex)} color='error'>
                                    <Trash2 size={18} />
                                  </IconButton>
                                </Box>
                              ))}
                              <Button
                                onClick={() => addVariant(index)}
                                size='small'
                                startIcon={<PlusCircle size={14} />}
                              >
                                Variant qo‘shish
                              </Button>
                            </Box>
                          )}
                        </AccordionDetails>
                      </Accordion>
                    ))
                  )}
                </AccordionDetails>
              </Accordion>
              <Box display={'flex'} flexDirection={'column'} gap={5}>
                <FormControl>
                  <TextField
                    size='small'
                    label='Yuborish tugmasi matni'
                    value={sentButtonLabel}
                    onChange={e => setSendButtonLabel(e.target.value)}
                  />
                </FormControl>
                <FormControl>
                  <TextField
                    label={"Muvaffaqiyatli yuborilgandan so'ng ko'rsatiladigan matn"}
                    multiline
                    minRows={3}
                    value={successText}
                    onChange={e => setSuccessText(e.target.value)}
                  />
                </FormControl>
                <Button variant='contained'>Yaratish</Button>
              </Box>
            </Box>
          ) : (
            <Box>
              <Tabs value={value} onChange={handleChange} variant='fullWidth' aria-label='basic tabs example'>
                <Tab value='one' label='Fon' />
                <Tab value='two' label='Logotip' />
              </Tabs>
              {value == 'one' ? (
                <Box>
                  <Typography variant='h6' sx={{ paddingY: 2 }}>
                    Fon
                  </Typography>
                  <Box display={'flex'} gap={3} flexDirection={{ xs: 'column', md: 'row' }}>
                    <Card
                      onClick={() => setBgColor('#f9f9fb')}
                      sx={{
                        height: 100,
                        border: `2px solid ${bg_color == '#f9f9fb' ? '#4361ee' : 'lightgray'}`,

                        cursor: 'pointer',
                        width: '100%',
                        boxShadow: 'none',
                        background: '#f9f9fb'
                      }}
                    >
                      <Typography
                        sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      >
                        Och kulirang
                      </Typography>
                    </Card>
                    <Card
                      onClick={() => setBgColor('#ffffff')}
                      sx={{
                        height: 100,
                        border: `2px solid ${bg_color == '#ffffff' ? '#4361ee' : 'lightgray'}`,
                        cursor: 'pointer',
                        width: '100%',
                        boxShadow: 'none',
                        background: '#ffffff'
                      }}
                    >
                      <Typography
                        sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      >
                        Och
                      </Typography>
                    </Card>
                    <Card
                      onClick={() => setBgColor('#dadadd')}
                      sx={{
                        height: 100,
                        border: `2px solid ${bg_color == '#dadadd' ? '#4361ee' : 'lightgray'}`,
                        cursor: 'pointer',
                        width: '100%',
                        boxShadow: 'none',
                        background: '#dadadd'
                      }}
                    >
                      <Typography
                        sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      >
                        Och gradient
                      </Typography>
                    </Card>
                  </Box>
                  <Typography sx={{ paddingY: 2 }}>Maxsus rang</Typography>
                  <Box display={'flex'} gap={3}>
                    <TextField
                      size='small'
                      value={bg_color}
                      sx={{ maxWidth: 70 }}
                      onChange={e => setBgColor(e.target.value)}
                      fullWidth
                      type='color'
                    />
                    <TextField
                      size='small'
                      value={bg_color}
                      onChange={e => setBgColor(e.target.value || '#f9f9fb')}
                      fullWidth
                    />
                  </Box>
                  <Typography sx={{ paddingY: 2 }}>Fon rasmi</Typography>
                  <Box
                    sx={{
                      borderRadius: 1,
                      paddingY: 5,
                      border: '1px solid lightgray',
                      display: 'flex',
                      gap: 5,
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <Card
                      sx={{
                        width: 180,
                        height: 180,
                        boxShadow: 'none',
                        background: 'lightgray',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      {bg_img ? (
                        <Image
                          priority={false}
                          src={bg_img}
                          alt='Yuklangan rasm'
                          width={180}
                          height={180}
                          unoptimized
                          style={{ objectFit: 'cover', borderRadius: '8px' }}
                        />
                      ) : (
                        <Image
                          priority={false}
                          src={'/images/request-form-bg.webp'}
                          alt='Yuklangan rasm'
                          width={180}
                          height={180}
                          unoptimized
                          style={{ objectFit: 'cover', borderRadius: '8px' }}
                        />
                      )}
                    </Card>
                    <Button
                      sx={{ maxWidth: 180 }}
                      fullWidth
                      component='label'
                      role={undefined}
                      variant='contained'
                      tabIndex={-1}
                      size='small'
                      startIcon={<Upload size={15} />}
                    >
                      {t('Yangilash')}
                      <VisuallyHiddenInput
                        type='file'
                        onChange={(e: any) => {
                          setBgImg(URL.createObjectURL(e.target.files[0]))
                        }}
                      />
                    </Button>
                    {bg_img && (
                      <Button
                        size='small'
                        sx={{ maxWidth: 180 }}
                        fullWidth
                        onClick={() => setBgImg(null)}
                        variant='outlined'
                        startIcon={<Trash size={15} />}
                      >
                        O'chirish
                      </Button>
                    )}
                  </Box>
                </Box>
              ) : (
                <>
                  <Box
                    sx={{
                      borderRadius: 1,
                      marginY: 5,
                      paddingY: 5,
                      border: '1px solid lightgray',
                      display: 'flex',
                      gap: 5,
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <Card
                      sx={{
                        width: 180,
                        height: 180,
                        boxShadow: 'none',
                        background: 'lightgray',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      {logoImg ? (
                        <Image
                          priority={false}
                          src={logoImg}
                          alt='Yuklangan rasm'
                          width={180}
                          height={180}
                          unoptimized
                          style={{ objectFit: 'cover', borderRadius: '8px' }}
                        />
                      ) : (
                        <Image
                          priority={false}
                          src={companyInfo.logo}
                          alt='Yuklangan rasm'
                          width={180}
                          height={180}
                          unoptimized
                          style={{ objectFit: 'cover', borderRadius: '8px' }}
                        />
                      )}
                    </Card>
                    <Button
                      sx={{ maxWidth: 180 }}
                      fullWidth
                      component='label'
                      role={undefined}
                      variant='contained'
                      tabIndex={-1}
                      size='small'
                      startIcon={<Upload size={15} />}
                    >
                      {t('Yangilash')}
                      <VisuallyHiddenInput
                        type='file'
                        onChange={(e: any) => {
                          setLogoImg(URL.createObjectURL(e.target.files[0]))
                        }}
                      />
                    </Button>
                    {logoImg && (
                      <Button
                        size='small'
                        sx={{ maxWidth: 180 }}
                        fullWidth
                        onClick={() => setLogoImg(null)}
                        variant='outlined'
                        startIcon={<Trash size={15} />}
                      >
                        O'chirish
                      </Button>
                    )}
                  </Box>
                </>
              )}
            </Box>
          )}
        </Card>
        <Box></Box>
        <Box sx={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', gap: 5 }}>
          <Box display={'flex'} alignItems={'center'} justifyContent={'center'}>
            <Card
              sx={{
                backgroundImage: `url(${bg_img || '/images/request-form-bg.webp'})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                backgroundColor: bg_color || 'lightgray',
                width: '100%',
                height: '100%',
                display: 'flex',
                justifyContent: 'center',
                maxWidth: displayMode == 'phone' ? 300 : displayMode == 'tablet' ? 500 : 'auto',
                boxShadow: 'none',
                border: '1px solid lightgray',
                padding: 5
              }}
            >
              <Card
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 5,
                  padding: 5,
                  width: 300,
                  backgroundColor: bg_color
                }}
              >
                <Box
                  sx={{
                    borderRadius: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'lightgray',
                    width: 100,
                    height: 100
                  }}
                >
                  {logoImg ? (
                    <Image
                      priority={false}
                      src={logoImg}
                      alt='Yuklangan rasm'
                      width={100}
                      height={100}
                      unoptimized
                      style={{ objectFit: 'cover', borderRadius: '8px' }}
                    />
                  ) : (
                    <Image
                      priority={false}
                      src={companyInfo.logo}
                      alt='Yuklangan rasm'
                      width={100}
                      height={100}
                      unoptimized
                      style={{ objectFit: 'cover', borderRadius: '8px' }}
                    />
                  )}{' '}
                </Box>
                <Typography color='black' fontWeight={600}>
                  Aloqa uchun kontakt
                </Typography>

                {fields.map((field, index) => (
                  <FormControl fullWidth key={index}>
                    {field.type === 'input' && (
                      <TextField
                        sx={{
                          backgroundColor: 'white',
                          borderRadius: '8px', // Fix border radius
                          '& .MuiOutlinedInput-root': {
                            borderRadius: '8px' // Apply to input root as well
                          }
                        }}
                        size='small'
                        type='text'
                        label={field.label}
                        value={field.value}
                        onChange={e => handleFieldChange(index, 'value', e.target.value)}
                      />
                    )}
                    {field.type === 'phone' && (
                      <>
                        <InputLabel shrink>{field.label}</InputLabel>
                        <PhoneInput
                          sx={{ background: 'white' }}
                          label={field.label}
                          value={field.value}
                          onChange={val => handleFieldChange(index, 'value', val)}
                        />
                      </>
                    )}
                    {field.type === 'text' && (
                      <TextField
                        sx={{
                          background: 'white',
                          borderRadius: '8px', // Fix border radius
                          '& .MuiOutlinedInput-root': {
                            borderRadius: '8px'
                          }
                        }}
                        label={field.label}
                        multiline
                        minRows={3}
                        value={field.value}
                        onChange={e => handleFieldChange(index, 'value', e.target.value)}
                      />
                    )}
                    {field.type === 'question' && (
                      <FormControl component='fieldset' variant='standard'>
                        <FormLabel component='legend'>{field.question}</FormLabel>
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
                                      setFields(prev => {
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
            </Card>
          </Box>
        </Box>
      </Box>
    </Card>
  )
}

export default NewCreate
