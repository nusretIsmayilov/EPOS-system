-- First, create a security definer function to check user roles without triggering RLS recursion
CREATE OR REPLACE FUNCTION public.user_has_role(_user_id uuid, _roles text[])
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE user_id = _user_id
      AND role = ANY(_roles::user_role[])
  );
$$;

-- Drop the problematic policy that causes infinite recursion
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;

-- Create a new policy using the security definer function
CREATE POLICY "Admins can view all profiles" 
ON public.profiles 
FOR SELECT 
USING (
  public.user_has_role(
    auth.uid(), 
    ARRAY['system_super_admin', 'super_admin', 'admin', 'manager']
  )
);