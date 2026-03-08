
-- AI Chat configuration table (admin-managed)
CREATE TABLE public.ai_chat_config (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  value text NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.ai_chat_config ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read chat config" ON public.ai_chat_config FOR SELECT USING (true);
CREATE POLICY "Admins can manage chat config" ON public.ai_chat_config FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- Knowledge base entries (admin-managed)
CREATE TABLE public.ai_knowledge_base (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL,
  category text DEFAULT 'general',
  is_active boolean DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.ai_knowledge_base ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read active knowledge" ON public.ai_knowledge_base FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage knowledge base" ON public.ai_knowledge_base FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- Chat conversations
CREATE TABLE public.chat_conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id text,
  status text NOT NULL DEFAULT 'active',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.chat_conversations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own conversations" ON public.chat_conversations FOR ALL USING (
  (auth.uid() IS NOT NULL AND auth.uid() = user_id) OR (session_id IS NOT NULL)
) WITH CHECK (
  (auth.uid() IS NOT NULL AND auth.uid() = user_id) OR (session_id IS NOT NULL)
);
CREATE POLICY "Admins can view all conversations" ON public.chat_conversations FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));

-- Chat messages
CREATE TABLE public.chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid REFERENCES public.chat_conversations(id) ON DELETE CASCADE NOT NULL,
  role text NOT NULL,
  content text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own messages" ON public.chat_messages FOR ALL USING (
  EXISTS (SELECT 1 FROM public.chat_conversations c WHERE c.id = chat_messages.conversation_id AND (
    (auth.uid() IS NOT NULL AND c.user_id = auth.uid()) OR c.session_id IS NOT NULL
  ))
) WITH CHECK (
  EXISTS (SELECT 1 FROM public.chat_conversations c WHERE c.id = chat_messages.conversation_id AND (
    (auth.uid() IS NOT NULL AND c.user_id = auth.uid()) OR c.session_id IS NOT NULL
  ))
);
CREATE POLICY "Admins can view all messages" ON public.chat_messages FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));

-- Insert default config
INSERT INTO public.ai_chat_config (key, value) VALUES
('system_prompt', 'You are SHAHEB''s friendly and knowledgeable customer support assistant. You help customers with product inquiries, order tracking, sizing advice, style recommendations, and general questions about our premium men''s fashion store. Be warm, professional, and concise. If you don''t know something specific about an order, suggest the customer check their dashboard or contact support. Always maintain a helpful and premium brand tone.'),
('welcome_message', 'Welcome to SHAHEB! 👋 I''m your personal style assistant. How can I help you today?'),
('bot_name', 'SHAHEB Assistant'),
('is_enabled', 'true');

-- Insert sample knowledge base
INSERT INTO public.ai_knowledge_base (title, content, category) VALUES
('Shipping Policy', 'We offer free shipping on orders above ₹999. Standard delivery takes 5-7 business days. Express delivery (₹149) takes 2-3 business days. We ship across India.', 'shipping'),
('Return Policy', 'We accept returns within 15 days of delivery. Items must be unworn, unwashed, and with original tags. Digital products are non-refundable. Refunds are processed within 5-7 business days.', 'returns'),
('Size Guide', 'Our sizes range from S to XXL. S: Chest 36", M: Chest 38", L: Chest 40", XL: Chest 42", XXL: Chest 44". For trousers, we have waist sizes 28-38. We recommend measuring yourself and comparing with our size chart on each product page.', 'sizing'),
('Payment Methods', 'We accept all major credit/debit cards, UPI, net banking, and cash on delivery (COD) for orders under ₹10,000. EMI options are available on orders above ₹3,000.', 'payments'),
('About SHAHEB', 'SHAHEB is a premium men''s fashion brand offering curated collections of shirts, trousers, ethnic wear, jackets, blazers, and accessories. We also offer digital products like style guides. Our mission is to help every man look and feel his best.', 'general');
