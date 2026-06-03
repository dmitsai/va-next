/* eslint-disable camelcase -- LLM JSON and Prisma ResumeAnalysis field names use snake_case */
import { type PrismaClient, type ResumeSection } from '@prisma/client';
import { generateJSON } from './aiService';

interface MarketSkillGapResult {
  score_skills: number;
  missing_skills: string[];
  trending_skills: string[];
}

interface AnalysisResult {
  score_total: number;
  score_completeness: number;
  score_structure: number;
  score_keywords: number;
  score_skills: number;
  recommendations: string[];
  trending_skills: string[];
}

export async function getMarketSkillGap(
  prisma: PrismaClient,
  desired_position: string,
  userSkills: string[],
): Promise<MarketSkillGapResult> {
  const topSkills = await prisma.skill.findMany({
    orderBy: { mentions: 'desc' },
    take: 20,
    select: { name: true },
  });

  if (topSkills.length === 0) {
    return { score_skills: 50, missing_skills: [], trending_skills: [] };
  }

  const userSkillsLower = new Set(userSkills.map((s) => s.toLowerCase()));
  const top = topSkills.map((s) => s.name);

  const matched = top.filter((name) => userSkillsLower.has(name.toLowerCase())).length;
  const score_skills = Math.round((matched / Math.min(top.length, 10)) * 100);

  const missing_skills = top
    .filter((name) => !userSkillsLower.has(name.toLowerCase()))
    .slice(0, 5);

  const trending_skills = top.slice(0, 8);

  return { score_skills, missing_skills, trending_skills };
}

function buildSectionSummary(sections: ResumeSection[]): string {
  return sections
    .map((s) => {
      const content = s.content as Record<string, unknown>;
      return `[${s.type}]: ${JSON.stringify(content)}`;
    })
    .join('\n');
}

export async function analyzeResume(
  prisma: PrismaClient,
  sections: ResumeSection[],
  desired_position: string,
): Promise<AnalysisResult> {
  const skillsSection = sections.find((s) => s.type === 'SKILLS');
  const userSkills: string[] = [];
  if (skillsSection) {
    const c = skillsSection.content as { hard?: string[]; soft?: string[] };
    userSkills.push(...(c.hard ?? []), ...(c.soft ?? []));
  }

  const marketData = await getMarketSkillGap(prisma, desired_position, userSkills);
  const summary = buildSectionSummary(sections);

  const prompt = `Analyze this resume for position "${desired_position || 'не указана'}" and return ONLY valid JSON:
{
  "score_total": <number 0-100>,
  "score_completeness": <number, filled sections out of 7 * 100>,
  "score_structure": <number, has about + experience + skills = good structure>,
  "score_keywords": <number, relevant keywords for THIS specific position present>,
  "score_skills": ${marketData.score_skills},
  "recommendations": <string array, 3-5 specific actionable recommendations in Russian, tailored ONLY for position "${desired_position || 'не указана'}". Each starts with a verb. Do NOT mention requirements for other specializations (e.g., if position is Backend — do not mention Frontend portfolio, design, etc.)>,
  "trending_skills": ${JSON.stringify(marketData.trending_skills)}
}
Target position: ${desired_position || 'не указана'}
Missing popular skills for this position: ${marketData.missing_skills.join(', ') || 'none'}
Resume content:
${summary}`;

  const result = await generateJSON<AnalysisResult>(prompt);

  // Enforce market data values so AI cannot override them
  result.score_skills = marketData.score_skills;
  result.trending_skills = marketData.trending_skills;

  return result;
}
