import { create } from 'zustand';
import request from '@/service/apis/request';
import {
  AccountTransaction,
  PaginationInfo,
  AccountTransactionType,
} from '@/types/pages';

interface FilterState {
  startDate: string;
  endDate: string;
  types: AccountTransactionType[];
}

interface AccountTransactionStore {
  transactions: AccountTransaction[];
  pagination: PaginationInfo;
  isLoading: boolean;
  error: string | null;

  filterState: FilterState;

  fetchTransactions: (
    override?: Partial<FilterState & { page: number; pageSize: number }>,
  ) => Promise<void>;
}

const useAccountTransactionStore = create<AccountTransactionStore>(
  (set, get) => ({
    transactions: [],
    pagination: {
      page: 1,
      pageSize: 10,
      totalPage: 1,
      totalItemCount: 0,
    },
    isLoading: false,
    error: null,
    filterState: {
      startDate: '',
      endDate: '',
      types: [],
    },

    fetchTransactions: async (override = {}) => {
      const state = get();

      const startDate = override.startDate ?? state.filterState.startDate;
      const endDate = override.endDate ?? state.filterState.endDate;
      const types = override.types ?? state.filterState.types;
      const page = override.page ?? state.pagination.page;
      const pageSize = override.pageSize ?? state.pagination.pageSize;

      // 디버깅 로그 추가
      console.log('fetchTransactions 요청 파라미터:', { startDate, endDate, types, page, pageSize });

      set({
        isLoading: true,
        error: null,
        filterState: { startDate, endDate, types }, // 현재 필터 상태 저장
      });

      try {
        const res = await request.POST<{
          transactions: AccountTransaction[];
          pagination: PaginationInfo;
        }>('/account/accounts/transactions/search', {
          startDate,
          endDate,
          types,
          page,
          pageSize,
        });

        // 디버깅 로그 추가
        console.log('API 응답:', res);

        // 중요: 응답에서 받은 pagination과 요청한 page를 조합
        // API가 올바른 페이지 번호를 반환하지 않을 경우를 대비
        set({
          transactions: res.transactions,
          pagination: {
            ...res.pagination,
            page: page, // 요청한 페이지 번호로 명시적 설정
          },
          isLoading: false,
        });
      } catch (err: unknown) {
        if (err instanceof Error) {
          set({
            isLoading: false,
            error: err.message,
          });
        } else {
          set({
            isLoading: false,
            error: '거래 내역을 불러오지 못했습니다.',
          });
        }
      }
    },
  }),
);

export default useAccountTransactionStore;