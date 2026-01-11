export function formatCurrency(amount: number) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount)
}

export function getImagePath(imagePath: string) {
  const cloudinaryBaseUrl = 'https://res.cloudinary.com'
  if(imagePath.startsWith(cloudinaryBaseUrl)) {
    return imagePath
  } else {
    return `/products/${imagePath}.jpg`
  }
}

// Formatea una fecha a HH:mm (ej: 14:32)
export function formatTime(date: Date | string): string {
  return new Date(date).toLocaleTimeString("es-AR", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  });
}

// Devuelve la diferencia en minutos entre dos fechas
export function minutesBetween(
  from: Date | string,
  to: Date | string
): number {
  const diff = new Date(to).getTime() - new Date(from).getTime();
  return Math.max(0, Math.round(diff / 60000));
}

// Devuelve cuántos minutos pasaron desde una fecha hasta ahora
export function minutesAgo(date: Date | string): number {
  const diff = Date.now() - new Date(date).getTime();
  return Math.max(0, Math.round(diff / 60000));
}


export const COLORS = {
  primary: {
    100: '#ffedd5',  // orange-100
    200: '#fed7aa',  // orange-200
    300: '#fdba74',  // orange-300
    400: '#fb923c',  // orange-400
    500: '#f97316',  // orange-500
    600: '#ea580c',  // orange-600
  },
  secondary: {
    100: '#cffafe',  // cyan-100
    200: '#a5f3fc',  // cyan-200
    300: '#67e8f9',  // cyan-300
    400: '#22d3ee',  // cyan-400
    500: '#06b6d4',  // cyan-500
    600: '#0891b2',  // cyan-600
  }
} as const;

export function generateSlug(text: string): string {
  return text
    .toLowerCase()                          // Convertir a minúsculas
    .trim()                                 // Quitar espacios al inicio/fin
    .normalize('NFD')                       // Normalizar caracteres Unicode
    .replace(/[\u0300-\u036f]/g, '')       // Quitar acentos (á -> a, é -> e)
    .replace(/[^a-z0-9\s-]/g, '')          // Quitar caracteres especiales
    .replace(/\s+/g, '-')                  // Espacios -> guiones
    .replace(/-+/g, '-')                   // Múltiples guiones -> uno solo
    .replace(/^-+|-+$/g, '')               // Quitar guiones al inicio/fin
}