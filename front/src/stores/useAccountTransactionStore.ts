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

      set({
        isLoading: true,
        error: null,
        filterState: { startDate, endDate, types }, // 현재 필터 상태 저장
      });

      try {
        const res = await request.POST<{
          transactions: AccountTransaction[];
          pagination: PaginationInfo;
        }>('/api/account/accounts/transactions/search', {
          startDate,
          endDate,
          types,
          page,
          pageSize,
        });

        set({
          transactions: res.transactions,
          pagination: res.pagination,
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
