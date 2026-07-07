
export const formatDate = (date: string) => {
  const d = new Date(date);
  
  const weekdays = {
    'monday': 'Lunes',
    'tuesday': 'Martes',
    'wednesday': 'Miércoles',
    'thursday': 'Jueves',
    'friday': 'Viernes',
    'saturday': 'Sábado',
    'sunday': 'Domingo'
  };

  const months = {
    'january': 'Enero',
    'february': 'Febrero',
    'march': 'Marzo',
    'april': 'Abril',
    'may': 'Mayo',
    'june': 'Junio',
    'july': 'Julio',
    'august': 'Agosto',
    'september': 'Septiembre',
    'october': 'Octubre',
    'november': 'Noviembre',
    'december': 'Diciembre'
  };

  const weekday = weekdays[d.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase()];
  const day = d.getDate();
  const month = months[d.toLocaleDateString('en-US', { month: 'long' }).toLowerCase()];
  const year = d.getFullYear();

  return `${weekday}, ${day} de ${month} de ${year}`;
};
