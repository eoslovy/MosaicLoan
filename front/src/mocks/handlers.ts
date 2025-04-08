import { rest } from 'msw';
import { format, differenceInDays, subDays } from 'date-fns';
import type { AccountTransaction } from '@/types/pages';

const handlers = [
  rest.get('/member/me', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        id: 1,
        name: '김싸피',
        oauthProvider: 'KAKAO',
        createdAt: '2025-05-10T00:00:00Z',
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
  rest.get('/contract/investments/overview', (req, res, ctx) => {
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

  rest.get('/contract/contracts/summary', (req, res, ctx) => {
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
  rest.get('/contract/investments', (req, res, ctx) => {
    const mockData = {
      investments: Array.from({ length: 14 }, (_, idx) => ({
        investmentId: idx + 1,
        createdAt:
          idx % 2 === 0 ? '2024-01-01T00:00:00Z' : '2024-02-01T00:00:00Z',
        investStatus: idx % 2 === 0 ? 'IN_PROGRESS' : 'COMPLETED',
        statusDistribution: {
          completed: 42,
          active: 78,
          default: 12,                
          transferred: 5,
        },
      })),
      investOverview: Array.from({ length: 1 }, (_, idx) => ({
        statusDistribution: {
        completed: 42,
        active: 78,
        default: 12,                
        transferred: 5,
      },
      totalContractCount: 137,
      totalProfit: 28750000,
      totalLoss: 3400000}),
      )}
    return res(ctx.status(200), ctx.json(mockData));
  }),
  rest.get('/credit/evaluations/recent', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        maxLoanLimit: 123000,
        interestRate: 90,
        creditScore: 850,
      }),
    );
  }),
  rest.post('/credit/evaluations', async (req, res, ctx) => {
    const { appliedAt, memberId } = await req.json();

    console.log(`신용평가 req - memberId: ${memberId}, 날짜: ${appliedAt}`);

    return res(
      ctx.status(200),
      ctx.json({
        createdAt: new Date().toISOString(),
        maxLoanLimit: 1000000,
        interestRate: 90,
      }),
    );
  }),

  rest.get('/contract/loans/overview', (req, res, ctx) => {
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
  rest.post('/contract/loans/', async (req, res, ctx) => {
    const { id, requestAmount, targetWeeks } = await req.json();
    const now = new Date();
    const dueDate = new Date();
    dueDate.setDate(now.getDate() + targetWeeks * 7);

    return res(
      ctx.status(200),
      ctx.json({
        id,
        requestAmount,
        dueDate: dueDate.toISOString().split('T')[0],
        createdAt: now.toISOString(),
      }),
    );
  }),
  rest.get('/account/accounts', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        amount: 300000,
      }),
    );
  }),
  rest.post('/account/external/deposit/ready', async (req, res, ctx) => {
    const { amount } = await req.json();

    if (!amount || amount < 1000) {
      return res(
        ctx.status(400),
        ctx.json({ message: '금액이 유효하지 않습니다.' }),
      );
    }

    return res(
      ctx.status(200),
      ctx.json({
        redirectUrl: '/my/myAccount',
      }),
    );
  }),
  rest.post('/account/external/withdrawal', async (req, res, ctx) => {
    const { amount } = await req.json();

    if (!amount || amount < 1000) {
      return res(
        ctx.status(400),
        ctx.json({ message: '출금 금액이 유효하지 않습니다.' }),
      );
    }

    return res(ctx.status(200), ctx.json({ success: true }));
  }),
  rest.post('/account/accounts/transactions/search', async (req, res, ctx) => {
    const { startDate, endDate, types, page, pageSize } = await req.json();

    const start = new Date(startDate);
    const end = new Date(endDate);
    const totalDays = Math.max(1, differenceInDays(end, start) + 1);

    const allTransactions: AccountTransaction[] = [];

    for (let d = 0; d < totalDays; d += 1) {
      const date = format(subDays(end, d), 'yyyy-MM-dd');

      // 하루에 2건씩 mock 생성
      for (let i = 0; i < 2; i += 1) {
        const index = d * 2 + i;

        allTransactions.push({
          amount: 10000 + index * 1000,
          cash: 1000000 - index * 3000,
          type: types[index % types.length],
          content: `(${date}) 모의 거래 ${index + 1}`,
          createdAt: date,
          targetId: 1000 + index,
        });
      }
    }

    // 최신순 정렬
    const sorted = allTransactions.sort((a, b) =>
      a.createdAt < b.createdAt ? 1 : -1,
    );

    const totalItemCount = sorted.length;
    const totalPage = Math.ceil(totalItemCount / pageSize);
    const startIdx = (page - 1) * pageSize;
    const paged = sorted.slice(startIdx, startIdx + pageSize);

    return res(
      ctx.status(200),
      ctx.json({
        transactions: paged,
        pagination: {
          page,
          pageSize,
          totalPage,
          totalItemCount,
        },
      }),
    );
  }),
  rest.post('/api/contract/investments/transactions/search', (req, res, ctx) => {
    const {
      startDate,
      endDate,
      types,
      investmentIds,
      page = 1,
      pageSize = 15,
      sort = [],
    } = req.body as {
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
      dueDate: string;
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
        dueDate: '2025-09-01',
        interestRate: '6.5%',
      },
      {
        id: 1002,
        contractId: 5001,
        investmentId: 1,
        amount: '650000',
        createdAt: '2025-03-01',
        status: '이자상환',
        dueDate: '2025-09-01',
        interestRate: '6.5%',
      },
      {
        id: 1003,
        contractId: 5002,
        investmentId: 1,
        amount: '15000000',
        createdAt: '2025-03-02',
        status: '원금상환',
        dueDate: '2025-09-02',
        interestRate: '6.5%',
      },
      {
        id: 1004,
        contractId: 5002,
        investmentId: 1,
        amount: '975000',
        createdAt: '2025-03-02',
        status: '이자상환',
        dueDate: '2025-09-02',
        interestRate: '6.5%',
      },
      {
        id: 1005,
        contractId: 5003,
        investmentId: 2,
        amount: '8000000',
        createdAt: '2025-03-05',
        status: '원금상환',
        dueDate: '2025-09-05',
        interestRate: '6.6%',
      },
      {
        id: 1006,
        contractId: 5003,
        investmentId: 2,
        amount: '528000',
        createdAt: '2025-03-05',
        status: '이자상환',
        dueDate: '2025-09-05',
        interestRate: '6.6%',
      },
      {
        id: 1007,
        contractId: 5004,
        investmentId: 2,
        amount: '12000000',
        createdAt: '2025-03-07',
        status: '원금상환',
        dueDate: '2025-09-07',
        interestRate: '6.6%',
      },
      {
        id: 1008,
        contractId: 5004,
        investmentId: 2,
        amount: '792000',
        createdAt: '2025-03-07',
        status: '이자상환',
        dueDate: '2025-09-07',
        interestRate: '6.6%',
      },
      {
        id: 1009,
        contractId: 5005,
        investmentId: 3,
        amount: '20000000',
        createdAt: '2025-03-10',
        status: '원금상환',
        dueDate: '2025-09-10',
        interestRate: '6.7%',
      },
      {
        id: 1010,
        contractId: 5005,
        investmentId: 3,
        amount: '1340000',
        createdAt: '2025-03-10',
        status: '이자상환',
        dueDate: '2025-09-10',
        interestRate: '6.7%',
      },
      {
        id: 1011,
        contractId: 5006,
        investmentId: 3,
        amount: '18000000',
        createdAt: '2025-03-12',
        status: '원금상환',
        dueDate: '2025-09-12',
        interestRate: '6.7%',
      },
      {
        id: 1012,
        contractId: 5006,
        investmentId: 3,
        amount: '1206000',
        createdAt: '2025-03-12',
        status: '이자상환',
        dueDate: '2025-09-12',
        interestRate: '6.7%',
      },
      {
        id: 1013,
        contractId: 5007,
        investmentId: 4,
        amount: '25000000',
        createdAt: '2025-03-15',
        status: '원금상환',
        dueDate: '2025-09-15',
        interestRate: '6.8%',
      },
      {
        id: 1014,
        contractId: 5007,
        investmentId: 4,
        amount: '1700000',
        createdAt: '2025-03-15',
        status: '이자상환',
        dueDate: '2025-09-15',
        interestRate: '6.8%',
      },
      {
        id: 1015,
        contractId: 5008,
        investmentId: 4,
        amount: '500000',
        createdAt: '2025-03-18',
        status: '환급',
        dueDate: '2025-09-18',
        interestRate: '6.8%',
      },
      {
        id: 1016,
        contractId: 5009,
        investmentId: 5,
        amount: '30000000',
        createdAt: '2025-03-20',
        status: '원금상환',
        dueDate: '2025-09-20',
        interestRate: '6.9%',
      },
      {
        id: 1017,
        contractId: 5009,
        investmentId: 5,
        amount: '2010000',
        createdAt: '2025-03-20',
        status: '이자상환',
        dueDate: '2025-09-20',
        interestRate: '6.9%',
      },
      {
        id: 1018,
        contractId: 5010,
        investmentId: 5,
        amount: '22000000',
        createdAt: '2025-03-22',
        status: '원금상환',
        dueDate: '2025-09-22',
        interestRate: '6.9%',
      },
      {
        id: 1019,
        contractId: 5010,
        investmentId: 5,
        amount: '1474000',
        createdAt: '2025-03-22',
        status: '이자상환',
        dueDate: '2025-09-22',
        interestRate: '6.9%',
      },
      {
        id: 1020,
        contractId: 5011,
        investmentId: 6,
        amount: '700000',
        createdAt: '2025-03-25',
        status: '환급',
        dueDate: '2025-09-25',
        interestRate: '7.0%',
      },
      {
        id: 1021,
        contractId: 5012,
        investmentId: 7,
        amount: '18000000',
        createdAt: '2025-03-27',
        status: '원금상환',
        dueDate: '2025-09-27',
        interestRate: '7.0%',
      },
      {
        id: 1022,
        contractId: 5012,
        investmentId: 7,
        amount: '1188000',
        createdAt: '2025-03-27',
        status: '이자상환',
        dueDate: '2025-09-27',
        interestRate: '7.0%',
      },
      {
        id: 1023,
        contractId: 5013,
        investmentId: 8,
        amount: '15000000',
        createdAt: '2025-03-29',
        status: '원금상환',
        dueDate: '2025-09-29',
        interestRate: '7.1%',
      },
      {
        id: 1024,
        contractId: 5013,
        investmentId: 8,
        amount: '1005000',
        createdAt: '2025-03-29',
        status: '이자상환',
        dueDate: '2025-09-29',
        interestRate: '7.1%',
      },
      {
        id: 1025,
        contractId: 5014,
        investmentId: 9,
        amount: '28000000',
        createdAt: '2025-03-30',
        status: '원금상환',
        dueDate: '2025-09-30',
        interestRate: '7.2%',
      },
      {
        id: 1026,
        contractId: 5014,
        investmentId: 9,
        amount: '1904000',
        createdAt: '2025-03-30',
        status: '이자상환',
        dueDate: '2025-09-30',
        interestRate: '7.2%',
      },
      {
        id: 1027,
        contractId: 5015,
        investmentId: 10,
        amount: '32000000',
        createdAt: '2025-03-31',
        status: '원금상환',
        dueDate: '2025-09-30',
        interestRate: '7.2%',
      },
      {
        id: 1028,
        contractId: 5015,
        investmentId: 10,
        amount: '2144000',
        createdAt: '2025-03-31',
        status: '이자상환',
        dueDate: '2025-09-30',
        interestRate: '7.2%',
      },
      {
        id: 1029,
        contractId: 5016,
        investmentId: 11,
        amount: '900000',
        createdAt: '2025-04-01',
        status: '환급',
        dueDate: '2025-10-01',
        interestRate: '7.3%',
      },
      {
        id: 1030,
        contractId: 5017,
        investmentId: 12,
        amount: '800000',
        createdAt: '2025-04-01',
        status: '환급',
        dueDate: '2025-10-01',
        interestRate: '7.3%',
      },
    ];

    const filteredTransactions: Transaction[] = [...allTransactions];

    if (sort.length > 0) {
      const { field, order } = sort[0];

      console.log(`MSW - 정렬 적용: ${field} ${order}`);

      filteredTransactions.sort((a, b) => {
        const valueA = a[field];
        const valueB = b[field];

        if (typeof valueA === 'string' && typeof valueB === 'string') {
          if (valueA.includes('%') && valueB.includes('%')) {
            const numA = parseFloat(valueA.replace('%', ''));
            const numB = parseFloat(valueB.replace('%', ''));
            return order === 'asc' ? numA - numB : numB - numA;
          }

          return order === 'asc'
            ? valueA.localeCompare(valueB)
            : valueB.localeCompare(valueA);
        }

        if (typeof valueA === 'number' && typeof valueB === 'number') {
          return order === 'asc' ? valueA - valueB : valueB - valueA;
        }

        const strA = String(valueA);
        const strB = String(valueB);
        return order === 'asc'
          ? strA.localeCompare(strB)
          : strB.localeCompare(strA);
      });
    }

    const totalItemCount = filteredTransactions.length;
    const totalPage = Math.ceil(totalItemCount / pageSize);
    const startIndex = (page - 1) * pageSize;
    const paginatedTransactions = filteredTransactions.slice(
      startIndex,
      startIndex + pageSize,
    );

    return res(
      ctx.status(200),
      ctx.json({
        pagination: {
          page,
          pageSize,
          totalPage,
          totalItemCount,
        },
        transactions: paginatedTransactions,
      }),
    );
  }),
  rest.post('/contract/investments/', async (req, res, ctx) => {
    const { principal, targetRate, targetWeeks } = await req.json();

    // 예시: 최소 금액 미만일 때 400 에러
    if (principal < 10000) {
      return res(
        ctx.status(400),
        ctx.json({ message: '최소 투자금액은 1만원입니다.' }),
      );
    }

    return res(
      ctx.status(200),
      ctx.json({ message: '투자 신청이 완료되었습니다.' }),
    );
  }),
  rest.get('/contract/investments/statistics', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        byAge: [
          { group: '10s', count: 150, amount: 500000, ratio: 12 },
          { group: '20s', count: 300, amount: 1200000, ratio: 24 },
          { group: '30s', count: 500, amount: 2400000, ratio: 32 },
          { group: '40s', count: 400, amount: 1800000, ratio: 20 },
          { group: '50+', count: 200, amount: 1000000, ratio: 12 },
        ],
        byFamilyStatus: [
          { group: 'single', count: 500, amount: 2200000, ratio: 35 },
          {
            group: 'married_with_children',
            count: 400,
            amount: 2000000,
            ratio: 30,
          },
          {
            group: 'married_without_children',
            count: 300,
            amount: 1500000,
            ratio: 25,
          },
          { group: 'other', count: 100, amount: 500000, ratio: 10 },
        ],
        byResidence: [
          { group: 'own', count: 400, amount: 1800000, ratio: 28 },
          { group: 'apartment', count: 300, amount: 1600000, ratio: 25 },
          { group: 'companyHousing', count: 100, amount: 400000, ratio: 10 },
          { group: 'multiHouse', count: 150, amount: 700000, ratio: 12 },
          { group: 'publicRental', count: 200, amount: 800000, ratio: 15 },
          { group: 'other', count: 150, amount: 600000, ratio: 10 },
        ],
        byIndustry: [
          { industry: 0, ratio: 1.2 },
          { industry: 1, ratio: 2.4 },
          { industry: 2, ratio: 0.5 },
          { industry: 3, ratio: 1.8 },
          { industry: 4, ratio: 3.1 },
          { industry: 5, ratio: 5.6 },
          { industry: 6, ratio: 0.7 },
          { industry: 7, ratio: 10.3 },
          { industry: 8, ratio: 4.2 },
          { industry: 9, ratio: 5.5 },
          { industry: 10, ratio: 9.8 },
          { industry: 11, ratio: 2.1 },
          { industry: 12, ratio: 6.3 },
          { industry: 13, ratio: 2.7 },
          { industry: 14, ratio: 1.9 },
          { industry: 15, ratio: 13.5 },
          { industry: 16, ratio: 2.2 },
          { industry: 17, ratio: 3.0 },
          { industry: 18, ratio: 1.0 },
          { industry: 19, ratio: 0.9 },
        ],
      }),
    );
  }),
  rest.post('/api/contract/loans/transactions/search', (req, res, ctx) => {
    const {
      startDate,
      endDate,
      types,
      page = 1,
      pageSize = 10,
      sort = [],
    } = req.body as {
      startDate?: string;
      endDate?: string;
      types?: string[];
      page?: number;
      pageSize?: number;
      sort?: Array<{ field: string; order: string }>;
    };

    interface Transaction {
      id: string;
      contractId: number;
      amount: string;
      createdAt: string;
      status: string;
      dueDate: string;
      interestRate: string;
      detail: {
        date: string;
        amount: string;
        balance: string;
        type: string;
      }[];
      [key: string]: string | number | object[] | unknown;
    }

    const allTransactions: Transaction[] = [
      {
        id: 'loan-1',
        contractId: 1,
        amount: '₩ 10,000,000',
        createdAt: '2024-01-01',
        status: '상환중',
        dueDate: '2025-01-01',
        interestRate: '6.5%',
        detail: [
          {
            date: '2024-03-01',
            amount: '₩ 100,000',
            balance: '₩ 9,900,000',
            type: '이자 납부',
          },
          {
            date: '2024-06-01',
            amount: '₩ 1,000,000',
            balance: '₩ 8,900,000',
            type: '원금 상환',
          },
        ],
      },
      {
        id: 'loan-2',
        contractId: 2,
        amount: '₩ 20,000,000',
        createdAt: '2024-02-01',
        status: '상환완료',
        dueDate: '2025-02-01',
        interestRate: '7.0%',
        detail: [
          {
            date: '2024-03-15',
            amount: '₩ 120,000',
            balance: '₩ 0',
            type: '완납',
          },
        ],
      },
      {
        id: 'loan-3',
        contractId: 3,
        amount: '₩ 15,000,000',
        createdAt: '2024-03-10',
        status: '연체',
        dueDate: '2025-03-10',
        interestRate: '8.2%',
        detail: [
          {
            date: '2024-04-10',
            amount: '₩ 120,000',
            balance: '₩ 14,880,000',
            type: '이자 납부',
          },
          {
            date: '2024-05-10',
            amount: '₩ 0',
            balance: '₩ 14,880,000',
            type: '연체',
          },
        ],
      },
      {
        id: 'loan-4',
        contractId: 4,
        amount: '₩ 5,000,000',
        createdAt: '2024-04-05',
        status: '상환중',
        dueDate: '2024-12-05',
        interestRate: '5.5%',
        detail: [
          {
            date: '2024-05-05',
            amount: '₩ 100,000',
            balance: '₩ 4,900,000',
            type: '이자 납부',
          },
        ],
      },
      {
        id: 'loan-5',
        contractId: 5,
        amount: '₩ 30,000,000',
        createdAt: '2024-01-20',
        status: '상환완료',
        dueDate: '2025-01-20',
        interestRate: '6.0%',
        detail: [
          {
            date: '2024-03-01',
            amount: '₩ 1,000,000',
            balance: '₩ 29,000,000',
            type: '원금 상환',
          },
          {
            date: '2024-07-01',
            amount: '₩ 29,000,000',
            balance: '₩ 0',
            type: '완납',
          },
        ],
      },
      {
        id: 'loan-6',
        contractId: 6,
        amount: '₩ 12,000,000',
        createdAt: '2024-05-10',
        status: '상환중',
        dueDate: '2025-05-10',
        interestRate: '6.8%',
        detail: [
          {
            date: '2024-06-10',
            amount: '₩ 100,000',
            balance: '₩ 11,900,000',
            type: '이자 납부',
          },
        ],
      },
      {
        id: 'loan-7',
        contractId: 7,
        amount: '₩ 8,000,000',
        createdAt: '2023-12-20',
        status: '상환완료',
        dueDate: '2024-12-20',
        interestRate: '5.2%',
        detail: [
          {
            date: '2024-01-20',
            amount: '₩ 8,000,000',
            balance: '₩ 0',
            type: '일시 상환',
          },
        ],
      },
      {
        id: 'loan-8',
        contractId: 8,
        amount: '₩ 50,000,000',
        createdAt: '2024-06-01',
        status: '상환중',
        dueDate: '2026-06-01',
        interestRate: '9.1%',
        detail: [
          {
            date: '2024-07-01',
            amount: '₩ 500,000',
            balance: '₩ 49,500,000',
            type: '이자 납부',
          },
          {
            date: '2024-10-01',
            amount: '₩ 5,000,000',
            balance: '₩ 44,500,000',
            type: '원금 상환',
          },
        ],
      },
      {
        id: 'loan-9',
        contractId: 9,
        amount: '₩ 6,500,000',
        createdAt: '2024-03-22',
        status: '연체',
        dueDate: '2025-03-22',
        interestRate: '7.3%',
        detail: [
          {
            date: '2024-04-22',
            amount: '₩ 0',
            balance: '₩ 6,500,000',
            type: '연체',
          },
        ],
      },
      {
        id: 'loan-10',
        contractId: 10,
        amount: '₩ 18,000,000',
        createdAt: '2024-02-14',
        status: '상환중',
        dueDate: '2025-02-14',
        interestRate: '6.0%',
        detail: [
          {
            date: '2024-03-14',
            amount: '₩ 180,000',
            balance: '₩ 17,820,000',
            type: '이자 납부',
          },
          {
            date: '2024-05-14',
            amount: '₩ 2,000,000',
            balance: '₩ 15,820,000',
            type: '원금 상환',
          },
        ],
      },
      {
        id: 'loan-11',
        contractId: 11,
        amount: '₩ 30,000,000',
        createdAt: '2024-01-15',
        status: '상환중',
        dueDate: '2025-01-15',
        interestRate: '5.8%',
        detail: [
          {
            date: '2024-02-15',
            amount: '₩ 290,000',
            balance: '₩ 29,710,000',
            type: '이자 납부',
          },
        ],
      },
      {
        id: 'loan-12',
        contractId: 12,
        amount: '₩ 15,000,000',
        createdAt: '2024-03-05',
        status: '상환완료',
        dueDate: '2025-03-05',
        interestRate: '6.2%',
        detail: [
          {
            date: '2024-08-05',
            amount: '₩ 15,000,000',
            balance: '₩ 0',
            type: '완납',
          },
        ],
      },
      {
        id: 'loan-13',
        contractId: 13,
        amount: '₩ 5,000,000',
        createdAt: '2024-04-18',
        status: '상환중',
        dueDate: '2025-04-18',
        interestRate: '4.9%',
        detail: [
          {
            date: '2024-05-18',
            amount: '₩ 50,000',
            balance: '₩ 4,950,000',
            type: '이자 납부',
          },
        ],
      },
      {
        id: 'loan-14',
        contractId: 14,
        amount: '₩ 40,000,000',
        createdAt: '2024-06-22',
        status: '연체',
        dueDate: '2026-06-22',
        interestRate: '7.5%',
        detail: [
          {
            date: '2024-07-22',
            amount: '₩ 0',
            balance: '₩ 40,000,000',
            type: '연체',
          },
        ],
      },
      {
        id: 'loan-15',
        contractId: 15,
        amount: '₩ 22,000,000',
        createdAt: '2024-02-01',
        status: '상환중',
        dueDate: '2025-02-01',
        interestRate: '6.3%',
        detail: [
          {
            date: '2024-03-01',
            amount: '₩ 220,000',
            balance: '₩ 21,780,000',
            type: '이자 납부',
          },
          {
            date: '2024-06-01',
            amount: '₩ 2,000,000',
            balance: '₩ 19,780,000',
            type: '원금 상환',
          },
        ],
      },
      {
        id: 'loan-16',
        contractId: 16,
        amount: '₩ 27,000,000',
        createdAt: '2024-01-25',
        status: '상환완료',
        dueDate: '2024-12-25',
        interestRate: '5.5%',
        detail: [
          {
            date: '2024-11-25',
            amount: '₩ 27,000,000',
            balance: '₩ 0',
            type: '완납',
          },
        ],
      },
      {
        id: 'loan-17',
        contractId: 17,
        amount: '₩ 11,000,000',
        createdAt: '2024-05-07',
        status: '상환중',
        dueDate: '2025-05-07',
        interestRate: '6.1%',
        detail: [
          {
            date: '2024-06-07',
            amount: '₩ 100,000',
            balance: '₩ 10,900,000',
            type: '이자 납부',
          },
        ],
      },
      {
        id: 'loan-18',
        contractId: 18,
        amount: '₩ 13,000,000',
        createdAt: '2023-11-11',
        status: '상환완료',
        dueDate: '2024-11-11',
        interestRate: '5.7%',
        detail: [
          {
            date: '2024-10-11',
            amount: '₩ 13,000,000',
            balance: '₩ 0',
            type: '완납',
          },
        ],
      },
      {
        id: 'loan-19',
        contractId: 19,
        amount: '₩ 17,500,000',
        createdAt: '2024-04-30',
        status: '연체',
        dueDate: '2025-04-30',
        interestRate: '6.9%',
        detail: [
          {
            date: '2024-05-30',
            amount: '₩ 0',
            balance: '₩ 17,500,000',
            type: '연체',
          },
        ],
      },
      {
        id: 'loan-20',
        contractId: 20,
        amount: '₩ 19,000,000',
        createdAt: '2024-03-03',
        status: '상환중',
        dueDate: '2025-03-03',
        interestRate: '6.4%',
        detail: [
          {
            date: '2024-04-03',
            amount: '₩ 190,000',
            balance: '₩ 18,810,000',
            type: '이자 납부',
          },
        ],
      },
    ];

    let filteredTransactions: Transaction[] = [...allTransactions];

    if (startDate && endDate) {
      filteredTransactions = filteredTransactions.filter((transaction) => {
        const transactionDate = new Date(transaction.createdAt);
        const start = new Date(startDate);
        const end = new Date(endDate);

        start.setHours(0, 0, 0, 0);
        end.setHours(23, 59, 59, 999);

        return transactionDate >= start && transactionDate <= end;
      });
    }

    if (types && types.length > 0) {
      filteredTransactions = filteredTransactions.filter((transaction) => {
        return types.includes(transaction.status);
      });
    }

    if (sort.length > 0) {
      filteredTransactions.sort((a, b) =>
        sort.reduce((result, { field, order }) => {
          if (result !== 0) return result;

          const valueA = a[field];
          const valueB = b[field];

          let currentComparisonResult: number;

          if (field === 'createdAt' || field === 'dueDate') {
            const parseDate = (dateString: string) => {
              const match = dateString.match(/^(\d{4})-(\d{2})-(\d{2})/);
              if (match) {
                return new Date(
                  parseInt(match[1], 10),
                  parseInt(match[2], 10) - 1,
                  parseInt(match[3], 10),
                );
              }
              return new Date(dateString);
            };

            const dateA =
              valueA && typeof valueA === 'string'
                ? parseDate(valueA)
                : new Date(0);
            const dateB =
              valueB && typeof valueB === 'string'
                ? parseDate(valueB)
                : new Date(0);

            currentComparisonResult =
              order === 'asc'
                ? dateA.getTime() - dateB.getTime()
                : dateB.getTime() - dateA.getTime();
          } else if (typeof valueA === 'string' && typeof valueB === 'string') {
            if (valueA.includes('%') && valueB.includes('%')) {
              const numA = parseFloat(valueA.replace('%', ''));
              const numB = parseFloat(valueB.replace('%', ''));
              currentComparisonResult =
                order === 'asc' ? numA - numB : numB - numA;
            } else {
              currentComparisonResult =
                order === 'asc'
                  ? valueA.localeCompare(valueB)
                  : valueB.localeCompare(valueA);
            }
          } else if (typeof valueA === 'number' && typeof valueB === 'number') {
            currentComparisonResult =
              order === 'asc' ? valueA - valueB : valueB - valueA;
          } else {
            const strA = String(valueA);
            const strB = String(valueB);
            currentComparisonResult =
              order === 'asc'
                ? strA.localeCompare(strB)
                : strB.localeCompare(strA);
          }

          return currentComparisonResult;
        }, 0),
      );
    }

    const totalItemCount = filteredTransactions.length;
    const totalPage = Math.ceil(totalItemCount / pageSize);
    const startIndex = (page - 1) * pageSize;
    const paginatedTransactions = filteredTransactions.slice(
      startIndex,
      startIndex + pageSize,
    );

    return res(
      ctx.status(200),
      ctx.json({
        pagination: {
          page,
          pageSize,
          totalPage,
          totalItemCount,
        },
        transactions: paginatedTransactions,
      }),
    );
  }),
  // 대출 ID: loan-3 (연체 상태) 상세 정보
  rest.get('/api/contract/loans/loan-3', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        transactions: [
          {
            contractId: 3,
            loanId: 'loan-3',
            amount: '₩ 15,000,000',
            createdAt: '2024-03-10',
            status: '대출실행',
          },
          {
            contractId: 3,
            loanId: 'loan-3',
            amount: '₩ 120,000',
            createdAt: '2024-04-10',
            status: '원금상환',
          },
          {
            contractId: 3,
            loanId: 'loan-3',
            amount: '₩ 120,000',
            createdAt: '2024-05-10',
            status: '원금상환',
          },
        ],
      }),
    );
  }),

  // 대출 ID: loan-9 (연체 상태) 상세 정보
  rest.get('/api/contract/loans/loan-9', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        transactions: [
          {
            contractId: 9,
            loanId: 'loan-9',
            amount: '₩ 6,500,000',
            createdAt: '2024-03-22',
            status: '대출실행',
          },
          {
            contractId: 9,
            loanId: 'loan-9',
            amount: '₩ 47,500',
            createdAt: '2024-04-22',
            status: '원금상환',
          },
        ],
      }),
    );
  }),

  // 대출 ID: loan-14 (연체 상태) 상세 정보
  rest.get('/api/contract/loans/loan-14', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        transactions: [
          {
            contractId: 14,
            loanId: 'loan-14',
            amount: '₩ 40,000,000',
            createdAt: '2024-06-22',
            status: '대출실행',
          },
          {
            contractId: 14,
            loanId: 'loan-14',
            amount: '₩ 300,000',
            createdAt: '2024-07-22',
            status: '원금상환',
          },
        ],
      }),
    );
  }),

  // 대출 ID: loan-19 (연체 상태) 상세 정보
  rest.get('/api/contract/loans/loan-19', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        transactions: [
          {
            contractId: 19,
            loanId: 'loan-19',
            amount: '₩ 17,500,000',
            createdAt: '2024-04-30',
            status: '대출실행',
          },
          {
            contractId: 19,
            loanId: 'loan-19',
            amount: '₩ 120,750',
            createdAt: '2024-05-30',
            status: '원금상환',
          },
        ],
      }),
    );
  }),
];

export default handlers;
