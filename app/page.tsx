'use client';

import React, { useState } from 'react';
import { ShoppingCart, Phone, MessageSquare, Plus, Minus, X, Leaf, Languages, CheckCircle, Loader2 } from 'lucide-react';
import { useLanguage } from './context/LanguageContext';
import productsData from '@/data/products.json';


export default function ShopPage() {
  const { t, language, setLanguage } = useLanguage();
  const [cart, setCart] = useState<{ id: number; quantity: number }[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [isOrdering, setIsOrdering] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  const addToCart = (id: number) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === id);
      if (existing) {
        return prev.map((item) => (item.id === id ? { ...item, quantity: item.quantity + 1 } : item));
      }
      return [...prev, { id, quantity: 1 }];
    });
  };

  const removeFromCart = (id: number) => {
    setCart((prev) =>
      prev
        .map((item) => (item.id === id ? { ...item, quantity: item.quantity - 1 } : item))
        .filter((item) => item.quantity > 0)
    );
  };

  const handleConfirmOrder = () => {
    setIsOrdering(true);
    // Simulate API call
    setTimeout(() => {
      setIsOrdering(false);
      setOrderSuccess(true);
      setCart([]);
      setIsCartOpen(false);
    }, 2000);
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cart.reduce((sum, item) => {
    const product = productsData.find((p) => p.id === item.id);
    return sum + (product?.price || 0) * item.quantity;
  }, 0);

  const filteredProducts = activeCategory === 'all' 
    ? productsData 
    : productsData.filter(p => p.category === activeCategory);

  const categories = ['all', 'vegetable', 'fruits', 'serials', 'packedfoods', 'leafyleaves', 'spice'];

  const currency = language === 'en' ? 'ETB' : 'ብር';

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-md border-b border-gray-100 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-primary p-2 rounded-lg text-white">
            <Leaf className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold text-primary tracking-tight">{t('shopTitle')}</h1>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setLanguage(language === 'en' ? 'am' : 'en')}
            className="flex items-center gap-2 px-3 py-1.5 bg-bg-soft hover:bg-gray-100 rounded-full transition-colors text-xs font-bold text-text-dark"
          >
            <Languages className="w-4 h-4 text-primary" />
            <span>{language === 'en' ? 'Amharic' : 'English'}</span>
          </button>

          <button 
            onClick={() => setIsCartOpen(true)}
            className="relative p-2 text-text-dark hover:bg-gray-100 rounded-full transition-colors"
          >
            <ShoppingCart className="w-6 h-6" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-secondary text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="px-6 py-8">
        <h2 className="text-3xl font-extrabold text-text-dark leading-tight">
          {t('heroTitle')} <span className="text-primary">{t('heroTitleAccent')}</span>.
        </h2>
        <p className="text-gray-500 mt-2">{t('heroSubtitle')}</p>
      </section>

      {/* Category Filter */}
      <div className="px-6 flex gap-2 overflow-x-auto pb-6 no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`
              whitespace-nowrap px-4 py-2 rounded-full text-sm font-bold transition-all
              ${activeCategory === cat 
                ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                : 'bg-white text-gray-500 border border-gray-100 hover:border-primary/30'}
            `}
          >
            {cat === 'all' ? (language === 'en' ? 'All' : 'ሁሉም') : t(`categories.${cat}`)}
          </button>
        ))}
      </div>

      {/* Product Grid */}
      <main className="px-6 grid grid-cols-2 md:grid-cols-3 gap-4">
        {filteredProducts.map((product) => (
          <div 
            key={product.id} 
            className="bg-white rounded-2xl p-4 shadow-soft border border-gray-50 flex flex-col items-center card-hover cursor-pointer"
            onClick={() => setSelectedProduct(product)}
          >
            <div className="text-5xl mb-4 bg-bg-soft w-full aspect-square flex items-center justify-center rounded-xl">
              {product.image}
            </div>
            <div className="w-full">
              <span className="text-[10px] font-bold uppercase tracking-wider text-primary/60">
                {t(`categories.${product.category}`)}
              </span>
              <h3 className="font-bold text-text-dark text-sm mt-1">
                {language === 'en' ? product.en : product.am}
              </h3>
              <div className="flex items-center justify-between mt-3">
                <p className="text-primary font-bold">{product.price.toFixed(2)} {currency}</p>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    addToCart(product.id);
                  }}
                  className="bg-primary text-white p-1.5 rounded-lg hover:opacity-90 active:scale-95 transition-all"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </main>

      {/* Fixed Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 p-4 z-50 pointer-events-none">
        <div className="max-w-md mx-auto flex gap-3 pointer-events-auto">
          <a 
            href="tel:0989681490"
            className="flex-1 bg-white border border-gray-200 shadow-lg rounded-2xl py-4 flex items-center justify-center gap-2 text-text-dark font-bold active:scale-95 transition-transform"
          >
            <Phone className="w-5 h-5 text-primary" />
            <span>{t('call')}</span>
          </a>
          <button 
            onClick={() => setIsCartOpen(true)}
            className="flex-[2] bg-primary shadow-lg shadow-primary/20 rounded-2xl py-4 flex items-center justify-center gap-2 text-white font-bold active:scale-95 transition-transform"
          >
            <MessageSquare className="w-5 h-5" />
            <span>{t('messageOrder')}</span>
          </button>
        </div>
      </div>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-text-dark/40 backdrop-blur-sm" 
            onClick={() => setSelectedProduct(null)}
          />
          <div className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-4 flex justify-end">
              <button 
                onClick={() => setSelectedProduct(null)}
                className="p-2 hover:bg-bg-soft rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-gray-400" />
              </button>
            </div>
            <div className="px-8 pb-8 flex flex-col items-center">
              <div className="text-8xl mb-6 bg-bg-soft w-48 h-48 flex items-center justify-center rounded-3xl shadow-inner">
                {selectedProduct.image}
              </div>
              <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest mb-2">
                {t(`categories.${selectedProduct.category}`)}
              </span>
              <h3 className="text-2xl font-black text-text-dark text-center mb-2">
                {language === 'en' ? selectedProduct.en : selectedProduct.am}
              </h3>
              <p className="text-gray-500 text-center mb-6 leading-relaxed">
                {language === 'en' 
                  ? "High-quality organic product sourced directly from local farms. Perfect for your daily cooking needs." 
                  : "ከአገር በቀል ገበሬዎች በቀጥታ የሚመጣ ከፍተኛ ጥራት ያለው ኦርጋኒክ ምርት። ለዕለታዊ የምግብ ዝግጅትዎ ፍጹም ምርጫ።"}
              </p>
              <div className="flex items-center justify-between w-full mt-4 bg-bg-soft p-4 rounded-2xl">
                <span className="text-3xl font-black text-primary">{selectedProduct.price.toFixed(2)} <span className="text-sm">{currency}</span></span>
                <button 
                  onClick={() => {
                    addToCart(selectedProduct.id);
                    setSelectedProduct(null);
                  }}
                  className="bg-primary text-white px-6 py-3 rounded-xl font-bold hover:opacity-90 active:scale-95 transition-all shadow-lg shadow-primary/20 flex items-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  <span>{language === 'en' ? 'Add' : 'ጨምር'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Order Status Overlays */}
      {isOrdering && (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white/90 backdrop-blur-md animate-in fade-in duration-300">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
            <Leaf className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-primary animate-pulse" />
          </div>
          <p className="mt-6 text-xl font-black text-primary animate-bounce">{t('orderProcessing')}</p>
        </div>
      )}

      {orderSuccess && (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white animate-in zoom-in duration-300">
          <div className="bg-primary/10 p-8 rounded-full mb-6">
            <CheckCircle className="w-24 h-24 text-primary animate-in scale-in-50 duration-500" />
          </div>
          <h3 className="text-3xl font-black text-text-dark mb-2 text-center px-6">{t('orderSuccess')}</h3>
          <p className="text-gray-500 text-center px-12 mb-8">{t('orderThankYou')}</p>
          <button 
            onClick={() => setOrderSuccess(false)}
            className="bg-primary text-white px-10 py-4 rounded-2xl font-bold shadow-lg shadow-primary/20 active:scale-95 transition-all"
          >
            {language === 'en' ? 'Continue Shopping' : 'ግብይት ይቀጥሉ'}
          </button>
        </div>
      )}

      {/* Cart Modal */}
      {isCartOpen && (
        <div className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center p-4">
          <div 
            className="absolute inset-0 bg-text-dark/40 backdrop-blur-sm" 
            onClick={() => setIsCartOpen(false)}
          />
          <div className="relative w-full max-w-lg bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom duration-300">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-xl font-bold text-text-dark">{t('currentCart')}</h3>
              <button 
                onClick={() => setIsCartOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 max-h-[60vh] overflow-y-auto">
              {cart.length === 0 ? (
                <div className="py-12 text-center">
                  <div className="bg-bg-soft w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ShoppingCart className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-500 font-medium">{t('emptyCart')}</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {cart.map((item) => {
                    const product = productsData.find((p) => p.id === item.id)!;
                    return (
                      <div key={item.id} className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-bg-soft rounded-xl flex items-center justify-center text-2xl">
                          {product.image}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-text-dark">
                            {language === 'en' ? product.en : product.am}
                          </h4>
                          <p className="text-primary text-sm">{product.price.toFixed(2)} {currency}</p>
                        </div>
                        <div className="flex items-center gap-3 bg-bg-soft p-1 rounded-lg">
                          <button 
                            onClick={() => removeFromCart(item.id)}
                            className="p-1 hover:bg-white rounded-md transition-colors"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="font-bold text-sm min-w-[20px] text-center">{item.quantity}</span>
                          <button 
                            onClick={() => addToCart(item.id)}
                            className="p-1 hover:bg-white rounded-md transition-colors"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="p-6 bg-bg-soft">
              <div className="flex items-center justify-between mb-6">
                <span className="text-gray-500 font-medium">{t('totalAmount')}</span>
                <span className="text-2xl font-black text-text-dark">{cartTotal.toFixed(2)} {currency}</span>
              </div>
              <button 
                onClick={handleConfirmOrder}
                className="w-full bg-primary text-white py-4 rounded-2xl font-bold shadow-lg shadow-primary/20 hover:opacity-95 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100"
                disabled={cart.length === 0}
              >
                {t('confirmOrder')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


