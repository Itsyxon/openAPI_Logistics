export interface MockCity {
  gc_id: number
  name: string
  full_name: string
  lat: number
  lon: number
}

export const MOCK_CITIES: MockCity[] = [
  { gc_id: 100, name: 'Москва', full_name: 'Москва, Россия', lat: 55.7558, lon: 37.6173 },
  { gc_id: 36, name: 'Воронеж', full_name: 'Воронеж, Россия', lat: 51.672, lon: 39.1843 },
  { gc_id: 78, name: 'Санкт-Петербург', full_name: 'Санкт-Петербург, Россия', lat: 59.9311, lon: 30.3609 },
  { gc_id: 66, name: 'Екатеринбург', full_name: 'Екатеринбург, Россия', lat: 56.8389, lon: 60.6057 },
  { gc_id: 54, name: 'Новосибирск', full_name: 'Новосибирск, Россия', lat: 55.0084, lon: 82.9357 },
  { gc_id: 16, name: 'Казань', full_name: 'Казань, Россия', lat: 55.7963, lon: 49.1088 },
  { gc_id: 52, name: 'Нижний Новгород', full_name: 'Нижний Новгород, Россия', lat: 56.3269, lon: 44.0059 },
  { gc_id: 61, name: 'Ростов-на-Дону', full_name: 'Ростов-на-Дону, Россия', lat: 47.2357, lon: 39.7015 },
  { gc_id: 63, name: 'Самара', full_name: 'Самара, Россия', lat: 53.1959, lon: 50.1002 },
  { gc_id: 74, name: 'Челябинск', full_name: 'Челябинск, Россия', lat: 55.1644, lon: 61.4368 },
  { gc_id: 23, name: 'Краснодар', full_name: 'Краснодар, Россия', lat: 45.0355, lon: 38.9753 },
  { gc_id: 55, name: 'Омск', full_name: 'Омск, Россия', lat: 54.9885, lon: 73.3242 },
]

export function findCityByName(name: string) {
  const normalized = name.trim().toLowerCase()
  return MOCK_CITIES.find((city) => city.name.toLowerCase() === normalized)
}
