import React from 'react';
import styles from '@/styles/components/BasicTable.module.scss';
import { BasicTableProps } from '@/types/components';
import Link from 'next/link';

const BasicTable: React.FC<BasicTableProps> = ({
  title,
  columns,
  rows,
  className,
  viewAllLink,
  showHeader = true,
}) => {
  return (
    <div className={`${styles.wrapper} ${className || ''}`}>
      {(title || viewAllLink) && (
        <div className={styles.header}>
          {title && <h3 className={styles.title}>{title}</h3>}
          {viewAllLink && (
            <Link href={viewAllLink} className={styles.viewAll}>
              전체보기 &gt;
            </Link>
          )}
        </div>
      )}

      <table className={styles.table}>
        {showHeader && (
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col}>{col}</th>
              ))}
            </tr>
          </thead>
        )}

        <tbody>
          {rows.map((row) => (
            <tr key={row.key}>
              {row.cells.map((cell) => (
                <td key={cell.key}>{cell.content || <>&nbsp;</>}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BasicTable;
