import { http } from './http'

// можно передать { carrierId, active } — если бэк это понимает
export const listVehicles = (params = {}) =>
    http.get('/vehicles', { params }).then(r => r.data)

export const createVehicle = (data) =>
    http.post('/vehicles', data).then(r => r.data)

export const updateVehicle = (id, data) =>
    http.put(`/vehicles/${id}`, data).then(r => r.data)

export const deleteVehicle = (id) =>
    http.delete(`/vehicles/${id}`).then(r => r.data)
