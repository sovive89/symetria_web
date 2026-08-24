-- ROLES
CREATE TYPE public.app_role AS ENUM ('patient', 'professional', 'admin');
CREATE TYPE public.consent_level AS ENUM ('full', 'partial', 'revoked');
CREATE TYPE public.appointment_status AS ENUM ('pending', 'confirmed', 'completed', 'cancelled');

CREATE OR REPLACE FUNCTION public.update_updated_at_column() RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$ LANGUAGE plpgsql SET search_path = public;

-- PROFILES
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY,
  full_name TEXT NOT NULL DEFAULT '',
  avatar_url TEXT,
  phone TEXT,
  birth_date DATE,
  city TEXT,
  state TEXT,
  goals TEXT,
  interests TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT, INSERT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role);
$$;

CREATE POLICY "own profile read" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "own profile insert" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY "own profile update" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

CREATE POLICY "own roles read" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "own role insert" ON public.user_roles FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id AND role <> 'admin');

-- PROFESSIONALS (public marketplace)
CREATE TABLE public.professionals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  full_name TEXT NOT NULL,
  specialty TEXT NOT NULL,
  registry TEXT,
  bio TEXT,
  city TEXT NOT NULL DEFAULT '',
  state TEXT NOT NULL DEFAULT '',
  avatar_url TEXT,
  instagram TEXT,
  services TEXT[] NOT NULL DEFAULT '{}',
  gallery TEXT[] NOT NULL DEFAULT '{}',
  availability TEXT[] NOT NULL DEFAULT '{}',
  price_from NUMERIC(10,2),
  rating NUMERIC(2,1) NOT NULL DEFAULT 0,
  reviews_count INTEGER NOT NULL DEFAULT 0,
  verified BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.professionals TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.professionals TO authenticated;
GRANT ALL ON public.professionals TO service_role;
ALTER TABLE public.professionals ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER professionals_updated_at BEFORE UPDATE ON public.professionals FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE POLICY "professionals public read" ON public.professionals FOR SELECT USING (true);
CREATE POLICY "professionals self insert" ON public.professionals FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "professionals self update" ON public.professionals FOR UPDATE TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin')) WITH CHECK (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "professionals admin delete" ON public.professionals FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE OR REPLACE FUNCTION public.owns_professional(_professional_id UUID)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.professionals WHERE id = _professional_id AND user_id = auth.uid());
$$;

-- CONSENTS (LGPD)
CREATE TABLE public.consents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL,
  professional_id UUID NOT NULL REFERENCES public.professionals(id) ON DELETE CASCADE,
  level public.consent_level NOT NULL DEFAULT 'partial',
  granted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  revoked_at TIMESTAMPTZ,
  UNIQUE (patient_id, professional_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.consents TO authenticated;
GRANT ALL ON public.consents TO service_role;
ALTER TABLE public.consents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "consents patient manage" ON public.consents FOR ALL TO authenticated USING (auth.uid() = patient_id) WITH CHECK (auth.uid() = patient_id);
CREATE POLICY "consents professional read" ON public.consents FOR SELECT TO authenticated USING (public.owns_professional(professional_id) OR public.has_role(auth.uid(), 'admin'));

CREATE OR REPLACE FUNCTION public.has_consent(_patient_id UUID)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.consents c
    JOIN public.professionals p ON p.id = c.professional_id
    WHERE c.patient_id = _patient_id AND p.user_id = auth.uid() AND c.level <> 'revoked'
  );
$$;

-- APPOINTMENTS
CREATE TABLE public.appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL,
  professional_id UUID NOT NULL REFERENCES public.professionals(id) ON DELETE CASCADE,
  scheduled_at TIMESTAMPTZ NOT NULL,
  procedure TEXT NOT NULL,
  status public.appointment_status NOT NULL DEFAULT 'pending',
  price NUMERIC(10,2),
  notes TEXT,
  patient_name TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.appointments TO authenticated;
