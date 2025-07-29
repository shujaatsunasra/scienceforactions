"use client";

import React from "react";
import AdminDashboard from "@/components/AdminDashboard";
import { ProfileProvider } from "@/context/ProfileContext";
import { useAuth } from "@/context/AuthContext";

export default function AdminPage() {
  const { user, isLoading } = useAuth();

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-xl font-semibold text-gray-700">Verifying admin access...</p>
        </div>
      </div>
    );
  }

  // Access control - only admins can access this page
  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center bg-white rounded-xl shadow-lg p-8">
          <div className="mb-6">
            <svg className="mx-auto h-24 w-24 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-6">
            You don't have permission to access this admin dashboard. This area is restricted to administrators only.
          </p>
          {!user ? (
            <div className="space-y-4">
              <p className="text-sm text-gray-500">Please sign in with an admin account to continue.</p>
              <a
                href="/profile"
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
              >
                Sign In
              </a>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-gray-500">
                Signed in as: <span className="font-medium">{user.email}</span>
              </p>
              <p className="text-sm text-gray-500">Contact your system administrator to request admin access.</p>
              <a
                href="/"
                className="inline-block bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
              >
                Return to Home
              </a>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Admin user has access
  return (
    <ProfileProvider>
      <AdminDashboard />
    </ProfileProvider>
  );
}

