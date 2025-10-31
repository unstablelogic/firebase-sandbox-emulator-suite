import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy, documentId } from 'firebase/firestore';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const collectionName = searchParams.get('collection');
    const page = parseInt(searchParams.get('page') || '0');
    const pageLimit = parseInt(searchParams.get('limit') || '20');

    if (!collectionName) {
      // Return available collections
      const collections = ['users', 'products', 'orders', 'config'];
      return NextResponse.json({ collections });
    }

    // Get collection data
    // For admin panel, fetch all docs and paginate in memory (works fine for limited datasets)
    const collectionRef = collection(db, collectionName);
    const allDocsQuery = query(collectionRef, orderBy(documentId()));
    const allSnapshot = await getDocs(allDocsQuery);
    const allDocs = allSnapshot.docs;
    
    // Calculate pagination
    const startIndex = page * pageLimit;
    const endIndex = startIndex + pageLimit;
    const documents = allDocs.slice(startIndex, endIndex).map(doc => ({
      id: doc.id,
      data: doc.data()
    }));

    return NextResponse.json({
      documents,
      total: allDocs.length,
      hasMore: endIndex < allDocs.length,
      page,
      limit: pageLimit
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch collection data', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

