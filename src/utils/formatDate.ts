/**
 * Formatea una fecha de manera determinística para evitar problemas de hidratación
 * entre servidor y cliente.
 */
export function formatDate(dateString: string, format: 'short' | 'long' = 'long'): string {
  const date = new Date(dateString);

  const months = [
    'enero',
    'febrero',
    'marzo',
    'abril',
    'mayo',
    'junio',
    'julio',
    'agosto',
    'septiembre',
    'octubre',
    'noviembre',
    'diciembre',
  ];

  const monthsShort = [
    'ene',
    'feb',
    'mar',
    'abr',
    'may',
    'jun',
    'jul',
    'ago',
    'sep',
    'oct',
    'nov',
    'dic',
  ];

  const day = date.getDate();
  const month = date.getMonth();
  const year = date.getFullYear();

  if (format === 'short') {
    return `${monthsShort[month]} ${day}`;
  }

  return `${day} de ${months[month]} de ${year}`;
}
