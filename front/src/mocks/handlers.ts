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
        totalContractCount: idx % 2 === 0 ? 5 : 10,
        statusDistribution: {
          completed: idx % 3,
          active: idx % 5,
          default: idx % 2,
          transferred: 0,
        },
      })),
    };

    return res(ctx.status(200), ctx.json(mockData));
  }),
  rest.get('/credit/evaluations/recent', (req, res, ctx) => {
    return res(
      ctx.status(404),
      ctx.json({
        maxLoanLimit: 123000,
        interestRate: 90,
        creditScore: 850,
      }),
    );
  }),
  rest.post('/credit/evaluations', async (req, res, ctx) => {
    const { appliedAt } = await req.json();

    console.log(`신용평가 req - 날짜: ${appliedAt}`);

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
  rest.post('/contract/investments/transactions/search', (req, res, ctx) => {
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
        interestRate: '6.5%',
      },
      {
        id: 1002,
        contractId: 5001,
        investmentId: 1,
        amount: '650000',
        createdAt: '2025-03-01',
        status: '이자상환',
        bondMaturity: '2025-09-01',
        interestRate: '6.5%',
      },
      {
        id: 1003,
        contractId: 5002,
        investmentId: 1,
        amount: '15000000',
        createdAt: '2025-03-02',
        status: '원금상환',
        bondMaturity: '2025-09-02',
        interestRate: '6.5%',
      },
      {
        id: 1004,
        contractId: 5002,
        investmentId: 1,
        amount: '975000',
        createdAt: '2025-03-02',
        status: '이자상환',
        bondMaturity: '2025-09-02',
        interestRate: '6.5%',
      },
      {
        id: 1005,
        contractId: 5003,
        investmentId: 2,
        amount: '8000000',
        createdAt: '2025-03-05',
        status: '원금상환',
        bondMaturity: '2025-09-05',
        interestRate: '6.6%',
      },
      {
        id: 1006,
        contractId: 5003,
        investmentId: 2,
        amount: '528000',
        createdAt: '2025-03-05',
        status: '이자상환',
        bondMaturity: '2025-09-05',
        interestRate: '6.6%',
      },
      {
        id: 1007,
        contractId: 5004,
        investmentId: 2,
        amount: '12000000',
        createdAt: '2025-03-07',
        status: '원금상환',
        bondMaturity: '2025-09-07',
        interestRate: '6.6%',
      },
      {
        id: 1008,
        contractId: 5004,
        investmentId: 2,
        amount: '792000',
        createdAt: '2025-03-07',
        status: '이자상환',
        bondMaturity: '2025-09-07',
        interestRate: '6.6%',
      },
      {
        id: 1009,
        contractId: 5005,
        investmentId: 3,
        amount: '20000000',
        createdAt: '2025-03-10',
        status: '원금상환',
        bondMaturity: '2025-09-10',
        interestRate: '6.7%',
      },
      {
        id: 1010,
        contractId: 5005,
        investmentId: 3,
        amount: '1340000',
        createdAt: '2025-03-10',
        status: '이자상환',
        bondMaturity: '2025-09-10',
        interestRate: '6.7%',
      },
      {
        id: 1011,
        contractId: 5006,
        investmentId: 3,
        amount: '18000000',
        createdAt: '2025-03-12',
        status: '원금상환',
        bondMaturity: '2025-09-12',
        interestRate: '6.7%',
      },
      {
        id: 1012,
        contractId: 5006,
        investmentId: 3,
        amount: '1206000',
        createdAt: '2025-03-12',
        status: '이자상환',
        bondMaturity: '2025-09-12',
        interestRate: '6.7%',
      },
      {
        id: 1013,
        contractId: 5007,
        investmentId: 4,
        amount: '25000000',
        createdAt: '2025-03-15',
        status: '원금상환',
        bondMaturity: '2025-09-15',
        interestRate: '6.8%',
      },
      {
        id: 1014,
        contractId: 5007,
        investmentId: 4,
        amount: '1700000',
        createdAt: '2025-03-15',
        status: '이자상환',
        bondMaturity: '2025-09-15',
        interestRate: '6.8%',
      },
      {
        id: 1015,
        contractId: 5008,
        investmentId: 4,
        amount: '500000',
        createdAt: '2025-03-18',
        status: '환급',
        bondMaturity: '2025-09-18',
        interestRate: '6.8%',
      },
      {
        id: 1016,
        contractId: 5009,
        investmentId: 5,
        amount: '30000000',
        createdAt: '2025-03-20',
        status: '원금상환',
        bondMaturity: '2025-09-20',
        interestRate: '6.9%',
      },
      {
        id: 1017,
        contractId: 5009,
        investmentId: 5,
        amount: '2010000',
        createdAt: '2025-03-20',
        status: '이자상환',
        bondMaturity: '2025-09-20',
        interestRate: '6.9%',
      },
      {
        id: 1018,
        contractId: 5010,
        investmentId: 5,
        amount: '22000000',
        createdAt: '2025-03-22',
        status: '원금상환',
        bondMaturity: '2025-09-22',
        interestRate: '6.9%',
      },
      {
        id: 1019,
        contractId: 5010,
        investmentId: 5,
        amount: '1474000',
        createdAt: '2025-03-22',
        status: '이자상환',
        bondMaturity: '2025-09-22',
        interestRate: '6.9%',
      },
      {
        id: 1020,
        contractId: 5011,
        investmentId: 6,
        amount: '700000',
        createdAt: '2025-03-25',
        status: '환급',
        bondMaturity: '2025-09-25',
        interestRate: '7.0%',
      },
      {
        id: 1021,
        contractId: 5012,
        investmentId: 7,
        amount: '18000000',
        createdAt: '2025-03-27',
        status: '원금상환',
        bondMaturity: '2025-09-27',
        interestRate: '7.0%',
      },
      {
        id: 1022,
        contractId: 5012,
        investmentId: 7,
        amount: '1188000',
        createdAt: '2025-03-27',
        status: '이자상환',
        bondMaturity: '2025-09-27',
        interestRate: '7.0%',
      },
      {
        id: 1023,
        contractId: 5013,
        investmentId: 8,
        amount: '15000000',
        createdAt: '2025-03-29',
        status: '원금상환',
        bondMaturity: '2025-09-29',
        interestRate: '7.1%',
      },
      {
        id: 1024,
        contractId: 5013,
        investmentId: 8,
        amount: '1005000',
        createdAt: '2025-03-29',
        status: '이자상환',
        bondMaturity: '2025-09-29',
        interestRate: '7.1%',
      },
      {
        id: 1025,
        contractId: 5014,
        investmentId: 9,
        amount: '28000000',
        createdAt: '2025-03-30',
        status: '원금상환',
        bondMaturity: '2025-09-30',
        interestRate: '7.2%',
      },
      {
        id: 1026,
        contractId: 5014,
        investmentId: 9,
        amount: '1904000',
        createdAt: '2025-03-30',
        status: '이자상환',
        bondMaturity: '2025-09-30',
        interestRate: '7.2%',
      },
      {
        id: 1027,
        contractId: 5015,
        investmentId: 10,
        amount: '32000000',
        createdAt: '2025-03-31',
        status: '원금상환',
        bondMaturity: '2025-09-30',
        interestRate: '7.2%',
      },
      {
        id: 1028,
        contractId: 5015,
        investmentId: 10,
        amount: '2144000',
        createdAt: '2025-03-31',
        status: '이자상환',
        bondMaturity: '2025-09-30',
        interestRate: '7.2%',
      },
      {
        id: 1029,
        contractId: 5016,
        investmentId: 11,
        amount: '900000',
        createdAt: '2025-04-01',
        status: '환급',
        bondMaturity: '2025-10-01',
        interestRate: '7.3%',
      },
      {
        id: 1030,
        contractId: 5017,
        investmentId: 12,
        amount: '800000',
        createdAt: '2025-04-01',
        status: '환급',
        bondMaturity: '2025-10-01',
        interestRate: '7.3%',
      },
    ];

    let filteredTransactions: Transaction[] = [...allTransactions];

    try {
      if (startDate && endDate) {
        console.log('날짜 필터링:', startDate, 'to', endDate);
        console.log('필터링 전 트랜잭션 수:', filteredTransactions.length);

        filteredTransactions = filteredTransactions.filter((transaction) => {
          try {
            const transactionDate = new Date(transaction.createdAt);
            const start = new Date(startDate);
            const end = new Date(endDate);

            return transactionDate >= start && transactionDate <= end;
          } catch (e) {
            console.error('날짜 필터링 오류:', e);
            return true;
          }
        });

        console.log('날짜 필터링 후 트랜잭션 수:', filteredTransactions.length);
      }

      if (types && Array.isArray(types) && types.length > 0) {
        console.log('타입 필터링:', types);
        console.log('필터링 전 트랜잭션 수:', filteredTransactions.length);

        filteredTransactions = filteredTransactions.filter((transaction) =>
          types.includes(transaction.status),
        );

        console.log('타입 필터링 후 트랜잭션 수:', filteredTransactions.length);
      }

      if (
        investmentIds &&
        Array.isArray(investmentIds) &&
        investmentIds.length > 0
      ) {
        console.log('투자 ID 필터링:', investmentIds);
        console.log('필터링 전 트랜잭션 수:', filteredTransactions.length);
        console.log('현재 데이터의 투자 ID들:', [
          ...new Set(filteredTransactions.map((t) => t.investmentId)),
        ]);

        filteredTransactions = filteredTransactions.filter((transaction) =>
          investmentIds.includes(transaction.investmentId),
        );

        console.log(
          '투자 ID 필터링 후 트랜잭션 수:',
          filteredTransactions.length,
        );
      }

      if (sort && Array.isArray(sort) && sort.length > 0) {
        console.log('정렬 설정:', sort);

        filteredTransactions.sort((a, b) => {
          for (let i = 0; i < sort.length; i += 1) {
            const { field, order } = sort[i];

            if (field in a && field in b) {
              let result = 0;

              if (field === 'interestRate') {
                const aValue = parseFloat(String(a[field]).replace('%', ''));
                const bValue = parseFloat(String(b[field]).replace('%', ''));
                result =
                  aValue < bValue
                    ? order === 'asc'
                      ? -1
                      : 1
                    : aValue > bValue
                      ? order === 'asc'
                        ? 1
                        : -1
                      : 0;
              } else if (field === 'createdAt' || field === 'bondMaturity') {
                const aValue = new Date(a[field] as string).getTime();
                const bValue = new Date(b[field] as string).getTime();
                result =
                  aValue < bValue
                    ? order === 'asc'
                      ? -1
                      : 1
                    : aValue > bValue
                      ? order === 'asc'
                        ? 1
                        : -1
                      : 0;
              } else {
                const aValue = a[field];
                const bValue = b[field];
                result =
                  aValue < bValue
                    ? order === 'asc'
                      ? -1
                      : 1
                    : aValue > bValue
                      ? order === 'asc'
                        ? 1
                        : -1
                      : 0;
              }

              if (result !== 0) {
                return result;
              }
            }
          }

          return 0;
        });
      }
    } catch (error) {
      console.error('데이터 처리 중 오류:', error);
      return res(
        ctx.status(500),
        ctx.json({ error: '데이터 처리 중 오류가 발생했습니다' }),
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
];

export default handlers;
