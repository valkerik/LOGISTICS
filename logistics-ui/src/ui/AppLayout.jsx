// src/ui/AppLayout.jsx
import { Outlet, NavLink } from 'react-router-dom'

export default function AppLayout(){
    const linkStyle = ({ isActive }) => ({
        padding: '6px 10px',
        textDecoration: 'none',
        color: isActive ? '#fff' : '#0366d6',
        background: isActive ? '#0366d6' : 'transparent',
        borderRadius: 6,
        fontWeight: 600,
    })

    return (
        <div style={{fontFamily:'system-ui', padding:16}}>
            <header style={{display:'flex', gap:12, marginBottom:16}}>
                <NavLink to="/shipments" style={linkStyle}>Перевозки</NavLink>
                <NavLink to="/clients"   style={linkStyle}>Клиенты</NavLink>
                <NavLink to="/drivers"   style={linkStyle}>Водители</NavLink>
                <NavLink to="/vehicles"  style={linkStyle}>Транспорт</NavLink>
                <NavLink to="/carriers"  style={linkStyle}>Перевозчики</NavLink>
            </header>
            <Outlet/>
        </div>
    )
}
