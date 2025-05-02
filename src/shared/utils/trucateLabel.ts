export const truncateLabel = (label: string, maxLength: number = 15) => {
  return label.length > maxLength ? `${label.slice(0, maxLength - 3)}...` : label
}
