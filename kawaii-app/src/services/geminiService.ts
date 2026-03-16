export async function generateKawaiiWallpaper(prompt: string): Promise<string> {
  try {
    const fullPrompt = `kawaii aesthetic wallpaper, ${prompt}, pastel colors, cute, dreamy, soft lighting, high quality, anime style, mobile wallpaper`;

    return new Promise((resolve, reject) => {
      // Carrega o Puter.js dinamicamente
      const script = document.createElement('script');
      script.src = 'https://js.puter.com/v2/';
      script.onload = async () => {
        try {
          const puter = (window as any).puter;
          const imgElement = await puter.ai.txt2img(fullPrompt, {
            model: 'flux-schnell'
          });
          
          // Converte o elemento img para base64
          const canvas = document.createElement('canvas');
          canvas.width = imgElement.naturalWidth || 576;
          canvas.height = imgElement.naturalHeight || 1024;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(imgElement, 0, 0);
          resolve(canvas.toDataURL('image/png'));
        } catch (err) {
          reject(err);
        }
      };
      script.onerror = () => reject(new Error('Falha ao carregar Puter.js'));
      
      // Só adiciona o script se ainda não existir
      if (!document.querySelector('script[src="https://js.puter.com/v2/"]')) {
        document.head.appendChild(script);
      } else {
        const puter = (window as any).puter;
        if (puter) {
          puter.ai.txt2img(fullPrompt, { model: 'flux-schnell' })
            .then((imgElement: HTMLImageElement) => {
              const canvas = document.createElement('canvas');
              canvas.width = imgElement.naturalWidth || 576;
              canvas.height = imgElement.naturalHeight || 1024;
              const ctx = canvas.getContext('2d');
              ctx?.drawImage(imgElement, 0, 0);
              resolve(canvas.toDataURL('image/png'));
            })
            .catch(reject);
        }
      }
    });

  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}
