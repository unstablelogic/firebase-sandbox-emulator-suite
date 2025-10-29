import { NextRequest, NextResponse } from 'next/server';
import { seedModule, seedAll } from '@/sandbox/sandbox.config';

export async function GET() {
  try {
    const modules = ['users', 'products', 'orders', 'config'];
    return NextResponse.json({ collections: modules });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to get available modules' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { module, options = {} } = body;

    if (module === 'all') {
      const results = await seedAll(options);
      return NextResponse.json(results);
    } else {
      const result = await seedModule(module, options);
      return NextResponse.json(result);
    }
  } catch (error) {
    return NextResponse.json(
      { 
        module: 'unknown',
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

