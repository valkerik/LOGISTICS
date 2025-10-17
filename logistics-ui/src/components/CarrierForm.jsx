import { useEffect, useState } from 'react'

export default function CarrierForm({ initial=null, onSubmit, onCancel }) {
    const [form, setForm] = useState({ name:'', inn:'', phone:'', email:'' })

    useEffect(() => {
        if (initial) {
            setForm({
                name:  initial.name  ?? '',
                inn:   initial.inn   ?? '',
                phone: initial.phone ?? '',
                email: initial.email ?? '',
            })
        } else {
            setForm({ name:'', inn:'', phone:'', email:'' })
        }
    }, [initial])

    const change = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))
    const submit = e => { e.preventDefault(); onSubmit(form) }

    return (
        <form onSubmit={submit} style={{display:'grid', gap:8, minWidth:360}}>
            <label>Название
                <input name="name" value={form.name} onChange={change} required />
            </label>
            <label>ИНН
                <input name="inn" value={form.inn} onChange={change} />
            </label>
            <label>Телефон
                <input name="phone" value={form.phone} onChange={change} />
            </label>
            <label>Email
                <input name="email" type="email" value={form.email} onChange={change} />
            </label>
            <div style={{display:'flex', gap:8, marginTop:4}}>
                <button type="submit">Сохранить</button>
                <button type="button" onClick={onCancel}>Отмена</button>
            </div>
        </form>
    )
}
