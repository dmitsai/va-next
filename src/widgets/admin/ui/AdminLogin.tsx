'use client';

import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState, type FormEvent } from 'react';

export const AdminLogin = () => {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const result = await signIn('credentials', {
            email,
            password,
            redirect: false,
        });

        if (result?.error) {
            setError(result.error);
            setLoading(false);
            return;
        }

        router.refresh();
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="flex w-full max-w-sm flex-col gap-4 rounded-10 border border-surface0 bg-mantle p-8"
        >
            <h2 className="text-center">Админ-панель</h2>

            {error && (
                <p className="rounded-md bg-red/10 px-3 py-2 text-sm text-red">
                    {error}
                </p>
            )}

            <label className="flex flex-col gap-1">
                <span className="small text-subtext0">Email</span>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="rounded-md border border-surface1 bg-surface0 px-3 py-2 text-text outline-none transition focus:border-mauve"
                    placeholder="admin@example.com"
                />
            </label>

            <label className="flex flex-col gap-1">
                <span className="small text-subtext0">Пароль</span>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="rounded-md border border-surface1 bg-surface0 px-3 py-2 text-text outline-none transition focus:border-mauve"
                    placeholder="••••••••"
                />
            </label>

            <button
                type="submit"
                disabled={loading}
                className="rounded-md bg-mauve px-4 py-2 font-semibold text-base transition hover:opacity-90 disabled:opacity-50"
            >
                {loading ? 'Вход...' : 'Войти'}
            </button>
        </form>
    );
};
