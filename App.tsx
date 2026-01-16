
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  ShoppingBag, 
  Search, 
  Star, 
  Clock, 
  ChevronRight, 
  X, 
  Plus, 
  Minus, 
  Flame,
  Zap,
  ChevronLeft
} from 'lucide-react';
import { CATEGORIES, MENU_ITEMS } from './constants';
import { FoodItem, Category, CartItem, AIRecommendation } from './types';
import { getAIRecommendations } from './geminiService';

const Header: React.FC<{ 
  cartCount: number; 
  onCartClick: () => void;
  onSearchFocus: () => void;
}> = ({ cartCount, onCartClick, onSearchFocus }) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center text-white font-bold">F</div>
          <span className="text-xl font-display font-bold text-gray-800">FreshFare</span>
        </div>
        
        <div className="flex items-center gap-4">
          <button onClick={onSearchFocus} className="p-2 text-gray-500 hover:text-green-600 transition-colors">
            <Search className="w-6 h-6" />
          </button>
          <button 
            onClick={onCartClick} 
            className="relative p-2 text-gray-500 hover:text-green-600 transition-colors"
          >
            <ShoppingBag className="w-6 h-6" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-green-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

const Hero: React.FC<{ onViewMenu: () => void }> = ({ onViewMenu }) => (
  <section className="pt-24 pb-12 px-4 max-w-7xl mx-auto grid lg:grid-cols-2 gap-8 items-center">
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-50 text-green-600 rounded-full text-sm font-medium">
        <Zap className="w-4 h-4 fill-current" />
        <span>Fastest delivery in your city</span>
      </div>
      <h1 className="text-5xl lg:text-7xl font-display font-extrabold text-gray-900 leading-[1.1]">
        Taste the <span className="text-green-500">Freshness</span> in every bite.
      </h1>
      <p className="text-lg text-gray-600 max-w-md">
        Premium ingredients, chef-crafted recipes, and ultra-fast delivery right to your doorstep.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 pt-2">
        <button 
          onClick={onViewMenu}
          className="px-8 py-4 bg-green-500 text-white rounded-2xl font-semibold shadow-lg shadow-green-200 hover:bg-green-600 transition-all active:scale-95"
        >
          View Menu
        </button>
        <button className="px-8 py-4 bg-white text-gray-700 border border-gray-200 rounded-2xl font-semibold hover:bg-gray-50 transition-all active:scale-95">
          Our Story
        </button>
      </div>
    </div>
    <div className="relative animate-in fade-in zoom-in duration-1000">
      <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-green-50 rounded-full blur-3xl opacity-50"></div>
      <img 
        src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=1200" 
        alt="Delicious Food" 
        className="w-full h-auto rounded-[2.5rem] shadow-2xl"
      />
    </div>
  </section>
);

