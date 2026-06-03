import { PrismaClient, SkillType } from '@prisma/client';

const skills: { name: string; type: SkillType; category: string | null }[] = [
  // Frontend
  { name: 'React', type: 'HARD', category: 'Frontend' },
  { name: 'Vue', type: 'HARD', category: 'Frontend' },
  { name: 'Angular', type: 'HARD', category: 'Frontend' },
  { name: 'Next.js', type: 'HARD', category: 'Frontend' },
  { name: 'TypeScript', type: 'HARD', category: 'Frontend' },
  { name: 'JavaScript', type: 'HARD', category: 'Frontend' },
  { name: 'HTML', type: 'HARD', category: 'Frontend' },
  { name: 'CSS', type: 'HARD', category: 'Frontend' },
  { name: 'Tailwind CSS', type: 'HARD', category: 'Frontend' },
  { name: 'Webpack', type: 'HARD', category: 'Frontend' },
  { name: 'Vite', type: 'HARD', category: 'Frontend' },
  { name: 'GraphQL', type: 'HARD', category: 'Frontend' },
  { name: 'REST API', type: 'HARD', category: 'Frontend' },
  { name: 'Figma', type: 'HARD', category: 'Frontend' },
  // Backend
  { name: 'Node.js', type: 'HARD', category: 'Backend' },
  { name: 'Python', type: 'HARD', category: 'Backend' },
  { name: 'Go', type: 'HARD', category: 'Backend' },
  { name: 'Java', type: 'HARD', category: 'Backend' },
  { name: 'PHP', type: 'HARD', category: 'Backend' },
  { name: 'Laravel', type: 'HARD', category: 'Backend' },
  { name: 'Django', type: 'HARD', category: 'Backend' },
  { name: 'FastAPI', type: 'HARD', category: 'Backend' },
  { name: 'NestJS', type: 'HARD', category: 'Backend' },
  { name: 'Express', type: 'HARD', category: 'Backend' },
  // Databases
  { name: 'PostgreSQL', type: 'HARD', category: 'Databases' },
  { name: 'MySQL', type: 'HARD', category: 'Databases' },
  { name: 'MongoDB', type: 'HARD', category: 'Databases' },
  { name: 'Redis', type: 'HARD', category: 'Databases' },
  { name: 'Elasticsearch', type: 'HARD', category: 'Databases' },
  { name: 'Prisma', type: 'HARD', category: 'Databases' },
  { name: 'SQLite', type: 'HARD', category: 'Databases' },
  // DevOps
  { name: 'Docker', type: 'HARD', category: 'DevOps' },
  { name: 'Kubernetes', type: 'HARD', category: 'DevOps' },
  { name: 'AWS', type: 'HARD', category: 'DevOps' },
  { name: 'GCP', type: 'HARD', category: 'DevOps' },
  { name: 'Azure', type: 'HARD', category: 'DevOps' },
  { name: 'CI/CD', type: 'HARD', category: 'DevOps' },
  { name: 'Git', type: 'HARD', category: 'DevOps' },
  { name: 'Linux', type: 'HARD', category: 'DevOps' },
  { name: 'Nginx', type: 'HARD', category: 'DevOps' },
  // Mobile
  { name: 'Swift', type: 'HARD', category: 'Mobile' },
  { name: 'Kotlin', type: 'HARD', category: 'Mobile' },
  { name: 'React Native', type: 'HARD', category: 'Mobile' },
  { name: 'Flutter', type: 'HARD', category: 'Mobile' },
  // Data
  { name: 'Pandas', type: 'HARD', category: 'Data' },
  { name: 'PyTorch', type: 'HARD', category: 'Data' },
  { name: 'TensorFlow', type: 'HARD', category: 'Data' },
  { name: 'SQL', type: 'HARD', category: 'Data' },
  { name: 'Spark', type: 'HARD', category: 'Data' },
  { name: 'Airflow', type: 'HARD', category: 'Data' },
  // Testing
  { name: 'Jest', type: 'HARD', category: 'Testing' },
  { name: 'Vitest', type: 'HARD', category: 'Testing' },
  { name: 'Cypress', type: 'HARD', category: 'Testing' },
  { name: 'Playwright', type: 'HARD', category: 'Testing' },
  { name: 'Storybook', type: 'HARD', category: 'Testing' },
  // Soft skills
  { name: 'Teamwork', type: 'SOFT', category: null },
  { name: 'Leadership', type: 'SOFT', category: null },
  { name: 'Communication', type: 'SOFT', category: null },
  { name: 'Problem-solving', type: 'SOFT', category: null },
  { name: 'Time management', type: 'SOFT', category: null },
  { name: 'Mentoring', type: 'SOFT', category: null },
  { name: 'Agile', type: 'SOFT', category: null },
  { name: 'Scrum', type: 'SOFT', category: null },
  { name: 'Kanban', type: 'SOFT', category: null },
  { name: 'Critical thinking', type: 'SOFT', category: null },
];

export async function seedSkills(prisma: PrismaClient) {
  const data = skills.map((s) => ({
    name: s.name,
    slug: s.name.toLowerCase().replace(/[^a-z0-9]/gi, '-'),
    type: s.type,
    category: s.category,
    mentions: 0,
  }));

  await prisma.skill.createMany({ data, skipDuplicates: true });
  console.log(`Seeded ${data.length} skills`);
}
