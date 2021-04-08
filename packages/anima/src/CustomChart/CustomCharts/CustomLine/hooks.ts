import { useMemo, useEffect, useCallback } from 'react';
import type { EChartOption } from 'echarts';
import _ from 'lodash';
import moment from 'moment';
import type { ToolTip } from '../../interface';
import { NO_CONTENT, TimeFormat, TooltipClickRoles } from '../../constant';
import type { CustomLineProps } from '.';

export interface CustomLineTooltip {
  toolTip?: ToolTip;
  tooltipSort?: (
    param: EChartOption.Tooltip.Format[],
  ) => EChartOption.Tooltip.Format[];
  tooltipValueFormatter?: (
    value: string,
    series: EChartOption.Tooltip.Format,
  ) => React.ReactNode;
  tooltipNameFormatter?: (
    name: string,
    series: EChartOption.Tooltip.Format,
  ) => React.ReactNode;
  tooltipClickRoles: string[]; // tooltip可点击角色
  // echart自定义元素点击回调，元素上需定义data-role,
  // data-value,返回的参数键即data-role取值，值data-value取值
  tooltipClickCallBack?: (params: DOMStringMap) => void;
  omitTooltipSeriesNames?: string[]; // 排除显示在tooltip 里的数据
  getTooltipTimeRange?: (
    params: EChartOption.Tooltip.Format[],
    dataSource: CustomLineProps['dataSource'],
  ) => string; // 获取tooltip 时间范围
  getTooltipValue?: (value: EChartOption.Tooltip.Format['value']) => any; // 获取tooltip 值
}

export function getTimeRangeByTimeStep(
  currentParams: any,
  dataSource: CustomLineProps['dataSource'],
): string {
  const startTime = currentParams?.[0]?.axisValueLabel;
  const timeSpace = moment(dataSource?.[2]?.[0]).diff(
    moment(dataSource?.[1]?.[0]),
    'minutes',
  );
  const endTime = moment(Number(currentParams?.[0]?.axisValue))
    .add(moment(dataSource?.[2]?.[0]).diff(moment(dataSource?.[1]?.[0])))
    .subtract(1, 'minutes')
    .format(TimeFormat.MONTH_DAY_TIME_WITHOUT_S);
  return _.gt(timeSpace, 1) ? `${startTime} ~ ${endTime}` : startTime;
}

interface UseCustomLineTooltipProps {
  echartsContainerRef: any;
  dataSource: CustomLineProps['dataSource'];
  customTooltip?: CustomLineTooltip;
}
export function useCustomLineTooltip({
  echartsContainerRef,
  dataSource,
  customTooltip,
}: UseCustomLineTooltipProps) {
  // 监听tooltip点击回调
  const handleTooltipClick = (e: any) => {
    const {
      target: { dataset },
    } = e;
    const isClickRole = customTooltip?.tooltipClickRoles.includes(
      dataset?.role,
    );
    if (!isClickRole) return;
    customTooltip?.tooltipClickCallBack?.(dataset);
  };

  useEffect(() => {
    echartsContainerRef?.current?.addEventListener?.(
      'click',
      handleTooltipClick,
    );
    return () => {
      echartsContainerRef?.current?.removeEventListener?.(
        'click',
        handleTooltipClick,
      );
    };
  }, [echartsContainerRef]);

  const renderSeriesName = useCallback(
    (seriesName, series) => {
      const tooltipNameFormatter = customTooltip?.tooltipNameFormatter;
      if (tooltipNameFormatter) return tooltipNameFormatter(seriesName, series);
      if (
        customTooltip?.tooltipClickRoles?.includes(
          TooltipClickRoles.SERIES_NAME,
        )
      ) {
        return `<a data-role=${TooltipClickRoles.SERIES_NAME} data-value=${seriesName} >${seriesName}</a>`;
      }
      return seriesName;
    },
    [customTooltip?.tooltipNameFormatter, customTooltip?.tooltipClickRoles],
  );

  const renderSeriesValue = useCallback(
    (seriesValue, series) => {
      const tooltipValueFormatter = customTooltip?.tooltipValueFormatter;
      if (_.isNil(seriesValue)) return NO_CONTENT;
      if (tooltipValueFormatter)
        return tooltipValueFormatter(seriesValue, series);
      if (
        customTooltip?.tooltipClickRoles?.includes(
          TooltipClickRoles.SERIES_VALUE,
        )
      ) {
        return `<a data-role=${TooltipClickRoles.SERIES_VALUE} data-value=${seriesValue} >${seriesValue}</a>`;
      }
      return seriesValue;
    },
    [customTooltip?.tooltipValueFormatter, customTooltip?.tooltipClickRoles],
  );

  return useMemo(() => {
    if (customTooltip?.toolTip) return customTooltip?.toolTip;
    return {
      maxHeight: 100,
      formatter: (params: EChartOption.Tooltip.Format[]) => {
        const tooltipSort = customTooltip?.tooltipSort;

        const newParams = tooltipSort
          ? tooltipSort(params)
          : params.sort((a: any, b: any) => {
            const ay = a.encode.y;
            const by = b.encode.y;
            return b.value?.[by[0]] - a.value?.[ay[0]];
          });

        const timeSpace = customTooltip?.getTooltipTimeRange
          ? customTooltip?.getTooltipTimeRange(newParams, dataSource)
          : getTimeRangeByTimeStep(newParams, dataSource);

        return `<div style="height: 100px; overflow-y: auto">
        <div>${timeSpace}</div>
        ${newParams
            .map(series => {
              const {
                value,
                marker,
                seriesName,
                encode: { y },
              } = series;

              const seriesValue = customTooltip?.getTooltipValue
                ? customTooltip?.getTooltipValue(value)
                : value?.[y[0]];

              if (
                customTooltip?.omitTooltipSeriesNames?.includes(
                  seriesName as string,
                )
              )
                return null;

              return `<div>
                <div style="display:flex; margin-top: 4px; align-item: center;">
                  <div>${marker}</div>
                  <div data-role=${TooltipClickRoles.SERIES_NAME
                } data-value=${seriesName} style="flex: 1; margin-right: 20px">
                  ${renderSeriesName(seriesName, series)}
                  </div>
                  <div data-role=${TooltipClickRoles.SERIES_VALUE
                } data-value=${seriesValue} style="margin-right: 10px">
                  ${renderSeriesValue(seriesValue, series)}
                  </div>
                </div>
              </div>`;
            })
            .join('')}
        </div>`;
      },
    };
  }, [dataSource, customTooltip]);
}
