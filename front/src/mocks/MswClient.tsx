'use client';

import { useEffect, useState } from 'react';
import mockEnable from '@/utils/mock';

const MswClient = ({ children }: { children: React.ReactNode }) => {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    mockEnable().finally(() => setReady(true));
  }, []);

  if (!ready) return <div>Loading mocks...</div>;

  return children;
};

export default MswClient;
