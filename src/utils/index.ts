export function formatCurrency(amount: number) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount)
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