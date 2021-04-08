import { useMemo } from 'react';
import {
  ChartUtils,
  CustomLineHooks,
  ChartConstants,
  ChartConfigs,
} from 'anima-zoey';

const { getNumberUnit, timeFormatter } = ChartUtils;
const { useCustomLineTooltip } = CustomLineHooks;
const { TimeFormat } = ChartConstants;
const { BASE_OPTION } = ChartConfigs;

interface UseBasicChartProps {
  echartsContainerRef: any;
  dataSource: {
    lineChart: (number | null)[];
    barChart: { name: string; data: (number | null)[] }[];
    timeList: string[];
  };
  onClick: (param: any) => void;
  customTooltip: CustomLineHooks.CustomLineTooltip;
}
export function useBasicChart({
  echartsContainerRef,
  dataSource,
  onClick,
  customTooltip = {} as CustomLineHooks.CustomLineTooltip,
}: UseBasicChartProps) {
  const xAxisData = dataSource?.timeList;

  const tooltip = useCustomLineTooltip({
    echartsContainerRef,
    dataSource: dataSource.barChart,
    customTooltip,
  });

  const options = useMemo(() => {
    const series = [
      {
        name: 'cpu',
        type: 'line',
        yAxisIndex: 1,
        data: dataSource?.lineChart,
      },
      ...dataSource?.barChart?.map(item => ({
        ...item,
        type: 'bar',
        stack: 'bar',
        barWidth: 15,
      })),
    ];

    const customOptions = {
      grid: {
        show: false,
        right: 70,
        left: 70,
        top: 30,
        bottom: 30,
      },
      xAxis: [
        {
          type: 'category',
          data: xAxisData,
          axisTick: { show: false, alignWithLabel: true },
          axisLabel: {
            formatter(value) {
              return timeFormatter(value, TimeFormat.MONTH_DAY_TIME_WITHOUT_S);
            },
            showMinLabel: true,
            showMaxLabel: true,
          },
          axisPointer: {
            label: {
              formatter({ value }) {
                return timeFormatter(
                  value,
                  TimeFormat.MONTH_DAY_TIME_WITHOUT_S,
                );
              },
            },
          },
        },
      ],
      yAxis: [
        {
          type: 'value',
          name: '数量',
          position: 'left',
          alignTicks: true,
          axisLine: {
            show: true,
            lineStyle: {
              color: '#91CC75',
            },
          },
          axisLabel: {
            formatter(value) {
              const { chartUnit, divisorUnit } = getNumberUnit(value);
              return `${value / divisorUnit} ${chartUnit}`;
            },
          },
        },
        {
          type: 'value',
          name: '使用率',
          position: 'right',
          alignTicks: true,
          axisLine: {
            show: true,
            lineStyle: {
              color: '#40a9ff',
            },
          },
          axisLabel: {
            formatter(value) {
              return `${value}%`;
            },
          },
        },
      ],
      series,
    };

    return { ...BASE_OPTION, ...customOptions };
  }, [dataSource, xAxisData]);

  const events = useMemo(
    () => ({
      click(param) {
        onClick(param);
      },
    }),
    [onClick],
  );

  return {
    options,
    events,
    tooltip,
  };
}
