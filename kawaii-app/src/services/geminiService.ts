export async function generateKawaiiWallpaper(prompt: string): Promise<string> {
  try {
    const fullPrompt = `kawaii aesthetic wallpaper, ${prompt}, pastel colors, cute, dreamy, soft lighting, high quality, anime style, mobile wallpaper`;

    // Stable Horde — 100% gratuito, sem chave
    const generateResponse = await fetch('https://stablehorde.net/api/v2/generate/async', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': '0000000000', // chave de convidado gratuita
      },
      body: JSON.stringify({
        prompt: fullPrompt,
        params: {
          width: 512,
          height: 896,
          steps: 20,
          sampler_name: 'k_euler',
        },
        models: ['Deliberate'],
      }),
    });

    if (!generateResponse.ok) throw new Error('Falha ao iniciar geração');
    const { id } = await generateResponse.json();

    // Aguarda a imagem ficar pronta
    for (let i = 0; i < 30; i++) {
      await new Promise(r => setTimeout(r, 3000));

      const statusResponse = await fetch(`https://stablehorde.net/api/v2/generate/check/${id}`);
      const status = await statusResponse.json();

      if (status.done) {
        const resultResponse = await fetch(`https://stablehorde.net/api/v2/generate/status/${id}`);
        const result = await resultResponse.json();
        const imageBase64 = result.generations?.[0]?.img;
        if (imageBase64) return `data:image/webp;base64,${imageBase64}`;
        throw new Error('Sem imagem no resultado');
      }
    }

    throw new Error('Timeout ao gerar imagem');

  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}
