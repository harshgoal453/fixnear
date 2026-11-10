import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Create a TanStack Query Client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 1000 * 60 * 5 // 5 minutes cache
    }
  }
});

// Lazy-Loaded Bulk Page Components
const Home = lazy(() => import('./pages/Home'));
const ServiceCatalog = lazy(() => import('./pages/ServiceCatalog'));
const TechnicianProfile = lazy(() => import('./pages/TechnicianProfile'));
const CustomerDashboard = lazy(() => import('./pages/CustomerDashboard'));
const ProviderDashboard = lazy(() => import('./pages/ProviderDashboard'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const Login = lazy(() => import('./pages/Login'));

// Loading Suspense Fallback
function PageLoader() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] text-slate-400 text-xs font-semibold space-y-3">
      <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      <span>Loading FixNear Component...</span>
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-indigo-600 selection:text-white">
          <Navbar />
          <main className="flex-1">
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/services" element={<ServiceCatalog />} />
                <Route path="/technician/:id" element={<TechnicianProfile />} />
                <Route path="/customer/bookings" element={<CustomerDashboard />} />
                <Route path="/provider/dashboard" element={<ProviderDashboard />} />
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/login" element={<Login />} />
              </Routes>
            </Suspense>
          </main>
          <Footer />
        </div>
      </Router>
    </QueryClientProvider>
  );
}
