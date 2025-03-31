import type { BasicTableRow } from '@/types/components';

/**
 * rows: 기존 데이터 행
 * total: 고정하고 싶은 행 개수 (예: 7행)
 * cellCount: 한 행에 들어갈 셀 개수
 * prefix: key 이름 앞에 붙을 문자열 (default: 'empty')
 */
const fillEmptyRows = (
  rows: BasicTableRow[],
  total: number,
  cellCount: number,
  prefix = 'empty',
): BasicTableRow[] => {
  const emptyRowCount = total - rows.length;

  if (emptyRowCount <= 0) return rows;

  const emptyRows: BasicTableRow[] = Array.from(
    { length: emptyRowCount },
    (_, i) => ({
      key: `${prefix}-${i}`,
      cells: Array.from({ length: cellCount }, (__, j) => ({
        key: `${prefix}-${i}-${j}`,
        content: '',
      })),
    }),
  );

  return [...rows, ...emptyRows];
};

export default fillEmptyRows;
