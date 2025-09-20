-- Create restaurants table
CREATE TABLE public.restaurants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  address TEXT,
  phone TEXT,
  email TEXT,
  website TEXT,
  logo_url TEXT,
  timezone TEXT DEFAULT 'UTC',
  currency TEXT DEFAULT 'USD',
  is_active BOOLEAN DEFAULT true,
  subscription_status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create packages table
CREATE TABLE public.packages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  features JSONB NOT NULL DEFAULT '{}',
  price_monthly NUMERIC DEFAULT 0,
  price_yearly NUMERIC DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create restaurant_packages table (many-to-many)
CREATE TABLE public.restaurant_packages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id UUID NOT NULL REFERENCES public.restaurants(id) ON DELETE CASCADE,
  package_id UUID NOT NULL REFERENCES public.packages(id) ON DELETE CASCADE,
  is_active BOOLEAN DEFAULT true,
  activated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(restaurant_id, package_id)
);

-- Add restaurant_id to profiles table
ALTER TABLE public.profiles 
ADD COLUMN restaurant_id UUID REFERENCES public.restaurants(id) ON DELETE CASCADE;

-- Add restaurant_id to all existing tables
ALTER TABLE public.customers ADD COLUMN restaurant_id UUID REFERENCES public.restaurants(id) ON DELETE CASCADE;
ALTER TABLE public.inventory ADD COLUMN restaurant_id UUID REFERENCES public.restaurants(id) ON DELETE CASCADE;
ALTER TABLE public.menu_categories ADD COLUMN restaurant_id UUID REFERENCES public.restaurants(id) ON DELETE CASCADE;
ALTER TABLE public.menu_items ADD COLUMN restaurant_id UUID REFERENCES public.restaurants(id) ON DELETE CASCADE;
ALTER TABLE public.orders ADD COLUMN restaurant_id UUID REFERENCES public.restaurants(id) ON DELETE CASCADE;
ALTER TABLE public.reservations ADD COLUMN restaurant_id UUID REFERENCES public.restaurants(id) ON DELETE CASCADE;
ALTER TABLE public.restaurant_tables ADD COLUMN restaurant_id UUID REFERENCES public.restaurants(id) ON DELETE CASCADE;
ALTER TABLE public.staff ADD COLUMN restaurant_id UUID REFERENCES public.restaurants(id) ON DELETE CASCADE;

-- Insert default packages
INSERT INTO public.packages (name, description, features, price_monthly, price_yearly) VALUES
('Basic POS', 'Simple point of sale system', '{"pos": true, "basic_reporting": true}', 29.99, 299.99),
('POS + Inventory', 'POS with inventory management', '{"pos": true, "inventory": true, "basic_reporting": true, "advanced_reporting": true}', 59.99, 599.99),
('Full Restaurant', 'Complete restaurant management', '{"pos": true, "inventory": true, "hr": true, "reservations": true, "basic_reporting": true, "advanced_reporting": true, "staff_management": true}', 99.99, 999.99),
('Enterprise', 'Full features with priority support', '{"pos": true, "inventory": true, "hr": true, "reservations": true, "basic_reporting": true, "advanced_reporting": true, "staff_management": true, "api_access": true, "priority_support": true}', 199.99, 1999.99);

-- Enable RLS on new tables
ALTER TABLE public.restaurants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.restaurant_packages ENABLE ROW LEVEL SECURITY;

-- RLS Policies for restaurants
CREATE POLICY "System super admins can manage all restaurants" ON public.restaurants
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE user_id = auth.uid() AND role = 'system_super_admin'
    )
  );

CREATE POLICY "Restaurant admins can view their restaurant" ON public.restaurants
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE user_id = auth.uid() 
      AND restaurant_id = restaurants.id 
      AND role IN ('super_admin', 'admin', 'manager')
    )
  );

-- RLS Policies for packages
CREATE POLICY "System super admins can manage packages" ON public.packages
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE user_id = auth.uid() AND role = 'system_super_admin'
    )
  );

CREATE POLICY "Anyone can view active packages" ON public.packages
  FOR SELECT USING (is_active = true);

-- RLS Policies for restaurant_packages
CREATE POLICY "System super admins can manage restaurant packages" ON public.restaurant_packages
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE user_id = auth.uid() AND role = 'system_super_admin'
    )
  );

CREATE POLICY "Restaurant admins can view their packages" ON public.restaurant_packages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE user_id = auth.uid() 
      AND restaurant_id = restaurant_packages.restaurant_id 
      AND role IN ('super_admin', 'admin', 'manager')
    )
  );

-- Update existing RLS policies to be restaurant-aware
DROP POLICY IF EXISTS "Admins can manage customers" ON public.customers;
CREATE POLICY "Admins can manage customers" ON public.customers
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE user_id = auth.uid() 
      AND (
        role = 'system_super_admin' OR
        (restaurant_id = customers.restaurant_id AND role IN ('super_admin', 'admin', 'manager'))
      )
    )
  );

DROP POLICY IF EXISTS "Admins can manage inventory" ON public.inventory;
CREATE POLICY "Admins can manage inventory" ON public.inventory
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE user_id = auth.uid() 
      AND (
        role = 'system_super_admin' OR
        (restaurant_id = inventory.restaurant_id AND role IN ('super_admin', 'admin', 'manager'))
      )
    )
  );

-- Function to create restaurant with admin user
CREATE OR REPLACE FUNCTION public.create_restaurant_with_admin(
  restaurant_name TEXT,
  restaurant_slug TEXT,
  admin_email TEXT,
  admin_password TEXT,
  admin_full_name TEXT,
  package_ids UUID[] DEFAULT ARRAY[]::UUID[]
) RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_restaurant_id UUID;
  new_user_id UUID;
  new_profile_id UUID;
  package_id UUID;
BEGIN
  -- Only system super admins can create restaurants
  IF NOT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND role = 'system_super_admin'
  ) THEN
    RAISE EXCEPTION 'Only system super admins can create restaurants';
  END IF;

  -- Create restaurant
  INSERT INTO public.restaurants (name, slug)
  VALUES (restaurant_name, restaurant_slug)
  RETURNING id INTO new_restaurant_id;

  -- Create admin user (this would need to be done via Supabase Auth API in practice)
  -- For now, we'll create a profile that can be linked later
  INSERT INTO public.profiles (restaurant_id, email, full_name, role)
  VALUES (new_restaurant_id, admin_email, admin_full_name, 'super_admin')
  RETURNING id INTO new_profile_id;

  -- Assign packages to restaurant
  FOREACH package_id IN ARRAY package_ids
  LOOP
    INSERT INTO public.restaurant_packages (restaurant_id, package_id)
    VALUES (new_restaurant_id, package_id);
  END LOOP;

  RETURN new_restaurant_id;
END;
$$;