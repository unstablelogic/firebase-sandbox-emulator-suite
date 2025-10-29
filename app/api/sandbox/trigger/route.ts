import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { functionName, payload = {} } = body;

    if (!functionName) {
      return NextResponse.json(
        { error: 'Function name is required' },
        { status: 400 }
      );
    }

    const startTime = Date.now();
    
    // Call the Functions emulator
    const functionUrl = `http://localhost:5001/demo-project/us-central1/${functionName}`;
    
    const response = await fetch(functionUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });

    const duration = Date.now() - startTime;
    const responseData = await response.json();

    return NextResponse.json({
      success: response.ok,
      status: response.status,
      data: responseData,
      duration,
      functionName,
      payload
    });
  } catch (error) {
    return NextResponse.json(
      { 
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        functionName: 'unknown'
      },
      { status: 500 }
    );
  }
}

