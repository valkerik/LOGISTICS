import { useEffect, useState } from 'react'

export default function DriverForm({ initial=null, onSubmit, onCancel }) {
    const [form, setForm] = useState({
        carrierId: '',        // required (Long)
        fullName: '',         // required
        licenseNumber: '',    // required
        licenseValidUntil: '',// required (yyyy-MM-dd)
        phone: ''             // optional
    })

    useEffect(() => {
        if (initial) {
            setForm({
                carrierId: String(initial.carrierId ?? initial.carrier?.id ?? ''),
                fullName: initial.fullName ?? initial.full_name ?? '',
                licenseNumber: initial.licenseNumber ?? '',
                licenseValidUntil: (initial.licenseValidUntil ?? '').slice(0,10),
                phone: initial.phone ?? '',
            })
        } else {
            setForm({ carrierId:'', fullName:'', licenseNumber:'', licenseValidUntil:'', phone:'' })
        }
    }, [initial])

    const change = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

    const submit = e => {
        e.preventDefault()
        const dto = {
            carrierId: form.carrierId ? Number(form.carrierId) : null,
            fullName: form.fullName.trim(),
            licenseNumber: form.licenseNumber.trim(),
            // input type=date отдаёт "YYYY-MM-DD" — это ок для LocalDate
            licenseValidUntil: form.licenseValidUntil,
            phone: form.phone || null,
        }
        onSubmit(dto)
    }

    return (
        <form onSubmit={submit} style={{display:'grid', gap:8, minWidth:360}}>
            <label>Перевозчик (ID)
                <input name="carrierId" value={form.carrierId} onChange={change} required />
            </label>
            <label>ФИО
                <input name="fullName" value={form.fullName} onChange={change} required />
            </label>
            <label>Номер прав
                <input name="licenseNumber" value={form.licenseNumber} onChange={change} required />
            </label>
            <label>Права действительны до
                <input name="licenseValidUntil" type="date" value={form.licenseValidUntil} onChange={change} required />
            </label>
            <label>Телефон
                <input name="phone" value={form.phone} onChange={change} />
            </label>
            <div style={{display:'flex', gap:8, marginTop:4}}>
                <button type="submit">Сохранить</button>
                <button type="button" onClick={onCancel}>Отмена</button>
            </div>
        </form>
    )
}
