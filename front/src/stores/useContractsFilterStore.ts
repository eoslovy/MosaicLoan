import { create } from 'zustand';

interface ContractsFilterState {
  investmentIds: number[] | null;
  setFilter: (ids: number[]) => void;
}

const useContractsFilterStore = create<ContractsFilterState>((set) => ({
  investmentIds: null,
  setFilter: (ids) => set({ investmentIds: ids }),
}));

export default useContractsFilterStore;
