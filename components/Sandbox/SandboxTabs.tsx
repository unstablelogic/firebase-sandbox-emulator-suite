'use client';

import { cn } from '@/lib/utils';

interface Tab {
  id: string;
  label: string;
  icon: string;
}

const tabs: Tab[] = [
  { id: 'collections', label: 'Collections', icon: '📄' },
  { id: 'seeding', label: 'Seeding', icon: '🌱' },
  { id: 'functions', label: 'Functions', icon: '⚡' },
  { id: 'console', label: 'Console', icon: '📺' }
];

interface SandboxTabsProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export default function SandboxTabs({ activeTab, onTabChange }: SandboxTabsProps) {
  return (
    <div className="border-b border-gray-200">
      <nav className="-mb-px flex space-x-8">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              'whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm transition-colors',
              activeTab === tab.id
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            )}
          >
            <span className="mr-2">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </nav>
    </div>
  );
}

