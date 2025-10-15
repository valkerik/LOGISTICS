// статусы перевозок (должны совпадать с бэком)
export const SHIPMENT_STATUSES = [
    'NEW',
    'ASSIGNED',
    'IN_TRANSIT',
    'DELIVERED',
    'CANCELLED',
]

// читаемые названия (если нужно в UI)
export const SHIPMENT_STATUS_LABEL = {
    NEW: 'Новая',
    ASSIGNED: 'Назначена',
    IN_TRANSIT: 'В пути',
    DELIVERED: 'Доставлена',
    CANCELLED: 'Отменена',
}

// роли пользователей (как в enum UserRole на бэке)
export const USER_ROLES = ['ADMIN', 'MANAGER', 'VIEWER']

export const USER_ROLE_LABEL = {
    ADMIN: 'Администратор',
    MANAGER: 'Менеджер',
    VIEWER: 'Просмотр',
}
