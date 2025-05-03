export const getPhoneNumber = (phone: string) => {
  return `https://onmap.uz/tel/${phone.replace("+", "")}`
}
