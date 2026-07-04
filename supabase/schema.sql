-- ============================================================
-- People's Priorities — Complete Supabase PostgreSQL Schema
-- AI-Powered Constituency Planning Platform
-- ============================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- ============================================================
-- ENUMS
-- ============================================================

CREATE TYPE user_role AS ENUM ('citizen', 'mp', 'officer', 'admin');
CREATE TYPE complaint_status AS ENUM ('pending', 'open', 'in_progress', 'resolved', 'closed', 'rejected');
CREATE TYPE complaint_priority AS ENUM ('low', 'medium', 'high', 'critical');
CREATE TYPE project_status AS ENUM ('proposed', 'approved', 'ongoing', 'completed', 'on_hold', 'cancelled');
CREATE TYPE vote_type AS ENUM ('up', 'down');
CREATE TYPE notification_type AS ENUM ('complaint_update', 'comment', 'project_update', 'scheme', 'vote', 'system');

-- ============================================================
-- TABLES
-- ============================================================

CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT,
  role user_role NOT NULL DEFAULT 'citizen',
  avatar_url TEXT,
  bio TEXT,
  address TEXT,
  constituency_id UUID,
  department_id UUID,
  is_verified BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.constituencies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  state TEXT NOT NULL,
  district TEXT,
  mp_id UUID REFERENCES public.users(id),
  population INTEGER,
  area_sq_km NUMERIC(10,2),
  latitude NUMERIC(10,7),
  longitude NUMERIC(10,7),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.users ADD CONSTRAINT fk_users_constituency
  FOREIGN KEY (constituency_id) REFERENCES public.constituencies(id);

