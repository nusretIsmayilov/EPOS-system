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

-- Create triggers for updated_at
CREATE TRIGGER update_restaurants_updated_at
  BEFORE UPDATE ON public.restaurants
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_packages_updated_at
  BEFORE UPDATE ON public.packages
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();