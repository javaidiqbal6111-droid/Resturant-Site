
export type Category = 'All' | 'Italian' | 'Burgers' | 'Indian' | 'Sushi' | 'Desserts' | 'Salads' | 'Drinks';

export type OrderStatus = 'Placed' | 'Preparing' | 'Out for Delivery' | 'Delivered' | 'Cancelled';

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
  relatedIds?: string[];
}

export interface CartItem extends FoodItem {
  quantity: number;
  selectedOptions?: string[];
}

export interface AIRecommendation {
  reasoning: string;
  suggestedIds: string[];
}

export interface Rider {
  name: string;
  phone: string;
  image: string;
  rating: number;
}

export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'rider';
  timestamp: number;
}

export interface OrderBreakdown {
  subtotal: number;
  deliveryFee: number;
  serviceFee: number;
  salesTax: number;
  total: number;
}

export interface Order {
  id: string;
  items: CartItem[];
  status: OrderStatus;
  total: number;
  breakdown?: OrderBreakdown;
  timestamp: number;
  estimatedArrival: string;
  rider?: Rider;
  cancellationReason?: string;
  refunded?: boolean;
}
