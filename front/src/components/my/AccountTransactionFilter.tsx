// 'use client';

// import React from 'react';
// import DatePicker from 'react-datepicker';
// import 'react-datepicker/dist/react-datepicker.css';
// import styles from '@/styles/my/AccountTransactionFilter.module.scss';
// import type { AccountTransactionFilterProps } from '@/types/pages';
// import Button from '@/components/common/Button';

// const AccountTransactionFilter: React.FC<AccountTransactionFilterProps> = ({
//   startDate,
//   endDate,
//   selectedTypes,
//   onStartDateChange,
//   onEndDateChange,
//   onTypesChange,
// }) => {
//   const transactionTypeOptions = [
//     { label: '입금', value: 'EXTERNAL_IN' },
//     { label: '출금', value: 'EXTERNAL_OUT' },
//     { label: '투자금 환급', value: 'INVESTMENT_IN' },
//     { label: '투자금 입금', value: 'INVESTMENT_OUT' },
//     { label: '대출금 입금', value: 'LOAN_IN' },
//     { label: '대출금 상환', value: 'LOAN_OUT' },
//   ];

//   const handleTypeToggle = (value: string) => {
//     if (selectedTypes.includes(value)) {
//       onTypesChange(selectedTypes.filter((type) => type !== value));
//     } else {
//       onTypesChange([...selectedTypes, value]);
//     }
//   };

//   return (
//     <div className={styles.filterContainer}>
//       <div className={styles.row}>
//         <div className={styles.filterItem}>
//           <label htmlFor='startDate' className={styles.label}>
//             거래일
//           </label>
//           <div className={styles.dateRange}>
//             <DatePicker
//               id='startDate'
//               selected={startDate}
//               onChange={(date) => date && onStartDateChange(date)}
//               dateFormat='yyyy-MM-dd'
//               className={styles.dateInput}
//             />
//             <span className={styles.tilde}>~</span>
//             <DatePicker
//               id='endDate'
//               selected={endDate}
//               onChange={(date) => date && onEndDateChange(date)}
//               dateFormat='yyyy-MM-dd'
//               className={styles.dateInput}
//             />
//           </div>
//         </div>

//         <div className={styles.filterItem}>
//           <label id='transactionTypeLabel'>거래 유형</label>
//           <div
//             className={styles.typeOptions}
//             aria-labelledby='transactionTypeLabel'
//             role='group'
//           >
//             {transactionTypeOptions.map((opt) => (
//               <button
//                 key={opt.value}
//                 className={`${styles.typeButton} ${
//                   selectedTypes.includes(opt.value) ? styles.active : ''
//                 }`}
//                 onClick={() => handleTypeToggle(opt.value)}
//                 type='button'
//               >
//                 {opt.label}
//               </button>
//             ))}
//           </div>
//         </div>

//         <div className={styles.filterItem}>
//           <Button
//             label={{ text: '검색', size: 'md', color: 'white' }}
//             variant='filled'
//             size='normal'
//           />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AccountTransactionFilter;
