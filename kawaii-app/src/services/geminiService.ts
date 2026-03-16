export async function generateKawaiiWallpaper(prompt: string): Promise<string> {
  const response = await fetch('/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt }),
  });

  if (!response.ok) throw new Error('Falha ao gerar');
  const data = await response.json();
  if (!data.image) throw new Error('Sem imagem');
  return data.image;
}
