export interface GroupData {
  group: string;
  count: number;
  amount: number;
  ratio: number;
}

export interface IndustryData {
  industry: number;
  ratio: number;
}

export interface UserData {
  byAge: GroupData[];
  byFamilyStatus: GroupData[];
  byResidence: GroupData[];
  byIndustry: IndustryData[];
}
