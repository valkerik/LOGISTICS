import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { listClients, createClient, updateClient, deleteClient } from '../api/clients'
import ClientForm from '../components/ClientForm.jsx'
import { useState } from 'react'

export default function ClientsPage(){
    const qc = useQueryClient()
    const [page, setPage] = useState(0)
    const [q, setQ] = useState('')
    const [editing, setEditing] = useState(null)   // объект клиента или null
    const [isOpen, setIsOpen] = useState(false)    // показ формы

    const { data, isLoading } = useQuery({
        queryKey:['clients', page, q],
        queryFn:()=>listClients(page, 20, q),
        keepPreviousData:true
    })

    const mCreate = useMutation({
        mutationFn: (dto) => createClient(dto),
        onSuccess: () => { setIsOpen(false); qc.invalidateQueries({queryKey:['clients']}) }
    })

    const mUpdate = useMutation({
        mutationFn: ({id, dto}) => updateClient(id, dto),
        onSuccess: () => { setIsOpen(false); setEditing(null); qc.invalidateQueries({queryKey:['clients']}) }
    })

    const mDelete = useMutation({
        mutationFn: (id) => deleteClient(id),
        onSuccess: () => qc.invalidateQueries({queryKey:['clients']})
    })

    if (isLoading) return 'Загрузка...'
    const content = data?.content ?? []
    const totalPages = data?.totalPages ?? 1

    return (
        <div>
            <h2>Клиенты</h2>

            <div style={{display:'flex', gap:8, marginBottom:8}}>
                <input placeholder="поиск" value={q} onChange={e=>{setPage(0); setQ(e.target.value)}} />
                <button onClick={()=>{ setEditing(null); setIsOpen(true) }}>+ Добавить</button>
            </div>

            {/* таблица */}
            <table cellPadding="6" border="1" style={{borderCollapse:'collapse', width:'100%'}}>
                <thead><tr><th>ID</th><th>Название</th><th>Телефон</th><th>Email</th><th></th></tr></thead>
                <tbody>
                {content.map(c=>(
                    <tr key={c.id}>
                        <td>{c.id}</td>
                        <td>{c.name}</td>
                        <td>{c.phone}</td>
                        <td>{c.email}</td>
                        <td style={{whiteSpace:'nowrap'}}>
                            <button onClick={()=>{ setEditing(c); setIsOpen(true) }}>Изменить</button>{' '}
                            <button onClick={()=>{ if (confirm(`Удалить клиента "${c.name}"?`)) mDelete.mutate(c.id) }}>Удалить</button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            <div style={{marginTop:12, display:'flex', gap:8}}>
                <button disabled={page<=0} onClick={()=>setPage(p=>p-1)}>Назад</button>
                <span>стр. {page+1} из {totalPages}</span>
                <button disabled={page>=totalPages-1} onClick={()=>setPage(p=>p+1)}>Вперёд</button>
            </div>

            {/* простейшее модальное окно на диве */}
            {isOpen && (
                <div style={{
                    position:'fixed', inset:0, background:'rgba(0,0,0,.35)',
                    display:'grid', placeItems:'center'
                }}>
                    <div style={{background:'#fff', padding:16, borderRadius:8}}>
                        <h3 style={{marginTop:0}}>{editing ? 'Редактировать клиента' : 'Новый клиент'}</h3>
                        <ClientForm
                            initial={editing}
                            onSubmit={(dto)=> editing ? mUpdate.mutate({id: editing.id, dto}) : mCreate.mutate(dto)}
                            onCancel={()=>{ setIsOpen(false); setEditing(null) }}
                        />
                    </div>
                </div>
            )}
        </div>
    )
}
