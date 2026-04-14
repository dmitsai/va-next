import { RouterOutputs } from 'trpc/shared';

export type DashboardStats = RouterOutputs['admin']['getStats'];

export const STATUS_DOT: Record<string, string> = {
    COMPLETED: 'bg-green',
    FAILED: 'bg-red',
    RUNNING: 'bg-yellow animate-pulse',
};

export const STATUS_LABELS: Record<string, string> = {
    COMPLETED: 'Готово',
    FAILED: 'Ошибка',
    RUNNING: 'В процессе',
};

export const ROLE_LABELS: Record<string, string> = {
    ADMIN: 'Админы',
    USER: 'Кандидаты',
    COMPANY: 'Компании',
    GUEST: 'Гости',
};

export const ROLE_COLORS: Record<string, string> = {
    ADMIN: 'text-red',
    USER: 'text-blue',
    COMPANY: 'text-peach',
    GUEST: 'text-overlay1',
};

export const formatDateTime = (date: Date | string) =>
    new Date(date).toLocaleString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
    });
