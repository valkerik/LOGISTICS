import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { listDrivers, deleteDriver } from '../api/drivers'
import { useState } from 'react'

export default function DriversPage() {
    const qc = useQueryClient()
    const [q, setQ] = useState('')

    const { data = [], isLoading } = useQuery({
        queryKey: ['drivers', q],
        queryFn: () => listDrivers(q ? { q } : {}),
    })

    const mDelete = useMutation({
        mutationFn: (id) => deleteDriver(id),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['drivers'] }),
    })

    if (isLoading) return 'Загрузка...'

    return (
        <div>
            <h2>Водители</h2>
            <div style={{display:'flex', gap:8, marginBottom:8}}>
                <input placeholder="поиск" value={q} onChange={e=>setQ(e.target.value)} />
                {/* здесь позже можно добавить кнопку +Добавить с формой */}
            </div>

            <table cellPadding="6" border="1" style={{borderCollapse:'collapse', width:'100%'}}>
                <thead>
                <tr>
                    <th>ID</th><th>ФИО</th><th>Телефон</th><th>Перевозчик</th><th></th>
                </tr>
                </thead>
                <tbody>
                {data.map(d=>(
                    <tr key={d.id}>
                        <td>{d.id}</td>
                        <td>{d.fullName ?? d.full_name ?? d.name ?? '(нет данных)'}</td>
                        <td>{d.phone ?? ''}</td>
                        <td>{d.carrierName ?? d.carrier?.name ?? ''}</td>
                        <td style={{whiteSpace:'nowrap'}}>
                            {/* <button onClick={()=>...}>Изменить</button>{' '} */}
                            <button onClick={()=>{ if (confirm('Удалить водителя?')) mDelete.mutate(d.id) }}>Удалить</button>
                        </td>
                    </tr>
                ))}
                {data.length === 0 && <tr><td colSpan={5} style={{textAlign:'center', color:'#888'}}>Нет данных</td></tr>}
                </tbody>
            </table>
        </div>
    )
}
