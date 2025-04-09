'use client';

import { useEffect, useRef, useState } from 'react';
import { postCreditEvaluation } from '@/service/apis/borrow';
import { useUserStore } from '@/stores/userStore';

const useCreditEvaluation = ({ onCompleted }: { onCompleted: () => void }) => {
  const [step, setStep] = useState<0 | 1 | 2>(0);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const pingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const { user } = useUserStore();

  const isMock = process.env.NEXT_PUBLIC_API_MOCKING === 'enabled';

  const startEvaluation = async () => {
    if (!user?.id) return;

    try {
      setIsEvaluating(true);
      setStep(0);

      const today = new Date().toISOString().split('T')[0];
      await postCreditEvaluation({ appliedAt: today });
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

      const ws = new WebSocket(`${process.env.CREDIT_WEBSOCKET_URL}?memberId=${user.id}`);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log('[WS] 연결 성공');

        // ping 인터벌 시작
        pingIntervalRef.current = setInterval(() => {
          if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({ type: 'ping' }));
          }
        }, 30000); // 30초마다 ping
      };

      ws.onmessage = ({ data }) => {
        console.log('[WS] 메시지 수신:', data);
        const parsed = JSON.parse(data);
        if (parsed?.status === 'completed') {
          setStep(2);
          setTimeout(() => {
            setIsEvaluating(false);
            onCompleted?.();
            ws.close();
          }, 1000);
        } else {
          setStep(0);
          setIsEvaluating(false);
          ws.close();
        }
      };

      ws.onerror = (err) => {
        console.error('[WS] 오류 발생:', err);
        setStep(0);
        setIsEvaluating(false);
        if (pingIntervalRef.current) {
          clearInterval(pingIntervalRef.current);
          pingIntervalRef.current = null;
        }
      };

      ws.onclose = () => {
        console.log('[WS] 연결 종료');
        if (pingIntervalRef.current) {
          clearInterval(pingIntervalRef.current);
          pingIntervalRef.current = null;
        }
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
