
export type Category = 'All' | 'Italian' | 'Burgers' | 'Indian' | 'Sushi' | 'Desserts' | 'Salads';

export interface FoodItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: Category;
  rating: number;
  prepTime: string;
  calories: number;
  ingredients: string[];
}

export interface CartItem extends FoodItem {
  quantity: number;
  selectedOptions?: string[];
}

export interface AIRecommendation {
  reasoning: string;
  suggestedIds: string[];
}
