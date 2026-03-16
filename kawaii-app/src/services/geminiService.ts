export async function generateKawaiiWallpaper(prompt: string): Promise<string> {
  const fullPrompt = `kawaii aesthetic wallpaper, ${prompt}, pastel colors, cute, dreamy, soft lighting, high quality, anime style, mobile wallpaper`;
  const encodedPrompt = encodeURIComponent(fullPrompt);
  const seed = Math.floor(Math.random() * 999999);

  return `https://pollinations.ai/p/${encodedPrompt}?width=576&height=1024&seed=${seed}&nologo=true&model=flux`;
}
