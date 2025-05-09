export const LEAD_STATEMENTS_TEMPERATURE = [
  { value: '', label: 'Barcha haroratlar' },
  { value: 'hot', label: 'Issiq' },
  { value: 'warm', label: 'Iliq' },
  { value: 'cold', label: 'Sovuq' }
]

export const LEAD_STATEMENTS_STATES = [
  { value: '', label: 'Barcha holatlar' },
  { value: 'new', label: 'Yangi' },
  { value: 'connected', label: "Bog'lanilgan" },
  { value: 'not_connected', label: "Bog'lanilmagan" },
  { value: 'test_period', label: 'Sinov darsida' },
  { value: 'enrolled', label: "Sotuv bo'ldi" },
  { value: 'rejected', label: "Yo'qotilgan" }
]

export const LEADS_STATE_MAP: { [key: string]: { label: string; color: string } } = {
  new: { label: 'Yangi', color: 'primary' },
  connected: { label: "Bog'lanildi", color: 'success' },
  not_connected: { label: "Bog'lanilmadi", color: 'error' },
  test_period: { label: 'Sinov darsida', color: 'warning' },
  enrolled: { label: "Sotuv bo'ldi", color: 'success' },
  rejected: { label: "Yo'qotilgan", color: 'error' }
}

export const LEADS_TEMPERATURE_MAP: { [key: string]: { label: string; color: string } } = {
  hot: { label: 'Issiq', color: 'success' },
  col: { label: 'Sovuq', color: 'error' },
  warm: { label: 'Iliq', color: 'warning' }
}

export const LEADS_SELLES_FUNNEL_MAP: { [key: string]: string } = {
  all_leads: 'Barcha lidlar',
  connected_leads: "Bog'lanilganlar",
  test_period: 'Sinov darsidagilar',
  enrolled_leads: 'Sotuv bo\'lganlar',
};
