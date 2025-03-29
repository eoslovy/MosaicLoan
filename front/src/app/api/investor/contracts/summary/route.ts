import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    statusDistribution: {
      completed: 35,
      active: 45,
      default: 15,
      transferred: 5,
    },
    totalContractCount: 100,
    totalProfit: 1250000000,
    totalLoss: 10000000,
  });
}