const CategoryBar: React.FC<{ 
  activeCategory: Category; 
  onSelect: (cat: Category) => void 
}> = ({ activeCategory, onSelect }) => (
  <div className="sticky top-16 z-40 bg-white/90 backdrop-blur-md py-4 border-b border-gray-100">
    <div className="max-w-7xl mx-auto px-4 overflow-x-auto no-scrollbar flex items-center gap-2">
      {CATEGORIES.map(cat => (
        <button
          key={cat}
          onClick={() => onSelect(cat)}
          className={`whitespace-nowrap px-6 py-2 rounded-full text-sm font-semibold transition-all ${
            activeCategory === cat 
            ? 'bg-green-500 text-white shadow-md shadow-green-100' 
            : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  </div>
);

const FoodCard: React.FC<{ 
  item: FoodItem; 
  onClick: () => void;
  onAddToCart: (e: React.MouseEvent) => void;
}> = ({ item, onClick, onAddToCart }) => (
  <div 
    onClick={onClick}
    className="group bg-white rounded-3xl overflow-hidden border border-gray-100 hover:border-green-100 transition-all cursor-pointer hover:shadow-xl hover:shadow-gray-100"
  >
    <div className="relative aspect-[4/3] overflow-hidden">
      <img 
        src={item.image} 
        alt={item.name} 
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
      />
      <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-2 py-1 rounded-full flex items-center gap-1 shadow-sm">
        <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
        <span className="text-xs font-bold text-gray-800">{item.rating}</span>
      </div>
    </div>
    <div className="p-5 space-y-2">
      <div className="flex justify-between items-start gap-2">
        <h3 className="font-display font-bold text-gray-900 group-hover:text-green-600 transition-colors leading-tight">
          {item.name}
        </h3>
        <span className="text-green-600 font-bold">${item.price.toFixed(2)}</span>
      </div>
      <p className="text-xs text-gray-500 line-clamp-2">{item.description}</p>
      <div className="flex items-center justify-between pt-2">
        <div className="flex items-center gap-1.5 text-gray-400">
          <Clock className="w-3.5 h-3.5" />
          <span className="text-[10px] font-medium uppercase tracking-wider">{item.prepTime}</span>
        </div>
        <button 
          onClick={onAddToCart}
          className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center shadow-lg shadow-green-100 hover:bg-green-600 active:scale-90 transition-all"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
    </div>
  </div>
);

const AIRecommender: React.FC<{ onSuggest: (ids: string[]) => void }> = ({ onSuggest }) => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [recommendation, setRecommendation] = useState<AIRecommendation | null>(null);

  const handleRecommend = async () => {
    if (!input.trim()) return;
    setLoading(true);
    const result = await getAIRecommendations(input);
    if (result) {
      setRecommendation(result);
      onSuggest(result.suggestedIds);
    }
    setLoading(false);
  };

  return (
    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-[2rem] p-8 mt-12 mb-20">
      <div className="flex items-center gap-3 mb-4 text-green-700">
        <Flame className="w-6 h-6" />
        <h2 className="text-2xl font-display font-bold">Ask AI Recommendations</h2>
      </div>
      <p className="text-green-800/70 mb-6 font-medium">
        Craving something specific? Describe it and we'll find your perfect match.
      </p>
      <div className="flex flex-col sm:flex-row gap-3">
        <input 
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="e.g. 'I want something spicy and healthy under $15'"
          className="flex-1 px-6 py-4 rounded-2xl bg-white border-2 border-green-100 focus:outline-none focus:border-green-400 text-gray-700 placeholder:text-gray-300 transition-all shadow-sm"
        />
        <button 
          onClick={handleRecommend}
          disabled={loading}
          className="px-8 py-4 bg-green-500 text-white rounded-2xl font-bold shadow-lg shadow-green-200 hover:bg-green-600 disabled:opacity-50 transition-all"
        >
          {loading ? 'Finding...' : 'Ask Gemini'}
        </button>
      </div>
      {recommendation && (
        <div className="mt-6 p-6 bg-white/60 rounded-2xl border border-green-100 animate-in fade-in slide-in-from-top-2 duration-500">
          <p className="text-green-800 text-sm italic">"{recommendation.reasoning}"</p>
        </div>
      )}
    </div>
  );
};

const CartDrawer: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQty: (id: string, delta: number) => void;
}> = ({ isOpen, onClose, items, onUpdateQty }) => {
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <>
      <div 
        className={`fixed inset-0 z-[60] bg-black/40 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />
      <div 
        className={`fixed top-0 right-0 z-[70] h-full w-full sm:w-[400px] bg-white shadow-2xl transition-transform duration-500 ease-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="h-full flex flex-col">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-xl font-display font-bold">Your Order</h2>
            <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-900 transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center">
                  <ShoppingBag className="w-8 h-8 text-gray-300" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Your bag is empty</h3>
                  <p className="text-sm text-gray-400">Add some delicious items to start your order.</p>
                </div>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.id} className="flex gap-4">
                  <div className="w-20 h-20 rounded-2xl overflow-hidden bg-gray-100">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex justify-between">
                      <h4 className="font-bold text-sm text-gray-900 line-clamp-1">{item.name}</h4>
                      <span className="font-bold text-sm text-green-600">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                    <p className="text-[10px] text-gray-400 uppercase tracking-wide">{item.category}</p>
                    <div className="flex items-center gap-3 pt-1">
                      <button 
                        onClick={() => onUpdateQty(item.id, -1)}
                        className="w-6 h-6 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:border-green-500 hover:text-green-500 transition-all"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-sm font-bold w-4 text-center">{item.quantity}</span>
                      <button 
                        onClick={() => onUpdateQty(item.id, 1)}
                        className="w-6 h-6 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:border-green-500 hover:text-green-500 transition-all"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="p-6 bg-gray-50 space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-500">
                <span>Subtotal</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-500">
                <span>Delivery Fee</span>
                <span>$2.00</span>
              </div>
              <div className="flex justify-between text-lg font-bold text-gray-900 pt-2 border-t border-gray-200">
                <span>Total</span>
                <span>${(total + (items.length > 0 ? 2 : 0)).toFixed(2)}</span>
              </div>
            </div>
            <button 
              disabled={items.length === 0}
              className="w-full py-4 bg-green-500 text-white rounded-2xl font-bold shadow-lg shadow-green-100 hover:bg-green-600 disabled:opacity-50 active:scale-[0.98] transition-all"
            >
              Checkout Now
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

const ItemModal: React.FC<{
  item: FoodItem | null;
  onClose: () => void;
  onAddToCart: (item: FoodItem) => void;
}> = ({ item, onClose, onAddToCart }) => {
  if (!item) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-2xl bg-white rounded-t-[2.5rem] sm:rounded-[2.5rem] overflow-hidden shadow-2xl animate-in slide-in-from-bottom duration-500">
        <button onClick={onClose} className="absolute top-4 right-4 z-10 p-2 bg-white/90 backdrop-blur rounded-full shadow-lg text-gray-500 hover:text-gray-900">
          <X className="w-5 h-5" />
        </button>
        
        <div className="grid md:grid-cols-2">
          <div className="h-64 md:h-full">
            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
          </div>
          <div className="p-8 flex flex-col h-full">
            <div className="flex-1 space-y-6">
              <div>
                <span className="text-xs font-bold text-green-600 uppercase tracking-widest bg-green-50 px-3 py-1 rounded-full">{item.category}</span>
                <h2 className="text-3xl font-display font-extrabold text-gray-900 mt-2">{item.name}</h2>
                <div className="flex items-center gap-4 mt-2">
                  <div className="flex items-center gap-1 text-yellow-400">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="text-sm font-bold text-gray-800">{item.rating}</span>
                  </div>
                  <div className="text-gray-300">|</div>
                  <div className="flex items-center gap-1.5 text-gray-500 text-sm font-medium">
                    <Clock className="w-4 h-4" />
                    <span>{item.prepTime}</span>
                  </div>
                </div>
              </div>

              <p className="text-gray-500 leading-relaxed">{item.description}</p>

              <div>
                <h4 className="font-bold text-sm text-gray-900 mb-3">Key Ingredients</h4>
                <div className="flex flex-wrap gap-2">
                  {item.ingredients.map(ing => (
                    <span key={ing} className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded-xl text-xs font-medium">
                      {ing}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-gray-100 flex items-center justify-between mt-8">
              <div>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Total Price</p>
                <span className="text-3xl font-extrabold text-green-600">${item.price.toFixed(2)}</span>
              </div>
              <button 
                onClick={() => {
                  onAddToCart(item);
                  onClose();
                }}
                className="px-10 py-4 bg-green-500 text-white rounded-2xl font-bold shadow-xl shadow-green-100 hover:bg-green-600 transition-all active:scale-95"
              >
                Add to Bag
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function App() {
  const [activeCategory, setActiveCategory] = useState<Category>('All');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<FoodItem | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [highlightedIds, setHighlightedIds] = useState<string[]>([]);
  const menuRef = useRef<HTMLElement>(null);

  const filteredItems = useMemo(() => {
    let items = MENU_ITEMS;
    if (activeCategory !== 'All') {
      items = items.filter(item => item.category === activeCategory);
    }
    if (searchQuery) {
      items = items.filter(item => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        item.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return items;
  }, [activeCategory, searchQuery]);

  const addToCart = (item: FoodItem) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const updateCartQty = (id: string, delta: number) => {
    setCart(prev => {
      const updated = prev.map(item => {
        if (item.id === id) {
          const newQty = Math.max(0, item.quantity + delta);
          return { ...item, quantity: newQty };
        }
        return item;
      }).filter(item => item.quantity > 0);
      return updated;
    });
  };

  const scrollToMenu = () => {
    menuRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="min-h-screen pb-20 sm:pb-0">
      <Header 
        cartCount={cart.reduce((s, i) => s + i.quantity, 0)} 
        onCartClick={() => setIsCartOpen(true)}
        onSearchFocus={scrollToMenu}
      />
      
      <main className="bg-white">
        <Hero onViewMenu={scrollToMenu} />

        <section ref={menuRef} className="max-w-7xl mx-auto px-4 py-12">
          <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2">
              <h2 className="text-3xl font-display font-extrabold text-gray-900">Explore Our Menu</h2>
              <p className="text-gray-500">Deliciousness delivered from local kitchens.</p>
            </div>
            <div className="relative w-full md:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
              <input 
                type="text"
                placeholder="Search your craving..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:border-green-400 focus:bg-white transition-all text-sm"
              />
            </div>
          </div>

          <CategoryBar activeCategory={activeCategory} onSelect={setActiveCategory} />

          {highlightedIds.length > 0 && (
            <div className="mt-8 flex items-center justify-between px-4 py-2 bg-green-50 rounded-xl border border-green-100">
              <span className="text-sm font-semibold text-green-700">Gemini's Top Picks are highlighted!</span>
              <button onClick={() => setHighlightedIds([])} className="text-green-500 hover:text-green-700">
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8">
            {filteredItems.map(item => (
              <div key={item.id} className={highlightedIds.includes(item.id) ? "ring-4 ring-green-500/20 rounded-3xl" : ""}>
                <FoodCard 
                  item={item} 
                  onClick={() => setSelectedItem(item)}
                  onAddToCart={(e) => {
                    e.stopPropagation();
                    addToCart(item);
                  }}
                />
              </div>
            ))}
          </div>

          {filteredItems.length === 0 && (
            <div className="text-center py-20 space-y-4">
              <div className="w-20 h-20 bg-gray-50 rounded-full mx-auto flex items-center justify-center">
                <Search className="w-8 h-8 text-gray-300" />
              </div>
              <p className="text-gray-400 font-medium">No dishes found matching your criteria.</p>
            </div>
          )}

          <AIRecommender onSuggest={setHighlightedIds} />
        </section>
      </main>

      <footer className="bg-gray-50 border-t border-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-4 gap-12">
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center text-white font-bold">F</div>
              <span className="text-xl font-display font-bold text-gray-800">FreshFare</span>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed">
              Experience the best of local cuisine with FreshFare. Fresh ingredients, expertly prepared.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-gray-900 mb-6">Quick Links</h4>
            <ul className="space-y-4 text-sm text-gray-500">
              <li><a href="#" className="hover:text-green-600 transition-colors">Order Online</a></li>
              <li><a href="#" className="hover:text-green-600 transition-colors">Gift Cards</a></li>
              <li><a href="#" className="hover:text-green-600 transition-colors">Nutrition Info</a></li>
              <li><a href="#" className="hover:text-green-600 transition-colors">Store Locator</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-gray-900 mb-6">Company</h4>
            <ul className="space-y-4 text-sm text-gray-500">
              <li><a href="#" className="hover:text-green-600 transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-green-600 transition-colors">Contact</a></li>
              <li><a href="#" className="hover:text-green-600 transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-green-600 transition-colors">Press</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-gray-900 mb-6">Support</h4>
            <ul className="space-y-4 text-sm text-gray-500">
              <li><a href="#" className="hover:text-green-600 transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-green-600 transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-green-600 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-green-600 transition-colors">Delivery Regions</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 mt-16 pt-8 border-t border-gray-200 text-center text-xs text-gray-400">
          © {new Date().getFullYear()} FreshFare. All rights reserved.
        </div>
      </footer>

      {/* Sticky Bottom CTA for Mobile */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-lg border-t border-gray-100 z-50">
        <button 
          onClick={() => setIsCartOpen(true)}
          className="w-full py-4 bg-green-500 text-white rounded-2xl font-bold flex items-center justify-between px-6 shadow-xl shadow-green-100"
        >
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5" />
            <span>View Bag</span>
          </div>
          <div className="flex items-center gap-3">
             <span className="w-px h-4 bg-white/30" />
             <span className="text-lg">
               ${(cart.reduce((s, i) => s + i.price * i.quantity, 0)).toFixed(2)}
             </span>
          </div>
        </button>
      </div>

      <CartDrawer 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        items={cart}
        onUpdateQty={updateCartQty}
      />

      <ItemModal 
        item={selectedItem} 
        onClose={() => setSelectedItem(null)} 
        onAddToCart={addToCart}
      />
    </div>
  );
}
