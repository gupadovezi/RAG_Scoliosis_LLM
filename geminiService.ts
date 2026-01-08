
import { GoogleGenAI } from "@google/genai";
import { SOSORT_GUIDELINE_CONTEXT } from "./knowledgeBase";
import { UserRole } from "./types";

export const generateScoliosisResponse = async (
  prompt: string,
  role: UserRole,
  history: { role: 'user' | 'model'; parts: { text: string }[] }[]
) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });
  
  const systemInstruction = `
    You are a specialized medical assistant trained on the 2016 SOSORT guidelines (Scoliosis Orthopaedic and Rehabilitation Treatment).
    
    YOUR KNOWLEDGE BASE:
    ${SOSORT_GUIDELINE_CONTEXT}
    
    USER ROLE: ${role.toUpperCase()}
    
    GUIDELINES:
    1. Base all medical advice EXCLUSIVELY on the provided SOSORT guidelines.
    2. If the user is a PATIENT: Use simple, clear, empathetic, and non-technical language. Avoid medical jargon unless explaining it simply.
    3. If the user is a PROFESSIONAL: Use precise, technical medical terminology. Refer to specific Level of Evidence (LoE) and Strength of Recommendation (SoR) as found in the text.
    4. Always cite specific Recommendations (e.g., "Recommendation 12") or Tables (e.g., "Table 10") if they contain the relevant information.
    5. If a question is outside the scope of the SOSORT guidelines or idiopathic scoliosis, politely state that you can only provide information based on the SOSORT benchmark.
    6. Ensure accuracy regarding Cobb angles, bracing hours (8-12h NTRB, 12-20h PTRB, 20-24h FTRB), and the "dose-response" relationship.
    
    Respond in Markdown format.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [
        { role: 'user', parts: [{ text: `System context: ${systemInstruction}` }] },
        ...history,
        { role: 'user', parts: [{ text: prompt }] }
      ],
      config: {
        temperature: 0.2, // Keep it focused for medical guidelines
        topP: 0.8,
        topK: 40,
      }
    });

    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("I'm sorry, I encountered an error while retrieving the guideline information. Please try again.");
  }
};
