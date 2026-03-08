
-- Tighten INSERT policies to require either user_id or session_id
DROP POLICY "Anyone can insert saved designs" ON public.saved_designs;
CREATE POLICY "Users can insert saved designs" ON public.saved_designs FOR INSERT 
WITH CHECK (user_id IS NOT NULL OR session_id IS NOT NULL);

DROP POLICY "Anyone can insert appointments" ON public.appointments;
CREATE POLICY "Users can insert appointments" ON public.appointments FOR INSERT 
WITH CHECK (user_id IS NOT NULL OR session_id IS NOT NULL);
