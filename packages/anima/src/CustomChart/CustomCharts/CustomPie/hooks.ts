import { useState, useEffect } from 'react';
import type { CustomPieProps } from '.';

interface UseMultipleLevelPieProps
  extends Pick<CustomPieProps, 'title' | 'dataSource'> {
  isMultiple: boolean;
  childrenKey?: string;
}
export function useMultipleLevelPie<T>({
  title,
  dataSource,
  isMultiple,
  childrenKey = 'subPieChartItems',
}: UseMultipleLevelPieProps) {
  const [pieData, setPieData] = useState<T[]>([]);
  const [pieStack, setPieStack] = useState<number[]>([]);
  const [pieTitle, setPieTitle] = useState(title);

  useEffect(() => {
    setPieTitle(title);
    setPieStack([]);
  }, [title]);

  useEffect(() => {
    setPieData(dataSource as T[]);
  }, [dataSource]);

  const handleGoBack = () => {
    const arr = pieStack.slice(0, -1);
    let k = Object.create(dataSource as T[]);
    let realPieTitle = pieTitle;
    arr.forEach((key, index) => {
      if (index === arr.length - 1) {
        realPieTitle = k?.[key]?.desc;
      }
      if (k?.[key]?.[childrenKey]) {
        k = k?.[key]?.[childrenKey];
      }
    });

    setPieStack(arr);
    setPieData(k);
    setPieTitle(arr.length ? realPieTitle : title);
  };

  const handleClickPie = (v: any) => {
    if (!isMultiple) return;
    setPieTitle(v.name);
    const children = pieData?.[v.dataIndex]?.[childrenKey];
    if (!children?.length) return;
    setPieStack(pieStack => [...pieStack, v.dataIndex]);
    setPieData(children);
  };

  return {
    pieData,
    pieStack,
    pieTitle,
    handleGoBack,
    handleClickPie,
  };
}
