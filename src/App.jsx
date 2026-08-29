import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import React, { useEffect } from 'react';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import WhyTanush from './pages/WhyTanush';
import BecomePartner from './pages/BecomePartner';
import Contact from './pages/Contact';
import Account from './pages/Account';
import NotFound from './pages/NotFound';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import CartDrawer from './components/CartDrawer/CartDrawer';
import { AdminAuthProvider } from './context/AdminAuthContext';
import { CartProvider } from './context/CartContext';
import { BrandProvider } from './context/BrandContext';
import AdminRoute from './components/Admin/AdminRoute';
import AdminLayout from './components/Admin/AdminLayout';
import AdminLogin from './pages/Admin/AdminLogin';
import AdminDashboard from './pages/Admin/AdminDashboard';
import ProductManager from './pages/Admin/ProductManager';
import CategoryManager from './pages/Admin/CategoryManager';
import HomepageManager from './pages/Admin/HomepageManager';
import HeroManager from './pages/Admin/HeroManager';
import NavigationManager from './pages/Admin/NavigationManager';
import PagesManager from './pages/Admin/PagesManager';
import StoriesManager from './pages/Admin/StoriesManager';
import JourneyManager from './pages/Admin/JourneyManager';
import TestimonialsManager from './pages/Admin/TestimonialsManager';
import MediaLibrary from './pages/Admin/MediaLibrary';
import OrdersManager from './pages/Admin/OrdersManager';
import SettingsManager from './pages/Admin/SettingsManager';
import Diagnostics from './pages/Admin/Diagnostics';
import AuditLog from './pages/Admin/AuditLog';
import NotificationsManager from './pages/Admin/NotificationsManager';
import Customers from './pages/Admin/Customers';
import ProductAnalytics from './pages/Admin/ProductAnalytics';
import CustomerAnalytics from './pages/Admin/CustomerAnalytics';
import SeEeOsEgo from './pages/Admin/SeEeOsEgo';
import PartnershipSectionManager from './pages/Admin/PartnershipSectionManager';
import IllustrationsManager from './pages/Admin/IllustrationsManager';

function App() {
  const ScrollToTop = () => {
    const { pathname } = useLocation();
    useEffect(() => {
      window.scrollTo(0, 0);
    }, [pathname]);
    return null;
  };

  return (
    <BrandProvider>
      <AdminAuthProvider>
        <CartProvider>
          <Router>
            <ScrollToTop />
            <Routes>
              {/* Admin Routes */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin" element={<AdminRoute />}>
                <Route element={<AdminLayout />}>
                  <Route index element={<Navigate to="/admin/dashboard" replace />} />
                  <Route path="dashboard" element={<AdminDashboard />} />
                  <Route path="products" element={<ProductManager />} />
                  <Route path="categories" element={<CategoryManager />} />
                  <Route path="customers" element={<Customers />} />
                  <Route path="product-analytics" element={<ProductAnalytics />} />
                  <Route path="customer-analytics" element={<CustomerAnalytics />} />
                  <Route path="se-ee-os-ego" element={<SeEeOsEgo />} />
                  <Route path="seo" element={<SeEeOsEgo />} />
                  <Route path="homepage" element={<HomepageManager />} />
                  <Route path="hero" element={<HeroManager />} />
                  <Route path="illustrations" element={<Navigate to="/admin/pages" replace />} />
                  <Route path="navigation" element={<NavigationManager />} />
                  <Route path="pages" element={<PagesManager />} />
                  <Route path="stories" element={<StoriesManager />} />
                  <Route path="journey" element={<JourneyManager />} />
                  <Route path="testimonials" element={<TestimonialsManager />} />
                  <Route path="media" element={<MediaLibrary />} />
                  <Route path="orders" element={<OrdersManager />} />
                  <Route path="settings" element={<SettingsManager />} />
                  <Route path="sections/partnerships" element={<PartnershipSectionManager />} />
                  <Route path="partnerships" element={<Navigate to="/admin/sections/partnerships" replace />} />
                  <Route path="diagnostics" element={<Diagnostics />} />
                  <Route path="audit" element={<AuditLog />} />
                  <Route path="notifications" element={<NotificationsManager />} />
                </Route>
              </Route>


              {/* Public Routes */}
              <Route path="*" element={<>
                <a href="#main-content" className="skip-to-main">Skip to main content</a>
                <Header />
                <main id="main-content">
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/shop" element={<Shop />} />
                    <Route path="/product/:slug" element={<ProductDetail />} />
                    <Route path="/why-tanush" element={<WhyTanush />} />
                    <Route path="/become-a-partner" element={<BecomePartner />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/account" element={<Account />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </main>
                <Footer />
                <CartDrawer />
              </>} />
            </Routes>
          </Router>
        </CartProvider>
      </AdminAuthProvider>
    </BrandProvider>
  );
}

export default App;
