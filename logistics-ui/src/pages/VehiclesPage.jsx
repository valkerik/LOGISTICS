import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { listVehicles, createVehicle, updateVehicle, deleteVehicle } from '../api/vehicles'
import { useMemo, useState } from 'react'
import VehicleForm from '../components/VehicleForm.jsx'

export default function VehiclesPage() {
    const qc = useQueryClient()
    const [carrierId, setCarrierId] = useState('')
    const [active, setActive] = useState('')
    const [editing, setEditing] = useState(null)
    const [isOpen, setIsOpen] = useState(false)
    const [errorMsg, setErrorMsg] = useState('')

    const params = useMemo(() => {
        const p = {}
        if (carrierId) p.carrierId = Number(carrierId)
        if (active !== '') p.active = active === 'true'
        return p
    }, [carrierId, active])

    const { data = [], isLoading } = useQuery({
        queryKey: ['vehicles', params],
        queryFn: () => listVehicles(params), // бек сейчас игнорит фильтры — ок
    })

    const mCreate = useMutation({
        mutationFn: (dto) => createVehicle(dto),
        onSuccess: () => { setIsOpen(false); setEditing(null); setErrorMsg(''); qc.invalidateQueries({ queryKey: ['vehicles'] }) },
        onError: (err) => setErrorMsg(err?.response?.data?.message || err?.message || 'Ошибка сохранения'),
    })

    const mUpdate = useMutation({
        mutationFn: ({ id, dto }) => updateVehicle(id, dto),
        onSuccess: () => { setIsOpen(false); setEditing(null); setErrorMsg(''); qc.invalidateQueries({ queryKey: ['vehicles'] }) },
        onError: (err) => setErrorMsg(err?.response?.data?.message || err?.message || 'Ошибка сохранения'),
    })

    const mDelete = useMutation({
        mutationFn: (id) => deleteVehicle(id),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['vehicles'] }),
        onError: (err) => alert(err?.response?.data?.message || err?.message || 'Ошибка удаления'),
    })

    if (isLoading) return 'Загрузка...'

    return (
        <div>
            <h2>Транспорт</h2>

            <div style={{display:'flex', gap:8, marginBottom:8}}>
                <input placeholder="carrierId" value={carrierId} onChange={e=>setCarrierId(e.target.value)} style={{width:120}} />
                <select value={active} onChange={e=>setActive(e.target.value)}>
                    <option value="">Все</option>
                    <option value="true">Активные</option>
                    <option value="false">Неактивные</option>
                </select>
                <button onClick={()=>{ setEditing(null); setIsOpen(true); setErrorMsg('') }}>+ Добавить</button>
            </div>

            <table cellPadding="6" border="1" style={{borderCollapse:'collapse', width:'100%'}}>
                <thead>
                <tr><th>ID</th><th>Госномер</th><th>Тип</th><th>Перевозчик</th><th>Активен</th><th></th></tr>
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
                            <button onClick={()=>{ setEditing(v); setIsOpen(true); setErrorMsg('') }}>Изменить</button>{' '}
                            <button onClick={()=>{ if (confirm('Удалить транспортное средство?')) mDelete.mutate(v.id) }}>Удалить</button>
                        </td>
                    </tr>
                ))}
                {data.length === 0 && <tr><td colSpan={6} style={{textAlign:'center', color:'#888'}}>Нет данных</td></tr>}
                </tbody>
            </table>

            {isOpen && (
                <div style={{position:'fixed', inset:0, background:'rgba(0,0,0,.35)', display:'grid', placeItems:'center'}}>
                    <div style={{background:'#fff', padding:16, borderRadius:8}}>
                        <h3 style={{marginTop:0}}>{editing ? 'Редактировать ТС' : 'Новое ТС'}</h3>

                        {errorMsg && (
                            <div style={{background:'#ffecec', color:'#b00', padding:'8px 10px', borderRadius:6, marginBottom:8}}>
                                {errorMsg}
                            </div>
                        )}

                        <VehicleForm
                            initial={editing}
                            onSubmit={(dto)=> editing ? mUpdate.mutate({ id: editing.id, dto }) : mCreate.mutate(dto)}
                            onCancel={()=>{ setIsOpen(false); setEditing(null); setErrorMsg('') }}
                        />
                    </div>
                </div>
            )}
        </div>
    )
}
