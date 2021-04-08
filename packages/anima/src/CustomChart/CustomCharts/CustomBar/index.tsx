import React, { useMemo } from 'react';
import _ from 'lodash';
import CustomChart from '../../CustomChart';
import type { ChartProps } from '../../interface';
import type { EChartOption } from 'echarts';
import { BASE_BAR_OPTION } from '../../echartConfigs';
import { getNumberUnit } from '../../utils';

/*
* multiple legend dataSource 
* [
    ['category', 'legend1', 'legend2'……],  // CategoryList
    [xAxis1, value1,  value2，……],  // values
    [xAxis2, value1,  value2，……],  // values
    ...
  ]
* */

/**
 * single legend dataSource
 * [
 *  [xAxis1, value1],
 *  [xAxis1, value2],
 *  ...
 * ]
 */
export interface CustomBarOption {
  hasZoom?: boolean;
  showLegend?: boolean;
}

type OriginBarProps =
  | 'customDom'
  | 'isLoading'
  | 'noDataStyle'
  | 'title'
  | 'chartStyle'
  | 'containerStyle';

export interface CustomBarProps extends Pick<ChartProps, OriginBarProps> {
  dataSource: any[];
  option?: EChartOption & CustomBarOption;
  rotateXAxis?: boolean;
  xAxisFormatter?: (value: string) => React.ReactNode;
}

export interface BarChartData {
  name: string; // category
  value: number;
}

function CustomBar(props: CustomBarProps): JSX.Element | null {
  const {
    dataSource,
    title,
    option,
    rotateXAxis,
    xAxisFormatter,
    chartStyle,
    containerStyle,
    isLoading = false,
    noDataStyle,
  } = props;
  const legends = dataSource?.[0]?.slice(1) || [];
  const hasZoom = option?.hasZoom ?? false;

  const series = useMemo(
    () =>
      legends?.map((__: string, index: number) => {
        const seriesDimension = index + 1;
        return {
          type: 'bar',
          barWidth: '10',
          encode: {
            x: 0,
            y: seriesDimension,
            seriesName: seriesDimension,
          },
        };
      }),
    [legends],
  );

  const barOptions = useMemo(() => {
    if (!dataSource?.[0]) return {};
    let pieOption: EChartOption = {
      title: title
        ? {
            text: title,
            left: 'center',
            textStyle: {
              color: '#333',
              fontSize: 20,
            },
          }
        : undefined,
      grid: {
        show: false,
        top: 36,
        right: 40,
        left: 20,
        bottom: hasZoom ? 40 : option?.showLegend ? 50 : 16,
        containLabel: true,
      },
      xAxis: [
        {
          type: 'category',
          gridIndex: 0,
          axisLabel: {
            interval: 0,
            rotate: rotateXAxis ? 40 : 0,
            formatter: xAxisFormatter,
          },
        },
      ],
      yAxis: [
        {
          type: 'value',
          axisLabel: {
            formatter(value: number) {
              const { chartUnit, divisorUnit } = getNumberUnit(value);
              return `${value / divisorUnit} ${chartUnit}`;
            },
          },
          gridIndex: 0,
        },
      ],
      dataset: {
        source: dataSource,
      },
      series,
      toolbox: {
        feature: hasZoom
          ? {
              dataZoom: {
                yAxisIndex: false,
              },
            }
          : undefined,
      },
      dataZoom: hasZoom
        ? [
            {
              type: 'inside',
            },
            {
              type: 'slider',
              filterMode: 'weakFilter',
              height: 6,
              borderColor: 'transparent',
              backgroundColor: '#e2e2e2',
              bottom: 12,
              handleIcon:
                'M10.7,11.9H9.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4h1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7v-1.2h6.6z M13.3,22H6.7v-1.2h6.6z M13.3,19.6H6.7v-1.2h6.6z', // jshint ignore:line
              handleSize: 16,
              handleStyle: {
                shadowBlur: 5,
                shadowOffsetX: 1,
                shadowOffsetY: 2,
                shadowColor: '#aaa',
              },
            },
          ]
        : undefined,
    };
    pieOption = _.merge({}, BASE_BAR_OPTION, pieOption);
    return _.merge({}, pieOption, option);
  }, [
    series,
    option,
    title,
    rotateXAxis,
    dataSource,
    xAxisFormatter,
    getNumberUnit,
  ]);

  const barLegend = useMemo(
    () =>
      option?.showLegend
        ? {
            legendStyle: {
              bottom: 20,
            },
            legendData: legends,
          }
        : undefined,
    [legends, option?.showLegend],
  );

  return (
    <CustomChart
      title={title}
      options={barOptions}
      isLoading={isLoading}
      containerStyle={{
        ...containerStyle,
        backgroundColor: '#fff',
      }}
      noDataStyle={{
        height: '100%',
        ...noDataStyle,
      }}
      legend={barLegend}
      chartStyle={chartStyle}
    />
  );
}

export default CustomBar;
