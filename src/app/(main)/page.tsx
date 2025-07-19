import React from "react";
import ActionTool from "@/components/ActionTool";

export default function HomePage() {
  return (
    <div className="flex w-full min-h-screen">
      {/* Main content area for action tool flow */}
      <main className="flex-1 flex flex-col items-center justify-center bg-background p-4 md:p-12 pt-16 pb-20 md:pt-0 md:pb-0">
        {/* Action tool flow */}
        <div className="w-full max-w-4xl">
          <ActionTool />
        </div>
      </main>
    </div>
  );
}
