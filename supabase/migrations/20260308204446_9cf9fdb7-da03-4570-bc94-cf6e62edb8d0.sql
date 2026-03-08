
-- Saved designs table
CREATE TABLE public.saved_designs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id text,
  name text NOT NULL,
  description text,
  fabric text,
  color text,
  style text,
  image_url text,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.saved_designs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert saved designs" ON public.saved_designs FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can view own saved designs" ON public.saved_designs FOR SELECT USING (
  (auth.uid() IS NOT NULL AND auth.uid() = user_id) OR (auth.uid() IS NULL AND session_id IS NOT NULL)
);
CREATE POLICY "Users can delete own saved designs" ON public.saved_designs FOR DELETE USING (
  (auth.uid() IS NOT NULL AND auth.uid() = user_id) OR (auth.uid() IS NULL AND session_id IS NOT NULL)
);

-- Appointments table
CREATE TABLE public.appointments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id text,
  name text NOT NULL,
  email text,
  phone text,
  appointment_type text NOT NULL DEFAULT 'consultation',
  preferred_date date NOT NULL,
  preferred_time text NOT NULL,
  notes text,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert appointments" ON public.appointments FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can view own appointments" ON public.appointments FOR SELECT USING (
  (auth.uid() IS NOT NULL AND auth.uid() = user_id) OR (auth.uid() IS NULL AND session_id IS NOT NULL)
);
