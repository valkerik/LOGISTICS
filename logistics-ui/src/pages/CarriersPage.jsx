import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { listCarriers, deleteCarrier } from '../api/carriers'
import { useState } from 'react'

export default function CarriersPage() {
    const qc = useQueryClient()
    const [q, setQ] = useState('')

    const { data = [], isLoading } = useQuery({
        queryKey: ['carriers', q],
        queryFn: () => listCarriers(q),
    })

    const mDelete = useMutation({
        mutationFn: (id) => deleteCarrier(id),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['carriers'] }),
    })

    if (isLoading) return 'Загрузка...'

    return (
        <div>
            <h2>Перевозчики</h2>
            <div style={{display:'flex', gap:8, marginBottom:8}}>
                <input placeholder="поиск" value={q} onChange={e=>setQ(e.target.value)} />
                {/* +Добавить сделаем, когда будет форма */}
            </div>

            <table cellPadding="6" border="1" style={{borderCollapse:'collapse', width:'100%'}}>
                <thead>
                <tr>
                    <th>ID</th><th>Название</th><th>ИНН</th><th>Телефон</th><th>Email</th><th></th>
                </tr>
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
                            {/* <button onClick={()=>...}>Изменить</button>{' '} */}
                            <button onClick={()=>{ if (confirm(`Удалить перевозчика "${c.name}"?`)) mDelete.mutate(c.id) }}>
                                Удалить
                            </button>
                        </td>
                    </tr>
                ))}
                {data.length === 0 && <tr><td colSpan={6} style={{textAlign:'center', color:'#888'}}>Нет данных</td></tr>}
                </tbody>
            </table>
        </div>
    )
}
