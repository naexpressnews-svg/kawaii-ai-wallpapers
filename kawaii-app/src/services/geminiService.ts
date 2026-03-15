import { GoogleGenAI } from '@google/genai';

export async function generateKawaiiWallpaper(prompt: string): Promise<string> {
  try {
    // Get API key from localStorage (saved by the user in the app)
    const apiKey = localStorage.getItem('kawaii_gemini_api_key');
    if (!apiKey) {
      throw new Error('NO_API_KEY');
    }
    const ai = new GoogleGenAI({ apiKey });
    
    const response = await ai.models.generateContent({
      model: 'gemini-3.1-flash-image-preview',
      contents: {
        parts: [
          {
            text: `Kawaii aesthetic wallpaper, ${prompt}, pastel colors, cute, dreamy, soft lighting, high quality, 4k resolution, mobile wallpaper aspect ratio`,
          },
        ],
      },
      config: {
        imageConfig: {
          aspectRatio: '9:16',
          imageSize: '1K',
        },
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
