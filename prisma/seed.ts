import { PrismaClient } from '@prisma/client';
import { seedSkills } from '~/server/db/seeds/skills';

const prisma = new PrismaClient();

async function main() {
    await seedSkills(prisma);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