CREATE TABLE public.villages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  constituency_id UUID NOT NULL REFERENCES public.constituencies(id),
  latitude NUMERIC(10,7),
  longitude NUMERIC(10,7),
  population INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.wards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  ward_number INTEGER,
  constituency_id UUID NOT NULL REFERENCES public.constituencies(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.departments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  code TEXT UNIQUE,
  description TEXT,
  head_officer_id UUID REFERENCES public.users(id),
  constituency_id UUID REFERENCES public.constituencies(id),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.users ADD CONSTRAINT fk_users_department
  FOREIGN KEY (department_id) REFERENCES public.departments(id);

CREATE TABLE public.categories (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  icon TEXT,
  color TEXT DEFAULT '#6366f1',
  description TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.citizens (
  id UUID PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
  aadhaar_last4 TEXT,
  voter_id TEXT,
  ward_id UUID REFERENCES public.wards(id),
  village_id UUID REFERENCES public.villages(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.complaints (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  status complaint_status NOT NULL DEFAULT 'pending',
  priority complaint_priority NOT NULL DEFAULT 'medium',
  category_id INTEGER REFERENCES public.categories(id),
  citizen_id UUID NOT NULL REFERENCES public.users(id),
  assigned_to UUID REFERENCES public.users(id),
  department_id UUID REFERENCES public.departments(id),
  constituency_id UUID REFERENCES public.constituencies(id),
  location_text TEXT,
  location_lat NUMERIC(10,7),
  location_lng NUMERIC(10,7),
  village_id UUID REFERENCES public.villages(id),
  ward_id UUID REFERENCES public.wards(id),
  is_anonymous BOOLEAN DEFAULT FALSE,
  is_ai_categorized BOOLEAN DEFAULT FALSE,
  ai_suggested_priority complaint_priority,
  resolution_note TEXT,
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.votes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  complaint_id UUID NOT NULL REFERENCES public.complaints(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  vote_type vote_type NOT NULL DEFAULT 'up',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(complaint_id, user_id)
);

CREATE TABLE public.comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  complaint_id UUID NOT NULL REFERENCES public.complaints(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  is_official BOOLEAN DEFAULT FALSE,
  parent_id UUID REFERENCES public.comments(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  status project_status NOT NULL DEFAULT 'proposed',
  department_id UUID REFERENCES public.departments(id),
  constituency_id UUID REFERENCES public.constituencies(id),
  created_by UUID REFERENCES public.users(id),
  approved_by UUID REFERENCES public.users(id),
  location_text TEXT,
  location_lat NUMERIC(10,7),
  location_lng NUMERIC(10,7),
  start_date DATE,
  end_date DATE,
  completion_percentage INTEGER DEFAULT 0 CHECK (completion_percentage BETWEEN 0 AND 100),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.budgets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  fiscal_year TEXT,
  allocated NUMERIC(15,2) NOT NULL DEFAULT 0,
  spent NUMERIC(15,2) NOT NULL DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  complaint_id UUID REFERENCES public.complaints(id) ON DELETE CASCADE,
  project_id UUID REFERENCES public.projects(id),
  user_id UUID NOT NULL REFERENCES public.users(id),
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_type TEXT,
  file_size INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  complaint_id UUID REFERENCES public.complaints(id) ON DELETE CASCADE,
  project_id UUID REFERENCES public.projects(id),
  url TEXT NOT NULL,
  thumbnail_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.project_updates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id),
  title TEXT NOT NULL,
  content TEXT,
  completion_percentage INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type notification_type NOT NULL DEFAULT 'system',
  reference_id UUID,
  reference_type TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.government_schemes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  ministry TEXT,
  deadline DATE,
  beneficiary_count TEXT,
  category TEXT,
  url TEXT,
  emoji TEXT DEFAULT '📜',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.activity_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id),
  action TEXT NOT NULL,
  entity_type TEXT,
  entity_id UUID,
  metadata JSONB,
  ip_address INET,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  type TEXT NOT NULL,
  constituency_id UUID REFERENCES public.constituencies(id),
  created_by UUID REFERENCES public.users(id),
  file_url TEXT,
  data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- INDEXES
-- ============================================================

CREATE INDEX idx_users_email ON public.users(email);
CREATE INDEX idx_users_role ON public.users(role);
CREATE INDEX idx_complaints_status ON public.complaints(status);
CREATE INDEX idx_complaints_priority ON public.complaints(priority);
CREATE INDEX idx_complaints_citizen ON public.complaints(citizen_id);
CREATE INDEX idx_complaints_created ON public.complaints(created_at DESC);
CREATE INDEX idx_complaints_title_trgm ON public.complaints USING GIN (title gin_trgm_ops);
CREATE INDEX idx_votes_complaint ON public.votes(complaint_id);
CREATE INDEX idx_comments_complaint ON public.comments(complaint_id);
CREATE INDEX idx_notifications_user ON public.notifications(user_id);
CREATE INDEX idx_notifications_read ON public.notifications(user_id, is_read);
CREATE INDEX idx_projects_status ON public.projects(status);

-- ============================================================
-- TRIGGERS
-- ============================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_users_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trigger_complaints_updated_at BEFORE UPDATE ON public.complaints FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trigger_projects_updated_at BEFORE UPDATE ON public.projects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, role, phone)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'citizen'),
    NEW.raw_user_meta_data->>'phone'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

CREATE OR REPLACE FUNCTION notify_complaint_update()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    INSERT INTO public.notifications (user_id, title, message, type, reference_id, reference_type)
    VALUES (
      NEW.citizen_id,
      'Complaint Status Updated',
      'Your complaint has been updated to ' || NEW.status,
      'complaint_update', NEW.id, 'complaint'
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_complaint_status_change
  AFTER UPDATE ON public.complaints
  FOR EACH ROW EXECUTE FUNCTION notify_complaint_update();

-- ============================================================
-- RLS POLICIES
-- ============================================================

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.complaints ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.budgets ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION get_user_role()
RETURNS TEXT AS $$
BEGIN
  RETURN (SELECT role FROM public.users WHERE id = auth.uid());
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE POLICY "Users can view all" ON public.users FOR SELECT USING (TRUE);
CREATE POLICY "Users can update own" ON public.users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own" ON public.users FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "View complaints" ON public.complaints FOR SELECT USING (
  NOT is_anonymous OR citizen_id = auth.uid() OR get_user_role() IN ('mp', 'officer', 'admin')
);
CREATE POLICY "Insert own complaints" ON public.complaints FOR INSERT WITH CHECK (auth.uid() = citizen_id);
CREATE POLICY "Update complaints" ON public.complaints FOR UPDATE USING (
  auth.uid() = citizen_id OR get_user_role() IN ('officer', 'mp', 'admin')
);

CREATE POLICY "Vote" ON public.votes FOR ALL USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Read comments" ON public.comments FOR SELECT USING (TRUE);
CREATE POLICY "Add comments" ON public.comments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Own notifications" ON public.notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Update own notifications" ON public.notifications FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "View projects" ON public.projects FOR SELECT USING (TRUE);
CREATE POLICY "Manage projects" ON public.projects FOR INSERT WITH CHECK (get_user_role() IN ('mp', 'officer', 'admin'));
CREATE POLICY "View budgets" ON public.budgets FOR SELECT USING (TRUE);

-- ============================================================
-- STORED FUNCTIONS
-- ============================================================

CREATE OR REPLACE FUNCTION get_complaint_stats()
RETURNS JSONB AS $$
DECLARE result JSONB;
BEGIN
  SELECT jsonb_build_object(
    'total', COUNT(*),
    'pending', COUNT(*) FILTER (WHERE status = 'pending'),
    'open', COUNT(*) FILTER (WHERE status = 'open'),
    'in_progress', COUNT(*) FILTER (WHERE status = 'in_progress'),
    'resolved', COUNT(*) FILTER (WHERE status = 'resolved'),
    'closed', COUNT(*) FILTER (WHERE status = 'closed')
  ) INTO result FROM public.complaints;
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- SEED DATA
-- ============================================================

INSERT INTO public.categories (name, icon, color) VALUES
  ('Roads & Infrastructure', '🛣️', '#f59e0b'),
  ('Water Supply', '💧', '#3b82f6'),
  ('Sanitation', '🚿', '#10b981'),
  ('Electricity', '⚡', '#eab308'),
  ('Healthcare', '🏥', '#ef4444'),
  ('Education', '📚', '#8b5cf6'),
  ('Environment', '🌿', '#22c55e'),
  ('Public Safety', '🛡️', '#6366f1'),
  ('Agriculture', '🌾', '#ca8a04'),
  ('Transportation', '🚌', '#f97316'),
  ('Housing', '🏠', '#06b6d4'),
  ('Employment', '💼', '#a855f7')
ON CONFLICT (name) DO NOTHING;

INSERT INTO public.government_schemes (title, ministry, emoji, category, beneficiary_count) VALUES
  ('PM Awas Yojana (Gramin)', 'Ministry of Rural Development', '🏠', 'Housing', '2.95 crore'),
  ('Pradhan Mantri Kisan Samman Nidhi', 'Ministry of Agriculture', '🌾', 'Agriculture', '11.5 crore'),
  ('Ayushman Bharat PM-JAY', 'Ministry of Health', '🏥', 'Healthcare', '50 crore+'),
  ('PM Ujjwala Yojana 2.0', 'Ministry of Petroleum', '🔥', 'Energy', '9 crore'),
  ('Skill India Mission', 'Ministry of Skill Development', '💼', 'Employment', '40 crore'),
  ('Beti Bachao Beti Padhao', 'Ministry of Women & Child Development', '👧', 'Education', 'All girls');

-- Storage buckets (run separately in Supabase dashboard):
-- INSERT INTO storage.buckets (id, name, public) VALUES ('complaint-media', 'complaint-media', true);
-- INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true);
-- INSERT INTO storage.buckets (id, name, public) VALUES ('documents', 'documents', false);

-- Realtime (enable in Supabase dashboard):
-- ALTER PUBLICATION supabase_realtime ADD TABLE public.complaints;
-- ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
-- ALTER PUBLICATION supabase_realtime ADD TABLE public.comments;
