import { MenuItemModified } from "@/pages/MenuItems"


// Stripe expects this shape
type StripeLineItem = {
  price_data: {
    currency: string
    product_data: {
      name: string
      description?: string
      images?: string[]
    }
    unit_amount: number
  }
  quantity: number
}

/**
 * Converts menu items into Stripe line_items format
 */
export function toStripeLineItems(
  items: any,
  currency: string = "usd"
): StripeLineItem[] {
  return items.map(item => ({
    price_data: {
      currency,
      product_data: {
        name: item.name,
        description: item.description ?? undefined,
        images: item.image_url ? [item.image_url] : [],
      },
      unit_amount: Math.round(item.price * 100), // dollars → cents
    },
    quantity: item.quantity,
  }))
}