'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/shared/Card';
import { Button } from '@/components/shared/Button';

interface Document {
  id: string;
  data: any;
}

interface CollectionData {
  documents: Document[];
  total: number;
  hasMore: boolean;
}

export default function CollectionViewer() {
  const [collections, setCollections] = useState<string[]>([]);
  const [selectedCollection, setSelectedCollection] = useState<string>('');
  const [collectionData, setCollectionData] = useState<CollectionData | null>(null);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [pageSize] = useState(20);

  // Load available collections
  useEffect(() => {
    loadCollections();
  }, []);

  // Load collection data when collection changes
  useEffect(() => {
    if (selectedCollection) {
      loadCollectionData();
    }
  }, [selectedCollection, page]);

  const loadCollections = async () => {
    try {
      const response = await fetch('/api/sandbox/collections');
      const data = await response.json();
      setCollections(data.collections || []);
    } catch (error) {
      console.error('Failed to load collections:', error);
    }
  };

  const loadCollectionData = async () => {
    if (!selectedCollection) return;
    
    setLoading(true);
    try {
      const response = await fetch(
        `/api/sandbox/collections?collection=${selectedCollection}&page=${page}&limit=${pageSize}`
      );
      const data = await response.json();
      setCollectionData(data);
    } catch (error) {
      console.error('Failed to load collection data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    loadCollectionData();
  };

  const handlePreviousPage = () => {
    if (page > 0) {
      setPage(page - 1);
    }
  };

  const handleNextPage = () => {
    if (collectionData?.hasMore) {
      setPage(page + 1);
    }
  };

  return (
    <div className="space-y-6">
      {/* Collection Selector */}
      <Card className="p-6">
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <label htmlFor="collection-select" className="block text-sm font-medium text-gray-700 mb-2">
              Select Collection
            </label>
            <select
              id="collection-select"
              value={selectedCollection}
              onChange={(e) => {
                setSelectedCollection(e.target.value);
                setPage(0);
              }}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Choose a collection...</option>
              {collections.map((collection) => (
                <option key={collection} value={collection}>
                  {collection}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-end">
            <Button onClick={handleRefresh} loading={loading}>
              🔄 Refresh
            </Button>
          </div>
        </div>
      </Card>

      {/* Collection Data */}
      {selectedCollection && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">
              {selectedCollection} Collection
            </h3>
            <div className="text-sm text-gray-500">
              {collectionData ? `${collectionData.documents.length} of ${collectionData.total} documents` : 'Loading...'}
            </div>
          </div>

          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading documents...</p>
            </div>
          ) : collectionData?.documents.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-2">📭</div>
              <p className="text-gray-600">No documents found in this collection</p>
              <p className="text-sm text-gray-500 mt-1">
                Try seeding some data or check if the collection name is correct
              </p>
            </div>
          ) : (
            <>
              {/* Documents Table */}
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Document ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Preview
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {collectionData?.documents.map((doc) => (
                      <tr key={doc.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
                          {doc.id}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          <pre className="bg-gray-100 p-2 rounded text-xs overflow-hidden max-w-md">
                            {JSON.stringify(doc.data, null, 2)}
                          </pre>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <button className="text-blue-600 hover:text-blue-800">
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center space-x-2">
                  <Button
                    onClick={handlePreviousPage}
                    disabled={page === 0}
                    variant="secondary"
                    size="sm"
                  >
                    ← Previous
                  </Button>
                  <Button
                    onClick={handleNextPage}
                    disabled={!collectionData?.hasMore}
                    variant="secondary"
                    size="sm"
                  >
                    Next →
                  </Button>
                </div>
                <div className="text-sm text-gray-500">
                  Page {page + 1} • {pageSize} per page
                </div>
              </div>
            </>
          )}
        </Card>
      )}
    </div>
  );
}

