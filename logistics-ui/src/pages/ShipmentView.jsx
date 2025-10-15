import { useParams } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getShipment, updateShipmentStatus } from '../api/shipments'
import { useState } from 'react'

export default function ShipmentView(){
    const { id } = useParams()
    const qc = useQueryClient()
    const { data: s, isLoading } = useQuery({ queryKey:['shipment', id], queryFn:()=>getShipment(id) })
    const [status, setStatus] = useState('')

    const mut = useMutation({
        mutationFn: (st)=>updateShipmentStatus(id, st),
        onSuccess: ()=>{
            qc.invalidateQueries({ queryKey:['shipment', id] })
            qc.invalidateQueries({ queryKey:['shipments'] })
        }
    })

    if (isLoading) return 'Загрузка...'
    if (!s) return 'Не найдено'

    return (
        <div>
            <h2>Перевозка #{s.id}</h2>
            <p><b>Клиент:</b> {s.clientName || s.client?.name}</p>
            <p><b>Перевозчик:</b> {s.carrierName || s.carrier?.name}</p>
            <p><b>Статус:</b> {s.status}</p>

            <div style={{display:'flex', gap:8, marginTop:8}}>
                <select value={status} onChange={e=>setStatus(e.target.value)}>
                    <option value="">— сменить статус —</option>
                    {['NEW','ASSIGNED','IN_TRANSIT','DELIVERED','CANCELLED'].map(x=>
                        <option key={x} value={x}>{x}</option>)}
                </select>
                <button disabled={!status || mut.isPending} onClick={()=>mut.mutate(status)}>
                    {mut.isPending?'Сохраняю...':'Обновить статус'}
                </button>
            </div>
        </div>
    )
}
