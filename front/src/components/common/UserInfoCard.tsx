import React from 'react';
import { UserInfoCardProps, TextColor } from '@/types/components';
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

  // ✅ 명시적으로 TextColor 타입 지정
  let changeRateColor: TextColor = 'gray';
  if (typeof changeRate.text === 'string') {
    if (changeRate.text.startsWith('+')) changeRateColor = 'text-ascendRed';
    else if (changeRate.text.startsWith('-'))
      changeRateColor = 'text-descentBlue';
  }

  const iconColor = icon === 'triangleAlert' ? '#F15454' : '#145DA0';
  const backgroundColor = icon === 'triangleAlert' ? '#FDE8E8' : '#EDF6FA';

  // categoryValue formatting
  let formattedCategoryValue = categoryValue.text;
  if (typeof categoryValue.text === 'string') {
    const match = categoryValue.text.match(/^(\d+)(\D*)$/);
    if (match && match[1].length > 3) {
      formattedCategoryValue = `999+ ${match[2]}`;
    }
  }

  // totalCount formatting
  let formattedTotalCount = totalCount.text;
  if (typeof totalCount.text === 'string') {
    const match = totalCount.text.match(/^(\d+)(\D*)$/);
    if (match) {
      const num = parseInt(match[1], 10);
      const unit = match[2];
      if (num >= 10000) {
        formattedTotalCount = `9,999+ ${unit}`;
      } else {
        formattedTotalCount = `${num.toLocaleString()}${unit}`;
      }
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
