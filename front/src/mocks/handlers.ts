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
];

export default handlers;
