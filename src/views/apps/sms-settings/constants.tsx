const FIRST_NAME = {
  label: 'Talaba ismi',
  value: '${first_name}',
  color: 'info',
  displayValue: '@TALABA_ISMI',
  placeholder: "Xabar matniga talabaning ismini qo'shish uchun",
}

const GROUP = {
  label: 'Guruh nomi',
  value: '${group}',
  color: 'warning',
  displayValue: '@GURUH_NOMI',
  placeholder: "Xabar matniga guruh nomini qo'shish uchun",
}

const BALANCE = {
  label: 'Balans',
  value: '${balance}',
  color: 'warning',
  displayValue: '@BALANS',
  placeholder: "Xabar matniga balansni qo'shish uchun",
}

const REASON = {
  label: 'Sabab',
  value: '${reason}',
  color: 'info',
  displayValue: '@SABAB',
  placeholder: "Xabar matniga sababni qo'shish uchun",
}

const SCORE = {
  label: 'Talabaning balli',
  value: '${score}',
  color: 'success',
  displayValue: '@TALABANING_BALLI',
  placeholder: "Xabar matniga talabaning balli qo'shish uchun",
}

const WHOSE_PAYMENT_DATE = {
  label: "To'lov sanasi",
  value: '${date}',
  color: 'primary',
  displayValue: "@TO'LOV_SANASI",
  placeholder: "Xabar matniga to'lov sanasi qo'shish uchun",
}


const DATE = {
  label: 'Sana',
  value: '${date}',
  color: 'primary',
  displayValue: '@SANA',
  placeholder: "Xabar matniga sanani qo'shish uchun",
}

const EXAM = {
  label: 'Imtixon nomi',
  value: '${exam}',
  color: 'primary',
  displayValue: '@IMTIXON_NOMI',
  placeholder: "Xabar matniga imtixon nomini qo'shish uchun",
}

const AMOUNT = {
  label: 'Summa',
  value: '${amount}',
  color: 'warning',
  displayValue: '@SUMMA',
  placeholder: "Xabar matniga summani qo'shish uchun",
}

const DEPT_AMOUNT = {
  label: 'Qarzdorlik summasi',
  value: '${amount}',
  color: 'warning',
  displayValue: '@QARZDORLIK_SUMMASI',
  placeholder: "Xabar matniga qarzdorlik summasini qo'shish uchun",
}
const PAID_DATE = {
  label: "To'lov sanasi",
  value: '${payment_date}',
  color: 'primary',
  displayValue: "@TO'LOV_SANASI",
  placeholder: "Xabar matniga to'lov sanasi qo'shish uchun",
}
const PAID_TYPE = {
  label: "To'lov turi",
  value: '${payment_type}',
  color: 'warning',
  displayValue: "@TO'LOV_TURI",
  placeholder: "Xabar matniga to'lov turini qo'shish uchun",
}

export const PLACEHOLDERS: any = {
  birthdate: [FIRST_NAME],
  notComeLesson: [FIRST_NAME],
  comeLesson: [FIRST_NAME],
  exam: [FIRST_NAME, GROUP, SCORE, EXAM],
  whosePayment: [FIRST_NAME, WHOSE_PAYMENT_DATE, DEPT_AMOUNT],
  deptStudents: [FIRST_NAME, WHOSE_PAYMENT_DATE, DEPT_AMOUNT],
  gradeStudents: [FIRST_NAME, GROUP, SCORE, PAID_DATE],
  paid: [FIRST_NAME, AMOUNT, PAID_DATE, PAID_TYPE]
}

