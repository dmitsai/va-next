import { generateJSON } from './aiService';

interface AboutMeContext {
  desired_position: string;
  experience_items: Array<{ position?: string; company?: string }>;
  hard_skills: string[];
  current_text?: string;
}

interface ExperienceContext {
  position: string;
  company: string;
  period: string;
  current_text?: string;
}

export async function generateAboutMe(ctx: AboutMeContext): Promise<string[]> {
  const experienceStr = ctx.experience_items
    .map((e) => [e.position, e.company].filter(Boolean).join(' at '))
    .join('; ');
  const skillsStr = ctx.hard_skills.join(', ');

  const hasText = ctx.current_text && ctx.current_text.trim().length > 20;

  const prompt = hasText
    ? `Ты карьерный консультант. Пользователь написал раздел "О себе" для резюме на позицию "${ctx.desired_position}".
Опыт: ${experienceStr || 'не указан'}.
Навыки: ${skillsStr || 'не указаны'}.

Текущий текст пользователя:
"""
${ctx.current_text}
"""

Дай 2 улучшенных варианта: сохрани суть и факты, но сделай формулировки сильнее — конкретнее, убери клише, добавь релевантные акценты под позицию. Каждый вариант 3–4 предложения. Начинай по-разному.
Return ONLY JSON array: ["variant1", "variant2"]`
    : `Ты карьерный консультант. Напиши 2 варианта раздела "О себе" для резюме.
Позиция: ${ctx.desired_position}.
Опыт: ${experienceStr || 'не указан'}.
Навыки: ${skillsStr || 'не указаны'}.
Правила: 3–4 предложения, профессиональный тон, без клише, начинать по-разному, на русском.
Return ONLY JSON array: ["variant1", "variant2"]`;

  return generateJSON<string[]>(prompt);
}

export async function generateExperienceDescription(ctx: ExperienceContext): Promise<string[]> {
  const hasText = ctx.current_text && ctx.current_text.trim().length > 20;

  const prompt = hasText
    ? `Ты карьерный консультант. Пользователь написал описание опыта для позиции "${ctx.position}" в "${ctx.company}" (${ctx.period}).

Текущее описание:
"""
${ctx.current_text}
"""

Дай 2 улучшенных варианта: конкретизируй, добавь глаголы достижений, если есть место для числовых метрик — добавь примерные. Каждый вариант 3–5 пунктов. Начинать по-разному.
Return ONLY JSON array: ["variant1", "variant2"]`
    : `Ты карьерный консультант. Напиши 2 варианта описания обязанностей и достижений для резюме.
Позиция: ${ctx.position} в компании ${ctx.company}, период: ${ctx.period}.
Правила: 3–5 пунктов, начинать с глаголов действия, конкретные результаты, на русском.
Return ONLY JSON array: ["variant1", "variant2"]`;

  return generateJSON<string[]>(prompt);
}
