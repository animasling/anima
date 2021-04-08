import React, { useRef } from 'react';
import type { EChartOption } from 'echarts';
import { CustomChart, ChartUtils } from 'anima-zoey';
import { message } from 'antd';
import { useBasicChart } from './hooks';

const { timeFormatter, fillTime } = ChartUtils;

const lineChartData = {
  '1673949120': 1.32,
  '1673949180': 1.831,
  '1673949240': 1.012,
  '1673949300': 1.347,
  '1673949360': 1.379,
  '1673949420': 1.652,
  '1673949480': 1.237,
  '1673949540': 1.408,
  '1673949600': 1.277,
  '1673949660': 1.77,
  '1673949720': 2.233,
  '1673949780': 1.239,
  '1673949840': 1.697,
  '1673949900': 1.204,
  '1673949960': 2.012,
  '1673950020': 1.208,
  '1673950080': 1.3,
  '1673950140': 2.073,
  '1673950200': 1.419,
  '1673950260': 1.708,
  '1673950320': 1.437,
  '1673950380': 1.506,
  '1673950440': 2.11,
  '1673950500': 2.137,
  '1673950560': 2.154,
  '1673950620': 2.064,
  '1673950680': 1.077,
  '1673950740': 1.706,
  '1673950800': null,
  '1673950860': null,
};

const barChartData = {
  bi_analysis: {
    '1673949120': null,
    '1673949180': 3.0,
    '1673949240': null,
    '1673949300': 1.0,
    '1673949360': 1.0,
    '1673949420': null,
    '1673949480': 1.0,
    '1673949540': null,
    '1673949600': 2.0,
    '1673949660': 6.0,
    '1673949720': 5.0,
    '1673949780': 4.0,
    '1673949840': null,
    '1673949900': 4.0,
    '1673949960': 1.0,
    '1673950020': null,
    '1673950080': 1.0,
    '1673950140': 2.0,
    '1673950200': 3.0,
    '1673950260': 2.0,
    '1673950320': 1.0,
    '1673950380': 5.0,
    '1673950440': 4.0,
    '1673950500': 4.0,
    '1673950560': null,
    '1673950620': null,
    '1673950680': null,
    '1673950740': 4.0,
    '1673950800': null,
    '1673950860': null,
  },
  bi_portal: {
    '1673949120': 2.0,
    '1673949180': 1.0,
    '1673949240': 5.0,
    '1673949300': 3.0,
    '1673949360': 3.0,
    '1673949420': null,
    '1673949480': 7.0,
    '1673949540': 4.0,
    '1673949600': 9.0,
    '1673949660': 7.0,
    '1673949720': 1.0,
    '1673949780': 2.0,
    '1673949840': 2.0,
    '1673949900': 7.0,
    '1673949960': 2.0,
    '1673950020': 2.0,
    '1673950080': 9.0,
    '1673950140': 2.0,
    '1673950200': 10.0,
    '1673950260': 4.0,
    '1673950320': 4.0,
    '1673950380': 2.0,
    '1673950440': 6.0,
    '1673950500': 10.0,
    '1673950560': 9.0,
    '1673950620': 3.0,
    '1673950680': 9.0,
    '1673950740': 4.0,
    '1673950800': null,
    '1673950860': null,
  },
};

export default () => {
  const echartsContainerRef = useRef();

  const handleClick = (e: any) => {
    const { name, seriesName, value } = e;
    message.info(
      `${seriesName} 在 ${timeFormatter(name)} 的慢查询有 ${value} 条`,
    );
  };

  const { tooltip, events, options } = useBasicChart({
    echartsContainerRef,
    dataSource: {
      lineChart: Object.values(lineChartData),
      barChart: Object.entries(barChartData).map(([key, value]) => {
        return {
          name: key,
          data: Object.values(value),
        };
      }),
      timeList: Object.keys(lineChartData).map(time => String(fillTime(time))),
    },
    onClick: handleClick,
    customTooltip: {
      omitTooltipSeriesNames: ['cpu'],
      getTooltipValue: value => value,
      tooltipSort: (params: EChartOption.Tooltip.Format[]) =>
        params.sort(
          (a, b) => ((b.value as number) ?? 0) - ((a.value as number) ?? 0),
        ),
    },
  });

  return (
    <CustomChart
      ref={echartsContainerRef}
      tooltip={tooltip}
      onEvents={events}
      options={options}
      chartStyle={{
        height: 250,
      }}
    />
  );
};
