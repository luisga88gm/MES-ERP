import { format } from "date-fns";
import { es } from "date-fns/locale";

export const formatDate = (dateStr: string) => {
  try {
    // Handle different date formats
    const date = dateStr.includes('T') 
      ? new Date(dateStr)
      : new Date(dateStr.split('/').reverse().join('-'));

    // Format with uppercase month
    return format(date, "dd/MMM/yyyy", { locale: es }).toUpperCase();
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateStr; // Return original string if parsing fails
  }
};
