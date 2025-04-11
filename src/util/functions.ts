// Function to generate a unique ID (UUID) for the appointment
export const generateUniqueId = (): string => {
  return '_' + Math.random().toString(36).substr(2, 9);
};

// Function to format a date (string or Date) into the format "YYYY-MM-DDTHH:MM"
// suitable for an input with type="datetime-local"
export const formatDateForInput = (dateInput: string | Date): string => {
  let date: Date;
  if (typeof dateInput === 'string') {
    date = new Date(dateInput);
  } else {
    date = dateInput;
  }
  if (isNaN(date.getTime())) return '';
  const pad = (n: number): string => n.toString().padStart(2, '0');
  const YYYY = date.getFullYear();
  const MM = pad(date.getMonth() + 1);
  const DD = pad(date.getDate());
  const HH = pad(date.getHours());
  const mm = pad(date.getMinutes());
  return `${YYYY}-${MM}-${DD}T${HH}:${mm}`;
};
