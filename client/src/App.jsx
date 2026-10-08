import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import {
  PublicOnly,
  RequireAuth,
  RequireApproved,
  RequireAdmin,
} from './components/auth/RouteGuards.jsx';

// Layout Routes
import PublicLayout from './components/layout/PublicLayout.jsx';
import StudentLayout from './components/layout/StudentLayout.jsx';
import AdminLayout from './components/layout/AdminLayout.jsx';

// Pages
import LandingPage from './pages/LandingPage.jsx';
import HowItWorksPage from './pages/HowItWorksPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import SignupPage from './pages/SignupPage.jsx';
import VerificationPage from './pages/VerificationPage.jsx';
import BrowsePage from './pages/BrowsePage.jsx';
import ItemDetailPage from './pages/ItemDetailPage.jsx';
import ReportItemPage from './pages/ReportItemPage.jsx';
import MyItemsPage from './pages/MyItemsPage.jsx';
import ClaimsPage from './pages/ClaimsPage.jsx';
import NotificationsPage from './pages/NotificationsPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import AdminStatsPage from './pages/AdminStatsPage.jsx';
import AdminVerificationsPage from './pages/AdminVerificationsPage.jsx';
import AdminItemsPage from './pages/AdminItemsPage.jsx';
import AdminClaimsPage from './pages/AdminClaimsPage.jsx';
import AdminUsersPage from './pages/AdminUsersPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';
import DevIndexPage from './pages/DevIndexPage.jsx';

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* TEMPORARY DEV REVIEW INDEX (Marked clearly for removal before production wiring) */}
        <Route path="/dev" element={<DevIndexPage />} />

        {/* PUBLIC LAYOUT */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/how-it-works" element={<HowItWorksPage />} />
        </Route>

        {/* PUBLIC ONLY AUTH PAGES (Redirect if authenticated) */}
        <Route element={<PublicOnly />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
        </Route>

        {/* VERIFICATION DOCKET (Requires authentication, accessible to pending & rejected users) */}
        <Route element={<RequireAuth />}>
          <Route path="/verification" element={<VerificationPage />} />
        </Route>

        {/* STUDENT WORKSPACE (Requires Approved Student status, includes mobile bottom bar) */}
        <Route element={<RequireApproved />}>
          <Route element={<StudentLayout />}>
            <Route path="/browse" element={<BrowsePage />} />
            {/* Rule 1: Declare "/items/new" before "/items/:id" */}
            <Route path="/items/new" element={<ReportItemPage />} />
            <Route path="/report" element={<Navigate to="/items/new" replace />} />
            <Route path="/items/:id" element={<ItemDetailPage />} />
            <Route path="/items/:id/claims" element={<ClaimsPage />} />
            <Route path="/items/:id/edit" element={<ReportItemPage />} />
            <Route path="/my-items" element={<MyItemsPage />} />
            <Route path="/claims" element={<ClaimsPage />} />
            <Route path="/claims/:id" element={<ClaimsPage />} />
            <Route path="/notifications" element={<NotificationsPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>
        </Route>

        {/* ADMIN WORKSPACE (Requires Admin clearance, wrapped in AdminShell layout) */}
        <Route path="/admin" element={<RequireAdmin />}>
          <Route element={<AdminLayout />}>
            <Route index element={<AdminStatsPage />} />
            <Route path="verifications" element={<AdminVerificationsPage />} />
            <Route path="items" element={<AdminItemsPage />} />
            <Route path="claims" element={<AdminClaimsPage />} />
            <Route path="users" element={<AdminUsersPage />} />
          </Route>
        </Route>

        {/* 404 LOST PROPERTY FALLBACK */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </AuthProvider>
  );
}
