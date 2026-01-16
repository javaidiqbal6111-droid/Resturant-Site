
import React, { useState, useEffect } from 'react';
import { ShieldCheck, Lock, CreditCard, X, CheckCircle2, Loader2, ChevronDown, ChevronUp } from 'lucide-react';

interface StripePaymentProps {
  total: number;
  breakdown?: any;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const StripePaymentModal: React.FC<StripePaymentProps> = ({ total, breakdown, isOpen, onClose, onSuccess }) => {
  const [status, setStatus] = useState<'idle' | 'processing' | 'success'>('idle');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [showSummary, setShowSummary] = useState(false);

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('processing');
    
    // Simulate payment gateway delay
    setTimeout(() => {
      setStatus('success');
      setTimeout(() => {
        onSuccess();
      }, 1500);
    }, 2500);
  };

  const formatCardNumber = (val: string) => {
    const v = val.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={status === 'idle' ? onClose : undefined} />
      
      <div className="relative w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-8 duration-500">
        {status === 'idle' && (
          <button onClick={onClose} className="absolute top-6 right-6 text-gray-400 hover:text-gray-900 transition-colors z-20">
            <X size={24} />
          </button>
        )}

        <div className="p-8">
          {status === 'idle' ? (
            <form onSubmit={handlePay} className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-green-600 mb-1">
                  <ShieldCheck size={20} />
                  <span className="text-sm font-bold uppercase tracking-wider">Secure Checkout</span>
                </div>
                <h2 className="text-2xl font-display font-extrabold text-gray-900">Payment Details</h2>
                <p className="text-sm text-gray-500">Powered by <span className="font-bold text-indigo-600">stripe</span></p>
              </div>

              {/* Collapsible Order Summary */}
              {breakdown && (
                <div className="bg-gray-50 rounded-2xl overflow-hidden border border-gray-100">
                  <button 
                    type="button"
                    onClick={() => setShowSummary(!showSummary)}
                    className="w-full px-4 py-3 flex items-center justify-between text-sm font-bold text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    <span>View Order Summary</span>
                    <div className="flex items-center gap-2">
                       <span className="text-green-600">${total.toFixed(2)}</span>
                       {showSummary ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </div>
                  </button>
                  {showSummary && (
                    <div className="px-4 pb-4 space-y-2 text-xs text-gray-500 animate-in slide-in-from-top-2 duration-300">
                      <div className="flex justify-between">
                        <span>Items Subtotal</span>
                        <span>${breakdown.subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Delivery Fee</span>
                        <span>${breakdown.deliveryFee.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Service Fee</span>
                        <span>${breakdown.serviceFee.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Estimated Sales Tax (8.25%)</span>
                        <span>${breakdown.salesTax.toFixed(2)}</span>
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-tight">Card Number</label>
                  <div className="relative">
                    <input 
                      required
                      type="text"
                      placeholder="0000 0000 0000 0000"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                      maxLength={19}
                      className="w-full px-4 py-3.5 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:border-green-400 focus:bg-white transition-all font-mono"
                    />
                    <CreditCard className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300" size={20} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-tight">Expiry Date</label>
                    <input 
                      required
                      type="text"
                      placeholder="MM / YY"
                      value={expiry}
                      onChange={(e) => setExpiry(e.target.value)}
                      maxLength={5}
                      className="w-full px-4 py-3.5 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:border-green-400 focus:bg-white transition-all font-mono"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-tight">CVC</label>
                    <input 
                      required
                      type="password"
                      placeholder="***"
                      value={cvc}
                      onChange={(e) => setCvc(e.target.value.replace(/[^0-9]/g, ''))}
                      maxLength={3}
                      className="w-full px-4 py-3.5 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:border-green-400 focus:bg-white transition-all font-mono"
                    />
                  </div>
                </div>
              </div>

              <button 
                type="submit"
                className="w-full py-4 bg-green-500 text-white rounded-2xl font-bold shadow-xl shadow-green-100 hover:bg-green-600 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
              >
                <Lock size={18} />
                <span>Pay ${total.toFixed(2)}</span>
              </button>

              <p className="text-[10px] text-center text-gray-400 px-6">
                Your payment is encrypted and secured using SSL technology. By clicking "Pay", you agree to our terms of service.
              </p>
            </form>
          ) : status === 'processing' ? (
            <div className="py-12 flex flex-col items-center justify-center space-y-6 animate-in fade-in duration-500">
              <div className="relative">
                <Loader2 className="w-16 h-16 text-green-500 animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Lock size={20} className="text-green-600" />
                </div>
              </div>
              <div className="text-center">
                <h3 className="text-xl font-display font-bold text-gray-900">Securing payment...</h3>
                <p className="text-sm text-gray-500">Please do not refresh the page.</p>
              </div>
            </div>
          ) : (
            <div className="py-12 flex flex-col items-center justify-center space-y-6 animate-in zoom-in duration-500">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-12 h-12 text-green-500" />
              </div>
              <div className="text-center">
                <h3 className="text-2xl font-display font-bold text-gray-900">Payment Successful!</h3>
                <p className="text-sm text-gray-500">Confirming your order with the kitchen...</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
