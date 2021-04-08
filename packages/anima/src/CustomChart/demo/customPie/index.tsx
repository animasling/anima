import React from 'react';
import { Card } from 'antd';
import _ from 'lodash';
import { CustomPie, ChartUtils, CustomPieHooks, ChartConstants } from 'anima-zoey';
import { resourceDataSource, departmentDataSource } from './data';
import './index.less';

const { countFormatter, timeFormatter, fillTime } = ChartUtils;
const { useMultipleLevelPie } = CustomPieHooks;
const { TimeFormat } = ChartConstants;

export interface PieChartData {
  name?: string; // category
  value?: number;
}
export function transformDataToPie(dataSource: any[]) {
  if (!dataSource || !dataSource.length) return [];
  return dataSource.map(({ name, value }) => [name, value]);
}

interface TransformChartData {
  data: Record<string, any>[];
  keyType?: string;
  valueType?: string;
  subItems?: string;
  isLine?: boolean;
}

type LineDetail = {
  date: string;
  num: number;
  index: number;
};

export const transformChartData = ({
  data,
  keyType = 'desc',
  valueType = 'num',
  isLine = false,
}: TransformChartData) => {
  if (_.isNil(data)) return [];

  return data?.map(item =>
    isLine
      ? {
          name: item[keyType],
          details: item[valueType]
            ?.sort((a: LineDetail, b: LineDetail) => a?.index - b?.index)
            .map((subItem: LineDetail) => ({
              [subItem?.date]: subItem?.num,
            })),
        }
      : {
          name: _.isEqual(keyType, 'time')
            ? timeFormatter(fillTime(keyType), TimeFormat.MONTH_DAY_TIME)
            : item[keyType],
          value: item[valueType],
        },
  );
};

interface CustomDomProps {
  title?: string;
  sum?: number;
  formatSum?: () => string;
  option?: Record<string, any>;
}
function CustomDom({ title, formatSum, sum, option }: CustomDomProps) {
  return (
    <div
      className='ring-chart-info'
      style={option?.right ? { left: '27%' } : {}}
    >
      <div className='title'>{title}</div>
      <div className='count'>
        {formatSum ? formatSum() : countFormatter(sum as number)}
      </div>
    </div>
  );
}

export default () => {
  const isMultiple = true;

  const {
    pieData,
    pieTitle,
    pieStack,
    handleClickPie,
    handleGoBack,
  } = useMultipleLevelPie<any>({
    title: '部门',
    dataSource: departmentDataSource,
    isMultiple,
  });

  const commomPieProps = {
    containerStyle: {
      padding: '10px 0',
    },
    chartStyle: {
      height: '190px',
      minHeight: '190px',
    },
    noDataStyle: {
      height: '100px',
    },
    legend: {
      legendStyle: {
        minHeight: '170px',
        width: 450,
      },
      width: 430,
    },
  };

  const pieProps = {
    ...commomPieProps,
    dataSource: resourceDataSource,
    legend: {
      legendData: resourceDataSource,
      ...commomPieProps.legend,
    },
    option: {
      isRing: false,
      hasPercent: true,
    },
  };

  const singleLevelRingProps = {
    ...commomPieProps,
    dataSource: resourceDataSource,
    legend: {
      legendData: resourceDataSource,
      ...commomPieProps.legend,
    },
    option: {
      isRing: true,
      right: '46%',
    },
    customDom: (
      <CustomDom
        title="资源Top20"
        sum={resourceDataSource.length}
        option={{ right: '46%' }}
      />
    ),
  };

  const departmentList = transformDataToPie(
    transformChartData({ data: pieData }),
  );

  const multipleLevelRingProps = {
    ...commomPieProps,
    dataSource: departmentList,
    legend: {
      legendData: departmentList,
      ...commomPieProps.legend,
    },
    option: {
      isRing: true,
      hasPercent: true,
      right: '46%',
    },
    customDom: (
      <CustomDom
        title={pieTitle}
        sum={pieData.length}
        option={{ right: '46%' }}
      />
    ),
    onEvents: {
      click: handleClickPie,
    },
    isMultiple,
    needGoBack: isMultiple && pieStack.length > 0,
    onGoBack: handleGoBack,
  };
  return (
    <>
      <Card title="饼图" size="small">
        <CustomPie {...pieProps} />
      </Card>
      <Card title="环形图单层" size="small" style={{ marginTop: '16px' }}>
        <CustomPie {...singleLevelRingProps} />
      </Card>
      <Card
        title="环形图多层(环形图和legend都可以点击)"
        size="small"
        style={{ marginTop: '16px' }}
      >
        <CustomPie {...multipleLevelRingProps} />
      </Card>
    </>
  );
};
