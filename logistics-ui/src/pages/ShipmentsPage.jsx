import { useQuery } from '@tanstack/react-query'
import { listShipments } from '../api/shipments'
import { useState } from 'react'
import { Link } from 'react-router-dom'

export default function ShipmentsPage(){
    const [page, setPage] = useState(0)
    const [status, setStatus] = useState('')
    const { data, isLoading } = useQuery({
        queryKey: ['shipments', page, status],
        queryFn: () => listShipments({ page, size: 20, status }),
        keepPreviousData: true
    })

    if (isLoading) return 'Загрузка...'
    const content = data?.content ?? []
    const totalPages = data?.totalPages ?? 1

    return (
        <div>
            <h2>Перевозки</h2>
            <div style={{display:'flex', gap:8, marginBottom:12}}>
                <select value={status} onChange={e=>{setPage(0); setStatus(e.target.value)}}>
                    <option value="">Все статусы</option>
                    <option>NEW</option><option>ASSIGNED</option>
                    <option>IN_TRANSIT</option><option>DELIVERED</option><option>CANCELLED</option>
                </select>
            </div>

            <table cellPadding="6" border="1" style={{borderCollapse:'collapse', width:'100%'}}>
                <thead>
                <tr>
                    <th>ID</th><th>Клиент</th><th>Перевозчик</th>
                    <th>Статус</th><th>Вес (кг)</th><th>Забор</th><th>Доставка</th><th></th>
                </tr>
                </thead>
                <tbody>
                {content.map(s=>(
                    <tr key={s.id}>
                        <td>{s.id}</td>
                        <td>{s.clientName || s.client?.name}</td>
                        <td>{s.carrierName || s.carrier?.name}</td>
                        <td>{s.status}</td>
                        <td>{s.cargoWeight}</td>
                        <td>{s.plannedPickupAt?.slice(0,16).replace('T',' ')}</td>
                        <td>{s.plannedDeliveryAt?.slice(0,16).replace('T',' ')}</td>
                        <td><Link to={`/shipments/${s.id}`}>Открыть</Link></td>
                    </tr>
                ))}
                </tbody>
            </table>

            <div style={{marginTop:12, display:'flex', gap:8}}>
                <button disabled={page<=0} onClick={()=>setPage(p=>p-1)}>Назад</button>
                <span>стр. {page+1} из {totalPages}</span>
                <button disabled={page>=totalPages-1} onClick={()=>setPage(p=>p+1)}>Вперёд</button>
            </div>
        </div>
    )
}
