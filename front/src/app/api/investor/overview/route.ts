import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    summary: {
      총투자금액: '100',
      누적수익금: '1231234',
      평균수익률: 8.3,
      투자건수: 50,
    },
  });
}
