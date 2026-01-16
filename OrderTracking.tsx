
import React, { useEffect, useState } from 'react';
import { 
  CheckCircle2, 
  ChefHat, 
  Bike, 
  Home, 
  ChevronLeft, 
  Clock, 
  MapPin, 
  Phone,
  MessageSquare,
  Star,
  ChevronDown,
  ChevronUp,
  XCircle,
  AlertTriangle,
  RefreshCcw,
  ArrowLeft,
  RotateCcw
} from 'lucide-react';
import { Order, OrderStatus, Rider, CartItem } from './types';
import { ChatView } from './ChatView';

interface OrderTrackingProps {
  order: Order;
  onBack: () => void;
  onCancelled: (order: Order) => void;
  onCompleted: (order: Order) => void;
}

const statusSteps: { status: OrderStatus; label: string; icon: React.ReactNode }[] = [
  { status: 'Placed', label: 'Order Placed', icon: <CheckCircle2 className="w-6 h-6" /> },
  { status: 'Preparing', label: 'Preparing', icon: <ChefHat className="w-6 h-6" /> },
  { status: 'Out for Delivery', label: 'On its way', icon: <Bike className="w-6 h-6" /> },
  { status: 'Delivered', label: 'Delivered', icon: <Home className="w-6 h-6" /> },
];

const CANCEL_REASONS = [
  "Ordered by mistake",
  "Wait time too long",
  "Forgot to add an item",
  "Changed my mind",
  "Price too high",
  "Other"
];

const DEFAULT_RIDER: Rider = {
  name: 'Marco Rossi',
  phone: '+1 (555) 0123 4567',
  image: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=200',
  rating: 4.9
};

