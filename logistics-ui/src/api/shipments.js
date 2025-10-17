// api/shipments.js
import { http } from './http'

// Если бэк пока не фильтрует по статусу — этот параметр просто проигнорируется (норм).
export async function listShipments({ status = '' } = {}) {
    const params = {};
    // сервер у тебя умеет принимать List<ShipmentStatus> ? Тогда:
    // statuses=NEW (или ?statuses=NEW&statuses=ASSIGNED)
    if (status && status !== 'ALL') {
        params.statuses = [status];
    }
    const { data } = await http.get('/shipments', { params });
    // ожидаем простой массив
    return data;
}

export const getShipment = (id) =>
    http.get(`/shipments/${id}`).then(r => r.data)

export const createShipment = (data) =>
    http.post('/shipments', data).then(r => r.data)

export const updateShipmentStatus = (id, status) =>
    http.patch(`/shipments/${id}/status`, { status }).then(r => r.data)

export const assignShipment = (id, { vehicleId = null, driverId = null }) =>
    http.patch(`/shipments/${id}/assign`, { vehicleId, driverId }).then(r => r.data)
