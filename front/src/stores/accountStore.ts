import { create } from 'zustand';

interface AccountState {
  balance: number;
  setBalance: (amount: number) => void;
}

const useAccountStore = create<AccountState>((set) => ({
  balance: 0,
  setBalance: (amount) => set({ balance: amount }),
}));

export default useAccountStore;
