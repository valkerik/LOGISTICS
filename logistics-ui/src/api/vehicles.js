import { http } from './http'

// Вернётся Page<Vehicle>. По умолчанию вытащим побольше (для селекта)
export const listVehicles = ({ carrierId, active = true, page = 0, size = 200 } = {}) =>
    http.get('/vehicles', { params: { carrierId, active, page, size } }).then(r => r.data)
