import { Heart, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LocationCardProps {
  name: string;
  description: string;
  image: string;
  onLove: () => void;
  onSkip: () => void;
  isAnimating?: boolean;
  animationType?: "love" | "skip" | null;
}

export function LocationCard({
  name,
  description,
  image,
  onLove,
  onSkip,
  isAnimating = false,
  animationType = null,
}: LocationCardProps) {
  return (
    <div 
      className={`relative w-full max-w-sm mx-auto ${
        isAnimating 
          ? animationType === "love" 
            ? "animate-swipe-right" 
            : "animate-swipe-left"
          : "animate-fade-in"
      }`}
    >
      <div className="bg-card rounded-3xl overflow-hidden shadow-card-tropical">
        {/* Image */}
        <div className="relative h-96 overflow-hidden">
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          
          {/* Location info overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <h3 className="text-2xl font-bold mb-2">{name}</h3>
            <p className="text-sm text-white/90">{description}</p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="p-6 flex justify-center gap-6">
          <Button
            size="lg"
            variant="outline"
            onClick={onSkip}
            className="rounded-full h-16 w-16 border-2 border-destructive text-destructive hover:bg-destructive hover:text-white transition-all hover:scale-110"
          >
            <X className="h-8 w-8" />
          </Button>
          
          <Button
            size="lg"
            onClick={onLove}
            className="rounded-full h-20 w-20 bg-gradient-ocean hover:opacity-90 transition-all hover:scale-110 shadow-tropical"
          >
            <Heart className="h-10 w-10 fill-white" />
          </Button>
        </div>
      </div>
    </div>
  );
}
