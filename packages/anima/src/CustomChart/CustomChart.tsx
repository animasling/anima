/**
 * legend, tooltip指定，
 * 可根据实际情况覆盖legend样式
 * */

import React, { useState, useMemo, useRef } from 'react';
import ReactEcharts from './ReactEcharts';
import type { EChartOption } from 'echarts';
import { Spin } from 'antd';
import _ from 'lodash';
import type { EChartsInstance } from 'echarts-for-react/lib/types';
import CustomLegend from './components/CustomLegend';
import ChartNoData from './components/ChartNoData';
import { getChartTheme } from './utils';
import type { ChartProps, LegendSelected } from './interface';
import { TOOLTIP_CLASS_NAME } from './constant';
import './customChart.less';

function CustomChart(props: ChartProps) {
  const customChartRef = useRef(null);

  const {
    tooltip,
    isUseNative = false,
    options,
    legend,
    chartStyle,
    title,
    isLoading,
    customDom,
    containerStyle,
    noDataStyle,
    onEvents,
    customRef,
    shouldSetOption,
    updateConditions,
  } = props;

  const [legendSelected, setLegendSeleted] = useState<LegendSelected>({});

  const tooltipPosition = useMemo(() => {
    const { offsetX = 1, offsetY = 1 } = tooltip || {};
    return (
      [pointX, pointY],
      params,
      dom,
      rect,
      { contentSize: [width, height] },
    ) => {
      const customChartContainer = dom?.offsetParent;

      if (!customChartContainer) return null;
      const HEADER_HEIGHT = 100; // header 的高度
      // 设置 提示框的位置
      // 1.提示框的高度 大于 图标距离分区的位置 即（容器距离浏览器位置 + 鼠标位置 - 分区和 banner的高度），提示框显示位置为
      // header 的下面
      // 2.提示框的宽度 大于 距离容器左边的距离，提示框显示在鼠标右边
      const { top } = customChartContainer?.getBoundingClientRect?.();
      const echartsTopFromHeader = top - HEADER_HEIGHT;

      const positionX = pointX > width + offsetX ? -width - offsetX : offsetX;

      const hideTooltip = () => {
        dom.style.display = 'none';
        dom.removeEventListener('mouseleave', hideTooltip);
      };
      dom.addEventListener('mouseleave', hideTooltip);

      const positionY =
        echartsTopFromHeader + pointY > height + offsetY
          ? // 此时 高度可以放下 tooltip ，则位置为 自己的高度 + 间隔
          -height - offsetY
          : // 20 为图标距离容器的距离，因为会加上 鼠标的坐标，而鼠标始终在 图标内，会同容器保持一定距离
          -echartsTopFromHeader - 50;

      // 坐标最后加上 x y 使得 tooltip 可以跟随鼠标变换位置，即 以鼠标为原心
      return [positionX + pointX, positionY + pointY];
    };
  }, [tooltip]);

  const echartsOptions = useMemo(() => {
    let customOptions = {
      legend: {
        show: false,
        pageIconSize: 0,
        pageFormatter: '',
        pageTextStyle: {
          width: 0,
        },
        bottom: 0,
        type: 'scroll',
        width: 0,
        height: 0,
        selected: legendSelected,
      },
    };
    if (tooltip) {
      const nativeTooltip = options.tooltip;
      const { maxHeight, formatter, color, fontSize } = tooltip;
      const tooltipOption = {
        triggerOn: 'mousemove',
        appendToBody: false,
        enterable: true,
        position: tooltipPosition,
        formatter(data: EChartOption.Tooltip.Format[]) {
          let style = maxHeight ? `max-height: ${maxHeight}px;` : '';
          style = color ? `${style}color: ${color};` : style;
          style = fontSize ? `${style}font-size:${fontSize}px` : style;
          return `<div class=${TOOLTIP_CLASS_NAME} style= "${style}">
          ${formatter ? formatter(data) : data}</div>`;
        },
        ...nativeTooltip,
      };
      customOptions = { ...customOptions, tooltip: tooltipOption };
    }
    // _.merge({}, options, customOptions) 保证 customOptions 不能被覆盖
    return isUseNative ? options : _.merge({}, options, customOptions);
  }, [isUseNative, options, legendSelected, tooltip, tooltipPosition]);

  const handleChartReady = (echartsInstance: EChartsInstance) => {
    props?.onChartReady?.(echartsInstance);
  };

  const handleChangeSelectedLegend = (newLegendSelected: LegendSelected) => {
    setLegendSeleted(newLegendSelected);
  };

  const chartData = options?.series as any[];

  return (
    <div
      className='custom-charts-container custom-charts'
      style={containerStyle}
      ref={customRef}
    >
      <Spin spinning={!!isLoading}>
        {options && chartData ? (
          <>
            <ReactEcharts
              ref={customChartRef}
              style={{ height: '100%', minHeight: '100px', ...chartStyle }}
              theme={getChartTheme(chartData)}
              onChartReady={handleChartReady}
              option={echartsOptions}
              onEvents={onEvents}
              updateConditions={updateConditions}
              shouldSetOption={shouldSetOption}
              notMerge
            />
            {customDom}
            <CustomLegend
              isUseNative={isUseNative}
              chartRef={customChartRef}
              legend={legend}
              legendSelected={legendSelected}
              onChangeSelectedLegend={handleChangeSelectedLegend}
            />
          </>
        ) : (
          <ChartNoData title={title} style={noDataStyle} />
        )}
      </Spin>
    </div>
  );
}

export default CustomChart;

export { default as CustomBar } from './CustomCharts/CustomBar';
export { default as CustomLine } from './CustomCharts/CustomLine';
export { default as CustomPie } from './CustomCharts/CustomPie';
import * as ChartUtils from './utils';
import * as ChartConstants from './constant';
import * as ChartConfigs from './echartConfigs';
import * as CustomLineHooks from './CustomCharts/CustomLine/hooks';
import * as CustomPieHooks from './CustomCharts/CustomPie/hooks';
export {
  ChartUtils,
  ChartConstants,
  ChartConfigs,
  CustomLineHooks,
  CustomPieHooks,
};
