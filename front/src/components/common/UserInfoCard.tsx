import React from 'react';
import { UserInfoCardProps } from '@/types/components';
import styles from '@/styles/components/UserInfoCard.module.scss';
import { Clock, TriangleAlert } from 'lucide-react';
import Text from '@/components/common/Text';

const iconMap = {
  clock: Clock,
  triangleAlert: TriangleAlert,
};

const UserInfoCard: React.FC<UserInfoCardProps> = ({
  icon,
  title,
  category,
  categoryValue,
  totalCount,
  changeRate,
}) => {
  const IconComponent = iconMap[icon];
  const changeRateColor = changeRate.text.startsWith('+')
    ? 'text-ascendRed'
    : changeRate.text.startsWith('-')
      ? 'text-descentBlue'
      : 'gray';

  const iconColor = icon === 'triangleAlert' ? '#F15454' : '#145DA0';
  const backgroundColor = icon === 'triangleAlert' ? '#FDE8E8' : '#EDF6FA';

  const categoryValueMatch = categoryValue.text.match(/^(\d+)(\D*)$/);
  const formattedCategoryValue =
    categoryValueMatch && categoryValueMatch[1].length > 3
      ? `999+ ${categoryValueMatch[2]}`
      : categoryValue.text;

  const totalCountMatch = totalCount.text.match(/^(\d+)(\D*)$/);
  let formattedTotalCount = totalCount.text;

  if (totalCountMatch) {
    const numericValue = parseInt(totalCountMatch[1], 10); // 숫자 부분 변환
    const unit = totalCountMatch[2]; // 단위 부분 유지

    if (numericValue >= 10000) {
      formattedTotalCount = `9,999+ ${unit}`; // 10,000 이상이면 `9,999+`
    } else {
      formattedTotalCount = `${numericValue.toLocaleString()}${unit}`; // 1,000 단위마다 `,` 추가
    }
  }

  return (
    <article className={styles.userInfoCard}>
      <div className={styles.iconWrapper} style={{ backgroundColor }}>
        <IconComponent size={25} color={iconColor} />
      </div>

      <div className={styles.textWrapper}>
        <Text {...title} />

        <div className={styles.categoryWrapper}>
          <Text {...category} />
          <Text {...categoryValue} text={formattedCategoryValue} />
        </div>

        <div className={styles.countWrapper}>
          <Text {...totalCount} text={formattedTotalCount} />
          <Text {...changeRate} color={changeRateColor} />
        </div>
      </div>
    </article>
  );
};

export default UserInfoCard;
