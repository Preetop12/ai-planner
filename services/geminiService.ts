
import { GoogleGenAI, Type } from "@google/genai";
import { PlanGenerationInput, StudyPlan, StudyTask } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const generateStudyPlan = async (input: PlanGenerationInput): Promise<Partial<StudyPlan>> => {
  const textPrompt = `
    Generate a detailed study plan for the subject "${input.subject}".
    ${input.fileData ? "Analyze the attached PDF syllabus to extract the topics." : `Syllabus Overview: ${input.syllabus}`}
    Target Exam Date: ${input.examDate}
    Available Daily Study Time: ${input.dailyStudyHours} hours
    Preferred Learning Style: ${input.learningStyle}

    The current date is ${new Date().toLocaleDateString()}.
    Create a day-by-day plan until the day before the exam. 
    Ensure topics are logically sequenced and include time for revision.
    Balance the workload based on the ${input.dailyStudyHours} hours provided.
  `;

  try {
    const parts: any[] = [{ text: textPrompt }];

    if (input.fileData) {
      parts.push({
        inlineData: {
          mimeType: input.fileData.mimeType,
          data: input.fileData.base64
        }
      });
    }

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: { parts },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            subject: { type: Type.STRING },
            tasks: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  day: { type: Type.INTEGER },
                  topic: { type: Type.STRING },
                  subtopics: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                  },
                  durationMinutes: { type: Type.INTEGER }
                },
                required: ["day", "topic", "durationMinutes"]
              }
            }
          },
          required: ["subject", "tasks"]
        }
      }
    });

    const data = JSON.parse(response.text || '{}');
    return {
      subject: data.subject || input.subject,
      targetDate: input.examDate,
      dailyHours: input.dailyStudyHours,
      tasks: (data.tasks || []).map((t: any) => ({
        ...t,
        id: Math.random().toString(36).substr(2, 9),
        completed: false
      }))
    };
  } catch (error) {
    console.error("Error generating study plan:", error);
    throw error;
  }
};
