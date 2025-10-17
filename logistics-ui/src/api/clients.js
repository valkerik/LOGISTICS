// api/clients.js
import { http } from './http'

// /api/clients?q=...
export const listClients = (q = '') =>
    http.get('/clients', { params: q ? { q } : {} }).then(r => r.data)

export const createClient = data =>
    http.post('/clients', data).then(r => r.data)

export const updateClient = (id, data) =>
    http.put(`/clients/${id}`, data).then(r => r.data)

export const deleteClient = id =>
    http.delete(`/clients/${id}`).then(r => r.data)
