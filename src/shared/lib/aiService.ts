import { Mistral } from '@mistralai/mistralai';

const MODEL = 'mistral-small-latest';

const getClient = () => {
  const apiKey = process.env.MISTRAL_API_KEY;
  if (!apiKey) throw new Error('MISTRAL_API_KEY is not set');
  return new Mistral({ apiKey });
};

export async function generateText(prompt: string, maxTokens = 2048): Promise<string> {
  const result = await getClient().chat.complete({
    model: MODEL,
    messages: [{ role: 'user', content: prompt }],
    maxTokens,
  });
  const content = result.choices?.[0]?.message?.content;
  if (content == null) throw new Error('AI returned empty response');
  return typeof content === 'string' ? content : JSON.stringify(content);
}

export async function generateJSON<T>(prompt: string): Promise<T> {
  const fullPrompt = `${prompt}\n\nReturn ONLY valid JSON. No markdown, no backticks, no explanation.`;
  const text = await generateText(fullPrompt, 4096);

  // Strip markdown code blocks if model added them anyway
  const stripped = text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim();

  // Extract outermost JSON object/array
  const start = stripped.search(/[[{]/);
  const lastObj = stripped.lastIndexOf('}');
  const lastArr = stripped.lastIndexOf(']');
  const end = Math.max(lastObj, lastArr);
  const candidate = start !== -1 && end !== -1 ? stripped.slice(start, end + 1) : stripped;

  try {
    return JSON.parse(candidate) as T;
  } catch {
    console.error('[generateJSON] total length:', text.length, '| last 200 chars:', JSON.stringify(text.slice(-200)));
    throw new Error('AI_INVALID_JSON');
  }
}
