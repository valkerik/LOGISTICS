import { http } from './http'

export const listDrivers = (params = {}) =>
    http.get('/drivers', { params }).then(r => r.data)

export const createDriver = (data) =>
    http.post('/drivers', data).then(r => r.data)

export const updateDriver = (id, data) =>
    http.put(`/drivers/${id}`, data).then(r => r.data)

export const deleteDriver = (id) =>
    http.delete(`/drivers/${id}`).then(r => r.data)
