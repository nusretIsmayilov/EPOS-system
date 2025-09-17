-- Second migration: Create permissions table and functions
CREATE TABLE public.role_permissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  role user_role NOT NULL,
  permission TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(role, permission)
);

-- Enable RLS on role_permissions
ALTER TABLE public.role_permissions ENABLE ROW LEVEL SECURITY;

-- Create policy for role_permissions
CREATE POLICY "Admins can manage role permissions" 
ON public.role_permissions 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM profiles 
  WHERE user_id = auth.uid() 
  AND role = ANY(ARRAY['system_super_admin'::user_role, 'super_admin'::user_role, 'admin'::user_role])
));

CREATE POLICY "Anyone can view role permissions" 
ON public.role_permissions 
FOR SELECT 
USING (true);

-- Insert default permissions for each role
INSERT INTO public.role_permissions (role, permission) VALUES
-- Front staff permissions
('front_staff', 'view_tables'),
('front_staff', 'view_pos'),
('front_staff', 'view_reservations'),
('front_staff', 'manage_reservations'),
('front_staff', 'view_customers'),

-- Kitchen staff permissions  
('kitchen_staff', 'view_orders'),
('kitchen_staff', 'manage_orders'),
('kitchen_staff', 'view_menu_items'),
('kitchen_staff', 'view_inventory'),

-- Cashier permissions
('cashier', 'view_pos'),
('cashier', 'manage_payments'),
('cashier', 'view_orders'),
('cashier', 'view_customers'),

-- Manager permissions (all of the above plus)
('manager', 'view_tables'),
('manager', 'view_pos'),
('manager', 'view_reservations'),
('manager', 'manage_reservations'),
('manager', 'view_customers'),
('manager', 'view_orders'),
('manager', 'manage_orders'),
('manager', 'view_menu_items'),
('manager', 'manage_menu_items'),
('manager', 'view_inventory'),
('manager', 'manage_inventory'),
('manager', 'view_staff'),
('manager', 'manage_staff'),
('manager', 'view_reports'),

-- Admin permissions (everything)
('admin', 'view_tables'),
('admin', 'view_pos'),
('admin', 'view_reservations'),
('admin', 'manage_reservations'),
('admin', 'view_customers'),
('admin', 'manage_customers'),
('admin', 'view_orders'),
('admin', 'manage_orders'),
('admin', 'view_menu_items'),
('admin', 'manage_menu_items'),
('admin', 'view_inventory'),
('admin', 'manage_inventory'),
('admin', 'view_staff'),
('admin', 'manage_staff'),
('admin', 'view_reports'),
('admin', 'manage_reports'),
('admin', 'view_settings'),
('admin', 'manage_settings'),

-- Owner permissions (everything including business intelligence)
('owner', 'view_tables'),
('owner', 'view_pos'),
('owner', 'view_reservations'),
('owner', 'manage_reservations'),
('owner', 'view_customers'),
('owner', 'manage_customers'),
('owner', 'view_orders'),
('owner', 'manage_orders'),
('owner', 'view_menu_items'),
('owner', 'manage_menu_items'),
('owner', 'view_inventory'),
('owner', 'manage_inventory'),
('owner', 'view_staff'),
('owner', 'manage_staff'),
('owner', 'view_reports'),
('owner', 'manage_reports'),
('owner', 'view_settings'),
('owner', 'manage_settings'),
('owner', 'view_analytics'),
('owner', 'manage_business_settings'),

-- Super admin gets all permissions
('super_admin', 'view_tables'),
('super_admin', 'view_pos'),
('super_admin', 'view_reservations'),
('super_admin', 'manage_reservations'),
('super_admin', 'view_customers'),
('super_admin', 'manage_customers'),
('super_admin', 'view_orders'),
('super_admin', 'manage_orders'),
('super_admin', 'view_menu_items'),
('super_admin', 'manage_menu_items'),
('super_admin', 'view_inventory'),
('super_admin', 'manage_inventory'),
('super_admin', 'view_staff'),
('super_admin', 'manage_staff'),
('super_admin', 'view_reports'),
('super_admin', 'manage_reports'),
('super_admin', 'view_settings'),
('super_admin', 'manage_settings'),
('super_admin', 'view_analytics'),
('super_admin', 'manage_business_settings');

-- Create a function to check if a user has a specific permission
CREATE OR REPLACE FUNCTION public.user_has_permission(_user_id uuid, _permission text)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles p
    JOIN public.role_permissions rp ON rp.role = p.role
    WHERE p.user_id = _user_id
      AND rp.permission = _permission
  );
$function$;