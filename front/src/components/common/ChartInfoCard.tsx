import React from 'react';
import styles from '@/styles/components/ChartInfoCard.module.scss';
import Text from '@/components/common/Text';
import DoughnutChart from '@/components/chart/DoughnutChart';
import { ChartInfoCardProps, DoughnutChartType } from '@/types/components';

const ChartInfoCard: React.FC<ChartInfoCardProps> = ({
  category,
  title,
  categoryCount,
  totalCount,
  changeValue,
}) => {
  // 유효한 차트 타입인지 확인하는 함수
  const isValidChartType = (value: string): value is DoughnutChartType => {
    return ['repay-complete', 'investing-ratio', 'loan-default'].includes(
      value,
    );
  };

  // 기본 차트 타입 설정
  const defaultType: DoughnutChartType = 'repay-complete';

  // `title.text`가 문자열일 때만 타입 확인
  const chartType: DoughnutChartType =
    typeof title.text === 'string' && isValidChartType(title.text)
      ? title.text
      : defaultType;

  // 숫자가 999 초과일 경우 표시 형식
  const formatLargeNumber = (value: string) => {
    const num = parseInt(value.replace(/[^0-9]/g, ''), 10);
    return num > 999 ? '999+' : value;
  };

  // 변화 값에 따른 색상 결정
  const changeValueColor =
    typeof changeValue.text === 'string' && changeValue.text.startsWith('+')
      ? 'text-ascendRed'
      : typeof changeValue.text === 'string' && changeValue.text.startsWith('-')
        ? 'text-descentBlue'
        : 'gray';

  // 변화값 형식 지정
  const formatChangeValue = (titleText: string, changeText: string) => {
    if (titleText === '상환 완료율') {
      return `목표대비 ${changeText}`;
    }
    if (titleText === '투자중 채권 비율') {
      return `전일대비 ${changeText.startsWith('+') ? changeText : `+${changeText}`}건`;
    }
    return changeText;
  };

  return (
    <article className={styles.chartInfoCard}>
      {/* 도넛 차트 */}
      <div className={styles.chartWrapper}>
        <DoughnutChart
          percentage={parseInt(
            typeof categoryCount.text === 'string' ? categoryCount.text : '0',
            10,
          )}
          type={chartType}
        />
      </div>

      {/* 텍스트 정보 */}
      <div className={styles.textWrapper}>
        <Text {...title} />
        <Text {...category} />

        {/* 카운트 정보 */}
        <div className={styles.countWrapper}>
          <Text
            {...categoryCount}
            text={
              typeof categoryCount.text === 'string'
                ? formatLargeNumber(categoryCount.text)
                : categoryCount.text
            }
          />
          /
          <Text
            {...totalCount}
            text={
              typeof totalCount.text === 'string'
                ? formatLargeNumber(totalCount.text)
                : totalCount.text
            }
          />
        </div>

        {/* 변화율 */}
        <Text
          {...changeValue}
          text={
            typeof title.text === 'string' &&
            typeof changeValue.text === 'string'
              ? formatChangeValue(title.text, changeValue.text)
              : changeValue.text
          }
          color={changeValueColor}
        />
      </div>
    </article>
  );
};

export default ChartInfoCard;
