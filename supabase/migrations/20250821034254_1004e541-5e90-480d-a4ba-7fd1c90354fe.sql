-- -- Extend the user_role enum to include more specific staff roles
-- ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'owner';
-- ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'front_staff';
-- ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'kitchen_staff';
-- ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'cashier';
-- ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'customer';

-- -- Create permissions table and functions
-- CREATE TABLE public.role_permissions (
--   id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
--   role user_role NOT NULL,
--   permission TEXT NOT NULL,
--   created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
--   UNIQUE(role, permission)
-- );

-- -- Enable RLS on role_permissions
-- ALTER TABLE public.role_permissions ENABLE ROW LEVEL SECURITY;

-- -- Create policy for role_permissions
-- CREATE POLICY "Admins can manage role permissions" 
-- ON public.role_permissions 
-- FOR ALL 
-- USING (EXISTS (
--   SELECT 1 FROM profiles 
--   WHERE user_id = auth.uid() 
--   AND role = ANY(ARRAY['system_super_admin'::user_role, 'super_admin'::user_role, 'admin'::user_role])
-- ));

-- CREATE POLICY "Anyone can view role permissions" 
-- ON public.role_permissions 
-- FOR SELECT 
-- USING (true);

-- -- Insert default permissions for each role
-- INSERT INTO public.role_permissions (role, permission) VALUES
-- -- Front staff permissions
-- ('front_staff', 'view_tables'),
-- ('front_staff', 'view_pos'),
-- ('front_staff', 'view_reservations'),
-- ('front_staff', 'manage_reservations'),
-- ('front_staff', 'view_customers'),

-- -- Kitchen staff permissions  
-- ('kitchen_staff', 'view_orders'),
-- ('kitchen_staff', 'manage_orders'),
-- ('kitchen_staff', 'view_menu_items'),
-- ('kitchen_staff', 'view_inventory'),

-- -- Cashier permissions
-- ('cashier', 'view_pos'),
-- ('cashier', 'manage_payments'),
-- ('cashier', 'view_orders'),
-- ('cashier', 'view_customers'),

-- -- Manager permissions (all of the above plus)
-- ('manager', 'view_tables'),
-- ('manager', 'view_pos'),
-- ('manager', 'view_reservations'),
-- ('manager', 'manage_reservations'),
-- ('manager', 'view_customers'),
-- ('manager', 'view_orders'),
-- ('manager', 'manage_orders'),
-- ('manager', 'view_menu_items'),
-- ('manager', 'manage_menu_items'),
-- ('manager', 'view_inventory'),
-- ('manager', 'manage_inventory'),
-- ('manager', 'view_staff'),
-- ('manager', 'manage_staff'),
-- ('manager', 'view_reports'),

-- -- Admin permissions (everything)
-- ('admin', 'view_tables'),
-- ('admin', 'view_pos'),
-- ('admin', 'view_reservations'),
-- ('admin', 'manage_reservations'),
-- ('admin', 'view_customers'),
-- ('admin', 'manage_customers'),
-- ('admin', 'view_orders'),
-- ('admin', 'manage_orders'),
-- ('admin', 'view_menu_items'),
-- ('admin', 'manage_menu_items'),
-- ('admin', 'view_inventory'),
-- ('admin', 'manage_inventory'),
-- ('admin', 'view_staff'),
-- ('admin', 'manage_staff'),
-- ('admin', 'view_reports'),
-- ('admin', 'manage_reports'),
-- ('admin', 'view_settings'),
-- ('admin', 'manage_settings'),

-- -- Owner permissions (everything including business intelligence)
-- ('owner', 'view_tables'),
-- ('owner', 'view_pos'),
-- ('owner', 'view_reservations'),
-- ('owner', 'manage_reservations'),
-- ('owner', 'view_customers'),
-- ('owner', 'manage_customers'),
-- ('owner', 'view_orders'),
-- ('owner', 'manage_orders'),
-- ('owner', 'view_menu_items'),
-- ('owner', 'manage_menu_items'),
-- ('owner', 'view_inventory'),
-- ('owner', 'manage_inventory'),
-- ('owner', 'view_staff'),
-- ('owner', 'manage_staff'),
-- ('owner', 'view_reports'),
-- ('owner', 'manage_reports'),
-- ('owner', 'view_settings'),
-- ('owner', 'manage_settings'),
-- ('owner', 'view_analytics'),
-- ('owner', 'manage_business_settings'),

