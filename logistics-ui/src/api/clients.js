import { http } from './http'

export const listClients = (page=0, size=20, q='') =>
    http.get('/clients', { params: { page, size, q } }).then(r => r.data)

export const createClient = data =>
    http.post('/clients', data).then(r => r.data)

export const updateClient = (id, data) =>
    http.put(`/clients/${id}`, data).then(r => r.data)

export const deleteClient = id =>
    http.delete(`/clients/${id}`).then(r => r.data)
