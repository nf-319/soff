import { useState } from 'react';
import * as Yup from 'yup';
import { revereAmount } from '@/components/amount-input';
import PhoneInput from '@/components/phone-input';
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
  Radio,
  TextField,
  Typography,
} from '@mui/material';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { ChevronLeft, CircleCheck } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '@/store';
import { setFields, setFieldValue, setEnd } from '@store/apps/form';
import { FieldType } from '@/types'

type Props = {
  page?: boolean;
};

const createValidationSchema = (fields: FieldType[]) => {
  const schemaFields: { [key: string]: any } = {};

  fields.forEach((field, index) => {
    const fieldName = `field_${index}`;
    let validator;

    switch (field.input_type) {
      case 'input':
        validator = Yup.string().trim();
        if (field.is_required) {
          validator = validator.required(`${field.label || field.title} talab qilinadi`);
        }
        break;
      case 'text':
        validator = Yup.string().trim();
        if (field.is_required) {
          validator = validator.required(`${field.label || field.title} talab qilinadi`);
        }
        break;
      case 'question':
        if (field.is_required) {
          if (field.question_type === 'single') {
            validator = Yup.number().required('Please select an option').min(0, 'Please select an option');
          } else {
            validator = Yup.array()
              .min(1, 'Kamida bitta variantni tanlang')
              .required('Kamida bitta variantni tanlang');
          }
        } else {
          if (field.question_type === 'single') {
            validator = Yup.number().nullable();
          } else {
            validator = Yup.array().nullable();
          }
        }
        break;
      default:
        validator = Yup.mixed();
    }

    schemaFields[fieldName] = validator;
  });

  return Yup.object().shape(schemaFields);
};

