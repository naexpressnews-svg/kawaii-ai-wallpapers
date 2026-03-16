export async function generateKawaiiWallpaper(prompt: string): Promise<string> {
  try {
    const fullPrompt = `kawaii aesthetic wallpaper, ${prompt}, pastel colors, cute, dreamy, soft lighting, high quality, anime style, mobile wallpaper`;
    const encodedPrompt = encodeURIComponent(fullPrompt);
    
    // Pollinations AI — 100% gratuito, sem chave, sem billing
    const width = 576;
    const height = 1024;
    const seed = Math.floor(Math.random() * 999999);
    const url = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=${width}&height=${height}&seed=${seed}&nologo=true&enhance=true`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Falha ao gerar imagem');
    }

    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });

  } catch (error) {
    console.error('Error generating wallpaper:', error);
    throw error;
  }
}
