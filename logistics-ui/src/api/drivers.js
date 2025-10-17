import { http } from './http'

// Бэк сейчас отдаёт просто активных водителей без фильтров
export const listDrivers = () =>
    http.get('/drivers').then(r => r.data) // <- List<Driver>
