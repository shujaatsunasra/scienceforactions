import React from "react";
import ReliableActionTool from "@/components/ReliableActionTool";
import { ProfileProvider } from "@/context/SafeProfileContext";

export default function ToolPage() {
  return (
    <ProfileProvider>
      <div className="flex w-full min-h-screen">
        <main className="flex-1 flex flex-col items-center justify-center bg-background p-4 md:p-12 pt-16 pb-20 md:pt-0 md:pb-0">
          <div className="w-full max-w-4xl">
            <ReliableActionTool 
              title="Civic Action Tool"
              description="Choose an action type and get a personalized template to make your voice heard on important issues."
              tags={['civic-engagement', 'personalized', 'action-ready']}
            />
          </div>
        </main>
      </div>
    </ProfileProvider>
  );
}
