-- Create the first system super admin
-- This will be updated manually after running this migration
-- Note: Replace 'your-email@example.com' with your actual email

-- For now, let's create a function to make the first user system super admin
CREATE OR REPLACE FUNCTION public.make_first_system_super_admin()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
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

-- You can call this function manually: SELECT public.make_first_system_super_admin();