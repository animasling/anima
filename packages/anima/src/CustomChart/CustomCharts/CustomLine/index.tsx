import React, { useMemo, useCallback, useRef } from 'react';
import _ from 'lodash';
import isEqual from 'fast-deep-equal';
import type { EChartOption } from 'echarts';
import { TimeFormat } from '../../constant';
import type { EChartsInstance } from 'echarts-for-react/lib/types';
import {
  getNumberUnit,
  timeFormatter,
  fillTime,
  xAxisLabelTimeFormatter,
} from '../../utils';
import CustomChart from '../../CustomChart';
import type { ChartProps, Legend } from '../../interface';
import SideBar from '../../components/SideBar';
import { BASE_OPTION } from '../../echartConfigs';
import { CustomLineTooltip, useCustomLineTooltip } from './hooks';
import './index.less';

export const DefaultLineSeriesConfig = {
  type: 'line',
  smooth: false,
  symbol: 'circle',
  showSymbol: true,
};

type OriginLineProps =
  | 'title'
  | 'chartStyle'
  | 'isLoading'
  | 'onEvents'
  | 'noDataStyle'
  | 'updateConditions'
  | 'shouldSetOption'
  | 'onChartReady'
  | 'shouldSetOption';

/*
* dataSource
* [
    ['category', 'legend1', 'legend2'],  // CategoryList
    [xAxis1,  value1,  value2 ],   // values
    [xAxis2,  value1,  value2 ],    // values
    ……
  ]
* */

type CustomTool = {
  show: boolean;
  title: string;
  icon: string;
  onClick: () => void;
};
export interface CustomLineProps
  extends Partial<Pick<ChartProps, OriginLineProps>>,
  Pick<Legend, 'multipleSelect' | 'onLegendChange'> {
  dataSource: any[];
  option?: EChartOption;
  styles?: React.CSSProperties;
  markLine?: number;
  sideBars?: React.ReactNode; // 是否配置sideBar
  showLegend?: boolean; // 是否显示legend
  yAxisName?: string;
  extraTitle?: React.ReactNode;
  saveAsImage?: Record<string, any>; // 保存为图片，设置名称
  customTools?: Record<string, CustomTool>; // 自定义工具项对象
  needHideLegends?: string[]; // 需要隐藏的legend
  selectedLegend?: Legend['selected'];
  customTooltip?: CustomLineTooltip; // 自定义tooltip
}

export interface LineChartData {
  name?: string; // category
  details?: {
    [key: number]: number;
  }[];
}

type TransformedLineData = (string | number)[];
export function transformDataToLine(
  dataSource: LineChartData[],
  key = 'name',
  formatter?: (value: number) => void,
): TransformedLineData[] {
  if (!dataSource?.length) return [];
  // category 必须是string类型，不然渲染就会出问题',
  // 如果detail 值为空，则legend 也不渲染了
  // ["category", legend1, legend2, ...]
  const categoryList = dataSource.reduce(
    (categorys, data) => {
      if (_.isEmpty(data?.details)) return [...categorys];
      return [...categorys, String(data[key])];
    },
    ['category'],
  );

  // dataSource 与 categoryList 中的 name 顺序还是完全一致的，可直接使用
  // [xAxis1, value1, value2, ...]
  const timeValueList =
    dataSource
      ?.reduce((currentData, { details }) => {
        // [[time, value], [time, value]]
        if (!currentData.length) {
          return details?.map(data => Object.entries(data)[0]);
        }
        return currentData.map((data, index) => {
          const [time] = data;
          return [...data, details?.[index]?.[time as number]];
        });
      }, [] as TransformedLineData[])
      ?.map(([time, ...values]: TransformedLineData) => [
        !_.isNil(formatter) ? formatter(fillTime(time)) : fillTime(time),
        ...values,
      ]) || [];

  return [categoryList, ...timeValueList];
}

