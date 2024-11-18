export const formatDateForDisplay = (date: string): string => {
  // Ensure we're working with yyyy-mm-dd format
  const [year, month, day] = date.split('-');
  return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
};

export const formatDateForCalendar = (dateStr: string): Date => {
  // Create date object at noon to avoid timezone issues
  const [year, month, day] = dateStr.split('-');
  return new Date(Number(year), Number(month) - 1, Number(day), 12, 0, 0);
};

export const parseDisplayDate = (displayDate: string): string => {
  // Convert from mm/dd/yyyy to yyyy-mm-dd
  const [month, day, year] = displayDate.split('/');
  return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
};