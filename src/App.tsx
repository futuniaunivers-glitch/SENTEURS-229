import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { MobileBottomNav } from './components/MobileBottomNav';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { SalesConditionsModal } from './components/SalesConditionsModal';
import { NotificationToast } from './components/NotificationToast';
import { HomePage } from './pages/HomePage';
import { ProductsPage } from './pages/ProductsPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { ConditionsPage } from './pages/ConditionsPage';
import { ContactPage } from './pages/ContactPage';
import { AdminPage } from './pages/admin/AdminPage';

const AppContent: React.FC = () => {
  const {
    currentView,
    selectedProduct,
    setSelectedProduct,
    isConditionsModalOpen,
    setIsConditionsModalOpen,
  } = useApp();

  // If in admin view, render Admin layout
  if (currentView === 'admin') {
    return (
      <div className="min-h-screen bg-stone-100/60 font-sans">
        <AdminPage />
        <NotificationToast />
      </div>
    );
  }

  // Public storefront
  return (
    <div className="min-h-screen flex flex-col bg-stone-50 font-sans selection:bg-amber-100 selection:text-amber-900">
      {/* Header */}
      <Header />

      {/* Main View router */}
      <main className="flex-1">
        {currentView === 'home' && <HomePage />}
        {currentView === 'products' && <ProductsPage />}
        {currentView === 'cart' && <CartPage />}
        {currentView === 'checkout' && <CheckoutPage />}
        {currentView === 'conditions' && <ConditionsPage />}
        {currentView === 'contact' && <ContactPage />}
      </main>

      {/* Footer */}
      <Footer />

      {/* Mobile Sticky Tab Navigation */}
      <MobileBottomNav />

      {/* Global Modals & Drawers */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}

      <CartDrawer />

      <SalesConditionsModal
        isOpen={isConditionsModalOpen}
        onClose={() => setIsConditionsModalOpen(false)}
      />

      <NotificationToast />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
