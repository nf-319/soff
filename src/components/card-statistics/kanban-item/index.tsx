export const today = `${new Date().getFullYear()}-${
  new Date().getMonth() + 1 > 9 ? new Date().getMonth() + 1 : `0${new Date().getMonth() + 1}`
}-${new Date().getDate() > 9 ? new Date().getDate() : `0${new Date().getDate()}`}`

