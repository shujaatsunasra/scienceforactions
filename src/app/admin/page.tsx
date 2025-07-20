import React from "react";
import type { Metadata } from "next";
import AdminDashboard from "@/components/AdminDashboard";
import { ProfileProvider } from "@/context/SafeProfileContext";
import { generateMetadata as generateSEOMetadata } from '@/lib/seo';

export const metadata: Metadata = generateSEOMetadata('admin');

export default function AdminPage() {
  return (
    <ProfileProvider>
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-text mb-4">
              Admin Dashboard
            </h1>
            <p className="text-grayText">
              Administrative dashboard for Science for Action platform management.
            </p>
          </header>
          <AdminDashboard />
        </div>
      </div>
    </ProfileProvider>
  );
}
