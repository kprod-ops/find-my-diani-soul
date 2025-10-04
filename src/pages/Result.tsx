import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Share2, Home } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { locations, profiles, calculateProfile } from "@/data/locations";
import { toast } from "sonner";

const Result = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const sessionId = searchParams.get("session");

  const [profile, setProfile] = useState<any>(null);
  const [topLocations, setTopLocations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadResults();
  }, [sessionId]);

  const loadResults = async () => {
    if (!sessionId) {
      navigate("/");
      return;
    }

    try {
      const { data, error } = await supabase
        .from("game_sessions")
        .select("*")
        .eq("id", sessionId)
        .single();

      if (error) throw error;

      const likedIds = data.liked_location_ids || [];
      const profileType = calculateProfile(likedIds);
      
      // Update profile type in database
      await supabase
        .from("game_sessions")
        .update({ profile_type: profileType })
        .eq("id", sessionId);

      setProfile(profiles[profileType as keyof typeof profiles]);
      
      // Get top 3 liked locations
      const topLocs = likedIds
        .slice(0, 3)
        .map((id: number) => locations.find(loc => loc.id === id))
        .filter(Boolean);
      
      setTopLocations(topLocs);
    } catch (error) {
      console.error("Error loading results:", error);
      toast.error("Failed to load results");
    } finally {
      setLoading(false);
    }
  };

  const handleShare = () => {
    const shareUrl = `${window.location.origin}/play?ref=${sessionId}`;
    
    if (navigator.share) {
      navigator.share({
        title: "Find your Diani vibe!",
        text: "Discover your travel style and see if we match!",
        url: shareUrl,
      });
    } else {
      navigator.clipboard.writeText(shareUrl);
      toast.success("Link copied! Share it with friends 🌴");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-beach">
        <p className="text-lg text-muted-foreground">Loading your vibe...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-beach py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <Card className="p-8 text-center shadow-tropical animate-fade-in">
          <div className="text-6xl mb-4">{profile?.emoji}</div>
          
          <h1 className="text-3xl font-bold mb-2">
            Your Diani Adventure Profile:
          </h1>
          <h2 className="text-4xl font-bold bg-gradient-ocean bg-clip-text text-transparent mb-4">
            {profile?.name}
          </h2>
          
          <p className="text-lg text-muted-foreground mb-8">
            {profile?.description}
          </p>

          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4">Your Top Loved Spots:</h3>
            <div className="grid gap-4">
              {topLocations.map((location) => (
                <div
                  key={location.id}
                  className="flex items-center gap-4 p-4 bg-muted rounded-2xl"
                >
                  <img
                    src={`/src/assets/${location.image}`}
                    alt={location.name}
                    className="w-20 h-20 rounded-xl object-cover"
                  />
                  <div className="text-left">
                    <h4 className="font-semibold">{location.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {location.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <Button
              size="lg"
              onClick={handleShare}
              className="w-full bg-gradient-sunset hover:opacity-90 transition-all text-lg"
            >
              <Share2 className="mr-2 h-5 w-5" />
              Share with a Friend
            </Button>
            
            <p className="text-sm text-muted-foreground">
              💘 Share your game and see if you're a perfect Diani duo!
            </p>

            <Button
              variant="outline"
              onClick={() => navigate("/")}
              className="w-full"
            >
              <Home className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </div>
        </Card>

        <p className="text-center mt-6 text-foreground/70 italic">
          "Your vibe is pure paradise 🌺 — let's see who matches your Diani energy!"
        </p>
      </div>
    </div>
  );
};

export default Result;
