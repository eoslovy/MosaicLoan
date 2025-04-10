import { useState, useEffect, useMemo } from 'react';
import { UserData } from '@/types/seedRandom';
import { generateRandomData } from '@/utils/dataGenerator';

interface UseRandomDataOptions {
  userId: number;
  refreshInterval?: number | null;
}

export default function useRandomData({ 
  userId, 
  refreshInterval = null 
}: UseRandomDataOptions): {
  data: UserData;
  refresh: () => void;
  isLoading: boolean;
} {
  const [data, setData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const generateData = () => {
    setIsLoading(true);
    setTimeout(() => {
      const newData = generateRandomData(userId);
      setData(newData);
      setIsLoading(false);
    }, 10);
  };
  
  useEffect(() => {
    generateData();
    
    if (refreshInterval) {
      const interval = setInterval(generateData, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [userId, refreshInterval]);
  
  return {
    data: data as UserData,
    refresh: generateData,
    isLoading
  };
}