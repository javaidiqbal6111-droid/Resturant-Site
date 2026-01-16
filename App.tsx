
import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
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
  ChevronLeft,
  Presentation,
  Info,
  ShieldCheck,
  History,
  RotateCcw,
  CheckCircle2,
  Heart,
  ExternalLink,
  MessageCircle,
  Bell
} from 'lucide-react';
import { CATEGORIES, MENU_ITEMS } from './constants';
import { FoodItem, Category, CartItem, AIRecommendation, Order } from './types';
import { getAIRecommendations } from './geminiService';
import { PresentationView } from './Presentation';
import { OrderTracking } from './OrderTracking';
import { StripePaymentModal } from './StripePayment';

// --- Components ---

const ImageWithPlaceholder: React.FC<{ 
  src: string; 
  alt: string; 
  className?: string; 
  large?: boolean;
}> = ({ src, alt, className, large }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const optimizedSrc = large ? src.replace('w=500', 'w=1000') : src;

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {!isLoaded && (
        <div className="absolute inset-0 animate-shimmer" />
      )}
      <img
        src={optimizedSrc}
        alt={alt}
        loading="lazy"
        onLoad={() => setIsLoaded(true)}
        className={`w-full h-full object-cover transition-all duration-700 ease-out ${
          isLoaded ? 'opacity-100 scale-100 blur-0' : 'opacity-0 scale-110 blur-xl'
        }`}
      />
    </div>
  );
};

const Header: React.FC<{ 
  cartCount: number; 
  onCartClick: () => void;
  onSearchFocus: () => void;
  onPresentationClick: () => void;
  onHistoryClick: () => void;
  onAboutClick: () => void;
  activeOrder?: Order | null;
}> = ({ cartCount, onCartClick, onSearchFocus, onPresentationClick, onHistoryClick, onAboutClick, activeOrder }) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
          <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center text-white font-bold">M</div>
          <span className="text-xl font-display font-bold text-gray-800">Mustafa Elmi</span>
        </div>
        
        <div className="flex items-center gap-4">
          <nav className="hidden lg:flex items-center gap-6 mr-4 text-sm font-semibold text-gray-500">
            <button onClick={onSearchFocus} className="hover:text-green-600 transition-colors">Menu</button>
            <button onClick={onAboutClick} className="hover:text-green-600 transition-colors">Our Story</button>
            <button onClick={onHistoryClick} className="hover:text-green-600 transition-colors">Orders</button>
          </nav>

          <div className="hidden md:flex items-center gap-1 text-[10px] font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full border border-green-100">
            <ShieldCheck size={12} />
            <span>ENCRYPTED</span>
          </div>
          
          <button 
            onClick={onPresentationClick} 
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-gray-100 text-gray-600 rounded-lg text-xs font-bold hover:bg-gray-200 transition-colors"
          >
            <Presentation className="w-4 h-4" />
            <span>Present</span>
          </button>

          {!activeOrder && (
            <button onClick={onSearchFocus} className="p-2 text-gray-500 hover:text-green-600 transition-colors">
              <Search className="w-6 h-6" />
            </button>
          )}

          <button 
            onClick={onCartClick} 
            className="relative p-2 text-gray-500 hover:text-green-600 transition-colors"
          >
            <ShoppingBag className="w-6 h-6" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-green-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white animate-in zoom-in">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

