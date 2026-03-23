import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom'
import App from './App.tsx'
import PrivateCleaningPage from './pages/PrivateCleaningPage.tsx'
import FlytterengoringPage from './pages/FlytterengoringPage.tsx'
import BookFlytterengoringPage from './pages/BookFlytterengoringPage.tsx'
import CommercialCleaningPage from './pages/CommercialCleaningPage.tsx'
import BookPrivateCleaningPage from './pages/BookPrivateCleaningPage.tsx'
import ExtraServicesPage from './pages/ExtraServicesPage.tsx'
import FAQPage from './pages/FAQPage.tsx'
import ServiceIncludedPage from './pages/ServiceIncludedPage.tsx'
import PricingPage from './pages/PricingPage.tsx'
import HowItWorksPage from './pages/HowItWorksPage.tsx'
import BookingHubPage from './pages/BookingHubPage.tsx'
import AdminRoutesPage from './pages/AdminRoutesPage.tsx'
import './styles/globals.css'

const routeMap: Record<string, string> = {
  'home': '/',
  'private-cleaning': '/private-cleaning',
  'flytterengoring': '/flytterengoring',
  'book-flytterengoring': '/book-flytterengoring',
  'erhverv': '/erhverv',
  'book-private': '/book-private',
  'extra-services': '/extra-services',
  'faq': '/faq',
  'service-included': '/service-included',
  'pricing': '/pricing',
  'how-it-works': '/how-it-works',
  'booking-hub': '/booking-hub',
};

// Wrapper to pass navigateTo helper to legacy page components
function PageWrapper({ Component }: { Component: React.ComponentType<{ onNavigate: (page: string) => void }> }) {
  const navigate = useNavigate();
  const onNavigate = (page: string) => {
    navigate(routeMap[page] || '/');
    window.scrollTo(0, 0);
  };
  return <Component onNavigate={onNavigate} />;
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/private-cleaning" element={<PageWrapper Component={PrivateCleaningPage} />} />
        <Route path="/flytterengoring" element={<PageWrapper Component={FlytterengoringPage} />} />
        <Route path="/book-flytterengoring" element={<PageWrapper Component={BookFlytterengoringPage} />} />
        <Route path="/erhverv" element={<PageWrapper Component={CommercialCleaningPage} />} />
        <Route path="/book-private" element={<PageWrapper Component={BookPrivateCleaningPage} />} />
        <Route path="/extra-services" element={<PageWrapper Component={ExtraServicesPage} />} />
        <Route path="/faq" element={<PageWrapper Component={FAQPage} />} />
        <Route path="/service-included" element={<PageWrapper Component={ServiceIncludedPage} />} />
        <Route path="/pricing" element={<PageWrapper Component={PricingPage} />} />
        <Route path="/how-it-works" element={<PageWrapper Component={HowItWorksPage} />} />
        <Route path="/booking-hub" element={<PageWrapper Component={BookingHubPage} />} />
        <Route path="/admin/routes" element={<AdminRoutesPage />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)
