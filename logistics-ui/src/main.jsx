import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import AppLayout from './ui/AppLayout.jsx'
import ClientsPage from './pages/ClientsPage.jsx'
import ShipmentsPage from './pages/ShipmentsPage.jsx'
import ShipmentView from './pages/ShipmentView.jsx'
import DriversPage from './pages/DriversPage.jsx'
import VehiclesPage from './pages/VehiclesPage.jsx'
import CarriersPage from './pages/CarriersPage.jsx'

const qc = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            retry: 1,
        },
    },
})

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <QueryClientProvider client={qc}>
            <BrowserRouter>
                <Routes>
                    <Route element={<AppLayout/>}>
                        <Route path="/" element={<Navigate to="/shipments" />} />
                        <Route path="/clients" element={<ClientsPage/>} />
                        <Route path="/shipments" element={<ShipmentsPage/>} />
                        <Route path="/shipments/:id" element={<ShipmentView/>} />
                        <Route path="/clients" element={<ClientsPage/>} />
                        <Route path="/drivers" element={<DriversPage/>} />
                        <Route path="/vehicles" element={<VehiclesPage/>} />
                        <Route path="/carriers" element={<CarriersPage/>} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </QueryClientProvider>
    </React.StrictMode>
)