export const OrderTracking: React.FC<OrderTrackingProps> = ({ order, onBack, onCancelled, onCompleted }) => {
  const [currentStatus, setCurrentStatus] = useState<OrderStatus>(order.status);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [showFullBreakdown, setShowFullBreakdown] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [requestRefund, setRequestRefund] = useState(true);
  const [isRefunded, setIsRefunded] = useState(false);

  const rider = order.rider || DEFAULT_RIDER;

  useEffect(() => {
    if (currentStatus === 'Cancelled' || currentStatus === 'Delivered') return;

    const statuses: OrderStatus[] = ['Placed', 'Preparing', 'Out for Delivery', 'Delivered'];
    const currentIndex = statuses.indexOf(currentStatus);
    
    if (currentIndex < statuses.length - 1) {
      const timer = setTimeout(() => {
        const nextStatus = statuses[currentIndex + 1];
        setCurrentStatus(nextStatus);
        if (nextStatus === 'Delivered') {
          onCompleted({...order, status: 'Delivered'});
        }
      }, 15000);
      return () => clearTimeout(timer);
    }
  }, [currentStatus]);

  const currentIndex = statusSteps.findIndex(s => s.status === currentStatus);

  const handleCall = () => {
    window.location.href = `tel:${rider.phone}`;
  };

  const confirmCancellation = () => {
    setCurrentStatus('Cancelled');
    const updatedOrder: Order = {
      ...order,
      status: 'Cancelled',
      cancellationReason: cancelReason,
      refunded: requestRefund
    };
    if (requestRefund) {
      setIsRefunded(true);
    }
    onCancelled(updatedOrder);
    setShowCancelModal(false);
  };

  if (currentStatus === 'Cancelled') {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 pb-12 px-4 animate-in fade-in duration-500">
        <div className="max-w-xl mx-auto text-center space-y-8">
          <div className="bg-white rounded-[2.5rem] p-12 shadow-xl border border-gray-100 flex flex-col items-center">
            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center text-red-500 mb-6">
              <XCircle size={40} />
            </div>
            <h1 className="text-3xl font-display font-extrabold text-gray-900 mb-2">Order Cancelled</h1>
            <p className="text-gray-500 mb-8 max-w-sm">
              Your order #{order.id} has been successfully cancelled. 
              {isRefunded && " Your refund is being processed and will appear in your bank account in 2 working days."}
            </p>
            
            {isRefunded && (
              <div className="w-full bg-green-50 border border-green-100 rounded-2xl p-4 flex items-center gap-3 mb-8">
                <RefreshCcw className="text-green-500" size={20} />
                <div className="text-left">
                  <p className="text-sm font-bold text-green-800">Refund Processing</p>
                  <p className="text-xs text-green-600">${order.total.toFixed(2)} to be credited within 2 days</p>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
              <button 
                onClick={onBack}
                className="w-full py-4 bg-gray-900 text-white rounded-2xl font-bold hover:bg-black transition-all flex items-center justify-center gap-2"
              >
                <ArrowLeft size={18} />
                <span>Return to Menu</span>
              </button>
              <button 
                onClick={() => {
                   // This logic is handled by parent App.tsx usually, but for tracking it might need a trigger
                   onBack();
                }}
                className="w-full py-4 bg-green-500 text-white rounded-2xl font-bold hover:bg-green-600 transition-all shadow-lg shadow-green-100 flex items-center justify-center gap-2"
              >
                <RotateCcw size={18} />
                <span>Order Again</span>
              </button>
            </div>
          </div>
          
          <div className="text-xs text-gray-400">
            Need more help? <a href="#" className="underline font-bold text-gray-500">Contact Support</a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12 px-4 relative">
      <div className="max-w-3xl mx-auto space-y-6">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-gray-500 hover:text-green-600 transition-colors font-semibold"
        >
          <ChevronLeft className="w-5 h-5" />
          <span>Back to Menu</span>
        </button>

        {/* Status Card */}
        <div className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/50 p-8 border border-gray-100">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Order ID: #{order.id}</p>
              <h1 className="text-3xl font-display font-extrabold text-gray-900">
                {currentStatus === 'Delivered' ? 'Enjoy your meal!' : 'Tracking your order'}
              </h1>
            </div>
            {currentStatus !== 'Delivered' && (
              <div className="flex items-center gap-3 px-6 py-3 bg-green-50 rounded-2xl">
                <Clock className="w-5 h-5 text-green-600" />
                <div>
                  <p className="text-[10px] text-green-600/70 font-bold uppercase">Estimated Arrival</p>
                  <p className="text-lg font-bold text-green-700">{order.estimatedArrival}</p>
                </div>
              </div>
            )}
          </div>

          {/* Progress Tracker */}
          <div className="relative mb-8">
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-100 -translate-y-1/2 hidden md:block" />
            <div 
              className="absolute top-1/2 left-0 h-0.5 bg-green-500 -translate-y-1/2 transition-all duration-1000 ease-in-out hidden md:block" 
              style={{ width: `${(currentIndex / (statusSteps.length - 1)) * 100}%` }}
            />
            
            <div className="relative flex flex-col md:flex-row justify-between gap-8">
              {statusSteps.map((step, idx) => {
                const isCompleted = idx <= currentIndex;
                const isActive = idx === currentIndex;
                
                return (
                  <div key={step.status} className="flex md:flex-col items-center gap-4 md:gap-3 flex-1">
                    <div className={`
                      relative z-10 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500
                      ${isCompleted ? 'bg-green-500 text-white shadow-lg shadow-green-100' : 'bg-gray-100 text-gray-400'}
                      ${isActive ? 'ring-4 ring-green-100 scale-110' : ''}
                    `}>
                      {step.icon}
                      {isActive && currentStatus !== 'Delivered' && (
                        <div className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-25" />
                      )}
                    </div>
                    <div className="text-left md:text-center">
                      <p className={`text-sm font-bold ${isCompleted ? 'text-gray-900' : 'text-gray-400'}`}>
                        {step.label}
                      </p>
                      {isActive && <p className="text-[10px] text-green-600 font-bold uppercase animate-pulse">Current</p>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Cancel Order Action */}
          {currentIndex < 2 && (
            <div className="pt-8 border-t border-gray-100 text-center">
               <button 
                 onClick={() => setShowCancelModal(true)}
                 className="text-xs font-bold text-red-400 hover:text-red-600 transition-colors uppercase tracking-widest flex items-center gap-2 mx-auto"
               >
                 <XCircle size={14} />
                 Cancel Order
               </button>
            </div>
          )}

          {currentStatus === 'Delivered' && (
             <div className="pt-8 border-t border-gray-100 flex flex-col items-center gap-4">
               <p className="text-sm font-medium text-gray-500">How was your experience with Mustafa Elmi?</p>
               <div className="flex gap-2">
                 {[1,2,3,4,5].map(i => <Star key={i} className="text-yellow-400 cursor-pointer hover:scale-110 transition-transform" fill={i <= 4 ? "currentColor" : "none"} />)}
               </div>
               <button 
                 onClick={onBack}
                 className="mt-2 flex items-center gap-2 px-8 py-3 bg-green-500 text-white rounded-2xl font-bold shadow-lg shadow-green-100 hover:bg-green-600 transition-all"
               >
                 <RotateCcw size={18} />
                 <span>Order Again</span>
               </button>
             </div>
          )}
        </div>

        {/* Map Placeholder & Delivery Info */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-[2rem] overflow-hidden border border-gray-100 shadow-lg shadow-gray-100">
            <div className="h-48 bg-gray-200 relative">
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=800')] bg-cover opacity-50 grayscale" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="w-10 h-10 bg-green-500 rounded-full border-4 border-white shadow-xl flex items-center justify-center text-white">
                  <Bike size={20} />
                </div>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gray-100 rounded-full overflow-hidden shrink-0 border-2 border-white shadow-md">
                  <img src={rider.image} alt={rider.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-gray-900">{rider.name}</h4>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <Star size={12} className="fill-yellow-400 text-yellow-400" />
                    <span className="text-[10px] font-bold text-gray-700">{rider.rating}</span>
                    <span className="text-gray-300">•</span>
                    <span className="text-[10px] text-gray-500 uppercase font-bold tracking-tighter">Mustafa Elmi Courier</span>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button 
                  onClick={handleCall}
                  className="flex items-center justify-center gap-2 py-3.5 bg-gray-50 text-gray-700 rounded-2xl font-bold text-sm border border-gray-100 hover:bg-green-50 hover:text-green-600 hover:border-green-100 transition-all active:scale-95"
                >
                  <Phone size={18} />
                  <span>Call Rider</span>
                </button>
                <button 
                  onClick={() => setIsChatOpen(true)}
                  className="flex items-center justify-center gap-2 py-3.5 bg-green-500 text-white rounded-2xl font-bold text-sm shadow-lg shadow-green-100 hover:bg-green-600 transition-all active:scale-95"
                >
                  <MessageSquare size={18} />
                  <span>Message</span>
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-lg shadow-gray-100 space-y-6 h-full">
            <h4 className="font-bold text-gray-900 flex items-center gap-2">
              <MapPin className="text-green-500 w-5 h-5" />
              Delivery Address
            </h4>
            <div className="space-y-1">
              <p className="font-bold text-gray-700">The Modern Loft</p>
              <p className="text-sm text-gray-500">123 Fresh Ave, Apartment 4B</p>
              <p className="text-sm text-gray-500">Green City, GC 54321</p>
            </div>
            
            <div className="pt-6 border-t border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-bold text-gray-900">Order Summary</h4>
                <button 
                  onClick={() => setShowFullBreakdown(!showFullBreakdown)}
                  className="text-[10px] font-bold text-green-600 uppercase tracking-widest flex items-center gap-1"
                >
                  {showFullBreakdown ? 'Hide Fees' : 'Show Fees'}
                  {showFullBreakdown ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                </button>
              </div>
              
              <div className="space-y-3">
                {order.items.map(item => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-gray-500">{item.quantity}x {item.name}</span>
                    <span className="font-bold text-gray-900">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}

                {showFullBreakdown && order.breakdown && (
                  <div className="pt-3 space-y-2 border-t border-dashed border-gray-200 animate-in slide-in-from-top-1 duration-300">
                    <div className="flex justify-between text-xs text-gray-400">
                      <span>Delivery Fee</span>
                      <span>${order.breakdown.deliveryFee.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-xs text-gray-400">
                      <span>Service Fee</span>
                      <span>${order.breakdown.serviceFee.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-xs text-gray-400">
                      <span>Estimated Sales Tax (8.25%)</span>
                      <span>${order.breakdown.salesTax.toFixed(2)}</span>
                    </div>
                  </div>
                )}

                <div className="flex justify-between pt-3 border-t border-gray-100">
                  <span className="font-bold text-gray-900">Total Charged</span>
                  <span className="font-extrabold text-green-600 text-lg">${order.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cancellation Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowCancelModal(false)} />
          <div className="relative w-full max-w-md bg-white rounded-[2.5rem] p-8 shadow-2xl animate-in zoom-in-95 duration-300">
            <h2 className="text-2xl font-display font-extrabold text-gray-900 mb-2">Cancel Order?</h2>
            <p className="text-sm text-gray-500 mb-6">Please let us know why you're cancelling. This helps us improve.</p>
            
            <div className="space-y-3 mb-8">
              {CANCEL_REASONS.map(reason => (
                <button
                  key={reason}
                  onClick={() => setCancelReason(reason)}
                  className={`w-full p-4 rounded-2xl border text-sm font-medium text-left transition-all ${
                    cancelReason === reason 
                    ? 'border-red-500 bg-red-50 text-red-700 ring-2 ring-red-500/10' 
                    : 'border-gray-100 bg-gray-50 text-gray-600 hover:border-gray-200'
                  }`}
                >
                  {reason}
                </button>
              ))}
            </div>

            <div className="bg-orange-50 rounded-2xl p-4 border border-orange-100 mb-8 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="text-orange-500" size={18} />
                  <span className="text-sm font-bold text-orange-900">Request Refund</span>
                </div>
                <button 
                  onClick={() => setRequestRefund(!requestRefund)}
                  className={`w-12 h-6 rounded-full transition-colors relative ${requestRefund ? 'bg-orange-500' : 'bg-gray-300'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${requestRefund ? 'left-7' : 'left-1'}`} />
                </button>
              </div>
              <p className="text-xs text-orange-700 leading-relaxed">
                {requestRefund 
                  ? "Refund of $" + order.total.toFixed(2) + " will be sent back to your account in 2 working days."
                  : "No refund will be requested. The order will simply be closed."}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => setShowCancelModal(false)}
                className="py-4 bg-gray-50 text-gray-500 rounded-2xl font-bold hover:bg-gray-100 transition-all"
              >
                Keep Order
              </button>
              <button 
                disabled={!cancelReason}
                onClick={confirmCancellation}
                className="py-4 bg-red-500 text-white rounded-2xl font-bold shadow-lg shadow-red-100 hover:bg-red-600 disabled:opacity-50 transition-all"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      <ChatView 
        rider={rider} 
        isOpen={isChatOpen} 
        onClose={() => setIsChatOpen(false)} 
      />
    </div>
  );
};
