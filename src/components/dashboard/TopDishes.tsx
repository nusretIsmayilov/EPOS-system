import { cn } from "@/lib/utils";
import tandooriSalmon from "@/assets/tandoori-salmon.jpg";
import butterChicken from "@/assets/butter-chicken.jpg";
import dalMakhani from "@/assets/dal-makhani.jpg";

interface Dish {
  id: string;
  name: string;
  description: string;
  price: string;
  image: string;
  rank: number;
}

const dishes: Dish[] = [
  {
    id: "1",
    name: "Tandoori Salmon",
    description: "Salmon marinated in spices with fresh garlic and ginger, cooked in the Tandoor",
    price: "£44.85",
    image: tandooriSalmon,
    rank: 1
  },
  {
    id: "2", 
    name: "Butter Chicken",
    description: "Tender chicken in a rich tomato and butter gravy, served with basmati rice",
    price: "£32.00",
    image: butterChicken,
    rank: 2
  },
  {
    id: "3",
    name: "Dal Makhani", 
    description: "Creamy black lentils simmered with butter and spices, a house specialty",
    price: "£18.00",
    image: dalMakhani,
    rank: 3
  }
];

const categories = [
  { id: "overall", label: "Overall Top Sellers", isActive: true },
  { id: "dishes", label: "Top Dishes", isActive: false },
  { id: "drinks", label: "Top Drinks", isActive: false },
  { id: "tables", label: "Top Tables", isActive: false }
];

export const TopDishes = () => {
  return (
    <div className="bg-card rounded-lg border border-border">
      <div className="p-6 border-b border-border">
        <div className="flex space-x-1">
          {categories.map((category) => (
            <button
              key={category.id}
              className={cn(
                "px-4 py-2 text-sm font-medium rounded-full transition-colors",
                category.isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              {category.label}
            </button>
          ))}
        </div>
      </div>
      
      <div className="p-6">
        <div className="space-y-4">
          {dishes.map((dish) => (
            <div key={dish.id} className="flex items-center space-x-4">
              <div className="text-sm text-muted-foreground font-medium">#{dish.rank}</div>
              <div className="w-12 h-12 rounded-full bg-muted flex-shrink-0 overflow-hidden">
                <img 
                  src={dish.image} 
                  alt={dish.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-foreground">{dish.name}</p>
                <p className="text-sm text-muted-foreground truncate">{dish.description}</p>
              </div>
              <div className="text-lg font-semibold text-foreground">{dish.price}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};