/* Added isHighlighted prop to FoodCard to support AI recommendations */
const FoodCard = React.memo<{ 
  item: FoodItem; 
  onClick: () => void;
  onAddToCart: (e: React.MouseEvent) => void;
  isHighlighted?: boolean;
}>(({ item, onClick, onAddToCart, isHighlighted }) => (
  <div 
    onClick={onClick}
    className={`group bg-white rounded-3xl overflow-hidden border transition-all cursor-pointer hover:shadow-xl hover:shadow-gray-100 relative ${
      isHighlighted ? 'border-green-500 ring-2 ring-green-100 shadow-lg scale-[1.02]' : 'border-gray-100 hover:border-green-100'
    }`}
  >
    <div className="relative aspect-[4/3] overflow-hidden">
      <ImageWithPlaceholder 
        src={item.image} 
        alt={item.name} 
        className="w-full h-full group-hover:scale-110 transition-transform duration-700"
      />
      <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-2 py-1 rounded-full flex items-center gap-1 shadow-sm">
        <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
        <span className="text-xs font-bold text-gray-800">{item.rating}</span>
      </div>
      <div className="absolute bottom-3 left-3 bg-green-500/90 backdrop-blur text-white text-[8px] font-bold uppercase tracking-widest px-2 py-1 rounded-full flex items-center gap-1 shadow-lg">
        <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
        Verified Available
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
));

const Toast: React.FC<{ message: string; visible: boolean; onClose: () => void }> = ({ message, visible, onClose }) => {
  useEffect(() => {
    if (visible) {
      const timer = setTimeout(onClose, 3000);
      return () => clearTimeout(timer);
    }
  }, [visible, onClose]);

  if (!visible) return null;

  return (
    <div className="fixed bottom-24 sm:bottom-8 left-1/2 -translate-x-1/2 z-[2000] animate-in slide-in-from-bottom-4 duration-300">
      <div className="bg-gray-900 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-gray-800">
        <Bell className="w-4 h-4 text-green-500" />
        <span className="text-sm font-bold">{message}</span>
      </div>
    </div>
  );
};

