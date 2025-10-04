-- Create game_sessions table to store user game results
CREATE TABLE IF NOT EXISTS public.game_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  liked_location_ids INTEGER[] NOT NULL DEFAULT '{}',
  profile_type TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS (but make it public for this fun game)
ALTER TABLE public.game_sessions ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read and create game sessions
CREATE POLICY "Anyone can create game sessions"
  ON public.game_sessions
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Anyone can read game sessions"
  ON public.game_sessions
  FOR SELECT
  TO public
  USING (true);