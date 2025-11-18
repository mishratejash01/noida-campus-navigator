-- Create Universities table (Level 1)
CREATE TABLE public.universities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  acronym TEXT NOT NULL UNIQUE,
  website_url TEXT,
  logo_url TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create Colleges table (Level 2)
CREATE TABLE public.colleges (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  affiliated_university_id UUID NOT NULL REFERENCES public.universities(id) ON DELETE CASCADE,
  website_url TEXT,
  logo_url TEXT,
  description TEXT,
  city TEXT NOT NULL DEFAULT 'Noida',
  established_year INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create Programs table (Level 3)
CREATE TABLE public.programs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  acronym TEXT NOT NULL,
  duration TEXT NOT NULL,
  description TEXT,
  program_type TEXT, -- undergraduate, postgraduate, diploma
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create College Programs junction table
CREATE TABLE public.college_programs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  college_id UUID NOT NULL REFERENCES public.colleges(id) ON DELETE CASCADE,
  program_id UUID NOT NULL REFERENCES public.programs(id) ON DELETE CASCADE,
  seats_available INTEGER,
  fees_per_year NUMERIC(10,2),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(college_id, program_id)
);

-- Create Subjects table (Level 4 support)
CREATE TABLE public.subjects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  program_id UUID NOT NULL REFERENCES public.programs(id) ON DELETE CASCADE,
  semester INTEGER NOT NULL,
  credits INTEGER,
  code TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create Academic Resources table
CREATE TABLE public.academic_resources (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  subject_id UUID NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
  college_id UUID NOT NULL REFERENCES public.colleges(id) ON DELETE CASCADE,
  resource_type TEXT NOT NULL CHECK (resource_type IN ('notes', 'pyqs', 'syllabus', 'other')),
  title TEXT NOT NULL,
  description TEXT,
  file_url TEXT NOT NULL,
  upload_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  uploaded_by TEXT,
  downloads INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create Internship Postings table
CREATE TABLE public.internship_postings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_name TEXT NOT NULL,
  company_logo_url TEXT,
  role_title TEXT NOT NULL,
  location TEXT NOT NULL,
  description TEXT NOT NULL,
  requirements TEXT,
  stipend TEXT,
  duration TEXT,
  program_filter TEXT[], -- Array of program acronyms
  application_type TEXT NOT NULL DEFAULT 'internal' CHECK (application_type IN ('internal', 'external')),
  application_url TEXT,
  posted_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  deadline TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create Internship Applicants table
CREATE TABLE public.internship_applicants (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  posting_id UUID NOT NULL REFERENCES public.internship_postings(id) ON DELETE CASCADE,
  student_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  college_name TEXT NOT NULL,
  program TEXT NOT NULL,
  resume_file_url TEXT NOT NULL,
  cover_letter TEXT,
  application_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'shortlisted', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create Events table
CREATE TABLE public.events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  date_time TIMESTAMP WITH TIME ZONE NOT NULL,
  venue TEXT NOT NULL,
  image_url TEXT,
  max_capacity INTEGER,
  current_registrations INTEGER DEFAULT 0,
  registration_deadline TIMESTAMP WITH TIME ZONE,
  event_type TEXT, -- workshop, seminar, competition, etc.
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create Event Registrations table
CREATE TABLE public.event_registrations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  student_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  college_name TEXT NOT NULL,
  program TEXT NOT NULL,
  registration_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  attendance_status TEXT DEFAULT 'registered' CHECK (attendance_status IN ('registered', 'attended', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(event_id, email)
);

-- Enable Row Level Security
ALTER TABLE public.universities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.colleges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.college_programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.academic_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.internship_postings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.internship_applicants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_registrations ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access (students can view all data)
CREATE POLICY "Allow public read access to universities" ON public.universities FOR SELECT USING (true);
CREATE POLICY "Allow public read access to colleges" ON public.colleges FOR SELECT USING (true);
CREATE POLICY "Allow public read access to programs" ON public.programs FOR SELECT USING (true);
CREATE POLICY "Allow public read access to college_programs" ON public.college_programs FOR SELECT USING (true);
CREATE POLICY "Allow public read access to subjects" ON public.subjects FOR SELECT USING (true);
CREATE POLICY "Allow public read access to academic_resources" ON public.academic_resources FOR SELECT USING (true);
CREATE POLICY "Allow public read access to internship_postings" ON public.internship_postings FOR SELECT USING (is_active = true);
CREATE POLICY "Allow public read access to events" ON public.events FOR SELECT USING (is_active = true);

-- Create policies for student applications/registrations
CREATE POLICY "Allow public insert to internship_applicants" ON public.internship_applicants FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert to event_registrations" ON public.event_registrations FOR INSERT WITH CHECK (true);

-- Create indexes for better query performance
CREATE INDEX idx_colleges_university ON public.colleges(affiliated_university_id);
CREATE INDEX idx_college_programs_college ON public.college_programs(college_id);
CREATE INDEX idx_college_programs_program ON public.college_programs(program_id);
CREATE INDEX idx_subjects_program ON public.subjects(program_id);
CREATE INDEX idx_academic_resources_subject ON public.academic_resources(subject_id);
CREATE INDEX idx_academic_resources_college ON public.academic_resources(college_id);
CREATE INDEX idx_internship_applicants_posting ON public.internship_applicants(posting_id);
CREATE INDEX idx_event_registrations_event ON public.event_registrations(event_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_universities_updated_at BEFORE UPDATE ON public.universities FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_colleges_updated_at BEFORE UPDATE ON public.colleges FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON public.events FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to increment event registrations counter
CREATE OR REPLACE FUNCTION public.increment_event_registrations()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.events 
  SET current_registrations = current_registrations + 1 
  WHERE id = NEW.event_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for event registration counter
CREATE TRIGGER increment_event_registrations_trigger 
AFTER INSERT ON public.event_registrations 
FOR EACH ROW EXECUTE FUNCTION public.increment_event_registrations();