GRANT ALL ON public.appointments TO service_role;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER appointments_updated_at BEFORE UPDATE ON public.appointments FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE POLICY "appointments patient manage" ON public.appointments FOR ALL TO authenticated USING (auth.uid() = patient_id) WITH CHECK (auth.uid() = patient_id);
CREATE POLICY "appointments professional read" ON public.appointments FOR SELECT TO authenticated USING (public.owns_professional(professional_id) OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "appointments professional update" ON public.appointments FOR UPDATE TO authenticated USING (public.owns_professional(professional_id)) WITH CHECK (public.owns_professional(professional_id));

-- ACCESS LOGS
CREATE TABLE public.access_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL,
  professional_id UUID NOT NULL REFERENCES public.professionals(id) ON DELETE CASCADE,
  data_accessed TEXT NOT NULL,
  accessed_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.access_logs TO authenticated;
GRANT ALL ON public.access_logs TO service_role;
ALTER TABLE public.access_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "access_logs patient read" ON public.access_logs FOR SELECT TO authenticated USING (auth.uid() = patient_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "access_logs professional insert" ON public.access_logs FOR INSERT TO authenticated WITH CHECK (public.owns_professional(professional_id));

-- EVOLUTION
CREATE TABLE public.evolution_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL,
  professional_id UUID REFERENCES public.professionals(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  notes TEXT,
  before_url TEXT,
  after_url TEXT,
  taken_at DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.evolution_entries TO authenticated;
GRANT ALL ON public.evolution_entries TO service_role;
ALTER TABLE public.evolution_entries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "evolution patient manage" ON public.evolution_entries FOR ALL TO authenticated USING (auth.uid() = patient_id) WITH CHECK (auth.uid() = patient_id);
CREATE POLICY "evolution professional read" ON public.evolution_entries FOR SELECT TO authenticated USING (public.has_consent(patient_id) OR public.has_role(auth.uid(), 'admin'));

-- MESSAGES
CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL,
  professional_id UUID NOT NULL REFERENCES public.professionals(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL,
  body TEXT NOT NULL,
  attachment_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.messages TO authenticated;
GRANT ALL ON public.messages TO service_role;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "messages participants read" ON public.messages FOR SELECT TO authenticated USING (auth.uid() = patient_id OR public.owns_professional(professional_id));
CREATE POLICY "messages participants insert" ON public.messages FOR INSERT TO authenticated WITH CHECK (auth.uid() = sender_id AND (auth.uid() = patient_id OR public.owns_professional(professional_id)));

-- REVIEWS (public)
CREATE TABLE public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  professional_id UUID NOT NULL REFERENCES public.professionals(id) ON DELETE CASCADE,
  patient_id UUID,
  author_name TEXT NOT NULL DEFAULT 'Paciente',
  rating_service SMALLINT NOT NULL DEFAULT 5,
  rating_communication SMALLINT NOT NULL DEFAULT 5,
  rating_experience SMALLINT NOT NULL DEFAULT 5,
  comment TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.reviews TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.reviews TO authenticated;
GRANT ALL ON public.reviews TO service_role;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "reviews public read" ON public.reviews FOR SELECT USING (true);
CREATE POLICY "reviews patient insert" ON public.reviews FOR INSERT TO authenticated WITH CHECK (auth.uid() = patient_id);
CREATE POLICY "reviews patient update" ON public.reviews FOR UPDATE TO authenticated USING (auth.uid() = patient_id) WITH CHECK (auth.uid() = patient_id);
CREATE POLICY "reviews owner delete" ON public.reviews FOR DELETE TO authenticated USING (auth.uid() = patient_id OR public.has_role(auth.uid(), 'admin'));

-- NOTIFICATIONS
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  body TEXT,
  read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.notifications TO authenticated;
GRANT ALL ON public.notifications TO service_role;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "notifications own manage" ON public.notifications FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE INDEX idx_appointments_professional ON public.appointments(professional_id, scheduled_at);
CREATE INDEX idx_appointments_patient ON public.appointments(patient_id, scheduled_at);
CREATE INDEX idx_messages_thread ON public.messages(patient_id, professional_id, created_at);
CREATE INDEX idx_professionals_specialty ON public.professionals(specialty);

-- DEMO DATA
INSERT INTO public.professionals (id, full_name, specialty, registry, bio, city, state, instagram, services, availability, price_from, rating, reviews_count, verified) VALUES
('11111111-1111-1111-1111-111111111101', 'Dra. Juliana Moretti', 'Biomedicina Estética', 'CRBM 12345-SP', 'Especialista em harmonização facial e bioestimuladores, com foco em resultados naturais e simetria.', 'São Paulo', 'SP', '@dra.julianamoretti', ARRAY['Harmonização facial','Bioestimulador de colágeno','Skinbooster','Toxina botulínica'], ARRAY['Seg','Ter','Qua','Qui'], 890.00, 4.9, 128, true),
('11111111-1111-1111-1111-111111111102', 'Dr. Rafael Lins', 'Odontologia Estética', 'CRO 45678-SP', 'Dentista com atuação em lentes de contato dental e reabilitação estética do sorriso.', 'Campinas', 'SP', '@dr.rafaellins', ARRAY['Lentes de contato dental','Clareamento','Facetas de resina'], ARRAY['Ter','Qua','Sex'], 1200.00, 4.8, 96, true),
('11111111-1111-1111-1111-111111111103', 'Camila Prado', 'Estética Avançada', NULL, 'Protocolos de pele com tecnologia e acompanhamento de evolução mês a mês.', 'Rio de Janeiro', 'RJ', '@camilaprado.estetica', ARRAY['Limpeza de pele profunda','Microagulhamento','Peeling químico','Protocolo antiacne'], ARRAY['Seg','Qua','Qui','Sáb'], 260.00, 4.7, 214, true),
('11111111-1111-1111-1111-111111111104', 'Marina Costa', 'Micropigmentação', NULL, 'Design e micropigmentação de sobrancelhas com técnica fio a fio e visagismo.', 'Belo Horizonte', 'MG', '@marinacosta.brows', ARRAY['Micropigmentação de sobrancelha','Design com visagismo','Lábios'], ARRAY['Qui','Sex','Sáb'], 690.00, 5.0, 87, true),
('11111111-1111-1111-1111-111111111105', 'Dr. Henrique Alves', 'Tricologia', 'CRBM 78901-PR', 'Tratamento de queda capilar e acompanhamento tricológico com registro de evolução.', 'Curitiba', 'PR', '@dr.henriquetrico', ARRAY['Avaliação tricológica','Microinfusão de medicamentos','Terapia capilar'], ARRAY['Seg','Ter','Qui'], 450.00, 4.6, 62, false),
('11111111-1111-1111-1111-111111111106', 'Clínica Symetra Vitae', 'Clínica', 'CNPJ 12.345.678/0001-90', 'Clínica multidisciplinar com biomedicina, odontologia e estética avançada no mesmo espaço.', 'São Paulo', 'SP', '@symetravitae', ARRAY['Avaliação multidisciplinar','Harmonização facial','Protocolos corporais','Tricologia'], ARRAY['Seg','Ter','Qua','Qui','Sex'], 350.00, 4.8, 176, true);

INSERT INTO public.reviews (professional_id, author_name, rating_service, rating_communication, rating_experience, comment) VALUES
('11111111-1111-1111-1111-111111111101', 'Ana P.', 5, 5, 5, 'Resultado natural e acompanhamento impecável. Explicou cada etapa.'),
('11111111-1111-1111-1111-111111111101', 'Bruna L.', 5, 4, 5, 'Muito atenciosa, senti segurança do início ao fim.'),
('11111111-1111-1111-1111-111111111102', 'Carlos M.', 5, 5, 5, 'Meu sorriso ficou simétrico e discreto, exatamente como queria.'),
('11111111-1111-1111-1111-111111111103', 'Fernanda S.', 5, 5, 4, 'Minha pele mudou em 3 meses, com registro de evolução mês a mês.'),
('11111111-1111-1111-1111-111111111104', 'Letícia R.', 5, 5, 5, 'Design perfeito para o meu rosto. Profissional excelente.'),
('11111111-1111-1111-1111-111111111105', 'Diego A.', 4, 5, 4, 'Acompanhamento sério e resultados visíveis na densidade capilar.');