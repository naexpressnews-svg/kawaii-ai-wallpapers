import { GoogleGenAI } from '@google/genai';

export async function generateKawaiiWallpaper(prompt: string): Promise<string> {
  try {
    const apiKey = localStorage.getItem('kawaii_gemini_api_key');
    if (!apiKey) {
      throw new Error('NO_API_KEY');
    }
    const ai = new GoogleGenAI({ apiKey });

    const response = await ai.models.generateImages({
      model: 'imagen-3.0-generate-002',
      prompt: `Kawaii aesthetic wallpaper, ${prompt}, pastel colors, cute, dreamy, soft lighting, high quality, 4k resolution, mobile wallpaper portrait`,
      config: {
        numberOfImages: 1,
        aspectRatio: '9:16',
      },
    });

    const image = response.generatedImages?.[0];
    if (image?.image?.imageBytes) {
      return `data:image/png;base64,${image.image.imageBytes}`;
    }

    throw new Error('No image data found in response');
  } catch (error: any) {
    console.error('Error generating wallpaper:', error);
    // Só redireciona para API Key se for mesmo erro de chave
    if (error?.message === 'NO_API_KEY' || error?.status === 401 || error?.status === 403) {
      throw new Error('NO_API_KEY');
    }
    // Outros erros mostram mensagem normal
    throw new Error(error?.message || 'Falha ao gerar imagem. Verifica se tens billing ativado no Google Cloud.');
  }
}
