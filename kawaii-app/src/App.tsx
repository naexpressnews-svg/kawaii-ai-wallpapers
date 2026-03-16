import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Download, X, Sparkles, Image as ImageIcon, Loader2 } from 'lucide-react';
import { Wallpaper } from './types';
import { DEFAULT_WALLPAPERS } from './constants';
import { generateKawaiiWallpaper } from './services/geminiService';
import AdBanner from './components/AdBanner';

export default function App() {
  const [activeTab, setActiveTab] = useState<'gallery' | 'generate' | 'favorites'>('gallery');
  const [wallpapers, setWallpapers] = useState<Wallpaper[]>(DEFAULT_WALLPAPERS);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [selectedImage, setSelectedImage] = useState<Wallpaper | null>(null);

  // Generator state
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const savedFavorites = localStorage.getItem('kawaii_favorites');
    if (savedFavorites) setFavorites(JSON.parse(savedFavorites));

    const savedWallpapers = localStorage.getItem('kawaii_generated_wallpapers');
    if (savedWallpapers) {
      const parsed = JSON.parse(savedWallpapers);
      setWallpapers(prev => [...parsed, ...prev]);
    }
  }, []);

  const toggleFavorite = (id: string) => {
    setFavorites(prev => {
      const newFavs = prev.includes(id) ? prev.filter(fId => fId !== id) : [...prev, id];
      localStorage.setItem('kawaii_favorites', JSON.stringify(newFavs));
      return newFavs;
    });
  };

  const handleDownload = async (url: string, filename: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);
    setError(null);
    setGeneratedImage(null);

    try {
      const imageUrl = await generateKawaiiWallpaper(prompt);
      setGeneratedImage(imageUrl);

      const newWallpaper: Wallpaper = {
        id: `gen_${Date.now()}`,
        url: imageUrl,
        prompt: prompt,
        category: 'AI Generated',
        createdAt: Date.now()
      };

      const updatedWallpapers = [newWallpaper, ...wallpapers];
      setWallpapers(updatedWallpapers);

      const generatedOnly = updatedWallpapers.filter(w => w.id.startsWith('gen_'));
      localStorage.setItem('kawaii_generated_wallpapers', JSON.stringify(generatedOnly));

    } catch (err: any) {
      setError('Falha ao gerar wallpaper. Tenta novamente.');
    } finally {
      setIsGenerating(false);
    }
  };

  const displayedWallpapers = activeTab === 'favorites'
    ? wallpapers.filter(w => favorites.includes(w.id))
    : wallpapers;

  return (
    <div className="min-h-screen pb-24 font-sans">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-pastel-pink/30 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-center">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-pastel-pink to-pastel-purple flex items-center justify-center shadow-sm">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-2xl font-heading font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-purple-400">
              Kawaii Walls
            </h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="mb-8">
          <AdBanner />
        </div>

        {activeTab === 'generate' ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto"
          >
            <div className="bg-white rounded-3xl shadow-xl shadow-pink-100/50 p-8 border border-pastel-pink/20">
              <h2 className="text-3xl font-heading font-bold text-center mb-2 text-gray-800">Create Magic ✨</h2>
              <p className="text-center text-gray-500 mb-8">Describe your dream kawaii wallpaper and let AI bring it to life.</p>

              <div className="space-y-4">
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="e.g., A cute fluffy bunny sleeping on a pastel pink cloud surrounded by stars..."
                  className="w-full h-32 p-4 rounded-2xl bg-gray-50 border-2 border-pastel-pink/30 focus:border-pink-400 focus:ring-4 focus:ring-pink-100 outline-none transition-all resize-none text-gray-700"
                />

                <button
                  onClick={handleGenerate}
                  disabled={isGenerating || !prompt.trim()}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-pink-400 to-purple-400 text-white font-bold text-lg shadow-lg shadow-pink-200 hover:shadow-pink-300 transform hover:-translate-y-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-6 h-6 animate-spin" />
                      Generating Magic...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-6 h-6" />
                      Generate Wallpaper
                    </>
                  )}
                </button>

                {error && (
                  <p className="text-red-500 text-center text-sm mt-2">{error}</p>
                )}
              </div>

              {generatedImage && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mt-8"
                >
                  <h3 className="text-lg font-bold text-gray-700 mb-4 text-center">Your Creation</h3>
                  <div className="relative rounded-2xl overflow-hidden shadow-lg aspect-[9/16] max-w-sm mx-auto group">
                    <img src={generatedImage} alt="Generated" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                      <button
                        onClick={() => handleDownload(generatedImage, `kawaii-wall-${Date.now()}.png`)}
                        className="p-3 bg-white rounded-full text-gray-800 hover:scale-110 transition-transform"
                      >
                        <Download className="w-6 h-6" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4"
          >
            {displayedWallpapers.length === 0 ? (
              <div className="col-span-full text-center py-20 text-gray-400">
                <Heart className="w-16 h-16 mx-auto mb-4 opacity-20" />
                <p className="text-xl">No favorites yet!</p>
                <p>Go find some cute wallpapers to save.</p>
              </div>
            ) : (
              displayedWallpapers.map((wallpaper) => (
                <motion.div
                  layoutId={`wall-${wallpaper.id}`}
                  key={wallpaper.id}
                  className="relative group rounded-2xl overflow-hidden cursor-pointer break-inside-avoid shadow-sm hover:shadow-xl transition-all duration-300"
                  onClick={() => setSelectedImage(wallpaper)}
                >
                  <img
                    src={wallpaper.url}
                    alt={wallpaper.prompt || wallpaper.category || 'Wallpaper'}
                    className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                    <div className="flex justify-between items-end">
                      <span className="text-white text-sm font-medium bg-white/20 backdrop-blur-md px-2 py-1 rounded-lg">
                        {wallpaper.category || 'Aesthetic'}
                      </span>
                      <button
                        onClick={(e) => { e.stopPropagation(); toggleFavorite(wallpaper.id); }}
                        className="p-2 rounded-full bg-white/20 backdrop-blur-md hover:bg-white/40 transition-colors"
                      >
                        <Heart className={`w-5 h-5 ${favorites.includes(wallpaper.id) ? 'fill-pink-400 text-pink-400' : 'text-white'}`} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </motion.div>
        )}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-xl shadow-xl shadow-pink-100/50 rounded-full px-6 py-3 border border-pastel-pink/30 flex items-center gap-8 z-40">
        <NavItem icon={<ImageIcon className="w-6 h-6" />} label="Gallery" isActive={activeTab === 'gallery'} onClick={() => setActiveTab('gallery')} />
        <NavItem icon={<Sparkles className="w-6 h-6" />} label="Create" isActive={activeTab === 'generate'} onClick={() => setActiveTab('generate')} isPrimary />
        <NavItem icon={<Heart className="w-6 h-6" />} label="Favorites" isActive={activeTab === 'favorites'} onClick={() => setActiveTab('favorites')} />
      </nav>

      {/* Fullscreen Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 md:p-8"
            onClick={() => setSelectedImage(null)}
          >
            <button className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors" onClick={() => setSelectedImage(null)}>
              <X className="w-6 h-6" />
            </button>
            <motion.div
              layoutId={`wall-${selectedImage.id}`}
              className="relative max-w-md w-full max-h-[85vh] rounded-3xl overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <img src={selectedImage.url} alt="Selected Wallpaper" className="w-full h-full object-contain bg-black" />
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-center justify-between">
                <div className="flex-1">
                  {selectedImage.prompt && <p className="text-white/80 text-sm line-clamp-2 mb-2">{selectedImage.prompt}</p>}
                  <span className="text-white text-sm font-medium bg-white/20 backdrop-blur-md px-3 py-1 rounded-full">{selectedImage.category || 'Aesthetic'}</span>
                </div>
                <div className="flex gap-3 ml-4">
                  <button onClick={() => toggleFavorite(selectedImage.id)} className="p-4 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 transition-colors">
                    <Heart className={`w-6 h-6 ${favorites.includes(selectedImage.id) ? 'fill-pink-400 text-pink-400' : 'text-white'}`} />
                  </button>
                  <button onClick={() => handleDownload(selectedImage.url, `kawaii-wall-${selectedImage.id}.png`)} className="p-4 rounded-full bg-gradient-to-r from-pink-400 to-purple-400 text-white shadow-lg hover:shadow-pink-400/50 transition-all hover:scale-105">
                    <Download className="w-6 h-6" />
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function NavItem({ icon, label, isActive, onClick, isPrimary = false }: {
  icon: React.ReactNode, label: string, isActive: boolean, onClick: () => void, isPrimary?: boolean
}) {
  return (
    <button onClick={onClick} className={`flex flex-col items-center gap-1 transition-all ${isActive ? (isPrimary ? 'text-pink-500' : 'text-gray-800') : 'text-gray-400 hover:text-gray-600'}`}>
      <div className={`p-2 rounded-2xl transition-all ${isActive ? (isPrimary ? 'bg-pink-100 shadow-inner' : 'bg-gray-100') : 'hover:bg-gray-50'}`}>
        {icon}
      </div>
      <span className="text-[10px] font-bold uppercase tracking-wider">{label}</span>
    </button>
  );
}
