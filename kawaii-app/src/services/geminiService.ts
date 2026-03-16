export async function generateKawaiiWallpaper(prompt: string): Promise<string> {
  try {
    const fullPrompt = `kawaii aesthetic wallpaper, ${prompt}, pastel colors, cute, dreamy, soft lighting, high quality, anime style, mobile wallpaper`;
    const encodedPrompt = encodeURIComponent(fullPrompt);
    const seed = Math.floor(Math.random() * 999999);
    
    // Usa diretamente o URL da imagem sem fetch
    const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=576&height=1024&seed=${seed}&nologo=true&enhance=true`;

    // Testa se a imagem carrega
    await new Promise<void>((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve();
      img.onerror = () => reject(new Error('Imagem não carregou'));
      img.src = imageUrl;
      // Timeout de 30 segundos
      setTimeout(() => reject(new Error('Timeout')), 30000);
    });

    return imageUrl;

  } catch (error) {
    console.error('Error generating wallpaper:', error);
    throw error;
  }
}
