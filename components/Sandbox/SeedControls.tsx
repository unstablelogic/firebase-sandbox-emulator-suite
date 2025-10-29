'use client';

import { useState } from 'react';
import { Card } from '@/components/shared/Card';
import { Button } from '@/components/shared/Button';

interface SeedModule {
  name: string;
  label: string;
  description: string;
  icon: string;
}

const seedModules: SeedModule[] = [
  {
    name: 'users',
    label: 'Users',
    description: 'User profiles with roles and preferences',
    icon: '👥'
  },
  {
    name: 'products',
    label: 'Products',
    description: 'Product catalog with inventory management',
    icon: '🛍️'
  },
  {
    name: 'orders',
    label: 'Orders',
    description: 'Order lifecycle with status tracking',
    icon: '📦'
  },
  {
    name: 'config',
    label: 'Config',
    description: 'Application configuration and settings',
    icon: '⚙️'
  }
];

export default function SeedControls() {
  const [seedOptions, setSeedOptions] = useState({
    clear: false,
    count: 10
  });
  const [loading, setLoading] = useState<string | null>(null);
  const [results, setResults] = useState<any[]>([]);

  const handleSeedModule = async (moduleName: string) => {
    setLoading(moduleName);
    try {
      const response = await fetch('/api/sandbox/seed', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          module: moduleName,
          options: seedOptions
        }),
      });

      const result = await response.json();
      setResults(prev => [...prev, result]);
    } catch (error) {
      console.error('Failed to seed module:', error);
      setResults(prev => [...prev, {
        module: moduleName,
        success: false,
        error: 'Failed to seed module'
      }]);
    } finally {
      setLoading(null);
    }
  };

  const handleSeedAll = async () => {
    setLoading('all');
    try {
      const response = await fetch('/api/sandbox/seed', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          module: 'all',
          options: seedOptions
        }),
      });

      const result = await response.json();
      setResults(prev => [...prev, ...result]);
    } catch (error) {
      console.error('Failed to seed all modules:', error);
    } finally {
      setLoading(null);
    }
  };

  const clearResults = () => {
    setResults([]);
  };

  return (
    <div className="space-y-6">
      {/* Options Panel */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">🌱 Seeding Options</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={seedOptions.clear}
                onChange={(e) => setSeedOptions(prev => ({ ...prev, clear: e.target.checked }))}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-700">Clear existing data</span>
            </label>
            <p className="text-xs text-gray-500 mt-1">Remove all documents before seeding</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Document count
            </label>
            <input
              type="number"
              min="1"
              max="1000"
              value={seedOptions.count}
              onChange={(e) => setSeedOptions(prev => ({ ...prev, count: parseInt(e.target.value) || 10 }))}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </Card>

      {/* Module Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {seedModules.map((module) => (
          <Card key={module.name} className="p-4 hover:shadow-md transition-shadow">
            <div className="text-center">
              <div className="text-3xl mb-2">{module.icon}</div>
              <h4 className="font-semibold text-gray-900 mb-1">{module.label}</h4>
              <p className="text-sm text-gray-600 mb-4">{module.description}</p>
              <Button
                onClick={() => handleSeedModule(module.name)}
                loading={loading === module.name}
                disabled={loading !== null}
                size="sm"
                className="w-full"
              >
                {loading === module.name ? 'Seeding...' : 'Seed Module'}
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Seed All Button */}
      <div className="text-center">
        <Button
          onClick={handleSeedAll}
          loading={loading === 'all'}
          disabled={loading !== null}
          variant="primary"
          size="lg"
        >
          🌱 Seed All Modules
        </Button>
      </div>

      {/* Results */}
      {results.length > 0 && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">📊 Seeding Results</h3>
            <Button onClick={clearResults} variant="ghost" size="sm">
              Clear Results
            </Button>
          </div>
          <div className="space-y-2">
            {results.map((result, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg ${
                  result.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className={result.success ? 'text-green-600' : 'text-red-600'}>
                      {result.success ? '✅' : '❌'}
                    </span>
                    <span className="font-medium">{result.module}</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    {result.success ? `${result.created} documents created` : result.error}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}