/* Added AIRecommender component to fix line 454 error */
const AIRecommender: React.FC<{ onSuggest: (ids: string[]) => void }> = ({ onSuggest }) => {
  const [query, setQuery] = useState('');
  const [isAsking, setIsAsking] = useState(false);
  const [response, setResponse] = useState<string | null>(null);

  const handleAsk = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setIsAsking(true);
    setResponse(null);
    try {
      const result = await getAIRecommendations(query);
      if (result) {
        setResponse(result.reasoning);
        onSuggest(result.suggestedIds);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsAsking(false);
    }
  };

  return (
    <div className="mt-12 p-8 bg-green-50 rounded-[2.5rem] border border-green-100 space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-green-500 rounded-2xl flex items-center justify-center text-white">
          <Zap className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-xl font-display font-bold text-gray-900">Ask Mustafa's AI</h3>
          <p className="text-xs text-green-600 font-bold uppercase tracking-widest">Powered by Gemini AI</p>
        </div>
      </div>
      
      <form onSubmit={handleAsk} className="flex flex-col sm:flex-row gap-3">
        <input 
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="e.g. 'Recommend me something spicy for dinner'"
          className="flex-1 px-6 py-4 bg-white border border-green-100 rounded-2xl focus:outline-none focus:border-green-500 transition-all text-sm"
        />
        <button 
          disabled={isAsking}
          className="px-8 py-4 bg-green-500 text-white rounded-2xl font-bold shadow-lg shadow-green-100 hover:bg-green-600 disabled:opacity-50 transition-all active:scale-95 flex items-center justify-center gap-2 min-w-[140px]"
        >
          {isAsking ? <RotateCcw className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
          <span>{isAsking ? 'Thinking...' : 'Ask AI'}</span>
        </button>
      </form>

      {response && (
        <div className="p-6 bg-white rounded-2xl border border-green-100 animate-in fade-in slide-in-from-top-2 duration-500">
          <p className="text-sm text-gray-700 leading-relaxed italic">"{response}"</p>
          <div className="mt-4 flex items-center gap-2 text-[10px] font-bold text-green-600 uppercase tracking-widest">
            <CheckCircle2 size={12} />
            <span>Recommended items highlighted above</span>
          </div>
        </div>
      )}
    </div>
  );
};

/* Added CartDrawer component to fix line 524 error */
const CartDrawer: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQty: (id: string, delta: number) => void;
  onCheckout: (items: CartItem[], breakdown: any) => void;
}> = ({ isOpen, onClose, items, onUpdateQty, onCheckout }) => {
  const subtotal = items.reduce((s, i) => s + (i.price * i.quantity), 0);
  const deliveryFee = subtotal > 0 ? 2.50 : 0;
  const serviceFee = subtotal * 0.05;
  const salesTax = subtotal * 0.0825;
  const total = subtotal + deliveryFee + serviceFee + salesTax;

  const breakdown = { subtotal, deliveryFee, serviceFee, salesTax, total };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[150] flex justify-end">
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300" onClick={onClose} />
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-500">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <ShoppingBag className="text-green-500" />
            <h2 className="text-xl font-display font-bold">Your Bag</h2>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-900"><X /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-40">
              <ShoppingBag size={64} />
              <p className="font-bold">Your bag is empty</p>
            </div>
          ) : (
            items.map(item => (
              <div key={item.id} className="flex gap-4 items-center">
                <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-gray-900 text-sm">{item.name}</h4>
                  <p className="text-xs text-green-600 font-bold">${item.price.toFixed(2)}</p>
                </div>
                <div className="flex items-center gap-3">
                  <button onClick={() => onUpdateQty(item.id, -1)} className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200"><Minus size={14}/></button>
                  <span className="text-sm font-bold w-4 text-center">{item.quantity}</span>
                  <button onClick={() => onUpdateQty(item.id, 1)} className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200"><Plus size={14}/></button>
                </div>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="p-8 bg-gray-50 border-t border-gray-100 space-y-6">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-gray-500"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
              <div className="flex justify-between text-gray-500"><span>Delivery Fee</span><span>${deliveryFee.toFixed(2)}</span></div>
              <div className="flex justify-between text-gray-500"><span>Service Fee</span><span>${serviceFee.toFixed(2)}</span></div>
              <div className="flex justify-between font-bold text-gray-900 pt-4 border-t border-gray-200">
                <span>Total</span><span className="text-green-600 text-2xl font-extrabold">${total.toFixed(2)}</span>
              </div>
            </div>
            <button 
              onClick={() => onCheckout(items, breakdown)}
              className="w-full py-4 bg-green-500 text-white rounded-2xl font-bold shadow-xl shadow-green-100 hover:bg-green-600 transition-all flex items-center justify-center gap-2"
            >
              <ShieldCheck size={18} />
              <span>Proceed to Checkout</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

/* Added HistoryDrawer component to fix line 525 error */
const HistoryDrawer: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  orders: Order[];
  onOrderAgain: (items: CartItem[]) => void;
}> = ({ isOpen, onClose, orders, onOrderAgain }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[150] flex justify-end">
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300" onClick={onClose} />
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-500">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <History className="text-green-500" />
            <h2 className="text-xl font-display font-bold">Order History</h2>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-900"><X /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {orders.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-40">
              <History size={64} />
              <p className="font-bold">No past orders found</p>
            </div>
          ) : (
            orders.map(order => (
              <div key={order.id} className="p-6 bg-gray-50 rounded-[2rem] border border-gray-100 space-y-4 hover:border-green-200 transition-all">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Order #{order.id}</p>
                    <p className="text-xs text-gray-500">{new Date(order.timestamp).toLocaleDateString()}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                    order.status === 'Delivered' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {order.status}
                  </span>
                </div>
                
                <div className="flex items-center gap-2">
                   <div className="flex -space-x-3 overflow-hidden">
                    {order.items.slice(0, 3).map((item, idx) => (
                      <img key={idx} src={item.image} className="w-8 h-8 rounded-full border-2 border-white object-cover shadow-sm" alt="" />
                    ))}
                  </div>
                  <p className="text-[10px] text-gray-400 font-medium">
                    {order.items.map(i => i.name).join(', ').substring(0, 40)}...
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-gray-200/50">
                  <p className="font-bold text-gray-900">${order.total.toFixed(2)}</p>
                  <button 
                    onClick={() => onOrderAgain(order.items)}
                    className="px-4 py-2 bg-white text-green-600 border border-green-100 rounded-xl text-xs font-bold hover:bg-green-50 hover:border-green-300 transition-all flex items-center gap-2"
                  >
                    <RotateCcw size={14} />
                    Order Again
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

// --- Main App Component ---

export default function App() {
  const [activeCategory, setActiveCategory] = useState<Category>('All');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<FoodItem | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [highlightedIds, setHighlightedIds] = useState<string[]>([]);
  const [isPresentationOpen, setIsPresentationOpen] = useState(false);
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);
  const [pastOrders, setPastOrders] = useState<Order[]>([]);
  const [checkoutData, setCheckoutData] = useState<{items: CartItem[], breakdown: any} | null>(null);
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);
  
  const menuRef = useRef<HTMLElement>(null);
  const aboutRef = useRef<HTMLElement>(null);

  // Persistence
  useEffect(() => {
    const saved = localStorage.getItem('past_orders');
    if (saved) setPastOrders(JSON.parse(saved));
  }, []);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setShowToast(true);
  };

  const saveOrders = (orders: Order[]) => {
    setPastOrders(orders);
    localStorage.setItem('past_orders', JSON.stringify(orders));
  };

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

  const addToCart = useCallback((item: FoodItem) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      triggerToast(`Added ${item.name} to Bag!`);
      return [...prev, { ...item, quantity: 1 }];
    });
  }, []);

  const handleOrderAgain = (items: CartItem[]) => {
    setCart(items.map(i => ({...i})));
    setIsHistoryOpen(false);
    setIsCartOpen(true);
    triggerToast("Order items restored to bag!");
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

  const handleCheckoutInitiate = (items: CartItem[], breakdown: any) => {
    setCheckoutData({ items, breakdown });
    setIsCartOpen(false);
  };

  const handlePaymentSuccess = () => {
    if (!checkoutData) return;
    
    const newOrder: Order = {
      id: Math.random().toString(36).substr(2, 9).toUpperCase(),
      items: [...checkoutData.items],
      total: checkoutData.breakdown.total,
      breakdown: checkoutData.breakdown,
      status: 'Placed',
      timestamp: Date.now(),
      estimatedArrival: '25-30 min'
    };
    setActiveOrder(newOrder);
    setCheckoutData(null);
    setCart([]);
    triggerToast("Payment successful! Tracking started.");
  };

  const scrollToMenu = () => menuRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  const scrollToAbout = () => aboutRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  // Render Logic
  if (activeOrder) {
    return (
      <div className="min-h-screen">
        <Header 
          cartCount={0} 
          onCartClick={() => setIsCartOpen(true)}
          onSearchFocus={scrollToMenu}
          onPresentationClick={() => setIsPresentationOpen(true)}
          onHistoryClick={() => setIsHistoryOpen(true)}
          onAboutClick={scrollToAbout}
          activeOrder={activeOrder}
        />
        <OrderTracking 
          order={activeOrder} 
          onBack={() => setActiveOrder(null)} 
          onCancelled={(o) => { saveOrders([o, ...pastOrders]); setActiveOrder(null); }}
          onCompleted={(o) => { saveOrders([o, ...pastOrders]); setActiveOrder(null); }}
        />
        <Toast visible={showToast} message={toastMessage} onClose={() => setShowToast(false)} />
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20 sm:pb-0">
      {isPresentationOpen && <PresentationView onClose={() => setIsPresentationOpen(false)} />}
      
      <Header 
        cartCount={cart.reduce((s, i) => s + i.quantity, 0)} 
        onCartClick={() => setIsCartOpen(true)}
        onSearchFocus={scrollToMenu}
        onPresentationClick={() => setIsPresentationOpen(true)}
        onHistoryClick={() => setIsHistoryOpen(true)}
        onAboutClick={scrollToAbout}
      />
      
      <main className="bg-white">
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
                onClick={scrollToMenu}
                className="px-8 py-4 bg-green-500 text-white rounded-2xl font-semibold shadow-lg shadow-green-200 hover:bg-green-600 transition-all active:scale-95"
              >
                View Menu
              </button>
              <button 
                onClick={scrollToAbout}
                className="px-8 py-4 bg-white text-gray-700 border border-gray-200 rounded-2xl font-semibold hover:bg-gray-50 transition-all active:scale-95"
              >
                Our Story
              </button>
            </div>
          </div>
          <div className="relative animate-in fade-in zoom-in duration-1000">
            <ImageWithPlaceholder 
              src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=1200" 
              alt="Hero" 
              className="w-full h-auto rounded-[2.5rem] shadow-2xl aspect-[16/10]"
            />
          </div>
        </section>

        {/* About Section */}
        <section ref={aboutRef} className="bg-gray-50 py-24">
          <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-16 items-center">
            <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl">
              <ImageWithPlaceholder src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=1000" alt="Chef" className="w-full aspect-[4/5]" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-8 text-white">
                <p className="text-xl font-display font-bold">Chef Mustafa Elmi</p>
                <p className="text-sm opacity-80">Founder & Executive Chef</p>
              </div>
            </div>
            <div className="space-y-8">
              <h2 className="text-4xl font-display font-extrabold text-gray-900">Crafting Moments Since 2012</h2>
              <p className="text-lg text-gray-500 leading-relaxed">
                What started as a small local kitchen has grown into a city-wide favorite. Our philosophy is simple: 
                <strong> Freshness first. Always.</strong> We source from local farmers and use Gemini AI to ensure our inventory 
                is always at peak quality for your order.
              </p>
              <div className="grid grid-cols-2 gap-6">
                <div className="p-6 bg-white rounded-3xl shadow-sm border border-gray-100">
                  <Heart className="text-red-500 mb-3" />
                  <h4 className="font-bold">100% Organic</h4>
                  <p className="text-xs text-gray-400">Locally sourced produce.</p>
                </div>
                <div className="p-6 bg-white rounded-3xl shadow-sm border border-gray-100">
                  <Clock className="text-blue-500 mb-3" />
                  <h4 className="font-bold">30 min Delivery</h4>
                  <p className="text-xs text-gray-400">Guaranteed freshness.</p>
                </div>
              </div>
              <button onClick={() => triggerToast("Full story coming soon!")} className="text-green-600 font-bold flex items-center gap-2 hover:underline">
                Read the full story <ExternalLink size={16} />
              </button>
            </div>
          </div>
        </section>

        {/* Menu Section */}
        <section ref={menuRef} className="max-w-7xl mx-auto px-4 py-12">
          <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2">
              <h2 className="text-3xl font-display font-extrabold text-gray-900">Explore Our Menu</h2>
              <div className="flex items-center gap-2 text-green-600 font-bold text-sm">
                <CheckCircle2 size={16} />
                <span>Verified Fresh by Gemini AI</span>
              </div>
            </div>
            <div className="relative w-full md:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
              <input 
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:border-green-400 focus:bg-white transition-all text-sm"
              />
            </div>
          </div>

          <div className="sticky top-16 z-40 bg-white/90 backdrop-blur-md py-4 border-b border-gray-100">
            <div className="max-w-7xl mx-auto overflow-x-auto no-scrollbar flex items-center gap-2">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`whitespace-nowrap px-6 py-2 rounded-full text-sm font-semibold transition-all ${activeCategory === cat ? 'bg-green-500 text-white shadow-md shadow-green-100' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8">
            {filteredItems.map(item => (
              <FoodCard 
                key={item.id} 
                item={item} 
                isHighlighted={highlightedIds.includes(item.id)}
                onClick={() => setSelectedItem(item)}
                onAddToCart={(e) => { e.stopPropagation(); addToCart(item); }}
              />
            ))}
          </div>

          <AIRecommender onSuggest={setHighlightedIds} />
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-4 gap-12">
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center text-white font-bold">M</div>
              <span className="text-xl font-display font-bold text-gray-800">Mustafa Elmi</span>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed">
              Experience the best of local cuisine with Mustafa Elmi. Fresh ingredients, expertly prepared.
            </p>
            <div className="flex gap-4">
              {['Facebook', 'Instagram', 'Twitter'].map(s => (
                <button key={s} onClick={() => triggerToast(`Opening ${s}...`)} className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 hover:bg-green-500 hover:text-white transition-all">
                  <span className="sr-only">{s}</span>
                  <MessageCircle size={14} />
                </button>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-bold text-gray-900 mb-6">Explore</h4>
            <ul className="space-y-4 text-sm text-gray-500">
              <li><button onClick={scrollToMenu} className="hover:text-green-600 transition-colors">Menu</button></li>
              <li><button onClick={scrollToAbout} className="hover:text-green-600 transition-colors">Our Story</button></li>
              <li><button onClick={() => triggerToast("Reviews coming soon!")} className="hover:text-green-600 transition-colors">Customer Reviews</button></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-gray-900 mb-6">Support</h4>
            <ul className="space-y-4 text-sm text-gray-500">
              <li><button onClick={() => triggerToast("Support Center loading...")} className="hover:text-green-600 transition-colors">Help Center</button></li>
              <li><button onClick={() => triggerToast("Privacy Policy PDF...")} className="hover:text-green-600 transition-colors">Privacy Policy</button></li>
              <li><button onClick={() => triggerToast("Contacting Support...")} className="hover:text-green-600 transition-colors">Contact Us</button></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-gray-900 mb-6">Payment Security</h4>
            <div className="p-6 bg-white rounded-3xl border border-gray-100 space-y-3">
              <ShieldCheck className="text-green-500" />
              <p className="text-xs text-gray-400">All transactions are encrypted with 256-bit SSL technology via Stripe.</p>
              <div className="flex gap-2">
                <img src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg" className="h-4 opacity-50" alt="Stripe" />
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Sticky Bottom Bag (Mobile Only) */}
      {cart.length > 0 && (
        <div className="sm:hidden fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-lg border-t border-gray-100 z-50 animate-in slide-in-from-bottom duration-500">
          <button 
            onClick={() => setIsCartOpen(true)}
            className="w-full py-4 bg-green-500 text-white rounded-2xl font-bold flex items-center justify-between px-6 shadow-xl shadow-green-100 active:scale-95 transition-all"
          >
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5" />
              <span>Checkout Bag ({cart.length})</span>
            </div>
            <span className="text-lg">${cart.reduce((s,i) => s + (i.price*i.quantity), 0).toFixed(2)}</span>
          </button>
        </div>
      )}

      {/* Modals & Overlays */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} items={cart} onUpdateQty={updateCartQty} onCheckout={handleCheckoutInitiate} />
      <HistoryDrawer isOpen={isHistoryOpen} onClose={() => setIsHistoryOpen(false)} orders={pastOrders} onOrderAgain={handleOrderAgain} />
      <StripePaymentModal isOpen={!!checkoutData} total={checkoutData?.breakdown.total || 0} breakdown={checkoutData?.breakdown} onClose={() => setCheckoutData(null)} onSuccess={handlePaymentSuccess} />
      
      {/* Enhanced Item Modal with Related Items */}
      <ItemModal 
        item={selectedItem} 
        onClose={() => setSelectedItem(null)} 
        onAddToCart={(item) => {
          addToCart(item);
          setSelectedItem(null);
        }} 
      />

      <Toast visible={showToast} message={toastMessage} onClose={() => setShowToast(false)} />
    </div>
  );
}

const ItemModal: React.FC<{
  item: FoodItem | null;
  onClose: () => void;
  onAddToCart: (item: FoodItem) => void;
}> = ({ item, onClose, onAddToCart }) => {
  if (!item) return null;

  const relatedItems = MENU_ITEMS.filter(m => item.relatedIds?.includes(m.id));

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={onClose} />
      <div className="relative w-full max-w-2xl bg-white rounded-t-[2.5rem] sm:rounded-[2.5rem] overflow-hidden shadow-2xl animate-in slide-in-from-bottom sm:zoom-in-95 duration-500 flex flex-col max-h-[90vh]">
        <button onClick={onClose} className="absolute top-4 right-4 z-20 p-2 bg-white/90 backdrop-blur rounded-full shadow-lg text-gray-500 hover:text-gray-900 transition-all hover:scale-110">
          <X className="w-5 h-5" />
        </button>
        
        <div className="overflow-y-auto no-scrollbar">
          <div className="grid md:grid-cols-2">
            <div className="h-64 md:h-auto">
              <ImageWithPlaceholder src={item.image} alt={item.name} className="w-full h-full" large />
            </div>
            <div className="p-8 flex flex-col">
              <div className="flex-1 space-y-6">
                <div>
                  <span className="text-xs font-bold text-green-600 uppercase tracking-widest bg-green-50 px-3 py-1 rounded-full">{item.category}</span>
                  <h2 className="text-3xl font-display font-extrabold text-gray-900 mt-2 leading-tight">{item.name}</h2>
                  <div className="flex items-center gap-4 mt-2">
                    <div className="flex items-center gap-1 text-yellow-400"><Star className="w-4 h-4 fill-current" /> <span className="text-sm font-bold text-gray-800">{item.rating}</span></div>
                    <div className="text-gray-300">|</div>
                    <div className="flex items-center gap-1.5 text-gray-500 text-sm font-medium"><Clock className="w-4 h-4" /><span>{item.prepTime}</span></div>
                  </div>
                </div>
                <p className="text-gray-500 leading-relaxed text-sm">{item.description}</p>
                <div>
                  <h4 className="font-bold text-xs text-gray-900 uppercase tracking-widest mb-3">Key Ingredients</h4>
                  <div className="flex flex-wrap gap-2">
                    {item.ingredients.map(ing => <span key={ing} className="px-3 py-1 bg-gray-100 text-gray-600 rounded-xl text-[10px] font-bold uppercase">{ing}</span>)}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {relatedItems.length > 0 && (
            <div className="p-8 border-t border-gray-50 bg-gray-50/50">
              <h4 className="font-display font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Zap size={18} className="text-yellow-500" />
                Frequently paired with
              </h4>
              <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
                {relatedItems.map(rel => (
                  <button 
                    key={rel.id} 
                    onClick={() => onAddToCart(rel)}
                    className="flex-shrink-0 w-48 bg-white p-3 rounded-2xl shadow-sm border border-gray-100 text-left hover:border-green-300 transition-all active:scale-95 group"
                  >
                    <div className="aspect-video rounded-xl overflow-hidden mb-3">
                      <ImageWithPlaceholder src={rel.image} alt={rel.name} className="w-full h-full" />
                    </div>
                    <p className="text-xs font-bold text-gray-900 line-clamp-1">{rel.name}</p>
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-[10px] text-green-600 font-bold">${rel.price.toFixed(2)}</span>
                      <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center text-green-600 group-hover:bg-green-500 group-hover:text-white transition-all">
                        <Plus size={10} />
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="p-8 bg-white border-t border-gray-100 flex items-center justify-between shrink-0">
          <div>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Total Price</p>
            <span className="text-3xl font-extrabold text-green-600">${item.price.toFixed(2)}</span>
          </div>
          <button 
            onClick={() => onAddToCart(item)}
            className="px-10 py-4 bg-green-500 text-white rounded-2xl font-bold shadow-xl shadow-green-100 hover:bg-green-600 transition-all active:scale-95"
          >
            Add to Bag
          </button>
        </div>
      </div>
    </div>
  );
};
