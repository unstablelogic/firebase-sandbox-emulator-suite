import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  let body: any = {};
  try {
    body = await request.json();
    const { functionName, payload = {} } = body;

    if (!functionName) {
      return NextResponse.json(
        { error: 'Function name is required' },
        { status: 400 }
      );
    }

    const startTime = Date.now();
    
    // Get project ID from environment or use default
    const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'demo-project';
    const functionsPort = process.env.NEXT_PUBLIC_FIREBASE_FUNCTIONS_PORT || '5001';
    const region = process.env.NEXT_PUBLIC_FIREBASE_FUNCTIONS_REGION || 'us-central1';
    
    // Call the Functions emulator
    const functionUrl = `http://localhost:${functionsPort}/${projectId}/${region}/${functionName}`;
    
    const response = await fetch(functionUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });

    const duration = Date.now() - startTime;
    
    let responseData;
    try {
      responseData = await response.json();
    } catch (parseError) {
      // If response is not JSON, get text instead
      responseData = { message: await response.text() };
    }

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
        functionName: body?.functionName || 'unknown'
      },
      { status: 500 }
    );
  }
}