const FormUi = ({ page }: Props) => {
  const {
    formName,
    fields,
    sentButtonLabel,
    logoImg,
    bg_img,
    bg_color,
    companyInfo,
    fontFamily,
    fontSize,
    textColor,
    end,
    displayMode,
    successText,
  } = useAppSelector((state) => ({
    ...state.form,
    companyInfo: state.user.companyInfo,
  }));

  console.log(formName)
  const dispatch = useAppDispatch();
  const router = useRouter();
  const isMobile = displayMode === 'phone';
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleSubmit = async () => {
    try {
      const formData: { [key: string]: any } = {};
      fields.forEach((field, index) => {
        const fieldName = `field_${index}`;
        if (field.input_type === 'question') {
          formData[fieldName] =
            field.question_type === 'single' ? field.checkedVariants?.[0] : field.checkedVariants || [];
        } else {
          formData[fieldName] = field.value;
        }
      });

      const schema = createValidationSchema(fields);
      await schema.validate(formData, { abortEarly: false });

      setErrors({});
      dispatch(setEnd(true));
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        const errorMessages: { [key: string]: string } = {};
        err.inner.forEach((error) => {
          if (error.path) {
            errorMessages[error.path] = error.message;
          }
        });
        setErrors(errorMessages);
      }
    }
  };

  return (
    <Box
      sx={{
        width: '100%',
        height: page ? '100vh' : '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        gap: 5,
      }}
    >
      <Box display="flex" alignItems="center" justifyContent="center" sx={{ height: '100%' }}>
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
            boxShadow: 'none',
            overflow: 'auto',
            padding: 5,
            ...(!page ? { border: '1px solid lightgray', maxWidth: 'auto' } : { borderRadius: 0 }),
          }}
        >
          {page && (
            <Box sx={{ position: 'absolute', top: 15, left: 10 }}>
              <Button variant="contained" onClick={() => router.back()} startIcon={<ChevronLeft size={20} />}>
                Orqaga qaytish
              </Button>
            </Box>
          )}

          <Box display="flex" alignItems="center" width="100%" justifyContent="center">
            <Card
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 5,
                overflowY: 'auto',
                padding: 5,
                transition: 'width 0.3s ease-in-out',
                width: '100%',
                height: 'auto',
                maxHeight: 500,
                maxWidth: isMobile ? 500 : 400,
                backgroundColor: bg_color,
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 100,
                  transition: 'height 0.3s ease-in-out',
                  height: isMobile ? 60 : 100,
                }}
              >
                <Image
                  priority={false}
                  src={
                    logoImg instanceof File
                      ? URL.createObjectURL(logoImg)
                      : typeof logoImg === 'string'
                        ? logoImg
                        : companyInfo.logo
                  }
                  alt="Yuklangan rasm"
                  width={100}
                  height={100}
                  unoptimized
                  style={{
                    width: 'auto',
                    transition: 'height 0.3s ease-in-out',
                    height: isMobile ? '60px' : '100px',
                    objectFit: 'cover',
                  }}
                />
              </Box>
              <Typography
                color={textColor}
                fontWeight={600}
                fontSize={fontSize}
                fontFamily={fontFamily}
                style={{
                  transition: 'font-size 0.3s ease, font-family 0.3s ease',
                }}
              >
                {formName}
              </Typography>

              {!end ? (
                <>
                  {fields.map((field, index) => {
                    const fieldName = `field_${index}`;
                    return (
                      <FormControl fullWidth key={index}>
                        {field.input_type === 'input' && (
                          <>
                            <TextField
                              sx={{
                                backgroundColor: bg_color,
                                borderRadius: '8px',
                                '& .MuiOutlinedInput-root': {
                                  borderRadius: '8px',
                                },
                              }}
                              size="small"
                              type="text"
                              label={field.label || field.title}
                              value={field.value}
                              onChange={(e) =>
                                dispatch(setFieldValue({ index, key: 'value', value: e.target.value }))
                              }
                              error={!!errors[fieldName]}
                              helperText={errors[fieldName]}
                            />
                          </>
                        )}

                        {field.input_type === 'phone' && (
                          <>
                            <InputLabel shrink>{field.label || field.title}</InputLabel>
                            <PhoneInput
                              sx={{ background: 'white' }}
                              label={field.label || field.title}
                              value={field.value}
                              onChange={(e) =>
                                dispatch(
                                  setFieldValue({ index, key: 'value', value: revereAmount(e.target.value) })
                                )
                              }
                            />
                          </>
                        )}

                        {field.input_type === 'text' && (
                          <TextField
                            sx={{
                              background: 'white',
                              borderRadius: '8px',
                              '& .MuiOutlinedInput-root': {
                                borderRadius: '8px',
                              },
                            }}
                            label={field.label || field.title}
                            multiline
                            minRows={3}
                            value={field.value}
                            onChange={(e) =>
                              dispatch(setFieldValue({ index, key: 'value', value: e.target.value }))
                            }
                            error={!!errors[fieldName]}
                            helperText={errors[fieldName]}
                          />
                        )}

                        {field.input_type === 'question' && (
                          <FormControl component="fieldset" variant="standard" error={!!errors[fieldName]}>
                            <FormLabel component="legend">{field.question || field.title}</FormLabel>
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
                                            dispatch(
                                              setFields(
                                                fields.map((f, i) =>
                                                  i === index ? { ...f, checkedVariants: [vIndex] } : f
                                                )
                                              )
                                            );
                                            setErrors((prev) => ({ ...prev, [fieldName]: '' }));
                                          }}
                                        />
                                      ) : (
                                        <Checkbox
                                          checked={field.checkedVariants?.includes(vIndex) || false}
                                          onChange={(e) => {
                                            const isChecked = e.target.checked;
                                            dispatch(
                                              setFields(
                                                fields.map((f, i) =>
                                                  i === index
                                                    ? {
                                                      ...f,
                                                      checkedVariants: isChecked
                                                        ? [...(f.checkedVariants || []), vIndex]
                                                        : (f.checkedVariants || []).filter(
                                                          (v: number) => v !== vIndex
                                                        ),
                                                    }
                                                    : f
                                                )
                                              )
                                            );
                                            setErrors((prev) => ({ ...prev, [fieldName]: '' }));
                                          }}
                                        />
                                      )
                                    }
                                    label={variant.value}
                                  />
                                ))}
                            </FormGroup>

                            {errors[fieldName] && (
                              <Typography color="error" variant="caption">
                                {errors[fieldName]}
                              </Typography>
                            )}
                          </FormControl>
                        )}
                      </FormControl>
                    );
                  })}

                  <Button variant="contained" fullWidth onClick={handleSubmit}>
                    {sentButtonLabel}
                  </Button>
                </>
              ) : (
                <>
                  <Typography fontSize="18px" textAlign="center" fontFamily={fontFamily}>
                    {successText}
                  </Typography>

                  <CircleCheck fill="#008000" color="#fff" size={100} />
                </>
              )}
            </Card>
          </Box>
        </Card>
      </Box>
    </Box>
  );
};

export default FormUi;
