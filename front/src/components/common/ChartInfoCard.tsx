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

  // `title.text`가 유효한 차트 타입인지 확인 후 적용
  const chartType: DoughnutChartType = isValidChartType(title.text)
    ? title.text
    : defaultType;

  // 3자리수 초과 시 "999+"로 변환
  const formatLargeNumber = (value: string) => {
    const num = parseInt(value.replace(/[^0-9]/g, ''), 10);
    return num > 999 ? '999+' : value;
  };

  // 변화 값에 따른 색상 적용
  const changeValueColor = changeValue.text.startsWith('+')
    ? 'text-ascendRed'
    : changeValue.text.startsWith('-')
      ? 'text-descentBlue'
      : 'gray';

  // `title` 값에 따라 `changeValue`를 특정 형식으로 변환
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
          percentage={parseInt(categoryCount.text, 10)}
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
            text={formatLargeNumber(categoryCount.text)}
          />
          /<Text {...totalCount} text={formatLargeNumber(totalCount.text)} />
        </div>

        {/* 변화율 */}
        <Text
          {...changeValue}
          text={formatChangeValue(title.text, changeValue.text)}
          color={changeValueColor}
        />
      </div>
    </article>
  );
};

export default ChartInfoCard;
