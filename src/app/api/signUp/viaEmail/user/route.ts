import bcrypt from 'bcrypt';
import { Roles } from '@prisma/client';
import { type NextRequest, NextResponse } from 'next/server';
import { prisma } from '~/server/db/db';
import { type SignUpCredentialsSchema, signUpCredentialsSchema } from '~/shared/api/schema/singUpViaEmail';

export const POST = async (request: NextRequest) => {
    const input = (await request.json()) as SignUpCredentialsSchema;
    signUpCredentialsSchema.parse(input);

    const exist = await prisma.users.findUnique({ where: { email: input.data.email } });

    if (exist) {
        return NextResponse.json({ message: 'Пользователь с такой почтой уже существует' }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(input.data.password, 10);

    await prisma.users.create({
        data: {
            email: input.data.email,
            password_hash: hashedPassword,
            role: Roles.USER
        },
    });

    return new NextResponse(undefined, { status: 201 });
};