import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface StepFormState {
  activeStep: number
  steps: string[]
  helpUsed: 'yes' | 'no' | null
  grades: {
    0: number | null
    4: number | null
  }
}

const initialState: StepFormState = {
  activeStep: 0,
  helpUsed: null as null | 'yes' | 'no',
  steps: ['', '', '', '', ''],
  grades: { 0: null, 4: null }
}

const stepFormSlice = createSlice({
  name: 'stepForm',
  initialState,
  reducers: {
    nextStep(state) {
      if (state.activeStep < 4) state.activeStep += 1
    },
    prevStep(state) {
      if (state.activeStep > 0) state.activeStep -= 1
    },
    setStepText(state, action: PayloadAction<{ stepIndex: number; text: string }>) {
      const { stepIndex, text } = action.payload
      state.steps[stepIndex] = text
    },
    setHelpUsed: (state, action) => {
      state.helpUsed = action.payload
    },
    setGrade(state, action: PayloadAction<{ stepIndex: 0 | 4; value: number }>) {
      state.grades[action.payload.stepIndex] = action.payload.value
    },
    resetForm(state) {
      state.activeStep = 0
      state.steps = ['', '', '', '', '']
      state.grades = { 0: null, 4: null }
    }
  }
})

export const { nextStep, setHelpUsed, prevStep, setStepText, setGrade, resetForm } = stepFormSlice.actions
export default stepFormSlice.reducer
