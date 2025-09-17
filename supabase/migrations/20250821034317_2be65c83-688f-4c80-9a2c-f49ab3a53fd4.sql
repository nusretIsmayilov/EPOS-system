-- First migration: Add new enum values
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'owner';
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'front_staff';
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'kitchen_staff';
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'cashier';