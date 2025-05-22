import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FieldType } from '@/types'

interface FormState {
  end: boolean;
  formName: string;
  displayMode: 'computer' | 'tablet' | 'phone';
  bg_img: any | null;
  logoImg: any | null;
  bg_color: string;
  fontFamily: string;
  fontSize: string;
  open: 'input' | 'description' | 'single' | null;
  successText: string;
  textColor: string;
  sentButtonLabel: string;
  fields: FieldType[];
  departmentValue: number | null;
  sourceValue: number | null;
  isElement: boolean;
  tabValue: string;
  isOuterExpanded: boolean;
  expandedFieldIndex: number | null;
}

const initialState: FormState = {
  end: false,
  formName: 'Aloqa uchun kontakt',
  displayMode: 'computer',
  bg_img: null,
  logoImg: null,
  bg_color: '#f9f9fb',
  fontFamily: 'Roboto',
  fontSize: '20px',
  open: null,
  successText: "So'rovingiz muvaffaqiyatli yuborildi! Tez orada siz bilan bog'lanamiz.",
  textColor: '#111827',
  sentButtonLabel: 'Yuborish',
  fields: [
    {
      input_type: 'name',
      label: 'Ism',
      title: 'Ism',
      value: '',
      is_required: false,
      order: 1,
    },
    {
      input_type: 'phone',
      label: 'Telefon',
      title: 'Telefon',
      value: '',
      is_required: false,
      order: 2,
    },
  ],
  departmentValue: null,
  sourceValue: null,
  isElement: true,
  tabValue: 'one',
  isOuterExpanded: false,
  expandedFieldIndex: null,
};

const formSlice = createSlice({
  name: 'form',
  initialState,
  reducers: {
    setFormState: (state, action: PayloadAction<Partial<FormState>>) => {
      Object.assign(state, action.payload);
    },
    setFieldValue: (
      state,
      action: PayloadAction<{ index: number; key: keyof FieldType; value: any }>
    ) => {
      const { index, key, value } = action.payload;
      if (state.fields[index]) {
        state.fields[index] = {
          ...state.fields[index],
          [key]: value,
        };
      }
    },
    setFields: (state, action: PayloadAction<FieldType[]>) => {
      state.fields = action.payload.map((field, index) => ({
        ...field,
        order: index + 1,
      }));
    },
    setFormName: (state, action: PayloadAction<string>) => {
      state.formName = action.payload;
    },
    setDisplayMode: (state, action: PayloadAction<'computer' | 'tablet' | 'phone'>) => {
      state.displayMode = action.payload;
    },
    setBgImg: (state, action: PayloadAction<any | null>) => {
      state.bg_img = action.payload;
    },
    setLogoImg: (state, action: PayloadAction<any | null>) => {
      state.logoImg = action.payload;
    },
    setBgColor: (state, action: PayloadAction<string>) => {
      state.bg_color = action.payload;
    },
    setFontFamily: (state, action: PayloadAction<string>) => {
      state.fontFamily = action.payload;
    },
    setFontSize: (state, action: PayloadAction<string>) => {
      state.fontSize = action.payload;
    },
    setTextColor: (state, action: PayloadAction<string>) => {
      state.textColor = action.payload;
    },
    setSuccessText: (state, action: PayloadAction<string>) => {
      state.successText = action.payload;
    },
    setSentButtonLabel: (state, action: PayloadAction<string>) => {
      state.sentButtonLabel = action.payload;
    },
    setOpen: (state, action: PayloadAction<'input' | 'description' | 'single' | null>) => {
      state.open = action.payload;
    },
    setEnd: (state, action: PayloadAction<boolean>) => {
      state.end = action.payload;
    },
    setDepartmentValue: (state, action: PayloadAction<number | null>) => {
      state.departmentValue = action.payload;
    },
    setSourceValue: (state, action: PayloadAction<number | null>) => {
      state.sourceValue = action.payload;
    },
    setIsElement: (state, action: PayloadAction<boolean>) => {
      state.isElement = action.payload;
    },
    setTabValue: (state, action: PayloadAction<string>) => {
      state.tabValue = action.payload;
    },
    setIsOuterExpanded: (state, action: PayloadAction<boolean>) => {
      state.isOuterExpanded = action.payload;
    },
    setExpandedFieldIndex: (state, action: PayloadAction<number | null>) => {
      state.expandedFieldIndex = action.payload;
    },
    resetForm: (state) => {
      return initialState;
    },
  },
});

export const {
  setFormState,
  setFieldValue,
  setFields,
  setFormName,
  resetForm,
  setDisplayMode,
  setBgImg,
  setLogoImg,
  setBgColor,
  setFontFamily,
  setFontSize,
  setTextColor,
  setSuccessText,
  setSentButtonLabel,
  setOpen,
  setEnd,
  setDepartmentValue,
  setSourceValue,
  setIsElement,
  setTabValue,
  setIsOuterExpanded,
  setExpandedFieldIndex,
} = formSlice.actions;

export default formSlice.reducer;
