-- Fix search path for make_first_system_super_admin function
CREATE OR REPLACE FUNCTION public.make_first_system_super_admin()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Update the first profile to be system super admin
  -- You'll need to run this manually or update via dashboard
  UPDATE public.profiles 
  SET role = 'system_super_admin' 
  WHERE id = (
    SELECT id FROM public.profiles 
    ORDER BY created_at ASC 
    LIMIT 1
  );
END;
$$;