import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stepper,
  Step,
  StepLabel,
  TextField,
  Button,
  Typography,
  Box,
  FormControl,
  Slider,
  FormHelperText,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  LinearProgress
} from '@mui/material'
import { nextStep, prevStep, setStepText, resetForm, setGrade, setHelpUsed } from '../../store/apps/crm-survey'
import { RootState, useAppDispatch, useAppSelector } from '@/store'
import { useEffect, useState } from 'react'
import { usePost } from '@/hooks/useApi'
import toast from 'react-hot-toast'
import {
  SentimentVeryDissatisfied,
  SentimentDissatisfied,
  SentimentNeutral,
  SentimentSatisfied,
  SentimentVerySatisfied
} from '@mui/icons-material'
import { LoadingButton } from '@mui/lab'

const CrmSurveymodal = () => {
  const [showSurvey, setShowSurvey] = useState(false)

  const dispatch = useAppDispatch()
  const { activeStep, steps, grades, helpUsed } = useAppSelector((state: RootState) => state.crmSurveySlice)
  const [showForm, setShowForm] = useState(false)
  const [error, setError] = useState('')
  const { mutate: feedBackMutate, isPending } = usePost()
  const [showSuccess, setShowSuccess] = useState(false)
  const stepTitle = [
    'CRM tizimidan umumiy qoniqish darajangiz?',
    'Tizimdagi muammolar haqida yozing',
    'Sizga yana qanday funksiyalar kerak?',
    'SOFF CRM siz uchun boshqa tizimlardan nimasi bilan afzal?',
    'Texnik yordam xizmatimizni baholang'
  ]
  const stepLabel = [
    'Nega bu bahoni berdingiz?',
    'Tizimdagi muammolaringizni batafsil yozing',
    'AI hisobotlar,ota-onalar paneli,avtomatik SMS,mobil ilova',
    'Afzalliklarni yozing',
    "Qo'shimcha izohlaringiz bo'lsa yozing"
  ]

  useEffect(() => {
    const now = new Date()
    const isFirstOfMonth = now.getDate() === 1
    const hasSeenSurvey = localStorage.getItem('crm_survey_shown') === now.toDateString()

    if (!isFirstOfMonth && hasSeenSurvey) {
      setShowSurvey(true)
      localStorage.setItem('crm_survey_shown', now.toDateString())
    }
  }, [])

  const handleClose = () => {
    dispatch(resetForm())
    setShowForm(false)
    setShowSuccess(false)
    setShowSurvey(false)
    setError('')
  }

  const handleNext = () => {
    if (!steps[activeStep].trim()) {
      setError('Iltimos, afzalliklarni yozing')
      return
    }
    if ((activeStep === 0 || activeStep === 4) && grades[activeStep as 0 | 4] == null) {
      setError('Bahoni tanlang')
      return
    }
    setError('')
    dispatch(nextStep())
  }

  const handleSubmit = () => {
    if (!steps[activeStep].trim()) {
      setError('Iltimos, afzalliklarni yozing')
      return
    }
    if (grades[4] == null) {
      setError('Bahoni tanlang')
      return
    }
    if (helpUsed == null) {
      setError('Texnik yordam holatini tanlang')
      return
    }

    feedBackMutate(
      'owner/feedback/',
      {
        rating: grades[0],
        rating_description: steps[0],
        weaknesses: steps[1],
        suggestions: steps[2],
        strengths: steps[3],
        technical_support_provided: helpUsed,
        technical_support_rating: grades[4],
        technical_support_comment: steps[4]
      },
      {
        onSuccess: () => {
          setShowSuccess(true)
          toast.success("So'rovingiz yuborildi")
        },
        onError: (err: any) => {
          console.log(err)
          toast.error('Xatolik')
        }
      }
    )
  }

  return (
    <Dialog open={showSurvey} fullWidth maxWidth='sm' sx={{ height: '100%', transition: 'heigth 0.3s ease-in-out' }}>
      {!showSuccess &&
        (!showForm ? (
          <>
            <DialogTitle>
              <Typography variant='h5'>So‘rovnoma</Typography>
            </DialogTitle>
            <DialogContent>
              <Typography fontWeight={700} sx={{ paddingBottom: 3 }} fontSize={22} color={'black'}>
                Salom! Mening ismim Zufarbek. SOFF CRM asoschisiman.
              </Typography>
              <Typography fontWeight={600} fontSize={20} gutterBottom>
                Har oy oxirida sizdan fikr so'raymiz. Ushbu so'rovnomani men shaxsan o'qiyman. Siz bildirgan fikr va
                muammolar asosida tizimni yaxshilaymiz. So'rov so'ngida siz uchun maxsus taklifimiz ham bor.
              </Typography>
            </DialogContent>
            <Box sx={{ padding: 5 }} display={'flex'} flexDirection={'column'} gap={3}>
              <Button fullWidth variant='contained' onClick={() => setShowForm(true)}>
                So'rovnomani boshlash
              </Button>
              <Button variant='outlined' fullWidth onClick={handleClose}>
                Keyinroq
              </Button>
            </Box>
          </>
        ) : (
          <>
            <Box sx={{ position: 'relative' }}>
              <LinearProgress
                variant='determinate'
                value={((activeStep + 1) / 5) * 100}
                sx={{ height: 5, borderRadius: 2 }}
              />
            </Box>

            <DialogTitle>{stepTitle[activeStep]}</DialogTitle>
            <DialogContent>
              {activeStep === 4 && (
                <FormControl margin='normal' error={!!error && helpUsed == null} component='fieldset'>
                  <FormLabel component='legend'>Texnik yordam olganmisiz?</FormLabel>
                  <RadioGroup row value={helpUsed ?? ''} onChange={e => dispatch(setHelpUsed(e.target.value))}>
                    <FormControlLabel value={true} control={<Radio />} label='Ha' />
                    <FormControlLabel value={false} control={<Radio />} label='Yo‘q' />
                  </RadioGroup>
                  {helpUsed == null && <FormHelperText>Tanlang</FormHelperText>}
                </FormControl>
              )}

              <Box display={'flex'} justifyContent={'center'} alignItems={'center'} paddingTop={4}>
                {activeStep === 0 && grades[0] != null && (
                  <>
                    {grades[0] <= 4 ? (
                      <SentimentVeryDissatisfied color='error' sx={{ fontSize: 40 }} />
                    ) : grades[0] <= 6 ? (
                      <SentimentDissatisfied color='warning' sx={{ fontSize: 40 }} />
                    ) : grades[0] <= 8 ? (
                      <SentimentNeutral color='info' sx={{ fontSize: 40 }} />
                    ) : grades[0] <= 9 ? (
                      <SentimentSatisfied color='success' sx={{ fontSize: 40 }} />
                    ) : (
                      <SentimentVerySatisfied color='success' sx={{ fontSize: 40 }} />
                    )}
                  </>
                )}
              </Box>
              <Box display={'flex'} justifyContent={'center'} alignItems={'center'}>
                {activeStep === 4 && grades[4] != null && (
                  <>
                    {grades[4] <= 4 ? (
                      <SentimentVeryDissatisfied color='error' sx={{ fontSize: 40 }} />
                    ) : grades[4] <= 6 ? (
                      <SentimentDissatisfied color='warning' sx={{ fontSize: 40 }} />
                    ) : grades[4] <= 8 ? (
                      <SentimentNeutral color='info' sx={{ fontSize: 40 }} />
                    ) : grades[4] <= 9 ? (
                      <SentimentSatisfied color='success' sx={{ fontSize: 40 }} />
                    ) : (
                      <SentimentVerySatisfied color='success' sx={{ fontSize: 40 }} />
                    )}
                  </>
                )}
              </Box>

              {(activeStep === 0 || activeStep === 4) && (
                <FormControl fullWidth sx={{paddingX:2}} error={!!error && grades[activeStep] == null}>
                  <Typography gutterBottom>
                    {activeStep == 0 ? 'Bahoni tanlang (1 - 10)' : 'Texnik yordam sifatini baholang (1-10)'}
                  </Typography>
                  <Slider
                    value={grades[activeStep] ?? 0}
                    onChange={(_, value) => dispatch(setGrade({ stepIndex: activeStep, value: value as number }))}
                    step={1}
                    marks
                    min={1}
                    max={10}
                    valueLabelDisplay='auto'
                  />
                  {grades[activeStep] == null && <FormHelperText>Bahoni tanlang</FormHelperText>}
                </FormControl>
              )}

              <TextField
                multiline
                fullWidth
                margin='normal'
                minRows={4}
                label={stepLabel[activeStep]}
                value={steps[activeStep]}
                onChange={e => dispatch(setStepText({ stepIndex: activeStep, text: e.target.value }))}
                error={!!error && !steps[activeStep].trim()}
                helperText={!steps[activeStep].trim() && error ? error : ''}
              />
            </DialogContent>
            <DialogActions>
              {/* <Button onClick={handleClose}>Bekor qilish</Button> */}
              <Button
                fullWidth
                variant='outlined'
                onClick={() => {
                  if (activeStep === 0) {
                    setShowForm(false)
                  } else {
                    setError('')
                  }
                  dispatch(prevStep())
                }}
              >
                Orqaga
              </Button>
              {activeStep < 4 ? (
                <Button fullWidth variant='contained' onClick={handleNext}>
                  Keyingi
                </Button>
              ) : (
                <LoadingButton fullWidth loading={isPending} variant='contained' onClick={handleSubmit}>
                  Yuborish
                </LoadingButton>
              )}
            </DialogActions>
          </>
        ))}
      {showSuccess && (
        <>
          <DialogTitle>Rahmat! So‘rovnomangiz qabul qilindi.</DialogTitle>
          <DialogContent>
            <Typography sx={{ paddingX: 5 }} textAlign={'center'} fontSize={22} color={'black'} fontWeight={700}>
              Yozgan fikr va muammolaringiz e’tiborsiz qolmaydi — jamoamiz ularni albatta ko‘rib chiqadi va zarur
              choralarni ko‘radi
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button fullWidth variant='contained' onClick={() => handleClose()}>
              Yopish
            </Button>
          </DialogActions>
        </>
      )}
    </Dialog>
  )
}

export default CrmSurveymodal
