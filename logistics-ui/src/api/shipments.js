import { http } from './http'

export const listShipments = (params={page:0,size:20,status:''}) =>
    http.get('/shipments', { params }).then(r => r.data)

export const getShipment = id =>
    http.get(`/shipments/${id}`).then(r => r.data)

export const createShipment = data =>
    http.post('/shipments', data).then(r => r.data)

export const updateShipmentStatus = (id, status) =>
    http.patch(`/shipments/${id}/status`, { status }).then(r => r.data)
