-- 1. Add college_id to posts to enable College Leaderboard (Expert Fix)
ALTER TABLE public.posts 
ADD COLUMN IF NOT EXISTS college_id UUID REFERENCES public.colleges(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_posts_college_id ON public.posts(college_id);

-- 2. Create Comments Table (Threaded)
CREATE TABLE public.comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  user_id UUID, -- Nullable for anonymous
  parent_comment_id UUID REFERENCES public.comments(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  is_op BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 3. Create Marketplace Listings
CREATE TABLE public.marketplace_listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id UUID, -- Link to auth.users if you have auth set up, or just a UUID
  college_id UUID NOT NULL REFERENCES public.colleges(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  price NUMERIC(10, 2) NOT NULL DEFAULT 0,
  category TEXT NOT NULL,
  condition TEXT CHECK (condition IN ('New', 'Like New', 'Good', 'Fair', 'Poor')),
  images TEXT[] DEFAULT '{}',
  is_giveaway BOOLEAN DEFAULT false,
  is_sold BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 4. Create Gigs (Skill Swap)
CREATE TABLE public.gigs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  title TEXT NOT NULL,
  description TEXT,
  payment_type TEXT CHECK (payment_type IN ('Cash', 'Barter', 'Free')),
  skills_required TEXT[] DEFAULT '{}',
  status TEXT DEFAULT 'Open' CHECK (status IN ('Open', 'In Progress', 'Completed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 5. Create Daily Mess Ratings (Mess Wars)
CREATE TABLE public.daily_mess_ratings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  college_id UUID NOT NULL REFERENCES public.colleges(id) ON DELETE CASCADE,
  rating_food INTEGER CHECK (rating_food >= 1 AND rating_food <= 5),
  menu_photo_url TEXT,
  verdict TEXT CHECK (verdict IN ('Yum', 'Mid', 'Toxic')),
  rating_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(college_id, rating_date) -- One rating summary per college per day (simplified)
);

-- 6. Create Exam War Rooms
CREATE TABLE public.exam_war_rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subject_id UUID NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
  exam_date TIMESTAMP WITH TIME ZONE NOT NULL,
  is_active BOOLEAN DEFAULT true,
  -- Storing chat history as JSONB for flexibility as requested, 
  -- though a separate messages table is usually better for scaling.
  chat_history JSONB DEFAULT '[]'::jsonb, 
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 7. Create College Leaderboard View
-- Aggregates points: 5 pts per Review, 2 pts per Post, 1 pt per Marketplace Listing
CREATE OR REPLACE VIEW public.college_leaderboard AS
SELECT 
  c.id,
  c.name,
  c.logo_url,
  COALESCE(COUNT(DISTINCT r.id) * 5, 0) + 
  COALESCE(COUNT(DISTINCT p.id) * 2, 0) + 
  COALESCE(COUNT(DISTINCT m.id) * 1, 0) as total_score,
  RANK() OVER (ORDER BY (
    COALESCE(COUNT(DISTINCT r.id) * 5, 0) + 
    COALESCE(COUNT(DISTINCT p.id) * 2, 0) + 
    COALESCE(COUNT(DISTINCT m.id) * 1, 0)
  ) DESC) as rank
FROM public.colleges c
LEFT JOIN public.reviews r ON c.id = r.college_id
LEFT JOIN public.posts p ON c.id = p.college_id
LEFT JOIN public.marketplace_listings m ON c.id = m.college_id
GROUP BY c.id, c.name, c.logo_url;

-- 8. Enable Realtime & RLS
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketplace_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gigs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_mess_ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exam_war_rooms ENABLE ROW LEVEL SECURITY;

-- Simple "Open" Policies for MVP (Refine these for production!)
CREATE POLICY "Public read comments" ON public.comments FOR SELECT USING (true);
CREATE POLICY "Public write comments" ON public.comments FOR INSERT WITH CHECK (true);

CREATE POLICY "Public read marketplace" ON public.marketplace_listings FOR SELECT USING (true);
CREATE POLICY "Public write marketplace" ON public.marketplace_listings FOR INSERT WITH CHECK (true);

CREATE POLICY "Public read gigs" ON public.gigs FOR SELECT USING (true);
CREATE POLICY "Public write gigs" ON public.gigs FOR INSERT WITH CHECK (true);

CREATE POLICY "Public read mess" ON public.daily_mess_ratings FOR SELECT USING (true);
CREATE POLICY "Public write mess" ON public.daily_mess_ratings FOR INSERT WITH CHECK (true);

CREATE POLICY "Public read war rooms" ON public.exam_war_rooms FOR SELECT USING (true);
CREATE POLICY "Public write war rooms" ON public.exam_war_rooms FOR INSERT WITH CHECK (true);

-- Enable Realtime for relevant tables
alter publication supabase_realtime add table public.posts;
alter publication supabase_realtime add table public.comments;
alter publication supabase_realtime add table public.exam_war_rooms;
