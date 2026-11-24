
import { GoogleGenAI } from "@google/genai";
import { Attachment } from '../types';

const SYSTEM_INSTRUCTION = `You are Dr. AI, an advanced virtual medical consultant for Saff Hospital, Rahim Yar Khan.
Your Goal: Provide accurate, empathetic, and professional health guidance in English or Roman Urdu.

CAPABILITIES:
1. **Symptom Checker**: Ask clarifying questions (duration, severity) before suggesting possible causes. **Provide detailed explanations** of why symptoms might occur (pathophysiology in simple terms) and how they typically progress. **Suggest specific home remedies** (dietary changes, lifestyle adjustments, safe OTC options) that are practical and effective.
2. **Report & Image Analyzer**: Expertly analyze medical documents including:
   - **Lab Reports**: CBC, Lipid Profile, LFTs, Kidney Function Tests, etc. For every key parameter found (e.g., Hemoglobin, WBC, Cholesterol, Triglycerides, Creatinine), **briefly explain what it measures** in simple terms so the patient understands its importance. Highlight values outside normal ranges and explain the potential health implications. Suggest specific dietary and lifestyle changes to help improve these values.
   - **Imaging (X-rays)**: Interpret basic X-ray images (Chest, Bone). Look for and explain visible signs like fractures, opacities (pneumonia/congestion), or alignment issues.
   - **ECG/EKG**: Analyze ECG strips for rhythm (Sinus, Bradycardia, Tachycardia) and basic waveform abnormalities (ST elevation/depression).
   - **PDF Reports**: Read and summarize textual medical reports provided in PDF format.
   - *Disclaimer*: Always state that AI analysis of images is a screening tool and must be verified by a radiologist or cardiologist.
3. **Diet & Nutrition**: Create personalized meal plans based on user conditions (Diabetes, Hypertension, Weight Loss).
4. **Mental Health**: Provide supportive listening and coping strategies for anxiety/stress.
5. **Medicine Info**: Explain uses, side effects, and precautions for common medicines.

RULES:
- **Vitals Analysis**: If user provides BP, Heart Rate, or Temp, categorize as Normal/Elevated/Critical based on standard ranges.
- **Booking**: If the user wants to book an appointment, ask for [Doctor Name/Specialty, Date, Reason]. 
  - Once you have these 3 details, OUTPUT JSON at the very end of your response: \`\`\`json { "booking": { "doctorName": "...", "date": "...", "reason": "..." } } \`\`\`
- **Safety**: For emergencies (Chest pain, severe bleeding, difficulty breathing), immediately advise calling Rescue 1122 or visiting the Emergency Room.
- **Disclaimer**: Always imply you are an AI assistant, not a replacement for a physical doctor.

TONE: Professional, caring, detailed, and culturally appropriate for Pakistan.`;

// Helper to initialize the client with strict checking
const getGoogleGenAI = () => {
  // STRICT: Do not hardcode keys here. Always use process.env.
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey || apiKey.includes('YOUR_API_KEY') || apiKey.length < 10) {
    console.error("Gemini Service Error: Invalid or missing API Key.");
    throw new Error("API Key is missing. Please configure GEMINI_API_KEY in Vercel Environment Variables.");
  }

  return new GoogleGenAI({ apiKey });
};

