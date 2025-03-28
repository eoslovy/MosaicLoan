'use client';

import React from 'react';
import styles from '@/styles/components/FilterSelectedList.module.scss';

interface FilterSelectedListProps {
  data: { id: string; name: string }[];
  selectedIds: string[];
  onSelect: (selected: string[]) => void;
}

const FilterSelectedList: React.FC<FilterSelectedListProps> = ({
  data,
  selectedIds,
  onSelect,
}) => {
  const toggleSelection = (id: string) => {
    if (selectedIds.includes(id)) {
      onSelect(selectedIds.filter((item) => item !== id));
    } else {
      onSelect([...selectedIds, id]);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.headerRow}>
        <label htmlFor='selectAll'>
          <input
            type='checkbox'
            id='selectAll'
            checked={selectedIds.length === data.length}
            onChange={() =>
              onSelect(
                selectedIds.length === data.length
                  ? []
                  : data.map((item) => item.id),
              )
            }
          />
          전체 선택
        </label>
        <span className={styles.count}>
          총 {data.length}건 중 {selectedIds.length}건
        </span>
      </div>

      <div className={styles.tableWrapper}>
        <ul className={styles.selectedList}>
          {data.map((item) => (
            <li key={item.id} className={styles.listItem}>
              <label htmlFor={`select-${item.id}`}>
                <input
                  type='checkbox'
                  id={`select-${item.id}`}
                  checked={selectedIds.includes(item.id)}
                  onChange={() => toggleSelection(item.id)}
                />
                {item.name}
              </label>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default FilterSelectedList;
