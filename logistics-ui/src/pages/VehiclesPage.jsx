import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { listVehicles, deleteVehicle } from '../api/vehicles'
import { useState } from 'react'

export default function VehiclesPage() {
    const qc = useQueryClient()
    const [carrierId, setCarrierId] = useState('')
    const [active, setActive] = useState('')

    const params = {}
    if (carrierId) params.carrierId = Number(carrierId)
    if (active !== '') params.active = active === 'true'

    const { data = [], isLoading } = useQuery({
        queryKey: ['vehicles', params],
        queryFn: () => listVehicles(params),
    })

    const mDelete = useMutation({
        mutationFn: (id) => deleteVehicle(id),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['vehicles'] }),
    })

    if (isLoading) return 'Загрузка...'

    return (
        <div>
            <h2>Транспорт</h2>

            <div style={{display:'flex', gap:8, marginBottom:8}}>
                <input
                    placeholder="carrierId"
                    value={carrierId}
                    onChange={e=>setCarrierId(e.target.value)}
                    style={{width:120}}
                />
                <select value={active} onChange={e=>setActive(e.target.value)}>
                    <option value="">Все</option>
                    <option value="true">Активные</option>
                    <option value="false">Неактивные</option>
                </select>
                {/* кнопка +Добавить — позже, когда появится форма */}
            </div>

            <table cellPadding="6" border="1" style={{borderCollapse:'collapse', width:'100%'}}>
                <thead>
                <tr>
                    <th>ID</th><th>Госномер</th><th>Тип</th><th>Перевозчик</th><th>Активен</th><th></th>
                </tr>
                </thead>
                <tbody>
                {data.map(v=>(
                    <tr key={v.id}>
                        <td>{v.id}</td>
                        <td>{v.plateNo ?? v.plate_no ?? ''}</td>
                        <td>{v.type ?? ''}</td>
                        <td>{v.carrierName ?? v.carrier?.name ?? ''}</td>
                        <td>{String(v.active ?? v.isActive ?? '')}</td>
                        <td style={{whiteSpace:'nowrap'}}>
                            {/* <button onClick={()=>...}>Изменить</button>{' '} */}
                            <button onClick={()=>{ if (confirm('Удалить транспортное средство?')) mDelete.mutate(v.id) }}>Удалить</button>
                        </td>
                    </tr>
                ))}
                {data.length === 0 && <tr><td colSpan={6} style={{textAlign:'center', color:'#888'}}>Нет данных</td></tr>}
                </tbody>
            </table>
        </div>
    )
}
