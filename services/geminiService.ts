
import { GoogleGenAI } from "@google/genai";

export const getSmartAssistance = async (query: string, context?: any) => {
  try {
    // Correctly initialize GoogleGenAI instance with named parameter right before call
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      // Pass contents as a direct string for simple text tasks
      contents: `User Stats Context: ${JSON.stringify(context || 'Standard stats available')}\nUser Question: ${query}`,
      config: {
        systemInstruction: `You are the PowerNet Assistant, a friendly and helpful guide for home electricity and WiFi.
        
        Guidelines:
        1. LANGUAGE: Use simple, everyday words. Avoid words like 'load', 'terminal', 'anomaly', 'diagnostics', or 'protocol'.
        2. TONE: Helpful, encouraging, and clear. Think of yourself as a savvy friend helping someone with their home.
        3. ADVICE: If the user uses a lot of power, suggest easy ways to save. If WiFi is slow, suggest moving the router or checking for loose cables.
        4. FORMATTING: Use short sentences and bullet points. Keep it easy to read on a phone.
        5. SAVINGS: Mention the 'Savings Mode' (Urja Bachat) whenever it helps the user save money.`,
        temperature: 0.8,
      }
    });
    
    // Use .text property directly
    return response.text || "I'm sorry, I'm having a little trouble thinking. Could you please try asking again?";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "I'm having trouble connecting right now. Please try again in a minute!";
  }
};

export const analyzeConsumption = async (units: number) => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `I used ${units} units this month. Is that good or bad? Give me some simple tips to save power.`,
    });
    return response.text;
  } catch (error) {
    return "I can't check your usage right now, but I'm sure you're doing great!";
  }
};
