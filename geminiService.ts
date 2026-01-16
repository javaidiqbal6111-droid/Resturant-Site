
import { GoogleGenAI, Type } from "@google/genai";
import { MENU_ITEMS } from "./constants";

export const getAIRecommendations = async (userInput: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
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
      contents: `You are Mustafa Elmi's premium AI Assistant. 
      Menu: ${JSON.stringify(menuSummary)}.
      User is asking: "${userInput}".
      
      CRITICAL: You must explicitly state if the items the user asks about are available. 
      All items in the provided menu are CURRENTLY AVAILABLE and FRESH. 
      Be encouraging and confirm freshness.
      
      Return JSON with:
      - reasoning: A polite confirmation of availability and why you recommend these items.
      - suggestedIds: Array of matching item IDs.`,
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