export const geminiService = {
  askHealthAssistant: async (prompt: string, attachments?: Attachment[]): Promise<string> => {
    try {
      const ai = getGoogleGenAI();
      const parts: any[] = [{ text: prompt }];
      
      if (attachments && attachments.length > 0) {
        attachments.forEach(att => {
            const base64Data = att.data.includes(',') ? att.data.split(',')[1] : att.data;
            parts.push({
              inlineData: {
                mimeType: att.mimeType,
                data: base64Data
              }
            });
        });
      }

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: {
          parts: parts
        },
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
        }
      });
      
      if (!response.text) {
         throw new Error("No response received from the model.");
      }

      return response.text;
    } catch (error: any) {
      console.error("Gemini Error:", error);
      const errorMessage = error.message?.toLowerCase() || '';
      const errorString = error.toString().toLowerCase();
      
      if (errorMessage.includes('403') || errorMessage.includes('key') || errorString.includes('api_key_invalid')) {
         return "⚠️ **Access Denied (403)**: The API Key provided is invalid or has been revoked by Google. Please check Vercel settings and generate a new key.";
      } else if (errorMessage.includes('failed to fetch') || errorMessage.includes('network')) {
         return "⚠️ **Connection Error**: Unable to reach the AI server. Please check your internet connection.";
      } else if (errorMessage.includes('429') || errorMessage.includes('quota')) {
         return "⚠️ **System Busy**: High traffic detected (Quota Exceeded). Please wait a moment and try again.";
      } else if (errorMessage.includes('500') || errorMessage.includes('503')) {
         return "⚠️ **Service Unavailable**: Google AI services are currently experiencing issues. Please try again later.";
      }
      
      return `I apologize, but I encountered an error: ${error.message || "Unknown Error"}. Please try asking your question again.`;
    }
  },

  askHealthAssistantStream: async function* (prompt: string, attachments?: Attachment[]) {
    try {
      const ai = getGoogleGenAI();
      const parts: any[] = [{ text: prompt }];
      
      if (attachments && attachments.length > 0) {
        attachments.forEach(att => {
            const base64Data = att.data.includes(',') ? att.data.split(',')[1] : att.data;
            parts.push({
              inlineData: {
                mimeType: att.mimeType,
                data: base64Data
              }
            });
        });
      }

      const responseStream = await ai.models.generateContentStream({
        model: "gemini-2.5-flash",
        contents: { parts: parts },
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
        }
      });

      for await (const chunk of responseStream) {
        const text = chunk.text;
        if (text) yield text;
      }
    } catch (error: any) {
        console.error("Gemini Stream Error:", error);
        if (error.message?.includes('403') || error.toString().includes('API_KEY_INVALID')) {
            yield "⚠️ **Error**: API Key is invalid or expired. Please update it in Vercel settings.";
        } else {
            throw error;
        }
    }
  },

  askAdminAssistant: async (prompt: string): Promise<string> => {
    try {
      const ai = getGoogleGenAI();
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: { parts: [{ text: prompt }] },
        config: {
          systemInstruction: `You are an efficient Hospital Administrator AI Assistant for Saff Hospital CRM.`,
        }
      });
      return response.text || "No response generated.";
    } catch (error: any) {
      console.error("Gemini Admin Error:", error);
      return `System Error: ${error.message}`;
    }
  },

  generateVideoFromImage: async (imageInput: string, prompt: string): Promise<string | null> => {
    try {
      const ai = getGoogleGenAI();
      // Use the verified key from getGoogleGenAI or process.env directly
      const apiKey = process.env.GEMINI_API_KEY; 
      
      let base64Data = '';
      let mimeType = 'image/png';

      if (imageInput.startsWith('http')) {
          try {
              const response = await fetch(imageInput);
              const blob = await response.blob();
              mimeType = blob.type;
              const buffer = await blob.arrayBuffer();
              
              let binary = '';
              const bytes = new Uint8Array(buffer);
              const len = bytes.byteLength;
              for (let i = 0; i < len; i++) {
                binary += String.fromCharCode(bytes[i]);
              }
              base64Data = btoa(binary);
          } catch (fetchError) {
              console.error("Failed to fetch image from URL:", fetchError);
              throw new Error("Could not download image. It might be protected by CORS policies.");
          }
      } else {
          base64Data = imageInput.split(',')[1] || imageInput;
          if (imageInput.includes('image/jpeg')) mimeType = 'image/jpeg';
          else if (imageInput.includes('image/webp')) mimeType = 'image/webp';
      }
      
      let operation = await ai.models.generateVideos({
        model: 'veo-3.1-fast-generate-preview',
        prompt: prompt,
        image: {
          imageBytes: base64Data,
          mimeType: mimeType,
        },
        config: {
          numberOfVideos: 1,
          resolution: '720p',
          aspectRatio: '16:9'
        }
      });

      while (!operation.done) {
        await new Promise(resolve => setTimeout(resolve, 5000));
        operation = await ai.operations.getVideosOperation({operation: operation});
      }

      const videoUri = operation.response?.generatedVideos?.[0]?.video?.uri;
      if (!videoUri) return null;

      // Ensure we append the key for the frontend to be able to fetch it if needed, 
      // though typically this URL is signed or public for a short time.
      return `${videoUri}&key=${apiKey}`;
    } catch (error) {
      console.error("Veo Error:", error);
      throw error;
    }
  }
};
