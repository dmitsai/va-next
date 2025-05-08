import { Roles } from '@prisma/client';
import bcrypt from 'bcrypt';
import { prisma } from './db';

const seed = async () => {
    const hashedPassword = await bcrypt.hash('password', 10);

    const testUser = await prisma.users.create({
        data: {
            email: 'company@gmail.com',
            password_hash: hashedPassword,
            role: Roles.COMPANY,
        },
    });

    const testCompany = await prisma.companyProfile.create({
        data: {
            title: 'T-Company',
            description: 'Test description',
            user_id: testUser.user_id,
            imgUrl: 'https://example.com/company-logo.jpg',
            phone: '+1234567890',
            email: 'contact@tcompany.com',
            website: 'https://tcompany.com',
        },
    });

    // const testTags = await prisma.tag.createMany({
    //   data: [
    //     {
    //       title: "Moscow",
    //       localTitle: "Москва",
    //     },
    //     {
    //       title: "Exp.1-3",
    //       localTitle: "Опыт работы 1 - 3 года",
    //     },
    //     {
    //       title: "remotely",
    //       localTitle: "Удаленная работа",
    //     },
    //     {
    //       title: "Design",
    //       localTitle: "Дизайн",
    //     },
    //   ],
    // });

    // const tags = await prisma.tag.findMany();

    // // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    // const vacancy1 = await prisma.vacancy.create({
    //   data: {
    //     title: "UI/UX Designer",
    //     company_id: testCompany.company_id,
    //     salaryFrom: "100000",
    //     salaryTo: "150000",
    //     description:
    //       "We are looking for an experienced UI/UX Designer to join our team.",
    //     lan: "55.7558",
    //     lng: "37.6173",
    //     imgUrl: "https://example.com/designer-vacancy.jpg",
    //     tags: {
    //       connect: [
    //         { tag_id: tags.find((t) => t.title === "Moscow")?.tag_id },
    //         { tag_id: tags.find((t) => t.title === "Exp.1-3")?.tag_id },
    //         { tag_id: tags.find((t) => t.title === "Design")?.tag_id },
    //       ],
    //     },
    //   },
    // });

    // const vacancy2 = await prisma.vacancy.create({
    //   data: {
    //     title: "Frontend Developer",
    //     company_id: testCompany.company_id,
    //     salaryFrom: "120000",
    //     salaryTo: "180000",
    //     description:
    //       "Looking for a skilled Frontend Developer with React experience.",
    //     lan: "55.7558",
    //     lng: "37.6173",
    //     imgUrl: "https://example.com/dev-vacancy.jpg",
    //     tags: {
    //       connect: [
    //         { tag_id: tags.find((t) => t.title === "remotely")?.tag_id },
    //         { tag_id: tags.find((t) => t.title === "Moscow")?.tag_id },
    //       ],
    //     },
    //   },
    // });

    console.log('Seed completed successfully!');
    console.log({
        user: testUser,
        company: testCompany,
        // tags: tags.length,
        // vacancies: [vacancy1, vacancy2],
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
