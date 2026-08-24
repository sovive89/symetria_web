REVOKE ALL ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.owns_professional(uuid) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.has_consent(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.owns_professional(uuid) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.has_consent(uuid) TO authenticated, service_role;