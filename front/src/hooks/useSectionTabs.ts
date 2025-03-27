import { useState } from 'react';
import { SectionTab } from '@/types/components';

const useSectionTabs = (initialTabs: SectionTab[], initialIndex = 0) => {
  const [activeIndex, setActiveIndex] = useState(initialIndex);

  const handleTabClick = (index: number) => {
    setActiveIndex(index);
  };

  const activeTab = initialTabs[activeIndex];

  return {
    tabs: initialTabs,
    activeIndex,
    activeTab,
    onTabClick: handleTabClick,
  };
};

export default useSectionTabs;
