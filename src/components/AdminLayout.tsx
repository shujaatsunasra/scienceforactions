"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useProfile } from '@/context/SafeProfileContext';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { profile } = useProfile();
  const [hasAdminAccess, setHasAdminAccess] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Check admin access (in real app, this would check user roles)
    const checkAdminAccess = () => {
      // For demo, allow access if user has any profile
      // In production, check actual admin roles
      if (profile) {
        setHasAdminAccess(true);
      }
      setIsChecking(false);
    };

    checkAdminAccess();
  }, [profile]);

  if (isChecking) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Checking access...</p>
        </div>
      </div>
    );
  }

  if (!hasAdminAccess) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md">
          <div className="text-6xl mb-4">🔒</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-600 mb-6">
            You don't have permission to access the admin dashboard.
          </p>
          <Link
            href="/"
            className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Return to Main App
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Admin Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">
                🛠️ Admin Dashboard
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Welcome, {profile?.name || 'Admin'}
              </span>
              <Link
                href="/"
                className="text-sm bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-md transition-colors"
              >
                Back to App
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Admin Sidebar */}
      <div className="flex">
        <nav className="w-64 bg-white shadow-sm h-[calc(100vh-4rem)] overflow-y-auto">
          <div className="p-4">
            <ul className="space-y-2">
              <li>
                <a
                  href="/admin"
                  className="block px-4 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100"
                >
                  📊 Overview
                </a>
              </li>
              <li>
                <a
                  href="/admin/users"
                  className="block px-4 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100"
                >
                  👥 User Management
                </a>
              </li>
              <li>
                <a
                  href="/admin/content"
                  className="block px-4 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100"
                >
                  📝 Content Management
                </a>
              </li>
              <li>
                <a
                  href="/admin/analytics"
                  className="block px-4 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100"
                >
                  📈 Analytics
                </a>
              </li>
              <li>
                <a
                  href="/admin/settings"
                  className="block px-4 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100"
                >
                  ⚙️ Settings
                </a>
              </li>
            </ul>
          </div>
        </nav>

        {/* Main Admin Content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
