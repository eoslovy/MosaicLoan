'use client';

import { useEffect, useRef, useState } from 'react';
import { postCreditEvaluation } from '@/service/apis/borrow';
import { useUserStore } from '@/stores/userStore';

const useCreditEvaluation = ({ onCompleted }: { onCompleted: () => void }) => {
  const [step, setStep] = useState<0 | 1 | 2>(0);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const { user } = useUserStore();

  const isMock = process.env.NEXT_PUBLIC_API_MOCKING === 'enabled';

  const startEvaluation = async () => {
    if (!user?.id) return;

    try {
      setIsEvaluating(true);
      setStep(0);

      const today = new Date().toISOString().split('T')[0];
      await postCreditEvaluation({ appliedAt: today, memberId: user.id });
      setStep(1);

      if (isMock) {
        console.log('[MOCK] WebSocket 시뮬레이션 시작');
        setTimeout(() => {
          console.log('[MOCK] 평가 완료 시뮬레이션 수신');
          setStep(2); // 먼저 완료 상태 보여줌
          setTimeout(() => {
            setIsEvaluating(false);
            onCompleted?.();
          }, 1000);
        }, 3000);
        return;
      }

      const ws = new WebSocket(`ws://localhost:8080/ws?memberId=${user.id}`);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log('[WS] 연결 성공');
      };

      ws.onmessage = (event) => {
        console.log('[WS] 메시지 수신:', event.data);
        const data = JSON.parse(event.data);
        if (data?.status === 'completed') {
          setStep(2);
          setTimeout(() => {
            setIsEvaluating(false);
            onCompleted?.();
            ws.close();
          }, 1000);
        }
      };

      ws.onerror = (err) => {
        console.error('[WS] 오류 발생:', err);
        setStep(0);
        setIsEvaluating(false);
      };

      ws.onclose = () => {
        console.log('[WS] 연결 종료');
      };
    } catch (e) {
      console.error('신용평가 요청 실패:', e);
      setIsEvaluating(false);
    }
  };

  useEffect(() => {
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  return { step, isEvaluating, startEvaluation };
};

export default useCreditEvaluation;
