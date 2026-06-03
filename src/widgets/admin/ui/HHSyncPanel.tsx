'use client';

export const HHSyncPanel = () => {
    return (
        <div className="rounded-8 border border-surface-tertiary bg-mantle/50">
            <div className="flex items-start gap-4 px-4 py-4">
                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-6 bg-red/10">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="8" x2="12" y2="12" />
                        <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                </div>
                <div className="flex-1">
                    <div className="flex items-center gap-2">
                        <p className="text-13 font-500 text-text">Синхронизация с HH.ru</p>
                        <span className="rounded-6 bg-red/10 px-1.5 py-0.5 text-11 text-red">
                            Недоступно
                        </span>
                    </div>
                    <p className="mt-1 text-12 text-sub">
                        Поддержка публичного API HH.ru для соискателей прекращена 15 декабря 2025 года.
                        Все запросы возвращают 403 Forbidden.
                    </p>
                    <p className="mt-2 text-12 text-overlay0">
                        Используйте <span className="text-teal">Remotive</span> или <span className="text-green">Trudvsem</span> для импорта вакансий.
                    </p>
                </div>
            </div>
        </div>
    );
};
