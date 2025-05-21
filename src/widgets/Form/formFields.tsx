import api from '@/@core/utils/api'
import { useGet } from '@/hooks/useApi'
import { VisuallyHiddenInput } from '@/views/apps/mentors/AddMentorsModal'
import { LoadingButton } from '@mui/lab'
import { v4 as uuidv4 } from 'uuid';
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
import { Plus, PlusCircle, Trash, Trash2, Upload } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { Dispatch, SetStateAction, SyntheticEvent, useEffect, useState } from 'react'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { FieldType } from '@/pages/settings/forms/create'

type Props = {
  is_update?: boolean
  formName: string
  setFormName: (val: string) => void
  fields: FieldType[]
  sentButtonLabel: string
  logoImg: any
  bg_img: any
  setFields: (val: any) => void
  handleFieldChange: any
  setSendButtonLabel: (str: any) => void
  bg_color: string
  displayName?: 'computer' | 'tablet' | 'phone'
  setBgColor: (val: string) => void
  companyInfoLogo: string
  setLogoImg: (str: string | null) => void
  setBgImg: (str: string | null) => void
  fontFamily: string
  fontSize: string
  textColor: string
  setFontFamily: Dispatch<SetStateAction<string>>
  setTextColor: Dispatch<SetStateAction<string>>
  setFontSize: Dispatch<SetStateAction<string>>
  successText: string
  setSuccessText: Dispatch<SetStateAction<string>>
  setOpen: Dispatch<SetStateAction<'input' | 'description' | 'single' | null>>
}

