import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import CreateRegistry from './pages/CreateRegistry';
import ProductCatalog from './pages/ProductCatalog';
import RegistryView from './pages/RegistryView';
import ShareRegistry from './pages/ShareRegistry';
import Login from './pages/Login';
import Register from './pages/Register';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Profile from './pages/Profile';
import Dashboard from './pages/Dashboard';
import HowItWorks from './pages/HowItWorks';
import Contact from './pages/ContactUs';
import Survey from './pages/Survey';
export function App() {
  return <AuthProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route element={<ProtectedRoute />}>
            <Route path="create-registry" element={<CreateRegistry />} />
            <Route path="registry/:id" element={<RegistryView />} />
            <Route path="profile" element={<Profile />} />
            <Route path="dashboard" element={<Dashboard />} />
          </Route>
          <Route path="catalog" element={<ProductCatalog />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/share/:shareUrl" element={<ShareRegistry />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/contact" element={<Contact />} />
        </Route>
        <Route path="/survey" element={<Survey />} />
      </Routes>
    </BrowserRouter>
  </AuthProvider>;
}