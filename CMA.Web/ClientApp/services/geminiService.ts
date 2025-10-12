import { GoogleGenerativeAI } from "@google/generative-ai";

if (!process.env.API_KEY) {
  console.warn("API_KEY environment variable not set. AI features will not work.");
}

const ai = process.env.API_KEY ? new GoogleGenerativeAI(process.env.API_KEY) : null;

export const generateQuestions = async (topic: string, count: number, difficulty: string) => {
  // Check if AI service is available
  if (!ai) {
    throw new Error("AI service is not configured. Please set the API_KEY environment variable.");
  }
  
  try {
    const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const prompt = `Generate ${count} multiple-choice questions about "${topic}" with a difficulty of "${difficulty}". Each question should have 4 options (A, B, C, D) and a correct answer.`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    if (text) {
      const jsonResponse = JSON.parse(text);
      return jsonResponse.questions;
    }
    return [];
  } catch (error) {
    console.error("Error generating questions with Gemini:", error);
    throw new Error("Failed to generate questions. Please check your API key and try again.");
  }
};

export const generateExamDetails = async (topic: string) => {
  // Check if AI service is available
  if (!ai) {
    throw new Error("AI service is not configured. Please set the API_KEY environment variable.");
  }
  
  try {
    const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const prompt = `Generate administrative details for an exam about "${topic}". The details should include a creative title, a short description (2-3 sentences), a recommended duration in minutes, and a total marks.`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    if (text) {
      return JSON.parse(text);
    }
    return null;
  } catch (error) {
    console.error("Error generating exam details with Gemini:", error);
    throw new Error("Failed to generate exam details. Please check your API key and try again.");
  }
};