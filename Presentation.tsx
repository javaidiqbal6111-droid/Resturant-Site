
import React, { useState } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Layout, 
  ShoppingBag, 
  CreditCard, 
  Zap, 
  ShieldCheck, 
  Smartphone, 
  BarChart3, 
  Rocket, 
  CheckCircle2,
  ArrowRight,
  Database,
  Search,
  Users
} from 'lucide-react';

interface SlideProps {
  onClose: () => void;
}

export const PresentationView: React.FC<SlideProps> = ({ onClose }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    // Slide 1: Title
    {
      title: "Mustafa Elmi",
      subtitle: "A Modern, Fast, and Scalable Restaurant Solution",
      content: (
        <div className="flex flex-col items-center text-center space-y-8 py-12">
          <div className="w-24 h-24 bg-green-500 rounded-3xl flex items-center justify-center text-white text-5xl font-bold shadow-2xl shadow-green-200">M</div>
          <p className="text-xl text-gray-500 max-w-lg">
            Delivering a premium digital experience for the modern food industry.
          </p>
        </div>
      )
    },
    // Slide 2: Project Overview
    {
      title: "Project Overview",
      subtitle: "The Vision Behind Mustafa Elmi",
      content: (
        <div className="grid md:grid-cols-2 gap-12 items-center py-8">
          <div className="space-y-6">
            <div className="p-6 bg-green-50 rounded-2xl border border-green-100">
              <h4 className="font-bold text-green-800 mb-2">The Challenge</h4>
              <p className="text-sm text-green-700">Local businesses often struggle with slow, dated ordering systems that frustrate mobile users.</p>
            </div>
            <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
              <h4 className="font-bold text-gray-800 mb-2">The Solution</h4>
              <p className="text-sm text-gray-600">A mobile-first, high-performance platform with AI-driven recommendations to boost order value and customer loyalty.</p>
            </div>
          </div>
          <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-gray-100 flex flex-col items-center text-center space-y-4">
             <Rocket className="w-16 h-16 text-green-500" />
             <h3 className="text-2xl font-bold">Outcome</h3>
             <p className="text-gray-500 text-sm italic">"A production-ready environment built for speed and conversion."</p>
          </div>
        </div>
      )
    },
    // Slide 3: System Flow
    {
      title: "How It Works",
      subtitle: "Seamless High-Level Flow",
      content: (
        <div className="py-12 flex flex-wrap justify-center items-center gap-4 md:gap-8">
          {[
            { icon: <Users />, label: "User Visits" },
            { icon: <Search />, label: "Browses Menu" },
            { icon: <ShoppingBag />, label: "Selects Items" },
            { icon: <CreditCard />, label: "Secure Payment" },
            { icon: <Database />, label: "Order Tracked" },
          ].map((step, i, arr) => (
            <React.Fragment key={i}>
              <div className="flex flex-col items-center gap-3">
                <div className="w-20 h-20 bg-white rounded-2xl shadow-lg border border-gray-100 flex items-center justify-center text-green-500">
                  {/* Fixed TS error: Cast element to any props to satisfy cloneElement signature */}
                  {React.cloneElement(step.icon as React.ReactElement<any>, { size: 32 })}
                </div>
                <span className="text-xs font-bold text-gray-700 uppercase tracking-tighter">{step.label}</span>
              </div>
              {i < arr.length - 1 && <ArrowRight className="text-gray-200 hidden md:block" />}
            </React.Fragment>
          ))}
        </div>
      )
    },
    // Slide 4: Layout Overview
    {
      title: "Layout Structure",
      subtitle: "Designed for Maximum Engagement",
      content: (
        <div className="grid md:grid-cols-2 gap-8 py-4">
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center text-green-600 shrink-0"><Layout size={20}/></div>
              <div>
                <h4 className="font-bold">Conversion-Focused Hero</h4>
                <p className="text-xs text-gray-500">High-impact imagery paired with clear Call-to-Actions (CTA).</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center text-green-600 shrink-0"><Smartphone size={20}/></div>
              <div>
                <h4 className="font-bold">Mobile-First Navigation</h4>
                <p className="text-xs text-gray-500">Sticky navigation and touch-friendly targets throughout.</p>
              </div>
            </div>
          </div>
          <div className="relative border-4 border-gray-900 rounded-[2rem] h-64 overflow-hidden shadow-2xl">
            <div className="bg-gray-100 w-full h-8 flex items-center px-4 gap-1">
              <div className="w-2 h-2 rounded-full bg-red-400"></div>
              <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
              <div className="w-2 h-2 rounded-full bg-green-400"></div>
            </div>
            <div className="p-4 space-y-3">
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-20 bg-gray-100 rounded-xl"></div>
              <div className="grid grid-cols-2 gap-2">
                <div className="h-16 bg-gray-100 rounded-xl"></div>
                <div className="h-16 bg-gray-100 rounded-xl"></div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    // Slide 5: Menu Experience
    {
      title: "Catalog Experience",
      subtitle: "Ease of Browsing",
      content: (
        <div className="space-y-8">
          <p className="text-center text-gray-500 max-w-lg mx-auto">Intuitive filtering and category selection ensure users find exactly what they want in seconds.</p>
          <div className="grid grid-cols-3 gap-4">
            {['Category Tabs', 'Price Filters', 'Live Search'].map(f => (
              <div key={f} className="p-4 bg-white border border-gray-100 rounded-2xl text-center shadow-sm">
                <CheckCircle2 className="w-5 h-5 text-green-500 mx-auto mb-2" />
                <span className="text-sm font-bold text-gray-700">{f}</span>
              </div>
            ))}
          </div>
        </div>
      )
    },
    // Slide 6: Item Details
    {
      title: "Deep Interaction",
      subtitle: "Item Details & Up-selling",
      content: (
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <img src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=600" className="rounded-3xl shadow-lg" alt="App Preview" />
          <div className="space-y-4 text-sm text-gray-600">
             <div className="flex gap-3">
                <div className="w-1 h-auto bg-green-500 rounded-full" />
                <p><strong>Visual Storytelling:</strong> High-res imagery displays quality immediately.</p>
             </div>
             <div className="flex gap-3">
                <div className="w-1 h-auto bg-green-500 rounded-full" />
                <p><strong>Clarity:</strong> Preparation time and calorie counts help customers decide.</p>
             </div>
             <div className="flex gap-3">
                <div className="w-1 h-auto bg-green-500 rounded-full" />
                <p><strong>Related Items:</strong> Intelligent cross-selling increases average cart value.</p>
             </div>
          </div>
        </div>
      )
    },
    // Slide 7: Payment & Safety
    {
      title: "Reliability & Safety",
      subtitle: "Secure Payment & Tracking",
      content: (
        <div className="grid md:grid-cols-3 gap-6 py-8">
          <div className="p-6 bg-white border border-gray-100 rounded-2xl space-y-3">
             <ShieldCheck className="text-green-500 w-8 h-8" />
             <h4 className="font-bold">Secure Stripe Flow</h4>
             <p className="text-xs text-gray-400">Industry-standard encryption for all transactions.</p>
          </div>
          <div className="p-6 bg-white border border-gray-100 rounded-2xl space-y-3">
             <Zap className="text-yellow-500 w-8 h-8" />
             <h4 className="font-bold">Real-time Feedback</h4>
             <p className="text-xs text-gray-400">Immediate order confirmation and tracking status.</p>
          </div>
          <div className="p-6 bg-white border border-gray-100 rounded-2xl space-y-3">
             <ShoppingBag className="text-blue-500 w-8 h-8" />
             <h4 className="font-bold">Clear Refund Policy</h4>
             <p className="text-xs text-gray-400">Automated workflows for cancellations and support.</p>
          </div>
        </div>
      )
    },
    // Slide 8: Admin & Data
    {
      title: "Business Intelligence",
      subtitle: "Data-Driven Decisions",
      content: (
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h4 className="text-xl font-bold">Manage with Ease</h4>
            <p className="text-gray-500 text-sm">Every order is captured with a clean data structure, allowing you to track popular items, peak hours, and customer preferences.</p>
            <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-lg text-xs font-mono text-gray-500">
               {"{ order_id: 'ME-902', total: 45.50, items: 3 }"}
            </div>
          </div>
          <div className="bg-green-500/5 p-8 rounded-[2rem] border border-green-500/10">
             <BarChart3 className="w-12 h-12 text-green-500 mb-4" />
             <div className="space-y-2">
                <div className="h-2 bg-green-500 rounded w-full"></div>
                <div className="h-2 bg-green-500/50 rounded w-2/3"></div>
                <div className="h-2 bg-green-500/20 rounded w-1/2"></div>
             </div>
          </div>
        </div>
      )
    },
    // Slide 9: Performance
    {
      title: "Quality Benchmarks",
      subtitle: "Optimized for Performance",
      content: (
        <div className="flex flex-col items-center gap-12 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 w-full">
            {[
              { label: "Load Time", val: "< 1.5s" },
              { label: "Lighthouse Score", val: "95+" },
              { label: "Mobile Ready", val: "100%" },
              { label: "Uptime", val: "99.9%" },
            ].map(stat => (
              <div key={stat.label} className="text-center space-y-2">
                <div className="text-3xl font-bold text-green-600 font-display">{stat.val}</div>
                <div className="text-[10px] text-gray-400 uppercase tracking-widest">{stat.label}</div>
              </div>
            ))}
          </div>
          <p className="text-sm text-gray-500 italic">Built using modern browser APIs to ensure a smooth 60fps experience on all devices.</p>
        </div>
      )
    },
    // Slide 10: Tech Stack
    {
      title: "Modern Foundation",
      subtitle: "Built with Scalable Technology",
      content: (
        <div className="grid grid-cols-2 gap-4 py-8">
           <div className="p-4 bg-gray-50 rounded-xl flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold">R</div>
              <span className="text-sm font-bold">React Frontend</span>
           </div>
           <div className="p-4 bg-gray-50 rounded-xl flex items-center gap-3">
              <div className="w-8 h-8 bg-cyan-500 rounded-lg flex items-center justify-center text-white font-bold">T</div>
              <span className="text-sm font-bold">Tailwind CSS</span>
           </div>
           <div className="p-4 bg-gray-50 rounded-xl flex items-center gap-3">
              <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center text-white font-bold">G</div>
              <span className="text-sm font-bold">Gemini AI Engine</span>
           </div>
           <div className="p-4 bg-gray-50 rounded-xl flex items-center gap-3">
              <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center text-white font-bold">L</div>
              <span className="text-sm font-bold">Lucide Graphics</span>
           </div>
        </div>
      )
    },
    // Slide 11: Strengths
    {
      title: "Why This Solution?",
      subtitle: "Competitive Advantage",
      content: (
        <div className="space-y-4 max-w-lg mx-auto py-8">
          {[
            "Premium Clean Aesthetic",
            "Ultra-Fast Order Flow",
            "AI-Powered Personalization",
            "Highly Maintainable Codebase",
            "Future-Ready Foundation"
          ].map(p => (
            <div key={p} className="flex items-center gap-3 p-4 bg-green-50 rounded-2xl border border-green-100">
               <CheckCircle2 className="text-green-600 w-5 h-5" />
               <span className="font-bold text-green-900">{p}</span>
            </div>
          ))}
        </div>
      )
    },
    // Slide 12: Next Steps
    {
      title: "Next Steps",
      subtitle: "Future Vision & Growth",
      content: (
        <div className="grid md:grid-cols-2 gap-8 py-8">
          <div className="space-y-4">
            <h4 className="font-bold text-gray-800">Growth Opportunities</h4>
            <ul className="space-y-2 text-sm text-gray-500 list-disc pl-5">
              <li>Loyalty Program integration</li>
              <li>Multi-location support</li>
              <li>Advanced analytics dashboard</li>
              <li>Push notifications for delivery</li>
            </ul>
          </div>
          <div className="bg-gray-900 text-white p-8 rounded-[2rem] flex flex-col justify-center items-center text-center space-y-6">
             <h3 className="text-2xl font-bold">Ready to Launch?</h3>
             <button onClick={onClose} className="px-8 py-4 bg-green-500 rounded-xl font-bold hover:bg-green-600 transition-all">Go Live Today</button>
          </div>
        </div>
      )
    }
  ];

  const next = () => setCurrentSlide(s => Math.min(slides.length - 1, s + 1));
  const prev = () => setCurrentSlide(s => Math.max(0, s - 1));

  return (
    <div className="fixed inset-0 z-[1000] bg-white flex flex-col">
      {/* Progress Bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gray-100">
        <div 
          className="h-full bg-green-500 transition-all duration-500 ease-out"
          style={{ width: `${((currentSlide + 1) / slides.length) * 100}%` }}
        />
      </div>

      <header className="px-8 py-6 flex items-center justify-between border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center text-white font-bold">M</div>
          <span className="font-display font-bold text-xl">Mustafa Elmi <span className="text-gray-400 font-normal">Presentation</span></span>
        </div>
        <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-900 transition-colors">
          <X className="w-6 h-6" />
        </button>
      </header>

      <main className="flex-1 overflow-hidden relative">
        <div className="max-w-4xl mx-auto h-full px-8 py-12 flex flex-col justify-center">
          <div className="space-y-2 mb-12 animate-in fade-in slide-in-from-left duration-700">
            <h1 className="text-4xl md:text-5xl font-display font-extrabold text-gray-900 leading-tight">
              {slides[currentSlide].title}
            </h1>
            <p className="text-xl text-green-600 font-medium">
              {slides[currentSlide].subtitle}
            </p>
          </div>

          <div className="flex-1 animate-in fade-in zoom-in duration-1000">
            {slides[currentSlide].content}
          </div>
        </div>
      </main>

      <footer className="px-8 py-8 flex items-center justify-between border-t border-gray-100">
        <div className="text-sm font-bold text-gray-400">
          SLIDE {currentSlide + 1} OF {slides.length}
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={prev}
            disabled={currentSlide === 0}
            className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:border-gray-900 hover:text-gray-900 disabled:opacity-30 disabled:hover:border-gray-200 transition-all"
          >
            <ChevronLeft />
          </button>
          <button 
            onClick={next}
            disabled={currentSlide === slides.length - 1}
            className="px-8 h-12 rounded-full bg-gray-900 text-white font-bold flex items-center gap-2 hover:bg-black disabled:opacity-30 transition-all"
          >
            <span>{currentSlide === slides.length - 1 ? 'End Presentation' : 'Next Slide'}</span>
            <ChevronRight size={18} />
          </button>
        </div>
      </footer>
    </div>
  );
};

const X = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);