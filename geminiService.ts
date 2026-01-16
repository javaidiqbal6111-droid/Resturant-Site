
import { GoogleGenAI, Type } from "@google/genai";
import { MENU_ITEMS } from "./constants";

export const getAIRecommendations = async (userInput: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  const menuSummary = MENU_ITEMS.map(item => ({
    id: item.id,
    name: item.name,
    description: item.description,
    price: item.price,
    category: item.category
  }));

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `You are a helpful restaurant assistant. Based on this menu: ${JSON.stringify(menuSummary)}, suggest 1-3 items for the user request: "${userInput}". Provide a short reason why.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            reasoning: { type: Type.STRING },
            suggestedIds: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ["reasoning", "suggestedIds"]
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text.trim());
    }
  } catch (error) {
    console.error("AI Error:", error);
    return null;
  }
};
