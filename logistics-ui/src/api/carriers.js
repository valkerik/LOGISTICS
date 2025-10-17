import { http } from './http'

export const listCarriers = (q = '') =>
    http.get('/carriers', { params: q ? { q } : {} }).then(r => r.data)

export const createCarrier = (data) =>
    http.post('/carriers', data).then(r => r.data)

export const updateCarrier = (id, data) =>
    http.put(`/carriers/${id}`, data).then(r => r.data)

export const deleteCarrier = (id) =>
    http.delete(`/carriers/${id}`).then(r => r.data)
