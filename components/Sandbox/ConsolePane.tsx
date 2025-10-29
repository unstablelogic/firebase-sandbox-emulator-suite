'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/shared/Card';
import { Button } from '@/components/shared/Button';

interface LogEntry {
  id: string;
  timestamp: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  data?: any;
}

export default function ConsolePane() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [autoScroll, setAutoScroll] = useState(true);

  // Add sample logs for demonstration
  useEffect(() => {
    const sampleLogs: LogEntry[] = [
      {
        id: '1',
        timestamp: new Date().toISOString(),
        type: 'info',
        message: 'Sandbox admin panel initialized',
        data: { component: 'ConsolePane' }
      },
      {
        id: '2',
        timestamp: new Date().toISOString(),
        type: 'success',
        message: 'Connected to Firebase emulators',
        data: { 
          firestore: 'localhost:8080',
          auth: 'localhost:9099',
          functions: 'localhost:5001'
        }
      },
      {
        id: '3',
        timestamp: new Date().toISOString(),
        type: 'warning',
        message: 'No seed data found',
        data: { suggestion: 'Run seed operations to populate collections' }
      }
    ];
    setLogs(sampleLogs);
  }, []);

  const addLog = (type: LogEntry['type'], message: string, data?: any) => {
    const newLog: LogEntry = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      type,
      message,
      data
    };
    setLogs(prev => [...prev, newLog]);
  };

  const clearLogs = () => {
    setLogs([]);
  };

  const exportLogs = () => {
    const logData = {
      exportedAt: new Date().toISOString(),
      logs: logs
    };
    
    const blob = new Blob([JSON.stringify(logData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sandbox-logs-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getLogIcon = (type: LogEntry['type']) => {
    switch (type) {
      case 'success': return '✅';
      case 'error': return '❌';
      case 'warning': return '⚠️';
      case 'info': return 'ℹ️';
      default: return '📝';
    }
  };

  const getLogColor = (type: LogEntry['type']) => {
    switch (type) {
      case 'success': return 'text-green-600';
      case 'error': return 'text-red-600';
      case 'warning': return 'text-yellow-600';
      case 'info': return 'text-blue-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Console Controls */}
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">📺 Console Logs</h3>
          <div className="flex items-center space-x-2">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={autoScroll}
                onChange={(e) => setAutoScroll(e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Auto-scroll</span>
            </label>
            <Button onClick={clearLogs} variant="secondary" size="sm">
              Clear Logs
            </Button>
            <Button onClick={exportLogs} variant="secondary" size="sm">
              Export Logs
            </Button>
          </div>
        </div>
      </Card>

      {/* Log Display */}
      <Card className="p-6">
        <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm h-96 overflow-y-auto">
          {logs.length === 0 ? (
            <div className="text-gray-500 text-center py-8">
              No logs available. Console activity will appear here.
            </div>
          ) : (
            <div className="space-y-1">
              {logs.map((log) => (
                <div key={log.id} className="flex items-start space-x-2">
                  <span className="flex-shrink-0">{getLogIcon(log.type)}</span>
                  <span className="text-gray-400 text-xs">
                    {new Date(log.timestamp).toLocaleTimeString()}
                  </span>
                  <span className={`flex-1 ${getLogColor(log.type)}`}>
                    {log.message}
                  </span>
                  {log.data && (
                    <details className="text-xs text-gray-500">
                      <summary className="cursor-pointer hover:text-gray-400">
                        Details
                      </summary>
                      <pre className="mt-1 ml-4 text-xs text-gray-400">
                        {JSON.stringify(log.data, null, 2)}
                      </pre>
                    </details>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>

      {/* Log Statistics */}
      <Card className="p-6">
        <h4 className="text-md font-semibold mb-4">📊 Log Statistics</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {logs.filter(l => l.type === 'info').length}
            </div>
            <div className="text-sm text-gray-600">Info</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {logs.filter(l => l.type === 'success').length}
            </div>
            <div className="text-sm text-gray-600">Success</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">
              {logs.filter(l => l.type === 'warning').length}
            </div>
            <div className="text-sm text-gray-600">Warnings</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">
              {logs.filter(l => l.type === 'error').length}
            </div>
            <div className="text-sm text-gray-600">Errors</div>
          </div>
        </div>
      </Card>
    </div>
  );
}

