import React, { useMemo } from 'react';
import _ from 'lodash';
import numeral from 'numeral';
import { Divider, Space } from 'antd';
import classNames from 'classnames';
import { ArrowLeftOutlined } from '@ant-design/icons';
import CustomChart from '../../CustomChart';
import type { EChartOption } from 'echarts';
import { BASE_PIE_OPTION } from '../../echartConfigs';
import { countFormatter, precisionPercentFormatter } from '../../utils';
import { LegendShapes, LegendDirections } from '../../constant';
import type { ChartProps } from '../../interface';
import './index.less';

/*
 * dataSource
 * [
 *   [legend1, value1],
 *   [legend2, value2],
 *   ...
 * ]
 * */
export interface CustomPieOption {
  isRing?: boolean;
  type?: string;
  right?: string;
  hasPercent?: boolean;
}

type OriginPieProps =
  | 'legend'
  | 'tooltip'
  | 'customDom'
  | 'title'
  | 'chartStyle'
  | 'containerStyle'
  | 'onEvents'
  | 'isLoading'
  | 'noDataStyle';

export interface CustomPieProps extends Pick<ChartProps, OriginPieProps> {
  dataSource: any[];
  option?: EChartOption & CustomPieOption;
  legendValueFormatter?: (value: number, name: string) => React.ReactNode;
  needGoBack?: boolean; // 是否需要返回
  onGoBack?: () => void; // 返回回调
  isMultiple?: boolean; // 是否是多层级
}

export interface PieChartData {
  name?: string; // category
  value?: number;
}

export function transformDataToPie(dataSource: PieChartData[]) {
  if (!dataSource || !dataSource.length) return [];
  return dataSource.map(({ name, value }) => [name, value]);
}

function CustomPie(props: CustomPieProps): JSX.Element {
  const {
    dataSource,
    title,
    legend,
    option = { hasPercent: false, type: '' },
    legendValueFormatter,
    onEvents,
    isMultiple = false,
    chartStyle,
    containerStyle,
    customDom,
    tooltip,
    isLoading = false,
    noDataStyle,
    needGoBack = false,
    onGoBack,
  } = props;

  const pieOptions = useMemo(() => {
    if (!dataSource?.[0]) return {};

    const otherSeries = !_.isNil(legend)
      ? {
          right: option?.right || '45%',
          label: {
            show: false,
          },
          labelLine: {
            show: false,
          },
          radius: option?.isRing ? ['66%', '86%'] : [0, '75%'],
        }
      : undefined;

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
        right: 40,
        left: 20,
        bottom: 60,
        containLabel: true,
      },
      dataset: {
        source: dataSource,
      },
      series: [
        {
          type: 'pie',
          center: ['50%', '50%'],
          minShowLabelAngle: 360,
          encode: {
            itemName: 0,
            value: 1,
          },
          ...otherSeries,
        },
      ],
    };
    pieOption = _.merge({}, BASE_PIE_OPTION, pieOption);

    return _.merge({}, pieOption, option);
  }, [option, legend, title, dataSource]);

  const pieLegend = useMemo(() => {
    const dataSum = legend?.legendData?.reduce(
      (sum, item) => sum + Number((item as string[])[1]),
      0,
    );

    return {
      direction: LegendDirections[1],
      legendShape: LegendShapes[1],
      height: 30,
      formatter: (val: string[]) => {
        let percent = '';

        // 有百分比
        if (option?.hasPercent) {
          percent = `${numeral(val[1])
            .divide(dataSum)
            .value()}`;
          // 解决当percent出现 8.708125370872257e-9 形式的数据，format后 变 NaN 问题
          if (_.includes(percent, 'e')) {
            percent = parseFloat(percent).toFixed(4);
          }
          percent = precisionPercentFormatter(percent);
        }

        const value = countFormatter(val[1]);

        const dataIndex = legend?.legendData?.findIndex(item =>
          _.isEqual(item, val),
        );
        return (
          <div
            className='legend-box'
            style={{
              width: `${numeral(legend?.width)
                .subtract(30)
                .value()}px`,
            }}
          >
            <Space split={<Divider type="vertical" />} size={0} align="start">
              <div
                className={classNames('legend-name', {
                  'legend-name-hover': isMultiple,
                })}
                onClick={() => {
                  if (!isMultiple) return;
                  (onEvents as Record<string, (value: any) => void>).click({
                    name: val[0],
                    dataIndex,
                  });
                }}
              >
                {val[0]}
              </div>
              {option?.hasPercent && <>{percent}</>}
            </Space>
            <span className='legend-val'>
              {legendValueFormatter
                ? legendValueFormatter(value, val[0])
                : value}
            </span>
          </div>
        );
      },
    };
  }, [legend, option?.hasPercent, legendValueFormatter]);

  return (
    <div className='pie-warpper'>
      {needGoBack && (
        <ArrowLeftOutlined
          className='goback-icon'
          onClick={onGoBack}
        />
      )}
      <CustomChart
        title={title}
        options={pieOptions}
        containerStyle={containerStyle}
        isLoading={isLoading}
        noDataStyle={{
          height: '100%',
          ...noDataStyle,
        }}
        onEvents={onEvents}
        legend={
          !_.isNil(legend)
            ? {
                ...pieLegend,
                ...legend,
              }
            : undefined
        }
        chartStyle={chartStyle}
        customDom={
          customDom
            ? typeof customDom === 'function'
              ? customDom()
              : customDom
            : undefined
        }
        tooltip={tooltip}
      />
    </div>
  );
}

export default CustomPie;
