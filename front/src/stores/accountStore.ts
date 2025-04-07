import { create } from 'zustand';

interface AccountState {
  balance: number;
  isFetched: boolean;
  setBalance: (amount: number) => void;
  setIsFetched: (fetched: boolean) => void;
}

const useAccountStore = create<AccountState>((set) => ({
  balance: 0,
  isFetched: false,
  setBalance: (amount) => set({ balance: amount }),
  setIsFetched: (fetched) => set({ isFetched: fetched }),
}));

export default useAccountStore;
