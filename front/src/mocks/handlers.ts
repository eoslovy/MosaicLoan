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
  rest.get('/api/credit/evaluations/recent', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        maxLoanLimit: 123000,
        interestRate: 90,
        creditScore: 850,
      }),
    );
  }),
  rest.post('/api/evaluations', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        createdAt: new Date().toISOString(),
        maxLoanLimit: 1000000,
        interestRate: 90,
      }),
    );
  }),
  rest.get('/api/contract/loans/overview', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        recentLoans: [
          {
            dueDate: '2025-05-06',
            principal: 10000000,
            interestRate: 350,
            amount: 12500000,
          },
          {
            dueDate: '2025-06-15',
            principal: 8000000,
            interestRate: 850,
            amount: 9600000,
          },
          {
            dueDate: '2025-07-10',
            principal: 12000000,
            interestRate: 650,
            amount: 15000000,
          },
          {
            dueDate: '2025-08-01',
            principal: 5000000,
            interestRate: 150,
            amount: 6000000,
          },
          // {
          //   dueDate: '2025-08-25',
          //   principal: 7000000,
          //   interestRate: 980,
          //   amount: 8400000,
          // },
        ],
        activeLoanCount: 4,
        totalCount: 9,
        activeLoanAmount: 43500000,
        averageInterestRate: 820, // 8.2%
      }),
    );
  }),
];

export default handlers;
