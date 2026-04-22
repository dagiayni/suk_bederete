'use client';

import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Package, 
  Users, 
  Settings, 
  Bell, 
  Search, 
  Edit2, 
  Trash2, 
  Plus,
  LogOut,
  Menu,
  X,
  Languages
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import productsData from '@/data/products.json';

export default function AdminDashboard() {
  const { t, language, setLanguage } = useLanguage();
  const [products, setProducts] = useState(productsData);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [notifications] = useState(12);

  const toggleStatus = (id: number) => {
    // In a real app, this would be an API call
    setProducts(products.map(p => 
      p.id === id ? { ...p, active: !(p as any).active } : p
    ));
  };

  const deleteProduct = (id: number) => {
    if (confirm('Are you sure you want to delete this product?')) {
      setProducts(products.filter(p => p.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-bg-soft flex">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-text-dark/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-100 transform transition-transform duration-300 ease-in-out
        lg:relative lg:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-primary p-1.5 rounded-lg text-white">
              <Package className="w-5 h-5" />
            </div>
            <span className="font-black text-primary text-xl">AdminPanel</span>
          </div>
          <button className="lg:hidden" onClick={() => setIsSidebarOpen(false)}>
            <X className="w-6 h-6 text-gray-400" />
          </button>
        </div>

        <nav className="mt-6 px-4 space-y-1">
          <SidebarLink icon={<LayoutDashboard className="w-5 h-5" />} label={t('admin.dashboard')} active />
          <SidebarLink icon={<Package className="w-5 h-5" />} label={t('admin.products')} />
          <SidebarLink icon={<Users className="w-5 h-5" />} label={t('admin.customers')} />
          <SidebarLink icon={<Settings className="w-5 h-5" />} label={t('admin.settings')} />
        </nav>

        <div className="absolute bottom-0 w-full p-4 border-t border-gray-100">
          <button className="flex items-center gap-3 w-full px-4 py-3 text-red-500 font-medium hover:bg-red-50 rounded-xl transition-colors">
            <LogOut className="w-5 h-5" />
            <span>{t('admin.logout')}</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-6 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button className="lg:hidden" onClick={() => setIsSidebarOpen(true)}>
              <Menu className="w-6 h-6 text-gray-500" />
            </button>
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input 
                type="text" 
                placeholder={t('admin.search')}
                className="bg-bg-soft border-none rounded-xl pl-10 pr-4 py-2 text-sm w-64 focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => setLanguage(language === 'en' ? 'am' : 'en')}
              className="flex items-center gap-2 px-3 py-1.5 bg-bg-soft hover:bg-gray-100 rounded-full transition-colors text-xs font-bold text-text-dark"
            >
              <Languages className="w-4 h-4 text-primary" />
              <span>{language === 'en' ? 'Amharic' : 'English'}</span>
            </button>

            <button className="relative p-2 text-gray-500 hover:bg-bg-soft rounded-full transition-colors">
              <Bell className="w-6 h-6" />
              {notifications > 0 && (
                <span className="absolute top-1.5 right-1.5 bg-secondary text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full ring-2 ring-white">
                  {notifications}
                </span>
              )}
            </button>
            <div className="flex items-center gap-3 border-l border-gray-100 pl-4">
              <div className="w-8 h-8 bg-primary/10 text-primary rounded-full flex items-center justify-center font-bold text-xs">
                JD
              </div>
              <span className="hidden sm:inline text-sm font-bold text-text-dark">John Doe</span>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="p-6 overflow-x-hidden">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-black text-text-dark">{t('admin.inventory')}</h2>
              <p className="text-gray-500 text-sm">{t('admin.manageStock')}</p>
            </div>
            <button className="bg-primary text-white px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:opacity-90 active:scale-95 transition-all shadow-lg shadow-primary/10">
              <Plus className="w-5 h-5" />
              <span className="hidden sm:inline">{t('admin.addProduct')}</span>
            </button>
          </div>

          {/* Product Table Card */}
          <div className="bg-white rounded-2xl shadow-soft border border-gray-50 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-bg-soft/50">
                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-gray-400">{t('admin.product')}</th>
                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-gray-400">{t('admin.price')}</th>
                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-gray-400">Category</th>
                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-gray-400">{t('admin.status')}</th>
                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-gray-400 text-right">{t('admin.actions')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {products.map((product) => (
                    <tr key={product.id} className="hover:bg-bg-soft/30 transition-colors">
                      <td className="px-6 py-4 flex items-center gap-3">
                        <span className="text-xl">{product.image}</span>
                        <span className="font-bold text-text-dark">{language === 'en' ? product.en : product.am}</span>
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-600">{product.price.toFixed(2)} {language === 'en' ? 'ETB' : 'ብር'}</td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 bg-bg-soft rounded-md text-[10px] font-bold uppercase text-primary">
                          {t(`categories.${product.category}`)}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <button 
                          onClick={() => toggleStatus(product.id)}
                          className={`
                            relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none
                            ${(product as any).active !== false ? 'bg-primary' : 'bg-gray-200'}
                          `}
                        >
                          <span className={`
                            inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                            ${(product as any).active !== false ? 'translate-x-6' : 'translate-x-1'}
                          `} />
                        </button>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button className="p-2 text-gray-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-all">
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => deleteProduct(product.id)}
                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}


function SidebarLink({ icon, label, active = false }: { icon: React.ReactNode, label: string, active?: boolean }) {
  return (
    <button className={`
      flex items-center gap-3 w-full px-4 py-3 rounded-xl font-bold transition-all
      ${active ? 'bg-primary/10 text-primary' : 'text-gray-500 hover:bg-bg-soft hover:text-text-dark'}
    `}>
      {icon}
      <span>{label}</span>
    </button>
  );
}

