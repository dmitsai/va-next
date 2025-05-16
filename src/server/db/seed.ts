import { Roles } from '@prisma/client';
import bcrypt from 'bcrypt';
import { prisma } from './db';

const seed = async () => {
    const initCurrency = await prisma.currency.createMany({
        data: [
            { title: 'RUB', char: '₽' },
            { title: 'USD', char: '$' },
            { title: 'EURO', char: '€' },
        ],
        skipDuplicates: true,
    });

    const hashedPassword = await bcrypt.hash('Password!1', 10);

    const testUser = await prisma.users.create({
        data: {
            email: 'testcompany@gmail.com',
            password_hash: hashedPassword,
            role: Roles.COMPANY,
        },
    });

    const testCompany = await prisma.companyProfile.create({
        data: {
            title: 'Test-Company',
            description: 'Test description',
            user_id: testUser.user_id,
            imgUrl: 'https://example.com/company-logo.jpg',
            phone: '+1234567899',
            email: 'contactTESTCOMPANY@tcompany.com',
            website: 'https://testcompany.com',
        },
    });

    const rubCurrency = await prisma.currency.findFirst({
        where: { title: 'RUB' },
    });
    const usdCurrency = await prisma.currency.findFirst({
        where: { title: 'USD' },
    });

    if (!rubCurrency || !usdCurrency) {
        throw new Error('Currencies not found');
    }

    const userCreationPromises = Array.from(
        { length: 10 },
        (_, i) => i + 1
    ).map(async (i) => {
        const user = await prisma.users.create({
            data: {
                email: `user${i}@example.com`,
                password_hash: hashedPassword,
                role: Roles.USER,
            },
        });

        const currencyId =
            i % 2 === 0 ? usdCurrency.currency_id : rubCurrency.currency_id;

        await prisma.clientProfile.create({
            data: {
                name: `User${i}`,
                surname: `Testov${i}`,
                imgUrl: `https://example.com/avatar${i}.jpg`,
                phone: `+123456789${i}`,
                email: `user${i}@example.com`,
                about_me: `I'm test user #${i} looking for a job`,
                salaryFrom: 30000 + i * 10000,
                currency_id: currencyId,
                user_id: user.user_id,
            },
        });

        return user;
    });

    const users = await Promise.all(userCreationPromises);

    const vacancy1 = await prisma.vacancy.create({
        data: {
            title: 'Frontend Developer (React)',
            company_id: testCompany.company_id,
            salaryFrom: 100000,
            salaryTo: 150000,
            currency_id: rubCurrency.currency_id,
            description:
                'We are looking for an experienced Frontend Developer with React knowledge.',
            imgUrl: 'https://example.com/frontend-vacancy.jpg',
        },
    });

    const vacancy2 = await prisma.vacancy.create({
        data: {
            title: 'Backend Developer (Node.js)',
            company_id: testCompany.company_id,
            salaryFrom: 2000,
            salaryTo: 3000,
            currency_id: usdCurrency.currency_id,
            description:
                'Looking for a skilled Backend Developer with Node.js experience.',
            imgUrl: 'https://example.com/backend-vacancy.jpg',
        },
    });

    const applicationPromises = users.flatMap((user) => [
        prisma.application.create({
            data: {
                vacancy_id: vacancy1.vacancy_id,
                user_id: user.user_id,
            },
        }),
        prisma.application.create({
            data: {
                vacancy_id: vacancy2.vacancy_id,
                user_id: user.user_id,
            },
        }),
    ]);

    await Promise.all(applicationPromises);

    console.log('Seed completed successfully!');
    console.log({
        company: testCompany,
        usersCount: users.length,
        vacancies: [vacancy1, vacancy2],
    });
};

seed()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error('Seed error:', e);
        await prisma.$disconnect();
        process.exit(1);
    });