const FormFields = ({
  handleFieldChange,
  formName,
  fields,
  sentButtonLabel,
  bg_img,
  is_update,
  bg_color,
  setBgColor,
  displayName,
  setBgImg,
  setLogoImg,
  setOpen,
  logoImg,
  setSendButtonLabel,
  setFields,
  setFormName,
  fontFamily,
  fontSize,
  textColor,
  setFontFamily,
  setFontSize,
  setTextColor,
  setSuccessText,
  successText,
  companyInfoLogo
}: Props) => {
  const [isElement, setIsElement] = useState(true)
  const { data: departments } = useGet(`leads/department/list/`)
  const { data: sources } = useGet('leads/source/')
  const { t } = useTranslation()
  const { query, push } = useRouter()
  const [departmentValue, setDepartmentValue] = useState<number | null>(null)
  const [sourceValue, setSourceValue] = useState<number | null>(null)

  const [isLoading, setIsLoading] = useState(false)
  const [value, setValue] = useState('one')
  const [isOuterExpanded, setIsOuterExpanded] = useState<boolean>(false)
  const [expandedFieldIndex, setExpandedFieldIndex] = useState<number | null>(null)

  const { data: formDetail, refetch } = useGet(`leads/form/detail/${String(query?.id)}/`, {
    options: { enabled: !!query?.id && !!is_update }
  })

  useEffect(() => {
    if (is_update && formDetail) {
      setFields(formDetail?.form_questions)
      setDepartmentValue(formDetail?.department)
      setSourceValue(formDetail?.source)
      setBgImg(formDetail?.background_image)
      setLogoImg(formDetail?.logo)
      setFormName(formDetail.title)
    }
  }, [formDetail])

  useEffect(() => {
    void refetch()
  }, [query.id])

  const handleCreateForm = async () => {
    setIsLoading(true)
    try {
      const payload = {
        title: formName,
        department: departmentValue,
        source: sourceValue,
        form_questions: fields,
        extra_data: {
          sent_button_label: sentButtonLabel,
          success_text: successText,
          font_family: fontFamily,
          font_size: fontSize,
          text_color: textColor
        }
      }
      await api.post('leads/form/create/', payload).then(res => {
        if (res.status == 201) {
          if (logoImg || bg_img) {
            const formData = new FormData()
            if (logoImg instanceof File) {
              formData.append('logo', logoImg)
            }
            if (bg_img instanceof File) {
              formData.append('background_image', bg_img)
            }
            formData.append('form', res.data.id)
            api.post('leads/form/file/', formData)
          }
        }
      })
      toast.success('Forma yaratildi')
      push('/settings/forms')
    } catch (err: any) {
      console.error(err)
      toast.error(err.response?.data?.msg || "Ma'lumotlarni to'liq kiriting")
    }
    setIsLoading(false)
  }

  const handleUpdateForm = async () => {
    setIsLoading(true)
    try {
      const payload = {
        title: formName,
        department: departmentValue,
        source: sourceValue,
        form_questions: fields,
        extra_data: {
          sent_button_label: sentButtonLabel,
          success_text: successText,
          font_family: fontFamily,
          font_size: fontSize,
          text_color: textColor
        }
      }
      await api.patch(`leads/form/update/${query.id}/`, payload).then(res => {
        if (res.status == 200) {
          if (logoImg || bg_img) {
            const formData = new FormData()
            if (logoImg instanceof File) {
              formData.append('logo', logoImg)
            }
            if (bg_img instanceof File) {
              formData.append('background_image', bg_img)
            }
            formData.append('form', res.data.id)
            api.post('leads/form/file/', formData)
          }
        }
      })
      toast.success('Forma yaratildi')
      push('/settings/forms')
    } catch (err: any) {
      console.error(err)
      toast.error(err.response?.data?.msg || "Ma'lumotlarni to'liq kiriting")
    }
    setIsLoading(false)
  }

  const handleAddField = (input_type: FieldType['input_type']) => {
    const newField: FieldType = {
      input_type,
      label: input_type === 'text' ? 'Yangi matn' : input_type === 'question' ? 'Yangi savol' : 'Yangi input',
      title: input_type === 'input' ? 'Yangi input' : input_type === 'text' ? 'Yangi Matn' : 'Yangi savol',
      is_required: false,
      ...(input_type === 'question'
        ? {
            question: 'Yangi savol',
            question_variants: [
              {
                id: uuidv4(),
                order: 1,
                value: 'variant 1'
              }
            ]
          }
        : { value: '' })
    }
    setFields([...fields, newField])
  }

  const handleChange = (event: SyntheticEvent, newValue: string) => {
    setValue(newValue)
  }

  const handleVariantChange = (fieldIndex: number, variantIndex: number, val: string) => {
    const updated = [...fields]
    updated[fieldIndex].question_variants![variantIndex] = {
      ...updated[fieldIndex].question_variants![variantIndex],
      value: val
    }
    setFields(updated)
  }

  const addVariant = (fieldIndex: number) => {
    const updated = [...fields]
    const variants = updated[fieldIndex].question_variants || []
    const newVariant = {
      id: uuidv4(),
      order: variants.length + 1,
      value: `Yangi variant ${variants.length + 1}`
    }
    updated[fieldIndex].question_variants = [...variants, newVariant]
    setFields(updated)
  }

  const handleDragEnd = (result: any) => {
    if (!result.destination) return
    const items = Array.from(fields)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)
    setFields(items)
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
    if (expandedFieldIndex === index) {
      setExpandedFieldIndex(null)
    }
  }

  const handleOuterAccordionChange = () => {
    setIsOuterExpanded(!isOuterExpanded)
  }

  const handleFieldAccordionChange = (index: number) => () => {
    setExpandedFieldIndex(expandedFieldIndex === index ? null : index)
  }

  return (
    <Card
      sx={{
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 'none',
        gap: 3,
        width: '100%',
        height: '100%',
        boxShadow: 'none'
      }}
    >
      <Box display='flex' mt={1} gap={{ xs: 2, md: displayName === 'computer' ? 2 : 3 }}>
        <Button fullWidth onClick={() => setIsElement(true)} variant={isElement ? 'contained' : 'outlined'}>
          Elementlar
        </Button>
        <Button fullWidth onClick={() => setIsElement(false)} variant={isElement ? 'outlined' : 'contained'}>
          Dizayn
        </Button>
      </Box>

      {isElement ? (
        <Box display={'flex'} flexDirection={'column'} gap={5}>
          <Box display={'flex'} gap={3}>
            <FormControl fullWidth>
              <InputLabel size='small' id='user-view-language-label'>
                {t("Bo'lim")}
              </InputLabel>
              <Select
                size='small'
                id='user-view-language'
                label="Bo'lim"
                labelId='user-view-language-label'
                name='department'
                value={departmentValue}
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
                value={sourceValue}
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
          <Box display='flex' gap={2} width='100%'>
            <Button
              fullWidth
              variant='outlined'
              onClick={() => setOpen('input')}
              startIcon={<PlusCircle size={15} />}
            >
              Input
            </Button>

            <Button
              fullWidth
              variant='outlined'
              onClick={() => setOpen('single')}
              startIcon={<PlusCircle size={15} />}
            >
              Savol
            </Button>

            <Button
              fullWidth
              variant='outlined'
              onClick={() => setOpen('description')}
              startIcon={<PlusCircle size={15} />}
            >
              Matn
            </Button>
          </Box>

          <Accordion
            expanded={isOuterExpanded}
            onChange={handleOuterAccordionChange}
            sx={{ border: '1px solid #e0e0e0', borderRadius: 1, boxShadow: 'none', overflow: 'hidden' }}
            variant='outlined'
          >
            <AccordionSummary expandIcon={<GridExpandMoreIcon />} aria-controls='panel1-content' id='panel1-header'>
              <Typography>Formalar</Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ borderTop: '1px solid #e0e0e0' }}>
              {!fields.length ? (
                <Typography textAlign={'center'}>Ma'lumot yo'q</Typography>
              ) : (
                <DragDropContext onDragEnd={handleDragEnd}>
                  <Droppable droppableId='fields'>
                    {provided => (
                      <div {...provided.droppableProps} ref={provided.innerRef}>
                        {fields.map((field, index) => (
                          <Draggable key={index} draggableId={String(index)} index={index}>
                            {provided => (
                              <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                                <Accordion
                                  expanded={expandedFieldIndex === index}
                                  onChange={handleFieldAccordionChange(index)}
                                  sx={{
                                    marginY: 4,
                                    border: '1px solid #e0e0e0',
                                    borderRadius: 1,
                                    boxShadow: 'none',
                                    overflow: 'hidden'
                                  }}
                                >
                                  <AccordionSummary
                                    expandIcon={<GridExpandMoreIcon />}
                                    sx={{ display: 'flex', justifyContent: 'space-between' }}
                                  >
                                    <Box display='flex' alignItems='center' justifyContent='space-between' width='100%'>
                                      <Typography>{field.title}</Typography>
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
                                    {(field.input_type === 'input' || field.input_type === 'phone') && (
                                      <TextField
                                        fullWidth
                                        label='Label'
                                        value={field.label}
                                        onChange={e => handleFieldChange(index, 'label', e.target.value)}
                                      />
                                    )}
                                    <FormControlLabel
                                      control={
                                        <Checkbox
                                          checked={field.is_required}
                                          onChange={e => handleFieldChange(index, 'is_required', e.target.checked)}
                                          color='primary'
                                        />
                                      }
                                      label='Majburiy'
                                      sx={{ mt: 2 }}
                                    />

                                    {field.input_type === 'text' && (
                                      <TextField
                                        fullWidth
                                        multiline
                                        minRows={3}
                                        label={field.label}
                                        value={field.label}
                                        onChange={e => handleFieldChange(index, 'label', e.target.value)}
                                      />
                                    )}

                                    {field.input_type === 'question' && (
                                      <Box>
                                        <TextField
                                          fullWidth
                                          label='Savol'
                                          value={field.question || field.title}
                                          onChange={e => handleFieldChange(index, 'question', e.target.value)}
                                          sx={{ mb: 2 }}
                                        />
                                        {field.question_variants?.map((variant: any, vIndex: any) => (
                                          <Box display='flex' alignItems='center' gap={1} mb={3} key={vIndex}>
                                            <TextField
                                              fullWidth
                                              label={`Variant ${vIndex + 1}`}
                                              value={variant.value}
                                              onChange={e => handleVariantChange(index, Number(vIndex), e.target.value)}
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
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>
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
          </Box>
        </Box>
      ) : (
        <Box display={'flex'} flexDirection={'column'} gap={5}>
          <Tabs
            value={value}
            onChange={handleChange}
            variant='fullWidth'
            aria-label='basic tabs example'
            sx={{
              marginBottom: 3,
              minHeight: 40,
              height: 40
            }}
          >
            <Tab
              value='one'
              label='Fon'
              sx={{
                padding: 0,
                minHeight: 40,
                height: 40,
                fontSize: 14
              }}
            />
            <Tab
              value='two'
              label='Logotip'
              sx={{
                padding: 0,
                minHeight: 40,
                height: 40,
                fontSize: 14
              }}
            />
            <Tab
              value='three'
              label='Yozuv uslubi'
              sx={{
                padding: 0,
                minHeight: 40,
                height: 40,
                fontSize: 14
              }}
            />
          </Tabs>

          {value === 'one' ? (
            <Box>
              <Box display='flex' gap={3} flexDirection={{ xs: 'column', md: 'row' }}>
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
                  <Typography sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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
                  <Typography sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    Och
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
                  <Image
                    priority={false}
                    src={bg_img ? URL.createObjectURL(bg_img) : '/images/request-form-bg.webp'}
                    alt='Yuklangan rasm'
                    width={180}
                    height={180}
                    unoptimized
                    style={{ objectFit: 'cover', borderRadius: '8px' }}
                  />
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
                      setBgImg(e.target.files[0])
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
          ) : value === 'two' ? (
            <Box>
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
                    width={180}
                    height={180}
                    unoptimized
                    style={{ objectFit: 'cover', borderRadius: '8px' }}
                  />
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
                      setLogoImg(e.target.files[0])
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
            </Box>
          ) : (
            <Box display='flex' flexDirection='column' gap={5}>
              <Box display='flex' gap={3}>
                <FormControl fullWidth>
                  <InputLabel size='small' id='font-family-label'>
                    Shrift
                  </InputLabel>
                  <Select
                    labelId='font-family-label'
                    id='font-family'
                    size='small'
                    value={fontFamily}
                    label='Shrift'
                    onChange={e => setFontFamily(e.target.value)}
                  >
                    <MenuItem value='Inter'>Inter</MenuItem>
                    <MenuItem value="'Poppins', sans-serif">Poppins</MenuItem>
                    <MenuItem value='Roboto'>Roboto</MenuItem>
                    <MenuItem value='Arial'>Arial</MenuItem>
                  </Select>
                </FormControl>

                <FormControl fullWidth>
                  <InputLabel size='small' id='font-size-label'>
                    O‘lcham
                  </InputLabel>
                  <Select
                    size='small'
                    label='O‘lcham'
                    id='font-size'
                    labelId='font-size-label'
                    value={fontSize}
                    onChange={e => setFontSize(e.target.value)}
                  >
                    <MenuItem value='16px'>Kichik</MenuItem>
                    <MenuItem value='20px'>O‘rta</MenuItem>
                    <MenuItem value='24px'>Katta</MenuItem>
                  </Select>
                </FormControl>
              </Box>
              <Typography>Matn rangi</Typography>
              <Box display={'flex'} gap={3}>
                <TextField
                  size='small'
                  value={textColor}
                  sx={{ maxWidth: 70 }}
                  onChange={e => setTextColor(e.target.value)}
                  fullWidth
                  type='color'
                />
                <TextField size='small' value={textColor} onChange={e => setTextColor(e.target.value)} fullWidth />
              </Box>
            </Box>
          )}
        </Box>
      )}

      <Box mt='auto'>
        <LoadingButton
          onClick={is_update ? handleUpdateForm : handleCreateForm}
          loading={isLoading}
          variant='contained'
          fullWidth
        >
          {is_update ? 'Saqlash' : 'Yaratish'}
        </LoadingButton>
      </Box>
    </Card>
  )
}

export default FormFields
