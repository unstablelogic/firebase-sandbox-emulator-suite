import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, getDocs, limit, startAfter, query, orderBy } from 'firebase/firestore';

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
    const collectionRef = collection(db, collectionName);
    let q = query(collectionRef, orderBy('__name__'), limit(pageLimit));

    if (page > 0) {
      // For pagination, you would need to implement startAfter with the last document
      // This is a simplified version
      q = query(collectionRef, orderBy('__name__'), limit(pageLimit));
    }

    const snapshot = await getDocs(q);
    const documents = snapshot.docs.map(doc => ({
      id: doc.id,
      data: doc.data()
    }));

    return NextResponse.json({
      documents,
      total: documents.length, // This would need to be calculated properly
      hasMore: documents.length === pageLimit,
      page,
      limit: pageLimit
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch collection data' },
      { status: 500 }
    );
  }
}

