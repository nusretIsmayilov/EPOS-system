-- Fix missing RLS policies for remaining tables

-- RLS policies for restaurant_tables
CREATE POLICY "Anyone can view available tables" ON public.restaurant_tables
  FOR SELECT USING (status = 'available');

CREATE POLICY "Staff can manage tables" ON public.restaurant_tables
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE user_id = auth.uid() 
      AND role IN ('super_admin', 'admin', 'manager', 'staff')
    )
  );

-- RLS policies for customers
CREATE POLICY "Customers can view their own info" ON public.customers
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = customers.profile_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage customers" ON public.customers
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE user_id = auth.uid() 
      AND role IN ('super_admin', 'admin', 'manager')
    )
  );

-- RLS policies for order_items
CREATE POLICY "Staff can view order items" ON public.order_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE user_id = auth.uid() 
      AND role IN ('super_admin', 'admin', 'manager', 'staff')
    )
  );

CREATE POLICY "Staff can manage order items" ON public.order_items
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE user_id = auth.uid() 
      AND role IN ('super_admin', 'admin', 'manager', 'staff')
    )
  );

-- RLS policies for reservations
CREATE POLICY "Customers can view their own reservations" ON public.reservations
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      JOIN public.customers c ON c.profile_id = p.id
      WHERE p.user_id = auth.uid() AND c.id = reservations.customer_id
    )
  );

CREATE POLICY "Staff can manage reservations" ON public.reservations
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE user_id = auth.uid() 
      AND role IN ('super_admin', 'admin', 'manager', 'staff')
    )
  );

-- RLS policies for inventory
CREATE POLICY "Staff can view inventory" ON public.inventory
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE user_id = auth.uid() 
      AND role IN ('super_admin', 'admin', 'manager', 'staff')
    )
  );

CREATE POLICY "Admins can manage inventory" ON public.inventory
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE user_id = auth.uid() 
      AND role IN ('super_admin', 'admin', 'manager')
    )
  );

-- Fix security definer functions with proper search path
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'customer')
  );
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER 
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;