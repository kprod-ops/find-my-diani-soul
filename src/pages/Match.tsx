import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Heart, Home, Share2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { locations, profiles, calculateMatch } from "@/data/locations";
import { toast } from "sonner";

const Match = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const referrerId = searchParams.get("ref");
  const friendId = searchParams.get("friend");

  const [matchData, setMatchData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMatchResults();
  }, [referrerId, friendId]);

  const loadMatchResults = async () => {
    if (!referrerId || !friendId) {
      navigate("/");
      return;
    }

    try {
      // Load both sessions
      const { data: sessions, error } = await supabase
        .from("game_sessions")
        .select("*")
        .in("id", [referrerId, friendId]);

      if (error) throw error;

      const referrer = sessions.find((s: any) => s.id === referrerId);
      const friend = sessions.find((s: any) => s.id === friendId);

      if (!referrer || !friend) {
        throw new Error("Sessions not found");
      }

      const userLikes = referrer.liked_location_ids || [];
      const friendLikes = friend.liked_location_ids || [];
      const matchPercentage = calculateMatch(userLikes, friendLikes);

      // Find shared locations
      const sharedLocationIds = userLikes.filter((id: number) =>
        friendLikes.includes(id)
      );
      const sharedLocations = sharedLocationIds
        .map((id: number) => locations.find((loc) => loc.id === id))
        .filter(Boolean)
        .slice(0, 3);

      const referrerProfile = profiles[referrer.profile_type as keyof typeof profiles];
      const friendProfile = profiles[friend.profile_type as keyof typeof profiles];

      setMatchData({
        matchPercentage,
        sharedLocations,
        referrerProfile,
        friendProfile,
      });
    } catch (error) {
      console.error("Error loading match results:", error);
      toast.error("Failed to load match results");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-beach">
        <p className="text-lg text-muted-foreground">Calculating your match...</p>
      </div>
    );
  }

  const getMatchMessage = (percentage: number) => {
    if (percentage >= 70) {
      return "You both love Diani sunsets and beachside vibes — match made in paradise! 🌅";
    } else if (percentage >= 50) {
      return "Great connection! You share some favorite spots perfect for exploring together! 🏖️";
    } else if (percentage >= 30) {
      return "Different vibes can make the best adventures — opposites attract! ✨";
    } else {
      return "Unique preferences! Time to introduce each other to new experiences! 🌴";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-beach py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <Card className="p-8 text-center shadow-tropical animate-fade-in">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <Heart className="h-24 w-24 text-secondary fill-secondary animate-pulse-slow" />
              <span className="absolute inset-0 flex items-center justify-center text-white font-bold text-xl">
                {matchData?.matchPercentage}%
              </span>
            </div>
          </div>

          <h1 className="text-4xl font-bold mb-4">
            You're a{" "}
            <span className="bg-gradient-sunset bg-clip-text text-transparent">
              {matchData?.matchPercentage}% Diani Match!
            </span>
          </h1>

          <div className="flex justify-center gap-4 mb-6">
            <div className="text-center">
              <div className="text-4xl mb-2">{matchData?.referrerProfile?.emoji}</div>
              <p className="text-sm font-medium">{matchData?.referrerProfile?.name}</p>
            </div>
            <div className="flex items-center">
              <Heart className="h-8 w-8 text-accent" />
            </div>
            <div className="text-center">
              <div className="text-4xl mb-2">{matchData?.friendProfile?.emoji}</div>
              <p className="text-sm font-medium">{matchData?.friendProfile?.name}</p>
            </div>
          </div>

          {matchData?.sharedLocations.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">📍 You both loved:</h3>
              <div className="space-y-2">
                {matchData.sharedLocations.map((location: any) => (
                  <div
                    key={location.id}
                    className="flex items-center gap-3 p-3 bg-muted rounded-xl"
                  >
                    <img
                      src={`/src/assets/${location.image}`}
                      alt={location.name}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <p className="font-medium text-left">{location.name}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <p className="text-lg text-muted-foreground mb-8 italic">
            {getMatchMessage(matchData?.matchPercentage || 0)}
          </p>

          <div className="space-y-4">
            <Button
              size="lg"
              className="w-full bg-gradient-ocean hover:opacity-90 transition-all text-lg"
            >
              Plan your trip together ✈️
            </Button>

            <Button
              variant="outline"
              onClick={() => navigate("/")}
              className="w-full"
            >
              <Home className="mr-2 h-4 w-4" />
              Play Again
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Match;
