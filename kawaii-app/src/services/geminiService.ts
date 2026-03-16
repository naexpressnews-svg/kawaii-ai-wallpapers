export async function generateKawaiiWallpaper(prompt: string): Promise<string> {
  try {
    const fullPrompt = `kawaii aesthetic wallpaper, ${prompt}, pastel colors, cute, dreamy, soft lighting, high quality, anime style, mobile wallpaper`;
    const encodedPrompt = encodeURIComponent(fullPrompt);
    const seed = Math.floor(Math.random() * 999999);

    // URL correto do Pollinations AI 2026
    const imageUrl = `https://pollinations.ai/p/${encodedPrompt}?width=576&height=1024&seed=${seed}&nologo=true&enhance=true&model=flux`;

    // Testa se a imagem carrega
    await new Promise<void>((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve();
      img.onerror = () => reject(new Error('Imagem não carregou'));
      img.src = imageUrl;
      setTimeout(() => reject(new Error('Timeout')), 60000);
    });

    return imageUrl;

  } catch (error) {
    console.error('Error generating wallpaper:', error);
    throw error;
  }
}
