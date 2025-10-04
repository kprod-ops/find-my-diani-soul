import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { LocationCard } from "@/components/LocationCard";
import { ProgressBar } from "@/components/ProgressBar";
import { locations, shuffleArray } from "@/data/locations";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Play = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const referrerId = searchParams.get("ref");

  const [gameLocations, setGameLocations] = useState(shuffleArray(locations));
  const [currentRound, setCurrentRound] = useState(0);
  const [likedLocations, setLikedLocations] = useState<number[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationType, setAnimationType] = useState<"love" | "skip" | null>(null);

  const totalRounds = 15;
  const currentLocation = gameLocations[currentRound];

  useEffect(() => {
    // If there's a referrer, optionally load their game data to show same locations
    // For now, we use random shuffle - can enhance to load same order
  }, [referrerId]);

  const handleChoice = async (liked: boolean) => {
    if (isAnimating) return;

    setIsAnimating(true);
    setAnimationType(liked ? "love" : "skip");

    if (liked) {
      setLikedLocations([...likedLocations, currentLocation.id]);
    }

    // Wait for animation
    setTimeout(async () => {
      if (currentRound + 1 >= totalRounds) {
        // Game complete - save results and navigate to result
        const updatedLikes = liked 
          ? [...likedLocations, currentLocation.id] 
          : likedLocations;
        
        try {
          const { data, error } = await supabase
            .from("game_sessions")
            .insert({
              liked_location_ids: updatedLikes,
            })
            .select()
            .single();

          if (error) throw error;

          // Navigate to result page with session ID
          if (referrerId) {
            navigate(`/match?ref=${referrerId}&friend=${data.id}`);
          } else {
            navigate(`/result?session=${data.id}`);
          }
        } catch (error) {
          console.error("Error saving game:", error);
          toast.error("Failed to save game results");
        }
      } else {
        // Move to next round
        setCurrentRound(currentRound + 1);
        setIsAnimating(false);
        setAnimationType(null);
      }
    }, 400);
  };

  if (!currentLocation) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-beach py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <ProgressBar current={currentRound + 1} total={totalRounds} />
        
        <LocationCard
          name={currentLocation.name}
          description={currentLocation.description}
          image={`/src/assets/${currentLocation.image}`}
          onLove={() => handleChoice(true)}
          onSkip={() => handleChoice(false)}
          isAnimating={isAnimating}
          animationType={animationType}
        />

        <p className="text-center mt-6 text-muted-foreground text-sm">
          Tap ❤️ to love it or ✕ to skip
        </p>
      </div>
    </div>
  );
};

export default Play;
