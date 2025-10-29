'use client';

import { useState, useEffect } from 'react';

export default function EnvironmentBanner() {
  const [isEmulatorMode, setIsEmulatorMode] = useState(false);

  useEffect(() => {
    const emulatorMode = process.env.NEXT_PUBLIC_FIREBASE_EMULATOR === 'true';
    setIsEmulatorMode(emulatorMode);
  }, []);

  if (!isEmulatorMode) {
    return null;
  }

  return (
    <div className="bg-orange-100 border-b border-orange-200 px-4 py-2">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-orange-800 font-medium">🔥 EMULATOR MODE</span>
          <span className="text-orange-600 text-sm">
            Connected to Firebase Emulator Suite
          </span>
        </div>
        <div className="text-orange-600 text-sm">
          <span className="font-medium">Ports:</span> Firestore:8080, Auth:9099, Functions:5001, UI:4000
        </div>
      </div>
    </div>
  );
}

