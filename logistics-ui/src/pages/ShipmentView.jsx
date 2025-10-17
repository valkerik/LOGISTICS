import { useParams } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getShipment, updateShipmentStatus, assignShipment } from '../api/shipments'
import { listVehicles } from '../api/vehicles'
import { listDrivers } from '../api/drivers'
import { useEffect, useMemo, useState } from 'react'
import { SHIPMENT_STATUSES, SHIPMENT_STATUS_LABEL } from '../constants'

export default function ShipmentView(){
    const { id } = useParams()
    const qc = useQueryClient()

    // 1) перевозка
    const { data: s, isLoading } = useQuery({
        queryKey:['shipment', id],
        queryFn:()=>getShipment(id)
    })

    const carrierId = useMemo(()=> s?.carrierId ?? s?.carrier?.id ?? null, [s])

    // 2) ТС (бэк фильтрует по carrierId)
    const { data: vehiclesPage } = useQuery({
        queryKey: ['vehicles', carrierId],
        queryFn: () => listVehicles({ carrierId, active: true, page: 0, size: 200 }),
        enabled: !!carrierId
    })

    // 3) Водители (бэк отдаёт всех активных → фильтруем на клиенте)
    const { data: allDrivers } = useQuery({
        queryKey: ['drivers', 'active'],
        queryFn: () => listDrivers()
    })

    const drivers = useMemo(()=>{
        if (!allDrivers || !carrierId) return allDrivers || []
        return allDrivers.filter(d => (d.carrierId ?? d.carrier?.id) === carrierId)
    }, [allDrivers, carrierId])

    const vehicles = vehiclesPage?.content ?? [] // Page<Vehicle>

    // 4) локальные состояния
    const [status, setStatus] = useState('')
    const [vehicleId, setVehicleId] = useState(null)
    const [driverId, setDriverId] = useState(null)

    useEffect(()=>{
        if (!s) return
        setVehicleId(s.vehicleId ?? s.vehicle?.id ?? null)
        setDriverId(s.driverId ?? s.driver?.id ?? null)
    }, [s])

    // 5) мутации
    const mutStatus = useMutation({
        mutationFn: (st)=>updateShipmentStatus(id, st),
        onSuccess: ()=>{
            qc.invalidateQueries({ queryKey:['shipment', id] })
            qc.invalidateQueries({ queryKey:['shipments'] })
            setStatus('')
        }
    })

    const mutAssign = useMutation({
        mutationFn: () => assignShipment(id, {
            vehicleId: vehicleId || null,
            driverId:  driverId  || null,
        }),
        onSuccess: ()=>{
            qc.invalidateQueries({ queryKey:['shipment', id] })
            qc.invalidateQueries({ queryKey:['shipments'] })
        }
    })

    if (isLoading) return 'Загрузка...'
    if (!s) return 'Не найдено'

    return (
        <div>
            <h2>Перевозка #{s.id}</h2>

            <p><b>Клиент:</b> {s.clientName || s.client?.name}</p>
            <p><b>Перевозчик:</b> {s.carrierName || s.carrier?.name}</p>

            {/* статус */}
            <div style={{display:'flex', gap:8, alignItems:'center', marginTop:8, marginBottom:16}}>
                <div><b>Статус:</b> {s.status}</div>
                <select value={status} onChange={e=>setStatus(e.target.value)}>
                    <option value="">— сменить статус —</option>
                    {SHIPMENT_STATUSES.map(x=>
                        <option key={x} value={x}>{SHIPMENT_STATUS_LABEL?.[x] || x}</option>
                    )}
                </select>
                <button disabled={!status || mutStatus.isPending} onClick={()=>mutStatus.mutate(status)}>
                    {mutStatus.isPending?'Сохраняю...':'Обновить статус'}
                </button>
            </div>

            {/* назначение */}
            <div style={{border:'1px solid #ccc', borderRadius:8, padding:12, maxWidth:520}}>
                <h3 style={{marginTop:0}}>Назначение</h3>

                <div style={{display:'grid', gap:10}}>
                    <label>
                        Транспортное средство
                        <select
                            value={vehicleId ?? ''}
                            onChange={e=>setVehicleId(e.target.value ? Number(e.target.value) : null)}
                            style={{display:'block', width:'100%', marginTop:4}}
                        >
                            <option value="">— не назначено —</option>
                            {vehicles.map(v=>(
                                <option key={v.id} value={v.id}>
                                    {v.plateNo ?? v.plate_no ?? '(без номера)'}
                                    {v.type ? ` — ${v.type}` : ''}
                                </option>
                            ))}
                        </select>
                    </label>

                    <label>
                        Водитель
                        <select
                            value={driverId ?? ''}
                            onChange={e=>setDriverId(e.target.value ? Number(e.target.value) : null)}
                            style={{display:'block', width:'100%', marginTop:4}}
                        >
                            <option value="">— не назначен —</option>
                            {drivers.map(d=>(
                                <option key={d.id} value={d.id}>
                                    {d.fullName ?? d.full_name ?? '(без имени)'}
                                </option>
                            ))}
                        </select>
                    </label>

                    <div style={{display:'flex', gap:8}}>
                        <button
                            disabled={mutAssign.isPending}
                            onClick={()=>mutAssign.mutate()}
                        >
                            {mutAssign.isPending ? 'Сохраняю...' : 'Сохранить назначение'}
                        </button>
                        <button
                            type="button"
                            onClick={()=>{
                                setVehicleId(s.vehicleId ?? s.vehicle?.id ?? null)
                                setDriverId(s.driverId ?? s.driver?.id ?? null)
                            }}
                        >
                            Отменить изменения
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