-- -- Super admin gets all permissions
-- ('super_admin', 'view_tables'),
-- ('super_admin', 'view_pos'),
-- ('super_admin', 'view_reservations'),
-- ('super_admin', 'manage_reservations'),
-- ('super_admin', 'view_customers'),
-- ('super_admin', 'manage_customers'),
-- ('super_admin', 'view_orders'),
-- ('super_admin', 'manage_orders'),
-- ('super_admin', 'view_menu_items'),
-- ('super_admin', 'manage_menu_items'),
-- ('super_admin', 'view_inventory'),
-- ('super_admin', 'manage_inventory'),
-- ('super_admin', 'view_staff'),
-- ('super_admin', 'manage_staff'),
-- ('super_admin', 'view_reports'),
-- ('super_admin', 'manage_reports'),
-- ('super_admin', 'view_settings'),
-- ('super_admin', 'manage_settings'),
-- ('super_admin', 'view_analytics'),
-- ('super_admin', 'manage_business_settings');

-- -- Create a function to check if a user has a specific permission
-- CREATE OR REPLACE FUNCTION public.user_has_permission(_user_id uuid, _permission text)
-- RETURNS boolean
-- LANGUAGE sql
-- STABLE SECURITY DEFINER
-- SET search_path TO 'public'
-- AS $function$
--   SELECT EXISTS (
--     SELECT 1
--     FROM public.profiles p
--     JOIN public.role_permissions rp ON rp.role = p.role
--     WHERE p.user_id = _user_id
--       AND rp.permission = _permission
--   );
-- $function$;

-- -- Update the existing user_has_role function to handle the new roles
-- CREATE OR REPLACE FUNCTION public.user_has_role(_user_id uuid, _roles text[])
-- RETURNS boolean
-- LANGUAGE sql
-- STABLE SECURITY DEFINER
-- SET search_path TO 'public'
-- AS $function$
--   SELECT EXISTS (
--     SELECT 1
--     FROM public.profiles
--     WHERE user_id = _user_id
--       AND role = ANY(_roles::user_role[])
--   );
-- $function$;


-- YENİİİİİİİİİİ KOOOOOD---------


-- ENUM roller (zaten varsa zarar vermez)
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'owner';
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'front_staff';
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'kitchen_staff';
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'cashier';
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'customer';

-- role_permissions tablosu (sende zaten var, referans için)
CREATE TABLE IF NOT EXISTS public.role_permissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  role user_role NOT NULL,
  permission TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(role, permission)
);

ALTER TABLE public.role_permissions ENABLE ROW LEVEL SECURITY;

-- Adminler role_permissions yönetebilir
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' AND tablename = 'role_permissions' AND policyname = 'Admins can manage role permissions'
  ) THEN
    CREATE POLICY "Admins can manage role permissions" 
    ON public.role_permissions 
    FOR ALL 
    USING (EXISTS (
      SELECT 1 FROM profiles 
      WHERE user_id = auth.uid() 
      AND role = ANY(ARRAY['system_super_admin'::user_role, 'super_admin'::user_role, 'admin'::user_role])
    ));
  END IF;
END $$;

-- Herkes role_permissions okuyabilir
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' AND tablename = 'role_permissions' AND policyname = 'Anyone can view role permissions'
  ) THEN
    CREATE POLICY "Anyone can view role permissions" 
    ON public.role_permissions 
    FOR SELECT 
    USING (true);
  END IF;
END $$;

-- CUSTOMER için POS izni (yoksa ekle)
INSERT INTO public.role_permissions(role, permission)
SELECT 'customer', 'view_pos'
WHERE NOT EXISTS (
  SELECT 1 FROM public.role_permissions 
  WHERE role = 'customer'::user_role AND permission = 'view_pos'
);

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

CREATE OR REPLACE FUNCTION public.user_has_role(_user_id uuid, _roles text[])
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE user_id = _user_id
      AND role = ANY(_roles::user_role[])
  );
$function$;

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Eski politikaları temizlemek istersen (isimleri farklıysa GUI'den sil):
-- DROP POLICY IF EXISTS "Admins can manage orders" ON public.orders;
-- DROP POLICY IF EXISTS "Allow anonymous users to create orders" ON public.orders;
-- DROP POLICY IF EXISTS "authenticated users can insert orders" ON public.orders;

-- 1) Staff/Admin siparişleri görebilsin
CREATE POLICY "orders_select_by_permission"
ON public.orders
FOR SELECT
TO authenticated
USING (
  user_has_permission(auth.uid(), 'view_orders')
  OR user_has_permission(auth.uid(), 'manage_orders')
);

-- 2) Staff/Admin sipariş oluşturabilsin
CREATE POLICY "orders_insert_by_permission"
ON public.orders
FOR INSERT
TO authenticated
WITH CHECK (
  user_has_permission(auth.uid(), 'manage_orders')
);

