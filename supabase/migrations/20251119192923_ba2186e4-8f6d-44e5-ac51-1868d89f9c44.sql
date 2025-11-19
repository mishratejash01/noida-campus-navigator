-- Create reviews table for Student Verdict feature
CREATE TABLE public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  college_id UUID NOT NULL REFERENCES public.colleges(id) ON DELETE CASCADE,
  user_id UUID, -- optional/anonymous
  rating_overall INTEGER NOT NULL CHECK (rating_overall >= 1 AND rating_overall <= 5),
  rating_faculty INTEGER CHECK (rating_faculty >= 1 AND rating_faculty <= 5),
  rating_infrastructure INTEGER CHECK (rating_infrastructure >= 1 AND rating_infrastructure <= 5),
  rating_crowd INTEGER CHECK (rating_crowd >= 1 AND rating_crowd <= 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create posts table for Campus Pulse feature
CREATE TABLE public.posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'Confession',
  upvotes INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_anonymous BOOLEAN NOT NULL DEFAULT true
);

-- Create housing table for PG/Hostel listings
CREATE TABLE public.housing (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  price_range TEXT NOT NULL,
  amenities TEXT[] NOT NULL DEFAULT '{}',
  rating NUMERIC(2,1) CHECK (rating >= 1 AND rating <= 5),
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all new tables
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.housing ENABLE ROW LEVEL SECURITY;

-- RLS Policies for reviews (public read, public insert for anonymous reviews)
CREATE POLICY "Allow public read access to reviews"
  ON public.reviews
  FOR SELECT
  USING (true);

CREATE POLICY "Allow public insert to reviews"
  ON public.reviews
  FOR INSERT
  WITH CHECK (true);

-- RLS Policies for posts (public read, public insert for anonymous posts)
CREATE POLICY "Allow public read access to posts"
  ON public.posts
  FOR SELECT
  USING (true);

CREATE POLICY "Allow public insert to posts"
  ON public.posts
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow public update to posts for upvotes"
  ON public.posts
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- RLS Policies for housing (public read only for now)
CREATE POLICY "Allow public read access to housing"
  ON public.housing
  FOR SELECT
  USING (true);

-- Create indexes for better performance
CREATE INDEX idx_reviews_college_id ON public.reviews(college_id);
CREATE INDEX idx_reviews_created_at ON public.reviews(created_at DESC);
CREATE INDEX idx_posts_created_at ON public.posts(created_at DESC);
CREATE INDEX idx_posts_category ON public.posts(category);
CREATE INDEX idx_housing_location ON public.housing(location);
CREATE INDEX idx_housing_price ON public.housing(price_range);