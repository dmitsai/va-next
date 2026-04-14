import { Roles } from '@prisma/client';
import type { ReactNode } from 'react';
import { Divider } from '~/entities/divider';
import { getServerAuthSession } from '~/server/auth';
import { ensureAdminExists } from '~/server/services/ensure-admin';
import { AdminLogin, AdminSidebar } from '~/widgets/admin';

const AdminLayout = async ({ children }: { children: ReactNode }) => {
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
        <div className="flex min-h-screen bg-base">
            <AdminSidebar />
            <Divider view={'vertical'} />
            <main className="flex-1 overflow-auto px-8 py-6">{children}</main>
        </div>
    );
};

export default AdminLayout;
