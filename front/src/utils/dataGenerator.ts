import { GroupData, IndustryData, UserData } from '@/types/seedRandom';
import SeededRandom from '@/utils/seededRandom';

const templateData: UserData = {
  byAge: [
    { group: '10s', count: 200, amount: 900000, ratio: 23 },
    { group: '20s', count: 200, amount: 900000, ratio: 23 },
    { group: '30s', count: 200, amount: 900000, ratio: 23 },
    { group: '40s', count: 200, amount: 900000, ratio: 23 },
    { group: '50+', count: 200, amount: 900000, ratio: 23 },
  ],
  byFamilyStatus: [
    { group: 'single', count: 200, amount: 900000, ratio: 23 },
    { group: 'married_with_children', count: 200, amount: 900000, ratio: 23 },
    {
      group: 'married_without_children',
      count: 200,
      amount: 900000,
      ratio: 23,
    },
    { group: 'other', count: 200, amount: 900000, ratio: 23 },
  ],
  byResidence: [
    { group: 'own', count: 200, amount: 900000, ratio: 23 },
    { group: 'apartment', count: 200, amount: 900000, ratio: 23 },
    { group: 'companyHousing', count: 200, amount: 900000, ratio: 23 },
    { group: 'multiHouse', count: 200, amount: 900000, ratio: 23 },
    { group: 'publicRental', count: 200, amount: 900000, ratio: 23 },
    { group: 'other', count: 200, amount: 900000, ratio: 23 },
  ],
  byIndustry: [
    { industry: 0, ratio: 0.5 },
    { industry: 1, ratio: 9.6 },
    { industry: 2, ratio: 0.3 },
    { industry: 3, ratio: 3.5 },
    { industry: 4, ratio: 4.1 },
    { industry: 5, ratio: 6.5 },
    { industry: 6, ratio: 1.8 },
    { industry: 7, ratio: 15.2 },
    { industry: 8, ratio: 5.9 },
    { industry: 9, ratio: 7.2 },
    { industry: 10, ratio: 10.8 },
    { industry: 11, ratio: 3.1 },
    { industry: 12, ratio: 8.3 },
    { industry: 13, ratio: 2.0 },
    { industry: 14, ratio: 1.5 },
    { industry: 15, ratio: 12.5 },
    { industry: 16, ratio: 2.8 },
    { industry: 17, ratio: 2.4 },
    { industry: 18, ratio: 1.2 },
    { industry: 19, ratio: 0.8 },
  ],
};

function generateRandomData(userId: string | number): UserData {
  const numericSeed =
    typeof userId === 'string'
      ? userId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
      : userId;

  const random = new SeededRandom(numericSeed);

  const byAgeWithCounts = templateData.byAge.map((item) => ({
    ...item,
    count: random.nextInt(100, 500),
    amount: random.nextInt(500000, 1500000),
  }));

  const byAge = calculateRatiosFromCounts(byAgeWithCounts);

  const byFamilyStatusWithCounts = templateData.byFamilyStatus.map((item) => ({
    ...item,
    count: random.nextInt(150, 450),
    amount: random.nextInt(600000, 1200000),
  }));

  const byFamilyStatus = calculateRatiosFromCounts(byFamilyStatusWithCounts);

  const byResidenceWithCounts = templateData.byResidence.map((item) => ({
    ...item,
    count: random.nextInt(120, 350),
    amount: random.nextInt(750000, 1300000),
  }));

  const byResidence = calculateRatiosFromCounts(byResidenceWithCounts);

  const byIndustry = (() => {
    const updated = templateData.byIndustry.map((item) => ({
      ...item,
      ratio: random.nextFloat(item.ratio * 0.7, item.ratio * 1.3),
    }));

    const total = updated.reduce((sum, item) => sum + item.ratio, 0);

    let normalized = updated.map((item) => ({
      ...item,
      ratio: +((item.ratio / total) * 100).toFixed(1),
    }));

    const finalTotal = normalized.reduce((sum, item) => sum + item.ratio, 0);
    if (Math.abs(finalTotal - 100) < 1) {
      normalized = normalized.map((item, index) =>
        index === normalized.length - 1
          ? { ...item, ratio: +(item.ratio + (100 - finalTotal)).toFixed(1) }
          : item,
      );
    }

    return normalized;
  })();

  return {
    byAge,
    byFamilyStatus,
    byResidence,
    byIndustry,
  };
}

function calculateRatiosFromCounts(items: GroupData[]): GroupData[] {
  const totalCount = items.reduce((sum, item) => sum + item.count, 0);

  let withRatios = items.map((item) => ({
    ...item,
    ratio: Math.round((item.count / totalCount) * 100),
  }));

  const totalRatio = withRatios.reduce((sum, item) => sum + item.ratio, 0);
  if (totalRatio !== 100) {
    withRatios = withRatios.map((item, index) =>
      index === withRatios.length - 1
        ? { ...item, ratio: item.ratio + (100 - totalRatio) }
        : item,
    );
  }
  
  return withRatios;
}

export default generateRandomData;
