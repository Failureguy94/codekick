import { useState } from 'react';
import { Play, ExternalLink, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';

interface VideoCardProps {
  title: string;
  searchQuery: string;
  index: number;
}

const VideoCard = ({ title, searchQuery, index }: VideoCardProps) => {
  const [showEmbed, setShowEmbed] = useState(false);
  const youtubeSearchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(searchQuery)}`;
  const embedSearchUrl = `https://www.youtube.com/embed?listType=search&list=${encodeURIComponent(searchQuery)}`;
  
  // Generate a placeholder gradient based on index
  const gradients = [
    'from-blue-600 to-purple-600',
    'from-purple-600 to-pink-600',
    'from-cyan-600 to-blue-600',
    'from-indigo-600 to-purple-600',
  ];
  const gradient = gradients[index % gradients.length];

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        className="block group cursor-pointer"
        onClick={() => setShowEmbed(true)}
      >
        <div className="gradient-border rounded-xl overflow-hidden">
          <div className="bg-card">
            {/* Thumbnail placeholder */}
            <div className={`aspect-video bg-gradient-to-br ${gradient} relative flex items-center justify-center`}>
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
              <div className="relative z-10 w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                <Play className="h-6 w-6 text-white fill-white ml-1" />
              </div>
            </div>
            
            {/* Info */}
            <div className="p-4">
              <div className="flex items-start justify-between gap-2">
                <h4 className="font-medium text-foreground line-clamp-2 text-sm group-hover:text-primary transition-colors">
                  {title}
                </h4>
                <ExternalLink className="h-4 w-4 text-muted-foreground shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Click to watch
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Video Embed Dialog */}
      <Dialog open={showEmbed} onOpenChange={setShowEmbed}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden">
          <DialogTitle className="sr-only">{title}</DialogTitle>
          <DialogDescription className="sr-only">Watch video about {searchQuery}</DialogDescription>
          <div className="relative">
            <div className="absolute top-4 right-4 z-10">
              <a
                href={youtubeSearchUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors"
              >
                <ExternalLink className="h-4 w-4" />
                Open in YouTube
              </a>
            </div>
            <div className="aspect-video bg-black">
              <iframe
                src={embedSearchUrl}
                title={title}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <div className="p-4 bg-card">
              <h3 className="font-semibold">{title}</h3>
              <p className="text-sm text-muted-foreground mt-1">Search: {searchQuery}</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default VideoCard;
