export async function generateKawaiiWallpaper(prompt: string): Promise<string> {
  try {
    const fullPrompt = `kawaii aesthetic wallpaper, ${prompt}, pastel colors, cute, dreamy, soft lighting, high quality, anime style, mobile wallpaper`;

    const response = await fetch(
      'https://api-inference.huggingface.co/models/Lykon/dreamshaper-8',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: fullPrompt,
          parameters: {
            width: 512,
            height: 912,
            num_inference_steps: 25,
            guidance_scale: 7.5,
          }
        }),
      }
    );

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
    console.error('Error:', error);
    throw error;
  }
}
