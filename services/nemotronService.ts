
import { PlanGenerationInput, StudyPlan } from "../types";

// In browser dev mode, use Vite reverse proxy to prevent CORS errors; fallback to direct url if running server-side
const NVIDIA_BASE = typeof window !== "undefined" ? "/nvidia-api/v1" : "https://integrate.api.nvidia.com/v1";
// Use an active, available Nemotron model on build.nvidia.com
const PRIMARY_MODEL = "nvidia/nemotron-3-ultra-550b-a55b";
const FALLBACK_MODELS = [
  "nvidia/nemotron-3.5-bolt-e4b",
  "meta/llama-3.2-11b-vision-instruct",
];

export interface AvailableNvidiaModel {
  id: string;
  name: string;
  description: string;
}

export const AVAILABLE_NVIDIA_MODELS: AvailableNvidiaModel[] = [
  {
    id: "auto",
    name: "Auto (Nemotron Ultra 550B with Fallbacks)",
    description: "Automatically selects the best model with instant fallback",
  },
  {
    id: "nvidia/nemotron-3-ultra-550b-a55b",
    name: "NVIDIA Nemotron 3 Ultra 550B",
    description: "Flagship high-capability reasoning model",
  },
  {
    id: "nvidia/nemotron-3.5-bolt-e4b",
    name: "NVIDIA Nemotron 3.5 Bolt",
    description: "Ultra-fast response model for quick doubt clearing",
  },
  {
    id: "nvidia/nemotron-3-nano-omni-30b-a3b-reasoning",
    name: "NVIDIA Nemotron 3 Nano Omni Reasoning",
    description: "Detailed step-by-step reasoning for complex problems",
  },
  {
    id: "meta/llama-3.2-11b-vision-instruct",
    name: "Llama 3.2 11B Vision Instruct (via NVIDIA)",
    description: "Concise and accurate general instruction model",
  },
];

export interface ChatDoubtInput {
  messages: { role: 'user' | 'assistant' | 'system'; content: string }[];
  selectedModel?: string;
  contextSubject?: string;
}

export const askDoubtWithNvidia = async (
  input: ChatDoubtInput
): Promise<{ reply: string; modelUsed: string }> => {
  const apiKey = (import.meta as any).env?.VITE_NVIDIA_API_KEY || "";

  const systemMessage = {
    role: "system",
    content: `You are EduMind AI Doubt Solver, an encouraging, clear, and highly knowledgeable academic tutor.
Explain concepts clearly using step-by-step breakdowns, intuitive examples, and bullet points where helpful.
${input.contextSubject ? `Context subject for the user: "${input.contextSubject}".` : ""}
Always provide accurate, easy-to-digest explanations.`
  };

  const candidateModels =
    input.selectedModel && input.selectedModel !== "auto"
      ? [input.selectedModel, ...FALLBACK_MODELS.filter(m => m !== input.selectedModel)]
      : [PRIMARY_MODEL, ...FALLBACK_MODELS];

  let lastError: Error | null = null;

  for (const model of candidateModels) {
    try {
      const res = await fetch(`${NVIDIA_BASE}/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model,
          messages: [systemMessage, ...input.messages],
          temperature: 0.4,
          max_tokens: 2048,
        }),
      });

      if (!res.ok) {
        const err = await res.text();
        console.warn(`Model ${model} doubt query failed (${res.status}): ${err}`);
        lastError = new Error(`NVIDIA API error ${res.status}: ${err}`);
        continue;
      }

      const json = await res.json();
      const reply = json.choices?.[0]?.message?.content?.trim();
      if (reply) {
        return { reply, modelUsed: model };
      }
    } catch (err: any) {
      console.warn(`Request failed for model ${model}:`, err);
      lastError = err;
    }
  }

  throw lastError || new Error("All NVIDIA models failed to respond. Please check API key.");
};

export const generateStudyPlan = async (
  input: PlanGenerationInput
): Promise<Partial<StudyPlan>> => {
  const apiKey = (import.meta as any).env?.VITE_NVIDIA_API_KEY || "";

  const systemPrompt = `You are an expert academic study planner. 
Always respond with valid JSON only — no markdown, no extra text.
The JSON must match exactly: { "subject": string, "tasks": [{ "day": number, "topic": string, "subtopics": string[], "durationMinutes": number }] }`;

  const userPrompt = `Generate a detailed day-by-day study plan.
Subject: ${input.subject}
Syllabus: ${input.syllabus || "General curriculum"}
Exam Date: ${input.examDate}
Daily Study Hours: ${input.dailyStudyHours}
Learning Style: ${input.learningStyle}
Today's Date: ${new Date().toLocaleDateString()}

Create a plan from today until the day before the exam. Sequence topics logically and include revision days.`;

  const models = [PRIMARY_MODEL, ...FALLBACK_MODELS];
  let lastError: Error | null = null;
  let rawText = "";

  for (const model of models) {
    try {
      const res = await fetch(`${NVIDIA_BASE}/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
          ],
          temperature: 0.3,
          max_tokens: 4096,
        }),
      });

      if (!res.ok) {
        const err = await res.text();
        console.warn(`Nemotron model ${model} failed (${res.status}): ${err}`);
        lastError = new Error(`Nemotron API error ${res.status}: ${err}`);
        continue;
      }

      const json = await res.json();
      rawText = json.choices?.[0]?.message?.content || "";
      if (rawText) break;
    } catch (err: any) {
      console.warn(`Request failed for model ${model}:`, err);
      lastError = err;
    }
  }

  if (!rawText) {
    throw lastError || new Error("Failed to receive response from NVIDIA API.");
  }

  // Strip possible markdown fences the model may add
  const cleaned = rawText.replace(/```json\s*/gi, "").replace(/```/g, "").trim();
  const data = JSON.parse(cleaned);

  return {
    subject: data.subject || input.subject,
    targetDate: input.examDate,
    dailyHours: input.dailyStudyHours,
    tasks: (data.tasks || []).map((t: any) => ({
      ...t,
      id: Math.random().toString(36).substr(2, 9),
      completed: false,
    })),
  };
};
