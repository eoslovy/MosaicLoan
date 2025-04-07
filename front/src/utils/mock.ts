const mockEnable = async () => {
  if (process.env.NEXT_PUBLIC_API_MOCKING !== 'enabled') return;

  const worker = (await import('@/mocks/browser')).default;
  await worker.start({
    onUnhandledRequest: 'bypass',
  });
  console.log('[MSW] Mock 서비스 워커 활성화됨');
};

export default mockEnable;
