import { Roles } from '@prisma/client';
import bcrypt from 'bcrypt';
import { prisma } from './db';
import { seedSkills } from './seeds/skills';

const PLATFORMS = [
    { name: 'local', title: 'Наша платформа' },
    { name: 'hh', title: 'HeadHunter', baseUrl: 'https://hh.ru' },
    { name: 'trudvsem', title: 'Труд Всём (Роструд)', baseUrl: 'https://trudvsem.ru' },
    { name: 'jobicy', title: 'Jobicy (Remote Jobs)', baseUrl: 'https://jobicy.com' },
    { name: 'remotive', title: 'Remotive (Remote Jobs)', baseUrl: 'https://remotive.com' },
];

const CURRENCIES = [
    { title: 'Российский рубль', char: '₽', code: 'RUB' },
    { title: 'Доллар США', char: '$', code: 'USD' },
    { title: 'Евро', char: '€', code: 'EUR' },
    { title: 'Тенге', char: '₸', code: 'KZT' },
    { title: 'Белорусский рубль', char: 'Br', code: 'BYR' },
    { title: 'Гривна', char: '₴', code: 'UAH' },
];

const seedCurrency = async (c: (typeof CURRENCIES)[number]) => {
    const existing = await prisma.currency.findFirst({
        where: { OR: [{ title: c.title }, { char: c.char }] },
    });

    if (existing) {
        await prisma.currency.update({
            where: { currency_id: existing.currency_id },
            data: { code: c.code },
        });
    } else {
        await prisma.currency.create({ data: c });
    }
};

const seed = async () => {
    await Promise.all(
        PLATFORMS.map((p) =>
            prisma.platform.upsert({
                where: { name: p.name },
                update: { title: p.title, baseUrl: p.baseUrl },
                create: p,
            }),
        ),
    );
    console.log('Platforms seeded');

    await Promise.all(CURRENCIES.map((c) => seedCurrency(c)));
    console.log('Currencies seeded');

    const hashedPassword = await bcrypt.hash('password', 10);

    const localPlatform = await prisma.platform.findUnique({
        where: { name: 'local' },
    });

    const testUser = await prisma.users.upsert({
        where: { email: 'company@gmail.com' },
        update: {},
        create: {
            email: 'company@gmail.com',
            password_hash: hashedPassword,
            role: Roles.COMPANY,
        },
    });

    const testCompany = await prisma.companyProfile.upsert({
        where: { user_id: testUser.user_id },
        update: {},
        create: {
            title: 'T-Company',
            description: 'Test description',
            user_id: testUser.user_id,
            imgUrl: 'https://example.com/company-logo.jpg',
            phone: '+1234567899',
            email: 'contactTESTCOMPANY@tcompany.com',
            website: 'https://testcompany.com',
        },
    });

    await seedSkills(prisma);

    console.log('Seed completed successfully!');
    console.log({
        user: testUser.user_id,
        company: testCompany.company_id,
        platform: localPlatform?.platform_id,
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
