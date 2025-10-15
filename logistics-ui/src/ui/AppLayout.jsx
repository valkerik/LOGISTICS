import { Outlet, Link, useLocation } from 'react-router-dom'

export default function AppLayout(){
    const { pathname } = useLocation()
    return (
        <div style={{fontFamily:'system-ui', padding:16}}>
            <header style={{display:'flex', gap:12, marginBottom:16}}>
                <Link to="/shipments" style={{fontWeight: pathname.startsWith('/shipments')?'700':'400'}}>Перевозки</Link>
                <Link to="/clients" style={{fontWeight: pathname.startsWith('/clients')?'700':'400'}}>Клиенты</Link>
            </header>
            <Outlet/>
        </div>
    )
}
