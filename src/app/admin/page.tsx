import React from "react";
import AdminDashboard from "@/components/AdminDashboard";
import { ProfileProvider } from "@/context/SafeProfileContext";

export default function AdminPage() {
  return (
    <ProfileProvider>
      <div className="min-h-screen bg-background">
        <AdminDashboard />
      </div>
    </ProfileProvider>
  );
}
