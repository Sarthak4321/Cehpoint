import { GoogleGenerativeAI } from '@google/generative-ai';

let genAI: GoogleGenerativeAI | null = null;

export const initGemini = (apiKey: string) => {
  genAI = new GoogleGenerativeAI(apiKey);
};

export const generateKnowledgeQuestions = async (skills: string[]): Promise<any[]> => {
  if (!genAI) {
    throw new Error('Gemini AI not initialized');
  }

  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const prompt = `Generate 5 multiple-choice questions to test knowledge in ${skills.join(', ')}. 
  Return a JSON array with this structure:
  [
    {
      "question": "Question text",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": 0
    }
  ]
  Only return the JSON array, no other text.`;

  const result = await model.generateContent(prompt);
  const response = result.response;
  const text = response.text();
  
  const jsonMatch = text.match(/\[[\s\S]*\]/);
  if (jsonMatch) {
    return JSON.parse(jsonMatch[0]);
  }
  
  return JSON.parse(text);
};

export const evaluateDemoTask = async (taskDescription: string, submission: string): Promise<{ score: number; feedback: string }> => {
  if (!genAI) {
    throw new Error('Gemini AI not initialized');
  }

  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const prompt = `Evaluate this demo task submission:
  Task: ${taskDescription}
  Submission: ${submission}
  
  Provide a score from 0-100 and detailed feedback.
  Return a JSON object:
  {
    "score": 85,
    "feedback": "Detailed feedback here"
  }
  Only return the JSON object, no other text.`;

  const result = await model.generateContent(prompt);
  const response = result.response;
  const text = response.text();
  
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    return JSON.parse(jsonMatch[0]);
  }
  
  return JSON.parse(text);
};

export const matchTaskToWorkers = async (task: any, workers: any[]): Promise<string[]> => {
  if (!genAI) {
    throw new Error('Gemini AI not initialized');
  }

  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const prompt = `Match this task to suitable workers:
  Task: ${JSON.stringify(task)}
  Workers: ${JSON.stringify(workers.map(w => ({ id: w.id, skills: w.skills, experience: w.experience })))}
  
  Return a JSON array of worker IDs that are good matches:
  ["worker-id-1", "worker-id-2"]
  Only return the JSON array, no other text.`;

  const result = await model.generateContent(prompt);
  const response = result.response;
  const text = response.text();
  
  const jsonMatch = text.match(/\[[\s\S]*\]/);
  if (jsonMatch) {
    return JSON.parse(jsonMatch[0]);
  }
  
  return JSON.parse(text);
};
