import { GoogleGenAI } from '@google/genai';

export async function generateKawaiiWallpaper(prompt: string): Promise<string> {
  try {
    const apiKey = localStorage.getItem('kawaii_gemini_api_key');
    if (!apiKey) {
      throw new Error('NO_API_KEY');
    }
    const ai = new GoogleGenAI({ apiKey });

    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash-preview-image-generation',
      contents: {
        parts: [
          {
            text: `Kawaii aesthetic wallpaper, ${prompt}, pastel colors, cute, dreamy, soft lighting, high quality, 4k resolution, mobile wallpaper aspect ratio`,
          },
        ],
      },
      config: {
        responseModalities: ['TEXT', 'IMAGE'],
      },
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }
    }
    throw new Error('No image data found in response');
  } catch (error) {
    console.error('Error generating wallpaper:', error);
    throw error;
  }
}
