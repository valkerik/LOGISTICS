// components/ClientForm.jsx
import { useState, useEffect } from 'react'

export default function ClientForm({ initial = null, onSubmit, onCancel }) {
    const [form, setForm] = useState({
        name: '', phone: '', email: '', inn: '', kpp: '', address: ''
    })

    useEffect(() => {
        if (initial) {
            setForm({
                name: initial.name || '',
                phone: initial.phone || '',
                email: initial.email || '',
                inn: initial.inn || '',
                kpp: initial.kpp || '',
                address: initial.address || '',
            })
        } else {
            setForm({ name: '', phone: '', email: '', inn: '', kpp: '', address: '' })
        }
    }, [initial])

    const change = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))
    const submit = e => { e.preventDefault(); onSubmit(form) }

    return (
        <form onSubmit={submit} style={{ display: 'grid', gap: 8, minWidth: 360 }}>
            <label>Название
                <input name="name" value={form.name} onChange={change} required />
            </label>
            <label>ИНН
                <input name="inn" value={form.inn} onChange={change} />
            </label>
            <label>КПП
                <input name="kpp" value={form.kpp} onChange={change} />
            </label>
            <label>Телефон
                <input name="phone" value={form.phone} onChange={change} />
            </label>
            <label>Email
                <input name="email" type="email" value={form.email} onChange={change} />
            </label>
            <label>Адрес
                <input name="address" value={form.address} onChange={change} />
            </label>
            <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                <button type="submit">Сохранить</button>
                <button type="button" onClick={onCancel}>Отмена</button>
            </div>
        </form>
    )
}
