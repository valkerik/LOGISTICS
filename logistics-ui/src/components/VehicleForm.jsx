import { useEffect, useState } from 'react'

export default function VehicleForm({ initial=null, onSubmit, onCancel }) {
    const [form, setForm] = useState({
        carrierId: '',
        plateNo: '',
        vin: '',
        make: '',
        model: '',
        year: '',
        capacityKg: '',
        type: 'TRUCK',   // enum: TRUCK, VAN, PICKUP, TRAILER, OTHER
        active: true
    })

    useEffect(() => {
        if (initial) {
            setForm({
                carrierId: String(initial.carrierId ?? initial.carrier?.id ?? ''),
                plateNo: initial.plateNo ?? initial.plate_no ?? '',
                vin: initial.vin ?? '',
                make: initial.make ?? '',
                model: initial.model ?? '',
                year: initial.year ?? '',
                capacityKg: String(initial.capacityKg ?? ''),
                type: initial.type ?? 'TRUCK',
                active: Boolean(initial.active ?? true),
            })
        } else {
            setForm({
                carrierId:'', plateNo:'', vin:'', make:'', model:'', year:'',
                capacityKg:'', type:'TRUCK', active:true
            })
        }
    }, [initial])

    const change = e => {
        const { name, value, type, checked } = e.target
        setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }))
    }

    const submit = e => {
        e.preventDefault()
        const common = {
            carrierId: form.carrierId ? Number(form.carrierId) : null,
            plateNo: form.plateNo.trim(),
            vin: form.vin?.trim() || null,
            make: form.make?.trim() || null,
            model: form.model?.trim() || null,
            year: form.year ? Number(form.year) : null,
            capacityKg: form.capacityKg ? Number(form.capacityKg) : null,
            type: form.type, // строго из списка ниже
        }
        // create: без active; update: с active
        const dto = initial ? { ...common, active: !!form.active } : common
        onSubmit(dto)
    }

    return (
        <form onSubmit={submit} style={{display:'grid', gap:8, minWidth:380}}>
            <label>Перевозчик (ID)
                <input name="carrierId" value={form.carrierId} onChange={change} required />
            </label>
            <label>Госномер
                <input name="plateNo" value={form.plateNo} onChange={change} required />
            </label>
            <label>VIN
                <input name="vin" value={form.vin} onChange={change} />
            </label>
            <label>Марка
                <input name="make" value={form.make} onChange={change} />
            </label>
            <label>Модель
                <input name="model" value={form.model} onChange={change} />
            </label>
            <label>Год
                <input name="year" type="number" value={form.year} onChange={change} />
            </label>
            <label>Грузоподъёмность, кг
                <input name="capacityKg" type="number" step="0.01" value={form.capacityKg} onChange={change} required />
            </label>
            <label>Тип
                <select name="type" value={form.type} onChange={change} required>
                    <option value="TRUCK">TRUCK</option>
                    <option value="VAN">VAN</option>
                    <option value="PICKUP">PICKUP</option>
                    <option value="TRAILER">TRAILER</option>
                    <option value="OTHER">OTHER</option>
                </select>
            </label>

            {initial && (
                <label>
                    <input name="active" type="checkbox" checked={form.active} onChange={change} /> Активен
                </label>
            )}

            <div style={{display:'flex', gap:8, marginTop:4}}>
                <button type="submit">Сохранить</button>
                <button type="button" onClick={onCancel}>Отмена</button>
            </div>
        </form>
    )
}
