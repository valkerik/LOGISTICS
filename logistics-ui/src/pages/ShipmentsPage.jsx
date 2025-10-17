// pages/ShipmentsPage.jsx
import { useQuery } from '@tanstack/react-query'
import { listShipments } from '../api/shipments'
import { useState } from 'react'
import { Link } from 'react-router-dom'

export default function ShipmentsPage() {
    const [status, setStatus] = useState('') // '' = все

    const { data = [], isLoading } = useQuery({
        queryKey: ['shipments', status],
        queryFn: () => listShipments({ status }),
        keepPreviousData: true,
    })

    if (isLoading) return 'Загрузка...'

    return (
        <div>
            <h2>Перевозки</h2>

            <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                <select
                    value={status}
                    onChange={e => setStatus(e.target.value)}
                >
                    <option value="">Все статусы</option>
                    <option>NEW</option>
                    <option>ASSIGNED</option>
                    <option>IN_TRANSIT</option>
                    <option>DELIVERED</option>
                    <option>CANCELLED</option>
                </select>
            </div>

            <table cellPadding="6" border="1" style={{ borderCollapse: 'collapse', width: '100%' }}>
                <thead>
                <tr>
                    <th>ID</th><th>Клиент</th><th>Перевозчик</th>
                    <th>Статус</th><th>Вес (кг)</th><th>Забор</th><th>Доставка</th><th></th>
                </tr>
                </thead>
                <tbody>
                {data.map(s => (
                    <tr key={s.id}>
                        <td>{s.id}</td>
                        <td>{s.clientName || s.client?.name}</td>
                        <td>{s.carrierName || s.carrier?.name}</td>
                        <td>{s.status}</td>
                        <td>{s.cargoWeight}</td>
                        <td>{s.plannedPickupAt?.slice(0, 16).replace('T', ' ')}</td>
                        <td>{s.plannedDeliveryAt?.slice(0, 16).replace('T', ' ')}</td>
                        <td><Link to={`/shipments/${s.id}`}>Открыть</Link></td>
                    </tr>
                ))}
                {data.length === 0 && (
                    <tr>
                        <td colSpan={8} style={{ textAlign: 'center', color: '#888' }}>Нет данных</td>
                    </tr>
                )}
                </tbody>
            </table>
        </div>
    )
}
