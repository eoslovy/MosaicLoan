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
];

export default handlers;
