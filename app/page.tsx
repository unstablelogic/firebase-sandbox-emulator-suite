import Link from 'next/link';
import { Card } from '@/components/shared/Card';
import { Button } from '@/components/shared/Button';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Firebase Sandbox Emulator Suite
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Plug-and-play Firebase sandbox toolkit: emulators, modular seeding, 
            schema sync + diff, CI guard, web admin panel, and scenario runner.
          </p>
        </div>

        {/* Quick Start */}
        <div className="max-w-4xl mx-auto mb-12">
          <Card className="p-8">
            <h2 className="text-2xl font-semibold mb-4">🚀 Quick Start</h2>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">1</span>
                <code className="bg-gray-100 px-3 py-1 rounded text-sm">npm install</code>
              </div>
              <div className="flex items-center space-x-4">
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">2</span>
                <code className="bg-gray-100 px-3 py-1 rounded text-sm">cp .env.sandbox.example .env.local</code>
              </div>
              <div className="flex items-center space-x-4">
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">3</span>
                <code className="bg-gray-100 px-3 py-1 rounded text-sm">npm run sandbox:test</code>
              </div>
            </div>
          </Card>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <Card className="p-6">
            <div className="text-3xl mb-3">🔥</div>
            <h3 className="text-xl font-semibold mb-2">Firebase Emulators</h3>
            <p className="text-gray-600 mb-4">
              Complete Firebase emulator suite with Firestore, Auth, Functions, and Hosting.
            </p>
            <ul className="text-sm text-gray-500 space-y-1">
              <li>• Firestore Emulator</li>
              <li>• Authentication Emulator</li>
              <li>• Cloud Functions Emulator</li>
              <li>• Hosting Emulator</li>
            </ul>
          </Card>

          <Card className="p-6">
            <div className="text-3xl mb-3">🌱</div>
            <h3 className="text-xl font-semibold mb-2">Modular Seeding</h3>
            <p className="text-gray-600 mb-4">
              Hybrid seeding system using Faker.js and JSON templates for realistic test data.
            </p>
            <ul className="text-sm text-gray-500 space-y-1">
              <li>• Faker.js integration</li>
              <li>• JSON templates</li>
              <li>• Modular architecture</li>
              <li>• CLI tools</li>
            </ul>
          </Card>

          <Card className="p-6">
            <div className="text-3xl mb-3">🔄</div>
            <h3 className="text-xl font-semibold mb-2">Schema Sync</h3>
            <p className="text-gray-600 mb-4">
              Export, import, and diff Firestore rules and indexes between environments.
            </p>
            <ul className="text-sm text-gray-500 space-y-1">
              <li>• Export from production</li>
              <li>• Import to local</li>
              <li>• Diff comparison</li>
              <li>• CI integration</li>
            </ul>
          </Card>

          <Card className="p-6">
            <div className="text-3xl mb-3">🛡️</div>
            <h3 className="text-xl font-semibold mb-2">CI Guard</h3>
            <p className="text-gray-600 mb-4">
              Automated deployment guard that blocks releases on schema mismatches.
            </p>
            <ul className="text-sm text-gray-500 space-y-1">
              <li>• Pre-deploy validation</li>
              <li>• Schema drift detection</li>
              <li>• Force override option</li>
              <li>• Webhook notifications</li>
            </ul>
          </Card>

          <Card className="p-6">
            <div className="text-3xl mb-3">🎛️</div>
            <h3 className="text-xl font-semibold mb-2">Admin Panel</h3>
            <p className="text-gray-600 mb-4">
              Web-based interface for managing emulator data and testing functions.
            </p>
            <ul className="text-sm text-gray-500 space-y-1">
              <li>• Collection viewer</li>
              <li>• Seed controls</li>
              <li>• Function triggers</li>
              <li>• Console logs</li>
            </ul>
          </Card>

          <Card className="p-6">
            <div className="text-3xl mb-3">🎯</div>
            <h3 className="text-xl font-semibold mb-2">Scenarios</h3>
            <p className="text-gray-600 mb-4">
              Automation scenarios for testing real-world workflows and performance.
            </p>
            <ul className="text-sm text-gray-500 space-y-1">
              <li>• User signup flow</li>
              <li>• Order processing</li>
              <li>• Stress testing</li>
              <li>• Performance metrics</li>
            </ul>
          </Card>
        </div>

        {/* Actions */}
        <div className="text-center">
          <div className="space-x-4">
            <Link href="/sandbox">
              <Button variant="primary" size="lg">
                🎛️ Open Sandbox Panel
              </Button>
            </Link>
            <Button variant="secondary" size="lg" onClick={() => window.open('http://localhost:4000', '_blank')}>
              🔥 Emulator UI
            </Button>
          </div>
        </div>

        {/* Documentation Links */}
        <div className="mt-12 text-center">
          <h3 className="text-lg font-semibold mb-4">📚 Documentation</h3>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="/docs/GETTING_STARTED.md" className="text-blue-600 hover:text-blue-800">
              Getting Started
            </a>
            <a href="/docs/SANDBOX_ADMIN_PANEL.md" className="text-blue-600 hover:text-blue-800">
              Admin Panel
            </a>
            <a href="/docs/SCHEMA_SYNC_AND_CI.md" className="text-blue-600 hover:text-blue-800">
              Schema Sync
            </a>
            <a href="/docs/SEEDING_AND_SCENARIOS.md" className="text-blue-600 hover:text-blue-800">
              Seeding & Scenarios
            </a>
            <a href="/docs/TROUBLESHOOTING.md" className="text-blue-600 hover:text-blue-800">
              Troubleshooting
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

