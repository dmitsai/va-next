import { Roles } from '@prisma/client';
import { getServerAuthSession } from '~/server/auth';
import { ensureAdminExists } from '~/server/services/ensure-admin';
import { AdminLogin } from './_components/AdminLogin';
import { AdminPanel } from './_components/AdminPanel';

export default async function AdminPage() {
    await ensureAdminExists();

    const session = await getServerAuthSession();
    const isAdmin = session?.user?.role === Roles.ADMIN;

    if (!session || !isAdmin) {
        return (
            <main className="flex min-h-screen items-center justify-center">
                <AdminLogin />
            </main>
        );
    }

    return (
        <main className="mx-auto w-full max-w-5xl px-4 py-8">
            <AdminPanel userEmail={session.user.email ?? ''} />
        </main>
    );
}
