// kawaii-app/api/generate.ts
export const config = { runtime: 'edge' };

export default async function handler(req: Request) {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  try {
    const { prompt } = await req.json();
    const fullPrompt = `kawaii aesthetic wallpaper, ${prompt}, pastel colors, cute, dreamy, soft lighting, high quality, anime style, mobile wallpaper`;

    const generateRes = await fetch('https://stablehorde.net/api/v2/generate/async', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': '0000000000',
      },
      body: JSON.stringify({
        prompt: fullPrompt,
        params: { width: 512, height: 896, steps: 20 },
        models: ['Deliberate'],
      }),
    });

    if (!generateRes.ok) throw new Error('Falha ao iniciar');
    const { id } = await generateRes.json();

    // Aguarda resultado
    for (let i = 0; i < 20; i++) {
      await new Promise(r => setTimeout(r, 4000));
      const status = await fetch(`https://stablehorde.net/api/v2/generate/check/${id}`);
      const statusData = await status.json();

      if (statusData.done) {
        const result = await fetch(`https://stablehorde.net/api/v2/generate/status/${id}`);
        const resultData = await result.json();
        const img = resultData.generations?.[0]?.img;
        if (img) {
          return new Response(JSON.stringify({ image: `data:image/webp;base64,${img}` }), {
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
          });
        }
      }
    }
    throw new Error('Timeout');
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
