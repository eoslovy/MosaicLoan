import { http, HttpResponse } from 'msw';

const handlers = [
  http.get('/me', () => {
    return HttpResponse.json({
      id: 1,
      username: 'testuser',
      email: 'test@example.com',
    });
  }),

  http.get('/api/investments/contracts/summary', () => {
    return HttpResponse.json({
      totalAmount: 1500000000,
      totalCount: 150,
      activeCount: 80,
      completedCount: 70,
      statusDistribution: {
        completed: 70,
        active: 80,
        default: 5,
        transferred: 5,
      },
      totalContractCount: 150,
      totalProfit: 25000000,
      totalLoss: 5000000,
    });
  }),

  http.get('/api/investments/transactions', ({ request }) => {
    const url = new URL(request.url);
    const startDate = url.searchParams.get('startDate');
    const endDate = url.searchParams.get('endDate');
    const types = url.searchParams.get('types')?.split(',') || [];
    const investmentIds =
      url.searchParams.get('investmentIds')?.split(',').map(Number) || [];

    const mockTransactions = [
      {
        id: '1',
        investmentId: 1,
        investmentName: '투자 상품 A',
        contractId: 'CONT-001',
        createdAt: '2024-01-15',
        amount: 10000000,
        status: '완료',
        type: '원금상환',
        description: '원금 상환 완료',
      },
      {
        id: '2',
        investmentId: 2,
        investmentName: '투자 상품 B',
        contractId: 'CONT-002',
        createdAt: '2024-02-01',
        amount: 5000000,
        status: '진행중',
        type: '이자상환',
        description: '이자 상환 진행중',
      },
      {
        id: '3',
        investmentId: 3,
        investmentName: '투자 상품 C',
        contractId: 'CONT-003',
        createdAt: '2024-02-15',
        amount: 15000000,
        status: '부실',
        type: '대출',
        description: '부실 채권',
      },
    ];

    let filteredTransactions = mockTransactions;

    if (startDate && endDate) {
      filteredTransactions = filteredTransactions.filter(
        (t) => t.createdAt >= startDate && t.createdAt <= endDate,
      );
    }

    if (types.length > 0) {
      filteredTransactions = filteredTransactions.filter((t) =>
        types.includes(t.type),
      );
    }

    if (investmentIds.length > 0) {
      filteredTransactions = filteredTransactions.filter((t) =>
        investmentIds.includes(t.investmentId),
      );
    }

    return HttpResponse.json({ transactions: filteredTransactions });
  }),
];

export default handlers;