-- 3) Staff/Admin siparişi güncelleyebilsin
CREATE POLICY "orders_update_by_permission"
ON public.orders
FOR UPDATE
TO authenticated
USING (
  user_has_permission(auth.uid(), 'manage_orders')
)
WITH CHECK (
  user_has_permission(auth.uid(), 'manage_orders')
);

-- 4) Staff/Admin sipariş silebilsin
CREATE POLICY "orders_delete_by_permission"
ON public.orders
FOR DELETE
TO authenticated
USING (
  user_has_permission(auth.uid(), 'manage_orders')
);

-- 5) POS üzerinden sipariş oluşturma (customer + diğer POS yetkilileri)
-- PaymentSuccess.tsx içindeki INSERT buradan geçecek.
CREATE POLICY "orders_pos_insert"
ON public.orders
FOR INSERT
TO authenticated
WITH CHECK (
  user_has_permission(auth.uid(), 'view_pos')
);

-- 6) POS tarafının insert sonrası SELECT yapabilmesi için (select().single())
-- Customer orders listesini UI'da görmüyor, ama RLS düzeyinde bu SELECT serbest
CREATE POLICY "orders_pos_select_for_insert"
ON public.orders
FOR SELECT
TO authenticated
USING (
  user_has_permission(auth.uid(), 'view_pos')
);


ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Eski policy'leri istersen sil:
-- DROP POLICY IF EXISTS "Allow anonymous users to insert order items" ON public.order_items;
-- DROP POLICY IF EXISTS "Staff can manage order items" ON public.order_items;
-- DROP POLICY IF EXISTS "Staff can view order items" ON public.order_items;

-- Staff/Admin sipariş detaylarını görsün
CREATE POLICY "order_items_select_by_permission"
ON public.order_items
FOR SELECT
TO authenticated
USING (
  user_has_permission(auth.uid(), 'view_orders')
  OR user_has_permission(auth.uid(), 'manage_orders')
);

-- Staff/Admin sipariş detaylarını yönetsin
CREATE POLICY "order_items_write_by_permission"
ON public.order_items
FOR ALL
TO authenticated
USING (
  user_has_permission(auth.uid(), 'manage_orders')
)
WITH CHECK (
  user_has_permission(auth.uid(), 'manage_orders')
);

-- POS üzerinden sipariş detay ekleme (customer dahil)
CREATE POLICY "order_items_pos_insert"
ON public.order_items
FOR INSERT
TO authenticated
WITH CHECK (
  user_has_permission(auth.uid(), 'view_pos')
);


ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "menu_items_select"
ON public.menu_items
FOR SELECT
TO authenticated
USING (
  user_has_permission(auth.uid(), 'view_menu_items')
  OR user_has_permission(auth.uid(), 'manage_menu_items')
);

CREATE POLICY "menu_items_insert"
ON public.menu_items
FOR INSERT
TO authenticated
WITH CHECK (
  user_has_permission(auth.uid(), 'manage_menu_items')
);

CREATE POLICY "menu_items_update"
ON public.menu_items
FOR UPDATE
TO authenticated
USING (
  user_has_permission(auth.uid(), 'manage_menu_items')
)
WITH CHECK (
  user_has_permission(auth.uid(), 'manage_menu_items')
);

CREATE POLICY "menu_items_delete"
ON public.menu_items
FOR DELETE
TO authenticated
USING (
  user_has_permission(auth.uid(), 'manage_menu_items')
);


ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "payments_select"
ON public.payments
FOR SELECT
TO authenticated
USING (
  user_has_permission(auth.uid(), 'manage_payments')
  OR user_has_permission(auth.uid(), 'view_reports')
);

CREATE POLICY "payments_insert_update"
ON public.payments
FOR INSERT, UPDATE
TO authenticated
WITH CHECK (
  user_has_permission(auth.uid(), 'manage_payments')
);

CREATE POLICY "payments_delete"
ON public.payments
FOR DELETE
TO authenticated
USING (
  user_has_permission(auth.uid(), 'manage_payments')
);


ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Kullanıcı kendi profilini okuyabilsin
CREATE POLICY "profiles_select_self"
ON public.profiles
FOR SELECT
TO authenticated
USING ( user_id = auth.uid() );

-- Admin/owner tüm profilleri görebilsin
CREATE POLICY "profiles_select_admin"
ON public.profiles
FOR SELECT
TO authenticated
USING (
  user_has_permission(auth.uid(), 'view_staff')
);

-- Admin/owner personeli yönetsin
CREATE POLICY "profiles_manage_staff"
ON public.profiles
FOR UPDATE, DELETE
TO authenticated
USING (
  user_has_permission(auth.uid(), 'manage_staff')
)
WITH CHECK (
  user_has_permission(auth.uid(), 'manage_staff')
);
