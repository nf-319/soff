const FIRST_NAME = {
  label: 'Talaba ismi',
  value: '${first_name}',
  color: 'info',
  displayValue: '@TALABA_ISMI',
  placeholder: "Xabar matniga talabaning ismini qo'shish uchun"
}

const GROUP = {
  label: 'Guruh nomi',
  value: '${group}',
  color: 'warning',
  displayValue: '@GURUH_NOMI',
  placeholder: "Xabar matniga guruh nomini qo'shish uchun"
}

const BALANCE = {
  label: 'Balans',
  value: '${balance}',
  color: 'warning',
  displayValue: '@BALANS',
  placeholder: "Xabar matniga balansni qo'shish uchun"
}

const REASON = {
  label: 'Sabab',
  value: '${reason}',
  color: 'info',
  displayValue: '@SABAB',
  placeholder: "Xabar matniga sababni qo'shish uchun"
}

const SCORE = {
  label: 'Talabaning balli',
  value: '${score}',
  color: 'success',
  displayValue: '@TALABANING_BALLI',
  placeholder: "Xabar matniga talabaning balli qo'shish uchun"
}

const WHOSE_PAYMENT_DATE = {
  label: "To'lov sanasi",
  value: '${date}',
  color: 'primary',
  displayValue: "@TO'LOV_SANASI",
  placeholder: "Xabar matniga to'lov sanasi qo'shish uchun"
}

const DATE = {
  label: 'Sana',
  value: '${date}',
  color: 'primary',
  displayValue: '@SANA',
  placeholder: "Xabar matniga sanani qo'shish uchun"
}

const AMOUNT = {
  label: 'Miqdor',
  value: '${amount}',
  color: 'warning',
  displayValue: '@MIQDOR',
  placeholder: "Xabar matniga miqdorni qo'shish uchun"
}

const DEPT_AMOUNT = {
  label: 'Qarzdorlik summasi',
  value: '${amount}',
  color: 'warning',
  displayValue: '@QARZDORLIK_SUMMASI',
  placeholder: "Xabar matniga qarzdorlik summasini qo'shish uchun"
}

export const PLACEHOLDERS: any = {
  for_payment:[FIRST_NAME,AMOUNT,DATE,BALANCE,GROUP],
  birthdate: [FIRST_NAME],
  exam: [FIRST_NAME, SCORE,DATE],
  notComeLesson: [FIRST_NAME],
  comeLesson: [FIRST_NAME],
  whosePayment: [FIRST_NAME, WHOSE_PAYMENT_DATE, DEPT_AMOUNT],
  deptStudents: [FIRST_NAME, WHOSE_PAYMENT_DATE, DEPT_AMOUNT],
  gradeStudents: [FIRST_NAME, GROUP, SCORE]
}
