
import { FoodItem, Category } from './types';

export const CATEGORIES: Category[] = ['All', 'Italian', 'Burgers', 'Indian', 'Sushi', 'Salads', 'Desserts', 'Drinks'];

export const MENU_ITEMS: FoodItem[] = [
  {
    id: '1',
    name: 'Truffle Mushroom Pasta',
    description: 'Fresh fettuccine with creamy wild mushroom sauce, drizzled with white truffle oil and topped with aged parmesan.',
    price: 18.50,
    image: 'https://images.unsplash.com/photo-1473093226795-af9932fe5856?auto=format&fit=crop&q=80&w=500',
    category: 'Italian',
    rating: 4.9,
    prepTime: '20-25 min',
    calories: 650,
    ingredients: ['Fresh Pasta', 'Wild Mushrooms', 'Truffle Oil', 'Parmesan', 'Cream'],
    relatedIds: ['d1', 'd2']
  },
  {
    id: '2',
    name: 'Royal Wagyu Burger',
    description: 'Juicy Wagyu beef patty, caramelised onions, vintage cheddar, and truffle mayo on a toasted brioche bun.',
    price: 16.90,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=500',
    category: 'Burgers',
    rating: 4.8,
    prepTime: '15-20 min',
    calories: 820,
    ingredients: ['Wagyu Beef', 'Brioche Bun', 'Cheddar', 'Caramelized Onions'],
    relatedIds: ['d3', 'd1']
  },
  {
    id: '3',
    name: 'Spicy Salmon Crunch Roll',
    description: 'Fresh Atlantic salmon, cucumber, avocado, topped with spicy mayo and crispy tempura flakes.',
    price: 14.00,
    image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&q=80&w=500',
    category: 'Sushi',
    rating: 4.7,
    prepTime: '10-15 min',
    calories: 420,
    ingredients: ['Salmon', 'Sushi Rice', 'Avocado', 'Nori', 'Tempura'],
    relatedIds: ['d2', 'd1']
  },
  {
    id: '4',
    name: 'Butter Chicken Masala',
    description: 'Tender chicken pieces simmered in a rich, buttery tomato gravy with traditional Indian spices.',
    price: 15.50,
    image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&q=80&w=500',
    category: 'Indian',
    rating: 4.9,
    prepTime: '25-30 min',
    calories: 750,
    ingredients: ['Chicken', 'Tomato', 'Butter', 'Garam Masala', 'Cream'],
    relatedIds: ['d4', 'd1']
  },
  {
    id: '5',
    name: 'Quinoa Power Bowl',
    description: 'Organic quinoa, roasted sweet potatoes, avocado, kale, and toasted chickpeas with lemon-tahini dressing.',
    price: 13.50,
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=500',
    category: 'Salads',
    rating: 4.6,
    prepTime: '10-12 min',
    calories: 380,
    ingredients: ['Quinoa', 'Kale', 'Avocado', 'Chickpeas', 'Tahini'],
    relatedIds: ['d4', 'd2']
  },
  {
    id: '6',
    name: 'Burrata & Prosciutto',
    description: 'Creamy burrata cheese served with 24-month aged prosciutto, arugula, and balsamic glaze.',
    price: 15.00,
    image: 'https://images.unsplash.com/photo-1541529086526-db283c563270?auto=format&fit=crop&q=80&w=500',
    category: 'Italian',
    rating: 4.9,
    prepTime: '5-10 min',
    calories: 520,
    ingredients: ['Burrata', 'Prosciutto', 'Arugula', 'Balsamic'],
    relatedIds: ['d2', 'd3']
  },
  {
    id: '7',
    name: 'Classic Margherita',
    description: 'Sourdough crust, San Marzano tomato sauce, fresh mozzarella, and basil leaves.',
    price: 14.50,
    image: 'https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?auto=format&fit=crop&q=80&w=500',
    category: 'Italian',
    rating: 4.8,
    prepTime: '15-18 min',
    calories: 610,
    ingredients: ['Sourdough', 'Tomato Sauce', 'Mozzarella', 'Basil'],
    relatedIds: ['d1', 'd3']
  },
  {
    id: '8',
    name: 'Tiramisu Della Casa',
    description: 'Traditional Italian dessert with espresso-soaked ladyfingers and creamy mascarpone.',
    price: 8.50,
    image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&q=80&w=500',
    category: 'Desserts',
    rating: 5.0,
    prepTime: '5 min',
    calories: 450,
    ingredients: ['Espresso', 'Mascarpone', 'Ladyfingers', 'Cocoa'],
    relatedIds: ['d4']
  },
  // Drinks
  {
    id: 'd1',
    name: 'Organic Sparkling Soda',
    description: 'Infused with fresh lime and mint, sweetened with organic cane sugar.',
    price: 4.50,
    image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&q=80&w=500',
    category: 'Drinks',
    rating: 4.9,
    prepTime: '2-3 min',
    calories: 120,
    ingredients: ['Lime', 'Mint', 'Sparkling Water']
  },
  {
    id: 'd2',
    name: 'Premium Italian Merlot',
    description: 'A smooth, full-bodied red wine from the heart of Tuscany.',
    price: 9.00,
    image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&q=80&w=500',
    category: 'Drinks',
    rating: 5.0,
    prepTime: '2 min',
    calories: 150,
    ingredients: ['Grapes']
  },
  {
    id: 'd3',
    name: 'Craft IPA Beer',
    description: 'Locally brewed with citrusy hops and a crisp finish.',
    price: 7.50,
    image: 'https://images.unsplash.com/photo-1535958636474-b021ee887b13?auto=format&fit=crop&q=80&w=500',
    category: 'Drinks',
    rating: 4.7,
    prepTime: '2 min',
    calories: 210,
    ingredients: ['Hops', 'Malt', 'Water']
  },
  {
    id: 'd4',
    name: 'Mango Lassi',
    description: 'Traditional yogurt-based drink blended with fresh Alphanso mangoes.',
    price: 5.50,
    image: 'https://images.unsplash.com/photo-1546173159-315724a93c90?auto=format&fit=crop&q=80&w=500',
    category: 'Drinks',
    rating: 4.9,
    prepTime: '4-5 min',
    calories: 280,
    ingredients: ['Mango', 'Yogurt', 'Cardamom']
  }
];
