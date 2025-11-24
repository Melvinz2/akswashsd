
import { GoogleGenAI, Chat } from "@google/genai";
import { Project } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const explainCommand = async (command: string): Promise<string> => {
  try {
      const prompt = `Explain this CLI command to a beginner student in one short sentence: \`${command}\``;
       const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });
      return response.text || "Downloads the file.";
  } catch (e) {
      return "Downloads the source code to your local machine.";
  }
}

/**
 * Creates a chat session specifically knowledgeable about the current project.
 */
export const createProjectChatSession = (project: Project): Chat => {
  const systemInstruction = `
    You are CodeVault AI, an expert senior software engineer acting as a tutor for a student.
    
    CURRENT PROJECT CONTEXT:
    - Title: ${project.title}
    - Language: ${project.language}
    - Difficulty: ${project.difficulty}
    - Description: ${project.description}
    
    FILE STRUCTURE:
    ${project.fileStructure}

    YOUR ROLE:
    1. Answer questions specifically about this project's code structure and logic.
    2. If the student asks general coding questions, relate them back to this project.
    3. Be encouraging, concise, and use technical but accessible language.
    4. Use Markdown for your responses (code blocks, bold text, lists).
    5. Keep responses relatively short (under 3 paragraphs) unless asked for a deep dive.

    Start by briefly introducing the project and suggesting 2 interesting files they should look at first.
  `;

  return ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: systemInstruction,
    },
  });
};
