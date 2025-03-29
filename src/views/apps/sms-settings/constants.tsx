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
  label: 'Ball',
  value: '${score}',
  color: 'success',
  displayValue: '@BALL',
  placeholder: "Xabar matniga ball qo'shish uchun",
}

const DATE = {
  label: 'Sana',
  value: '${date}',
  color: 'primary',
  displayValue: '@SANA',
  placeholder: "Xabar matniga sanani qo'shish uchun",
}

const AMOUNT = {
  label: 'Miqdor',
  value: '${amount}',
  color: 'warning',
  displayValue: '@MIQDOR',
  placeholder: "Xabar matniga miqdorni qo'shish uchun",
}


export const PLACEHOLDERS = {
  birthdate: [FIRST_NAME],
  notComeLesson: [FIRST_NAME],
  comeLesson: [FIRST_NAME],
  whosePayment: [FIRST_NAME, DATE, AMOUNT],
  deptStudents: [FIRST_NAME, DATE, AMOUNT],
  gradeStudents: [FIRST_NAME, GROUP, SCORE],
}

