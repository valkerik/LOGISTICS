import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { listCarriers, createCarrier, updateCarrier, deleteCarrier } from '../api/carriers'
import { useState } from 'react'
import CarrierForm from '../components/CarrierForm.jsx'

export default function CarriersPage() {
    const qc = useQueryClient()
    const [q, setQ] = useState('')
    const { data = [], isLoading } = useQuery({
        queryKey: ['carriers', q],
        queryFn: () => listCarriers(q),
    })

    const [editing, setEditing] = useState(null)
    const [isOpen, setIsOpen] = useState(false)
    const [errorMsg, setErrorMsg] = useState('')

    const mCreate = useMutation({
        mutationFn: (dto) => createCarrier(dto),
        onSuccess: () => { setIsOpen(false); setEditing(null); setErrorMsg(''); qc.invalidateQueries({ queryKey: ['carriers'] }) },
        onError: (err) => setErrorMsg(err?.response?.data?.message || err?.message || 'Ошибка сохранения'),
    })

    const mUpdate = useMutation({
        mutationFn: ({ id, dto }) => updateCarrier(id, dto),
        onSuccess: () => { setIsOpen(false); setEditing(null); setErrorMsg(''); qc.invalidateQueries({ queryKey: ['carriers'] }) },
        onError: (err) => setErrorMsg(err?.response?.data?.message || err?.message || 'Ошибка сохранения'),
    })

    const mDelete = useMutation({
        mutationFn: (id) => deleteCarrier(id),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['carriers'] }),
        onError: (err) => alert(err?.response?.data?.message || err?.message || 'Ошибка удаления'),
    })

    if (isLoading) return 'Загрузка...'

    return (
        <div>
            <h2>Перевозчики</h2>
            <div style={{display:'flex', gap:8, marginBottom:8}}>
                <input placeholder="поиск" value={q} onChange={e=>setQ(e.target.value)} />
                <button onClick={()=>{ setEditing(null); setIsOpen(true); setErrorMsg('') }}>+ Добавить</button>
            </div>

            <table cellPadding="6" border="1" style={{borderCollapse:'collapse', width:'100%'}}>
                <thead>
                <tr><th>ID</th><th>Название</th><th>ИНН</th><th>Телефон</th><th>Email</th><th></th></tr>
                </thead>
                <tbody>
                {data.map(c=>(
                    <tr key={c.id}>
                        <td>{c.id}</td>
                        <td>{c.name}</td>
                        <td>{c.inn ?? ''}</td>
                        <td>{c.phone ?? ''}</td>
                        <td>{c.email ?? ''}</td>
                        <td style={{whiteSpace:'nowrap'}}>
                            <button onClick={()=>{ setEditing(c); setIsOpen(true); setErrorMsg('') }}>Изменить</button>{' '}
                            <button onClick={()=>{ if (confirm(`Удалить перевозчика "${c.name}"?`)) mDelete.mutate(c.id) }}>Удалить</button>
                        </td>
                    </tr>
                ))}
                {data.length === 0 && <tr><td colSpan={6} style={{textAlign:'center', color:'#888'}}>Нет данных</td></tr>}
                </tbody>
            </table>

            {isOpen && (
                <div style={{position:'fixed', inset:0, background:'rgba(0,0,0,.35)', display:'grid', placeItems:'center'}}>
                    <div style={{background:'#fff', padding:16, borderRadius:8}}>
                        <h3 style={{marginTop:0}}>{editing ? 'Редактировать перевозчика' : 'Новый перевозчик'}</h3>

                        {errorMsg && (
                            <div style={{background:'#ffecec', color:'#b00', padding:'8px 10px', borderRadius:6, marginBottom:8}}>
                                {errorMsg}
                            </div>
                        )}

                        <CarrierForm
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
