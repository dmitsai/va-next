import bcrypt from 'bcrypt';
import { Roles } from '@prisma/client';
import { type NextRequest, NextResponse } from 'next/server';
import { prisma } from '~/server/db/db';
import {
    type SignUpCredentialsSchema,
    signUpCredentialsSchema,
} from '~/shared/api/schema/singUpViaEmail';

export const POST = async (request: NextRequest) => {
    const input = (await request.json()) as SignUpCredentialsSchema;
    signUpCredentialsSchema.parse(input);

    const exist = await prisma.users.findUnique({
        where: { email: input.data.email },
    });

    if (exist) {
        return NextResponse.json(
            { message: 'Пользователь с такой почтой уже существует' },
            { status: 409 }
        );
    }

    const hashedPassword = await bcrypt.hash(input.data.password, 10);

    const result = await prisma.$transaction(async (prisma) => {
        const user = await prisma.users.create({
            data: {
                email: input.data.email,
                password_hash: hashedPassword,
                role: Roles.USER,
            },
        });

        // NOTE: temp solution
        const currency = await prisma.currency.findUnique({
            where: { title: 'RUB' },
        });
        if (!currency) {
            throw new Error('Currency not found');
        }
        const clientProfile = await prisma.clientProfile.create({
            data: {
                user_id: user.user_id,
                email: input.data.email,
                currency_id: currency.currency_id,
            },
        });
        return { user, clientProfile };
    });

    return new NextResponse(JSON.stringify({ user_id: result.user.user_id }), {
        status: 201,
    });
};
