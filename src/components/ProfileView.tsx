"use client";
import React, { useState } from "react";
import { useProfile } from "@/context/ProfileContext";
import { useActionEngagement } from "@/context/ActionEngagementContext";
import { motion } from "framer-motion";
import ProgressDashboard from "./ProgressDashboard";

export default function ProfileView() {
  const { profile, isLoading, isNewUser, updateProfile, addInterest, removeInterest, resetProfile, exportProfileData, importProfileData } = useProfile();
  const { engagementData } = useActionEngagement();
  const [activeTab, setActiveTab] = useState<'profile' | 'progress'>('profile');
  const [editName, setEditName] = useState(profile?.name || "");
  const [editLocation, setEditLocation] = useState(profile?.location || "");
  const [interestInput, setInterestInput] = useState("");
  const [importData, setImportData] = useState("");
  const [importError, setImportError] = useState("");

  if (isLoading) return <div className="p-8 text-center text-grayText">Loading profile...</div>;

  const renderContent = () => {
    if (activeTab === 'progress') {
      return <ProgressDashboard />;
    }

    return (
      <div className="w-full max-w-2xl mx-auto py-8 px-2 md:px-0">
        <div className="bg-card rounded-card shadow-card border border-grayBorder p-8 mb-8">
          <h2 className="text-2xl font-bold mb-4">Your Profile</h2>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              className="w-full rounded-xl border border-grayBorder px-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-primary transition placeholder:text-grayText bg-graySoft"
              value={editName}
              onChange={e => setEditName(e.target.value)}
              onBlur={() => updateProfile({ name: editName })}
              placeholder="Enter your name"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Location</label>
            <input
              className="w-full rounded-xl border border-grayBorder px-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-primary transition placeholder:text-grayText bg-graySoft"
              value={editLocation}
              onChange={e => setEditLocation(e.target.value)}
              onBlur={() => updateProfile({ location: editLocation })}
              placeholder="Enter your location"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Interests</label>
            <div className="flex gap-2 mb-2">
              <input
                className="flex-1 rounded-xl border border-grayBorder px-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-primary transition placeholder:text-grayText bg-graySoft"
                value={interestInput}
                onChange={e => setInterestInput(e.target.value)}
                placeholder="Add an interest"
                onKeyDown={e => {
                  if (e.key === 'Enter' && interestInput.trim()) {
                    addInterest(interestInput.trim());
                    setInterestInput("");
                  }
                }}
              />
              <button
                className="px-4 py-2 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-colors"
                onClick={() => {
                  if (interestInput.trim()) {
                    addInterest(interestInput.trim());
                    setInterestInput("");
                  }
                }}
                type="button"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {profile?.interests.map((interest) => (
                <motion.div key={interest} whileHover={{ scale: 1.05 }}>
                  <div className="flex items-center gap-1 px-3 py-1 rounded-pill bg-graySoft text-xs text-grayText font-medium">
                    {interest}
                    <button className="ml-1 text-primary" onClick={() => removeInterest(interest)} type="button">×</button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Contribution Stats</label>
            <div className="flex gap-6 mt-2">
              <div className="flex flex-col items-center">
                <span className="text-lg font-bold">{profile?.contribution_stats?.actions_completed || 0}</span>
                <span className="text-xs text-grayText">Actions</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-lg font-bold">{profile?.contribution_stats?.policies_viewed || 0}</span>
                <span className="text-xs text-grayText">Policies</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-lg font-bold">{profile?.contribution_stats?.organizations_supported || 0}</span>
                <span className="text-xs text-grayText">Organizations</span>
              </div>
            </div>
          </div>
          <div className="flex gap-4 mt-6">
            <button className="px-4 py-2 bg-graySoft text-text rounded-xl font-medium hover:bg-grayBorder transition-colors" onClick={resetProfile} type="button">Reset Profile</button>
            <button className="px-4 py-2 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-colors" onClick={() => {
              const data = exportProfileData();
              navigator.clipboard.writeText(data);
              alert('Profile data copied to clipboard!');
            }} type="button">Export</button>
          </div>
        </div>

        {/* Import profile data */}
        <div className="bg-card rounded-card shadow-card border border-grayBorder p-8">
          <h3 className="text-lg font-bold mb-2">Import Profile Data</h3>
          <textarea
            className="w-full rounded-xl border border-grayBorder px-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-primary transition placeholder:text-grayText bg-graySoft mb-2"
            rows={3}
            value={importData}
            onChange={e => setImportData(e.target.value)}
            placeholder="Paste exported profile JSON here"
          />
          {importError && <div className="text-red-600 text-sm mb-2">{importError}</div>}
          <button
            className="px-4 py-2 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-colors"
            onClick={() => {
              const ok = importProfileData(importData);
              if (!ok) setImportError("Invalid profile data");
              else setImportError("");
            }}
            type="button"
          >
            Import
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full min-h-screen bg-gray-50">
      {/* Tab Navigation */}
      <div className="sticky top-0 bg-white border-b border-grayBorder z-10">
        <div className="w-full max-w-2xl mx-auto px-2 md:px-0">
          <div className="flex">
            <button
              className={`px-6 py-4 font-medium border-b-2 transition-colors ${
                activeTab === 'profile'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-grayText hover:text-text'
              }`}
              onClick={() => setActiveTab('profile')}
            >
              Profile
            </button>
            <button
              className={`px-6 py-4 font-medium border-b-2 transition-colors ${
                activeTab === 'progress'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-grayText hover:text-text'
              }`}
              onClick={() => setActiveTab('progress')}
            >
              Progress & Impact
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      {renderContent()}
    </div>
  );
}
