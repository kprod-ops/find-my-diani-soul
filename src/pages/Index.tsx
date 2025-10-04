import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import heroBeach from "@/assets/hero-beach.jpg";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Hero background image */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url(${heroBeach})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/50 to-black/70" />
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6 text-center">
        <div className="animate-float mb-6">
          <Sparkles className="h-16 w-16 text-secondary" />
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 animate-fade-in">
          Discover your
          <span className="block bg-gradient-sunset bg-clip-text text-transparent">
            Diani vibe
          </span>
        </h1>
        
        <p className="text-xl md:text-2xl text-white/90 mb-12 max-w-2xl animate-fade-in">
          Find out which spots match your travel soul 🌴✨
        </p>

        <Button
          size="lg"
          onClick={() => navigate("/play")}
          className="text-lg px-8 py-6 rounded-full bg-gradient-ocean hover:opacity-90 transition-all hover:scale-105 shadow-tropical animate-pulse-slow"
        >
          Start the Game
        </Button>

        <p className="text-white/70 mt-8 text-sm animate-fade-in">
          Swipe through 15 amazing Diani locations
        </p>
      </div>
    </div>
  );
};

export default Index;
