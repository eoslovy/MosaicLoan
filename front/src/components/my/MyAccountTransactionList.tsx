'use client';

// import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useContractsFilterStore from '@/stores/useContractsFilterStore';
import useAccountTransactionStore from '@/stores/useAccountTransactionStore';
import BasicTable from '@/components/common/BasicTable';
import Pagination from '@/components/common/Pagination';
import Pill from '@/components/common/Pill';
import styles from '@/styles/my/MyAccountTransactionList.module.scss';
import type { PillVariant } from '@/types/components';

const getTypeLabel = (type: string) => {
  switch (type) {
    case 'EXTERNAL_IN':
      return '입금';
    case 'EXTERNAL_OUT':
      return '출금';
    case 'INVESTMENT_IN':
      return '투자금 환급';
    case 'INVESTMENT_OUT':
      return '투자금 입금';
    case 'LOAN_IN':
      return '대출금 입금';
    case 'LOAN_OUT':
      return '대출금 상환';
    default:
      return type;
  }
};

const getTypeVariant = (type: string): PillVariant => {
  switch (type) {
    case 'INVESTMENT_IN':
      return 'investment-refund';
    case 'INVESTMENT_OUT':
      return 'investment-deposit';
    case 'LOAN_IN':
      return 'loan-deposit';
    case 'LOAN_OUT':
      return 'loan-repayment';
    case 'EXTERNAL_IN':
      return 'deposit';
    case 'EXTERNAL_OUT':
      return 'withdraw';
    default:
      return 'deposit';
  }
};

const ActionButton = ({
  type,
  targetId,
}: {
  type: string;
  targetId: number;
}) => {
  const router = useRouter();
  const { setFilter } = useContractsFilterStore();

  if (type === 'INVESTMENT_IN' || type === 'INVESTMENT_OUT') {
    return (
      <button
        type='button'
        className={styles.detailButton}
        onClick={() => {
          setFilter([targetId]);
          router.push('/investor/contracts');
        }}
      >
        투자상품 상세
      </button>
    );
  }

  if (type === 'LOAN_IN' || type === 'LOAN_OUT') {
    return (
      <button
        type='button'
        className={styles.detailButton}
        onClick={() => {
          setFilter([targetId]);
          router.push('/borrower');
        }}
      >
        대출정보 상세
      </button>
    );
  }

  return null;
};

const MyAccountTransactionList = () => {
  const { transactions, pagination, isLoading, fetchTransactions } =
    useAccountTransactionStore();

  const tableColumns = ['거래일', '금액', '잔액', '내용', '유형', ''];

  const handlePageChange = (nextPage: number) => {
    fetchTransactions({ page: nextPage });
  };

  return (
    <section className={styles.container}>
      <BasicTable
        title='계좌 입출금 내역'
        columns={tableColumns}
        rows={transactions.map((tx, idx) => ({
          key: `tx-${idx}`,
          cells: [
            {
              key: `date-${idx}`,
              content: <span className={styles.cellWrap}>{tx.createdAt}</span>,
            },
            {
              key: `amount-${idx}`,
              content: (
                <span className={styles.cellWrap}>
                  {tx.amount.toLocaleString()} ₩
                </span>
              ),
            },
            {
              key: `cash-${idx}`,
              content: (
                <span className={styles.cellWrap}>
                  {tx.cash.toLocaleString()} ₩
                </span>
              ),
            },
            {
              key: `content-${idx}`,
              content: <span className={styles.cellWrap}>{tx.content}</span>,
            },
            {
              key: `type-${idx}`,
              content: (
                <Pill
                  variant={getTypeVariant(tx.type)}
                  className={styles.cellWrap}
                >
                  {getTypeLabel(tx.type)}
                </Pill>
              ),
            },
            {
              key: `action-${idx}`,
              content: (
                <div className={styles.cellWrap}>
                  <ActionButton type={tx.type} targetId={tx.targetId} />
                </div>
              ),
            },
          ],
        }))}
      />

      <Pagination
        currentPage={pagination.page}
        totalPages={pagination.totalPage}
        onPageChange={handlePageChange}
      />
    </section>
  );
};

export default MyAccountTransactionList;
