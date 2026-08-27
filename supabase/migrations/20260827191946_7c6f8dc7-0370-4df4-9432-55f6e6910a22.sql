INSERT INTO public.staff_access_codes (code, role) VALUES
  ('MEDIKIOSK-DOCTOR-2026', 'doctor'),
  ('MEDIKIOSK-TRIAGE-2026', 'triage'),
  ('MEDIKIOSK-ADMIN-2026', 'admin')
ON CONFLICT (code) DO NOTHING;