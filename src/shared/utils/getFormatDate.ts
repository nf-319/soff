import { format } from 'date-fns';
import { uz } from 'date-fns/locale';

export const getFormatDate = (date: Date | string, formatString: string = 'dd MMMM yyyy'): string => {
  const parsedDate = typeof date === 'string' ? new Date(date) : date;

  if (isNaN(parsedDate.getTime())) {
    throw new Error('Invalid date');
  }

  return format(parsedDate, formatString, { locale: uz });
}

