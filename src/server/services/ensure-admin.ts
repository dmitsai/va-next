import { Roles } from '@prisma/client';
import { hash } from 'bcrypt';
import { prisma } from '~/server/db/db';

export async function ensureAdminExists() {
    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASSWORD;

    if (!email || !password) {
        console.warn(
            'ADMIN_EMAIL or ADMIN_PASSWORD not set — skipping admin init',
        );
        return null;
    }

    const passwordHash = await hash(password, 10);

    const admin = await prisma.users.upsert({
        where: { email },
        update: {},
        create: {
            email,
            password_hash: passwordHash,
            role: Roles.ADMIN,
        },
    });

    return admin;
}