function CustomLine(props: CustomLineProps): JSX.Element {
  const echartsContainerRef = useRef(null);
  const {
    dataSource,
    title,
    option,
    markLine,
    showLegend = true,
    yAxisName,
    customTools,
    onLegendChange,
    multipleSelect = true,
    needHideLegends,
    selectedLegend,
    styles,
    sideBars,
    chartStyle,
    onEvents,
    isLoading = false,
    extraTitle,
    noDataStyle,
    saveAsImage,
    shouldSetOption,
    customTooltip,
  } = props;

  const legends = dataSource?.[0]?.slice(1) || [];

  const getSeries = useCallback(
    (xAxis: string[]) => {
      const isSingle = xAxis?.length === 1;
      return legends.map((__: string, index: number) => {
        const seriesDimension = index + 1; // 第一列是 time 第二列开始才是 具体某一条线
        return {
          encode: {
            x: 0,
            y: seriesDimension,
            seriesName: seriesDimension,
          },
          markLine: markLine
            ? {
              lineStyle: {
                color: '#ff5733',
              },
              data: [
                {
                  name: '平均线',
                  yAxis: markLine,
                },
              ],
            }
            : undefined,
          ...DefaultLineSeriesConfig,
          showSymbol: isSingle,
          sampling: 'lttb',
          lineStyle: {
            width: 1.5,
          },
          emphasis: {
            lineStyle: {
              width: 1.5,
            },
          },
          animation: false,
        };
      });
    },
    [legends, markLine],
  );

  const lineOptions = useMemo(() => {
    if (!dataSource?.[0]) return {};
    const xAxis = dataSource.slice(1).map(data => data[0]);
    const series = getSeries(xAxis);

    let lineOption: EChartOption = {
      title: title
        ? {
          text: title,
          left: 'center',
          textStyle: {
            color: '#333',
            fontSize: 14,
            fontWeight: 'normal',
          },
        }
        : undefined,
      toolbox: {
        show: true,
        feature: {
          dataZoom: {
            yAxisIndex: false,
            title: {
              zoom: '区域缩放',
              back: '区域缩放还原',
            },
          },
          restore: {
            title: '还原',
          },
          saveAsImage: {
            show: !_.isNil(saveAsImage),
            name: '图片',
            type: 'png',
            backgroundColor: '#fff',
            ...saveAsImage,
          },
          ...customTools, // 自定义工具项
        },
      },
      grid: {
        show: false,
        right: 50,
        left: 70,
        top: 32,
        bottom: showLegend ? 60 : 20,
      },
      xAxis: [
        {
          type: 'category',
          axisTick: { show: false },
          // minInterval: 60000, // 最小时间间隔一分钟
          axisLabel: {
            formatter(value: number) {
              return xAxisLabelTimeFormatter(xAxis)(value);
            },
            showMinLabel: true,
            showMaxLabel: true,
          },
          axisPointer: {
            label: {
              formatter({ value }: { value: number }) {
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
          // min: 'dataMin',
          // max: 'dataMax',
          name: yAxisName,
          axisLabel: {
            formatter(value: number) {
              const { chartUnit, divisorUnit } = getNumberUnit(value);
              return `${value / divisorUnit} ${chartUnit}`;
            },
          },
        },
      ],
      dataset: {
        source: dataSource,
      },
      series,
    };

    lineOption = _.merge({}, BASE_OPTION, lineOption);
    return _.merge({}, lineOption, option);
  }, [dataSource, title, getSeries, customTools, showLegend, yAxisName]);

  const handleChartReady = (instance: EChartsInstance) => {
    props?.onChartReady?.(instance);
  };

  const handleUpdateChart = (
    prevProps: CustomLineProps,
    props: CustomLineProps,
  ) => {
    if (shouldSetOption) {
      return shouldSetOption(prevProps, props);
    }

    // 每次更新虽然数据没变化，但是xAxis, yAxis, tooltip,深比较是不同的，都有方法，
    // 且每次返回的是方法，引用地址是不一样的，我们需要单独来比较（用了notMerge）避免丢失echart原有的效果
    // 比如高亮，放大缩小

    const pickKeys = ['legend', 'dataset'];
    if (
      !isEqual(
        _.pick(props.option, pickKeys),
        _.pick(prevProps.option, pickKeys),
      ) ||
      !isEqual(prevProps.updateConditions, props.updateConditions)
    ) {
      return true;
    }
    return false;
  };

  const lineLegend = useMemo(() => {
    let legendProps = {};
    if ('selectedLegend' in props) {
      legendProps = {
        selected: selectedLegend,
      };
    }

    return showLegend
      ? {
        legendShape: 'circle',
        legendData: (dataSource?.[0]?.slice(1) || []).map((d: string) => ({
          name: d,
          itemStyle: {
            display: needHideLegends?.includes(d) ? 'none' : 'auto',
          },
        })),
        multipleSelect,
        onLegendChange,
        legendStyle: {
          maxHeight: 40,
        },
        ...legendProps,
      }
      : undefined;
  }, [
    dataSource,
    props,
    selectedLegend,
    showLegend,
    multipleSelect,
    onLegendChange,
  ]);

  const lineTooltip = useCustomLineTooltip({
    echartsContainerRef,
    dataSource,
    customTooltip,
  });

  return (
    <div
      className='container-line'
      style={styles}
      ref={echartsContainerRef}
    >
      {extraTitle}
      <CustomChart
        title={title}
        options={lineOptions}
        onChartReady={handleChartReady}
        containerStyle={{
          backgroundColor: '#fff',
        }}
        updateConditions={[option, yAxisName]}
        chartStyle={chartStyle}
        onEvents={onEvents}
        shouldSetOption={handleUpdateChart}
        noDataStyle={{
          height: '100%',
          ...noDataStyle,
        }}
        isLoading={isLoading}
        legend={lineLegend}
        tooltip={lineTooltip}
      />
      {sideBars ? (
        <SideBar
          direction="vertical"
          styles={{
            position: 'absolute',
            right: 10,
            bottom: 65,
          }}
          data={sideBars}
        />
      ) : null}
    </div>
  );
}

export default CustomLine;
