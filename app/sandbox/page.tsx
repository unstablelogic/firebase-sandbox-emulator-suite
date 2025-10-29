'use client';

import { useState, useEffect } from 'react';
import SandboxTabs from '@/components/Sandbox/SandboxTabs';
import CollectionViewer from '@/components/Sandbox/CollectionViewer';
import SeedControls from '@/components/Sandbox/SeedControls';
import FunctionTriggerPanel from '@/components/Sandbox/FunctionTriggerPanel';
import ConsolePane from '@/components/Sandbox/ConsolePane';

export default function SandboxPage() {
  const [activeTab, setActiveTab] = useState('collections');
  const [isEmulatorMode, setIsEmulatorMode] = useState(false);

  useEffect(() => {
    // Check if running in emulator mode
    const emulatorMode = process.env.NEXT_PUBLIC_FIREBASE_EMULATOR === 'true';
    setIsEmulatorMode(emulatorMode);
  }, []);

  // Show warning if not in emulator mode
  if (!isEmulatorMode) {
    return (
      <div className="min-h-screen bg-red-50 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center p-8">
          <div className="text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-red-800 mb-4">
            Not in Emulator Mode
          </h1>
          <p className="text-red-600 mb-6">
            The sandbox panel is only available when running in Firebase emulator mode.
          </p>
          <div className="bg-red-100 p-4 rounded-lg text-left">
            <p className="text-sm text-red-800 mb-2">
              To enable emulator mode:
            </p>
            <ol className="text-sm text-red-700 list-decimal list-inside space-y-1">
              <li>Set <code className="bg-red-200 px-1 rounded">NEXT_PUBLIC_FIREBASE_EMULATOR=true</code> in your <code className="bg-red-200 px-1 rounded">.env.local</code></li>
              <li>Start emulators: <code className="bg-red-200 px-1 rounded">npm run sandbox:start</code></li>
              <li>Refresh this page</li>
            </ol>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🎛️ Sandbox Admin Panel
          </h1>
          <p className="text-gray-600">
            Manage your Firebase emulator data and test Cloud Functions
          </p>
        </div>

        {/* Tabs */}
        <SandboxTabs activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Tab Content */}
        <div className="mt-6">
          {activeTab === 'collections' && <CollectionViewer />}
          {activeTab === 'seeding' && <SeedControls />}
          {activeTab === 'functions' && <FunctionTriggerPanel />}
          {activeTab === 'console' && <ConsolePane />}
        </div>
      </div>
    </div>
  );
}

