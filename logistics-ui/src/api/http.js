import axios from 'axios'

export const http = axios.create({
    baseURL: '/api', // проксируется Vite на 8080
})

// перехватчик для токена (если добавим логин)
http.interceptors.request.use(cfg => {
    const t = localStorage.getItem('token')
    if (t) cfg.headers.Authorization = `Bearer ${t}`
    return cfg
})
