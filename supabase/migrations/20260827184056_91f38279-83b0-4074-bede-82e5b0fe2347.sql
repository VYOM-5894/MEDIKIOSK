ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'patient';

CREATE TABLE IF NOT EXISTS public.staff_access_codes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  role app_role NOT NULL,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.staff_access_codes TO authenticated;
GRANT ALL ON public.staff_access_codes TO service_role;

ALTER TABLE public.staff_access_codes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view access codes"
  ON public.staff_access_codes FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can create access codes"
  ON public.staff_access_codes FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update access codes"
  ON public.staff_access_codes FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete access codes"
  ON public.staff_access_codes FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_staff_access_codes_updated_at
  BEFORE UPDATE ON public.staff_access_codes
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.staff_access_codes (code, role) VALUES
  ('MEDIKIOSK-DOCTOR-2026', 'doctor'),
  ('MEDIKIOSK-TRIAGE-2026', 'triage'),
  ('MEDIKIOSK-ADMIN-2026', 'admin')
ON CONFLICT (code) DO NOTHING;

CREATE OR REPLACE FUNCTION public.redeem_staff_code(_code text)
RETURNS app_role
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _role app_role;
  _uid uuid := auth.uid();
BEGIN
  IF _uid IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  SELECT role INTO _role
  FROM public.staff_access_codes
  WHERE code = upper(btrim(_code)) AND active = true;

  IF _role IS NULL THEN
    RAISE EXCEPTION 'Invalid or inactive access code';
  END IF;

  INSERT INTO public.user_roles (user_id, role)
  VALUES (_uid, _role)
  ON CONFLICT (user_id, role) DO NOTHING;

  RETURN _role;
END;
$$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, department)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.raw_user_meta_data ->> 'name'),
    NEW.raw_user_meta_data ->> 'department'
  )
  ON CONFLICT (id) DO NOTHING;

  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'patient'::app_role)
  ON CONFLICT (user_id, role) DO NOTHING;

  RETURN NEW;
END;
$$;