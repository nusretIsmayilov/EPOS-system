// src/types.ts
export interface Ingredient {
  inventory_id: string;
  quantity: number;
}

export interface MenuItem {
  id?: string;
  name: string;
  price: number;
  description?: string;
  is_available: boolean;
  prep_time?: number;
  calories?: number;
  ingredients?: Ingredient[];
}
