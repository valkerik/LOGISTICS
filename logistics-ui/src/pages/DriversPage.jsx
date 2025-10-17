import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { listDrivers, createDriver, updateDriver, deleteDriver } from '../api/drivers'
import { useState } from 'react'
import DriverForm from '../components/DriverForm.jsx'

export default function DriversPage() {
    const qc = useQueryClient()
    const [q, setQ] = useState('')
    const [editing, setEditing] = useState(null)
    const [isOpen, setIsOpen] = useState(false)
    const [errorMsg, setErrorMsg] = useState('')

    const { data = [], isLoading } = useQuery({
        queryKey: ['drivers', q],
        queryFn: () => listDrivers(q ? { q } : {}),
    })

    const mCreate = useMutation({
        mutationFn: (dto) => createDriver(dto),
        onSuccess: () => {
            setIsOpen(false); setEditing(null); setErrorMsg('')
            qc.invalidateQueries({ queryKey: ['drivers'] })
        },
        onError: (err) => setErrorMsg(err?.response?.data?.message || err?.message || 'Ошибка сохранения'),
    })

    const mUpdate = useMutation({
        mutationFn: ({ id, dto }) => updateDriver(id, dto),
        onSuccess: () => {
            setIsOpen(false); setEditing(null); setErrorMsg('')
            qc.invalidateQueries({ queryKey: ['drivers'] })
        },
        onError: (err) => setErrorMsg(err?.response?.data?.message || err?.message || 'Ошибка сохранения'),
    })

    const mDelete = useMutation({
        mutationFn: (id) => deleteDriver(id),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['drivers'] }),
        onError: (err) => alert(err?.response?.data?.message || err?.message || 'Ошибка удаления'),
    })

    if (isLoading) return 'Загрузка...'

    return (
        <div>
            <h2>Водители</h2>
            <div style={{display:'flex', gap:8, marginBottom:8}}>
                <input placeholder="поиск" value={q} onChange={e=>setQ(e.target.value)} />
                <button onClick={()=>{ setEditing(null); setIsOpen(true); setErrorMsg('') }}>+ Добавить</button>
            </div>

            <table cellPadding="6" border="1" style={{borderCollapse:'collapse', width:'100%'}}>
                <thead>
                <tr><th>ID</th><th>ФИО</th><th>Телефон</th><th>Перевозчик</th><th>Активен</th><th></th></tr>
                </thead>
                <tbody>
                {data.map(d=>(
                    <tr key={d.id}>
                        <td>{d.id}</td>
                        <td>{d.fullName ?? d.full_name ?? '(нет данных)'}</td>
                        <td>{d.phone ?? ''}</td>
                        <td>{d.carrierName ?? d.carrier?.name ?? ''}</td>
                        <td>{String(d.active ?? true)}</td>
                        <td style={{whiteSpace:'nowrap'}}>
                            <button onClick={()=>{ setEditing(d); setIsOpen(true); setErrorMsg('') }}>Изменить</button>{' '}
                            <button onClick={()=>{ if (confirm('Удалить водителя?')) mDelete.mutate(d.id) }}>Удалить</button>
                        </td>
                    </tr>
                ))}
                {data.length === 0 && <tr><td colSpan={6} style={{textAlign:'center', color:'#888'}}>Нет данных</td></tr>}
                </tbody>
            </table>

            {isOpen && (
                <div style={{position:'fixed', inset:0, background:'rgba(0,0,0,.35)', display:'grid', placeItems:'center'}}>
                    <div style={{background:'#fff', padding:16, borderRadius:8, minWidth:420}}>
                        <h3 style={{marginTop:0}}>{editing ? 'Редактировать водителя' : 'Новый водитель'}</h3>

                        {errorMsg && (
                            <div style={{background:'#ffecec', color:'#b00', padding:'8px 10px', borderRadius:6, marginBottom:8}}>
                                {errorMsg}
                            </div>
                        )}

                        <DriverForm
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
