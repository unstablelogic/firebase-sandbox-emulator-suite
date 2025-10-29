'use client';

import { useState } from 'react';
import { Card } from '@/components/shared/Card';
import { Button } from '@/components/shared/Button';

interface FunctionInfo {
  name: string;
  description: string;
  examplePayload: any;
}

const availableFunctions: FunctionInfo[] = [
  {
    name: 'exampleHttpFunction',
    description: 'HTTP trigger example function',
    examplePayload: { name: 'John Doe', message: 'Hello from the admin panel!' }
  },
  {
    name: 'onOrderCreated',
    description: 'Firestore trigger for order creation',
    examplePayload: { orderId: 'order_123', userId: 'user_456', total: 99.99 }
  },
  {
    name: 'dailyCleanup',
    description: 'Scheduled function for daily cleanup',
    examplePayload: {}
  },
  {
    name: 'validateUser',
    description: 'User validation function',
    examplePayload: { userId: 'user_123', email: 'user@example.com' }
  }
];

export default function FunctionTriggerPanel() {
  const [selectedFunction, setSelectedFunction] = useState<string>('');
  const [payload, setPayload] = useState<string>('{}');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleFunctionSelect = (functionName: string) => {
    setSelectedFunction(functionName);
    const func = availableFunctions.find(f => f.name === functionName);
    if (func) {
      setPayload(JSON.stringify(func.examplePayload, null, 2));
    }
  };

  const loadExample = () => {
    const func = availableFunctions.find(f => f.name === selectedFunction);
    if (func) {
      setPayload(JSON.stringify(func.examplePayload, null, 2));
    }
  };

  const triggerFunction = async () => {
    if (!selectedFunction) return;

    setLoading(true);
    setResult(null);

    try {
      const parsedPayload = JSON.parse(payload);
      
      const response = await fetch('/api/sandbox/trigger', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          functionName: selectedFunction,
          payload: parsedPayload
        }),
      });

      const result = await response.json();
      setResult(result);
    } catch (error) {
      setResult({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setLoading(false);
    }
  };

  const isValidJson = () => {
    try {
      JSON.parse(payload);
      return true;
    } catch {
      return false;
    }
  };

  return (
    <div className="space-y-6">
      {/* Function Selector */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">⚡ Function Trigger</h3>
        <div className="space-y-4">
          <div>
            <label htmlFor="function-select" className="block text-sm font-medium text-gray-700 mb-2">
              Select Function
            </label>
            <select
              id="function-select"
              value={selectedFunction}
              onChange={(e) => handleFunctionSelect(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Choose a function...</option>
              {availableFunctions.map((func) => (
                <option key={func.name} value={func.name}>
                  {func.name} - {func.description}
                </option>
              ))}
            </select>
          </div>

          {selectedFunction && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="payload-editor" className="block text-sm font-medium text-gray-700">
                  Payload (JSON)
                </label>
                <Button onClick={loadExample} variant="ghost" size="sm">
                  Load Example
                </Button>
              </div>
              <textarea
                id="payload-editor"
                value={payload}
                onChange={(e) => setPayload(e.target.value)}
                rows={8}
                className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 font-mono text-sm ${
                  !isValidJson() ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Enter JSON payload..."
              />
              {!isValidJson() && (
                <p className="mt-1 text-sm text-red-600">Invalid JSON format</p>
              )}
            </div>
          )}

          <div className="flex items-center space-x-4">
            <Button
              onClick={triggerFunction}
              loading={loading}
              disabled={!selectedFunction || !isValidJson()}
              variant="primary"
            >
              {loading ? 'Triggering...' : 'Trigger Function'}
            </Button>
            <Button
              onClick={() => window.open('http://localhost:4000/functions', '_blank')}
              variant="secondary"
            >
              View Emulator Logs
            </Button>
          </div>
        </div>
      </Card>

      {/* Results */}
      {result && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">📊 Function Result</h3>
          <div className={`p-4 rounded-lg ${
            result.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <span className={result.success ? 'text-green-600' : 'text-red-600'}>
                  {result.success ? '✅' : '❌'}
                </span>
                <span className="font-medium">
                  {result.success ? 'Function executed successfully' : 'Function execution failed'}
                </span>
              </div>
              {result.duration && (
                <span className="text-sm text-gray-600">
                  Duration: {result.duration}ms
                </span>
              )}
            </div>
            
            {result.success ? (
              <div>
                <div className="text-sm text-gray-600 mb-2">Status: {result.status}</div>
                <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto">
                  {JSON.stringify(result.data, null, 2)}
                </pre>
              </div>
            ) : (
              <div className="text-red-600">
                Error: {result.error}
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  );
}

