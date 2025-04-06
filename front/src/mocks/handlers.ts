import { rest } from 'msw';

const handlers = [
  rest.get('/member/me', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        id: 1,
        name: '김싸피',
        oauthProvider: 'KAKAO',
      }),
    );
  }),
  rest.get('/main', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        totalUsers: 25000,
        totalInvestment: 1500,
        totalrepaymentRate: 99.8,
      }),
    );
  }),
  rest.get('/api/contract/investments/overview', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        summary: {
          총투자금액: '15000000',
          누적수익금: '1250000',
          평균수익률: 8.5,
          투자건수: 5,
        },
        investlist: [
          {
            투자명: '부동산 담보 대출 A',
            투자금액: '5000000',
            금리: '9.8',
            상환일: '2024-08-15',
            상태: '상환중',
          },
          {
            투자명: '개인 사업자 대출 B',
            투자금액: '3000000',
            금리: '8.5',
            상환일: '2024-06-30',
            상태: '상환중',
          },
          {
            투자명: '소상공인 대출 C',
            투자금액: '2000000',
            금리: '7.5',
            상환일: '2024-04-20',
            상태: '상환완료',
          },
          {
            투자명: '개인 신용 대출 D',
            투자금액: '3000000',
            금리: '10.2',
            상환일: '2023-12-10',
            상태: '상환완료',
          },
          {
            투자명: '소상공인 대출 E',
            투자금액: '2000000',
            금리: '8.0',
            상환일: '2024-02-28',
            상태: '부실',
          },
        ],
        profitHistory: [
          {
            수익명: '이자수익',
            날짜: '2024-03-15',
            금액: '125000',
          },
          {
            수익명: '원금상환',
            날짜: '2024-03-10',
            금액: '2000000',
          },
          {
            수익명: '이자수익',
            날짜: '2024-02-15',
            금액: '118500',
          },
          {
            수익명: '이자수익',
            날짜: '2024-01-15',
            금액: '125000',
          },
          {
            수익명: '원금상환',
            날짜: '2024-01-10',
            금액: '3000000',
          },
          {
            수익명: '이자수익',
            날짜: '2023-12-15',
            금액: '145350',
          },
        ],
        simulation: {
          '5percent': [1000000, 1050000, 1102500, 1157625, 1215506],
          '8percent': [1000000, 1080000, 1166400, 1259712, 1360489],
          '12percent': [1000000, 1120000, 1254400, 1404928, 1573519],
        },
      }),
    );
  }),
  rest.get('/api/contract/contracts/summary', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        statusDistribution: {
          completed: 42,
          active: 78,
          default: 12,
          transferred: 5,
        },
        totalContractCount: 137,
        totalProfit: 28750000,
        totalLoss: 3400000,
      }),
    );
  }),
  rest.get('/api/contract/investments', (req, res, ctx) => {
    const mockData = {
      investments: Array.from({ length: 14 }, (_, idx) => ({
        investmentId: idx + 1,
        createdAt: idx % 2 === 0 ? '2024-01-01T00:00:00Z' : '2024-02-01T00:00:00Z',
        investStatus: idx % 2 === 0 ? 'IN_PROGRESS' : 'COMPLETED',
        totalContractCount: idx % 2 === 0 ? 5 : 10,
        statusDistribution: {
          completed: idx % 3,
          active: idx % 5,
          default: idx % 2,
          transferred: 0
        }
      }))
    };
  
    return res(
      ctx.status(200),
      ctx.json(mockData)
    );
  }),
  rest.post('/api/contract/investments/transactions/search', (req, res, ctx) => {
    const { startDate, endDate, types, investmentIds, page = 1, pageSize = 15, sort = [] } = req.body as {
      startDate?: string;
      endDate?: string;
      types?: string[];
      investmentIds?: number[];
      page?: number;
      pageSize?: number;
      sort?: Array<{ field: string; order: string }>;
    };
    
    interface Transaction {
      id: number;
      contractId: number;
      investmentId: number;
      amount: string;
      createdAt: string;
      status: string;
      bondMaturity: string;
      interestRate: string;
      [key: string]: string | number;
    }
    
    const allTransactions: Transaction[] = [
      {
        id: 1001,
        contractId: 5001,
        investmentId: 1,
        amount: '10000000',
        createdAt: '2025-03-01',
        status: '원금상환',
        bondMaturity: '2025-09-01',
        interestRate: '6.5%'
      },
      {
        id: 1002,
        contractId: 5001,
        investmentId: 1,
        amount: '650000',
        createdAt: '2025-03-01',
        status: '이자상환',
        bondMaturity: '2025-09-01',
        interestRate: '6.5%'
      },
      {
        id: 1003,
        contractId: 5002,
        investmentId: 1,
        amount: '15000000',
        createdAt: '2025-03-02',
        status: '원금상환',
        bondMaturity: '2025-09-02',
        interestRate: '6.5%'
      },
      {
        id: 1004,
        contractId: 5002,
        investmentId: 1,
        amount: '975000',
        createdAt: '2025-03-02',
        status: '이자상환',
        bondMaturity: '2025-09-02',
        interestRate: '6.5%'
      },
      {
        id: 1005,
        contractId: 5003,
        investmentId: 2,
        amount: '8000000',
        createdAt: '2025-03-05',
        status: '원금상환',
        bondMaturity: '2025-09-05',
        interestRate: '6.6%'
      },
      {
        id: 1006,
        contractId: 5003,
        investmentId: 2,
        amount: '528000',
        createdAt: '2025-03-05',
        status: '이자상환',
        bondMaturity: '2025-09-05',
        interestRate: '6.6%'
      },
      {
        id: 1007,
        contractId: 5004,
        investmentId: 2,
        amount: '12000000',
        createdAt: '2025-03-07',
        status: '원금상환',
        bondMaturity: '2025-09-07',
        interestRate: '6.6%'
      },
      {
        id: 1008,
        contractId: 5004,
        investmentId: 2,
        amount: '792000',
        createdAt: '2025-03-07',
        status: '이자상환',
        bondMaturity: '2025-09-07',
        interestRate: '6.6%'
      },
      {
        id: 1009,
        contractId: 5005,
        investmentId: 3,
        amount: '20000000',
        createdAt: '2025-03-10',
        status: '원금상환',
        bondMaturity: '2025-09-10',
        interestRate: '6.7%'
      },
      {
        id: 1010,
        contractId: 5005,
        investmentId: 3,
        amount: '1340000',
        createdAt: '2025-03-10',
        status: '이자상환',
        bondMaturity: '2025-09-10',
        interestRate: '6.7%'
      },
      {
        id: 1011,
        contractId: 5006,
        investmentId: 3,
        amount: '18000000',
        createdAt: '2025-03-12',
        status: '원금상환',
        bondMaturity: '2025-09-12',
        interestRate: '6.7%'
      },
      {
        id: 1012,
        contractId: 5006,
        investmentId: 3,
        amount: '1206000',
        createdAt: '2025-03-12',
        status: '이자상환',
        bondMaturity: '2025-09-12',
        interestRate: '6.7%'
      },
      {
        id: 1013,
        contractId: 5007,
        investmentId: 4,
        amount: '25000000',
        createdAt: '2025-03-15',
        status: '원금상환',
        bondMaturity: '2025-09-15',
        interestRate: '6.8%'
      },
      {
        id: 1014,
        contractId: 5007,
        investmentId: 4,
        amount: '1700000',
        createdAt: '2025-03-15',
        status: '이자상환',
        bondMaturity: '2025-09-15',
        interestRate: '6.8%'
      },
      {
        id: 1015,
        contractId: 5008,
        investmentId: 4,
        amount: '500000',
        createdAt: '2025-03-18',
        status: '환급',
        bondMaturity: '2025-09-18',
        interestRate: '6.8%'
      },
      {
        id: 1016,
        contractId: 5009,
        investmentId: 5,
        amount: '30000000',
        createdAt: '2025-03-20',
        status: '원금상환',
        bondMaturity: '2025-09-20',
        interestRate: '6.9%'
      },
      {
        id: 1017,
        contractId: 5009,
        investmentId: 5,
        amount: '2010000',
        createdAt: '2025-03-20',
        status: '이자상환',
        bondMaturity: '2025-09-20',
        interestRate: '6.9%'
      },
      {
        id: 1018,
        contractId: 5010,
        investmentId: 5,
        amount: '22000000',
        createdAt: '2025-03-22',
        status: '원금상환',
        bondMaturity: '2025-09-22',
        interestRate: '6.9%'
      },
      {
        id: 1019,
        contractId: 5010,
        investmentId: 5,
        amount: '1474000',
        createdAt: '2025-03-22',
        status: '이자상환',
        bondMaturity: '2025-09-22',
        interestRate: '6.9%'
      },
      {
        id: 1020,
        contractId: 5011,
        investmentId: 6,
        amount: '700000',
        createdAt: '2025-03-25',
        status: '환급',
        bondMaturity: '2025-09-25',
        interestRate: '7.0%'
      },
      {
        id: 1021,
        contractId: 5012,
        investmentId: 7,
        amount: '18000000',
        createdAt: '2025-03-27',
        status: '원금상환',
        bondMaturity: '2025-09-27',
        interestRate: '7.0%'
      },
      {
        id: 1022,
        contractId: 5012,
        investmentId: 7,
        amount: '1188000',
        createdAt: '2025-03-27',
        status: '이자상환',
        bondMaturity: '2025-09-27',
        interestRate: '7.0%'
      },
      {
        id: 1023,
        contractId: 5013,
        investmentId: 8,
        amount: '15000000',
        createdAt: '2025-03-29',
        status: '원금상환',
        bondMaturity: '2025-09-29',
        interestRate: '7.1%'
      },
      {
        id: 1024,
        contractId: 5013,
        investmentId: 8,
        amount: '1005000',
        createdAt: '2025-03-29',
        status: '이자상환',
        bondMaturity: '2025-09-29',
        interestRate: '7.1%'
      },
      {
        id: 1025,
        contractId: 5014,
        investmentId: 9,
        amount: '28000000',
        createdAt: '2025-03-30',
        status: '원금상환',
        bondMaturity: '2025-09-30',
        interestRate: '7.2%'
      },
      {
        id: 1026,
        contractId: 5014,
        investmentId: 9,
        amount: '1904000',
        createdAt: '2025-03-30',
        status: '이자상환',
        bondMaturity: '2025-09-30',
        interestRate: '7.2%'
      },
      {
        id: 1027,
        contractId: 5015,
        investmentId: 10,
        amount: '32000000',
        createdAt: '2025-03-31',
        status: '원금상환',
        bondMaturity: '2025-09-30',
        interestRate: '7.2%'
      },
      {
        id: 1028,
        contractId: 5015,
        investmentId: 10,
        amount: '2144000',
        createdAt: '2025-03-31',
        status: '이자상환',
        bondMaturity: '2025-09-30',
        interestRate: '7.2%'
      },
      {
        id: 1029,
        contractId: 5016,
        investmentId: 11,
        amount: '900000',
        createdAt: '2025-04-01',
        status: '환급',
        bondMaturity: '2025-10-01',
        interestRate: '7.3%'
      },
      {
        id: 1030,
        contractId: 5017,
        investmentId: 12,
        amount: '800000',
        createdAt: '2025-04-01',
        status: '환급',
        bondMaturity: '2025-10-01',
        interestRate: '7.3%'
      }
    ];

    let filteredTransactions: Transaction[] = [...allTransactions];

    const totalItemCount = filteredTransactions.length;
    const totalPage = Math.ceil(totalItemCount / pageSize);
    const startIndex = (page - 1) * pageSize;
    const paginatedTransactions = filteredTransactions.slice(startIndex, startIndex + pageSize);

    return res(
      ctx.status(200),
      ctx.json({
        pagination: {
          page,
          pageSize,
          totalPage,
          totalItemCount
        },
        transactions: paginatedTransactions
      }),
    );
  })
];


export default handlers;
