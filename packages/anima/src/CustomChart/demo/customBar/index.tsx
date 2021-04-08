import React from 'react';
import { CustomBar } from 'anima-zoey';
import { Card } from 'antd';
import { appSourceSource, resourceDataSource } from './data';

const XAXIS_RETAIN_LENGHT = 5;

export default () => {
  const commonBarProps = {
    containerStyle: {
      padding: '10px 0',
    },
    chartStyle: {
      height: '220px',
      minHeight: '220px',
    },
    noDataStyle: {
      height: '100px',
    },
  };

  const zoomBarProps = {
    ...commonBarProps,
    dataSource: appSourceSource,
    option: {
      hasZoom: true,
    },
  };

  const rotateXAxisBarProps = {
    ...commonBarProps,
    dataSource: resourceDataSource,
    xAxisFormatter: (value: string) =>
      value?.length > XAXIS_RETAIN_LENGHT
        ? value?.substring(0, XAXIS_RETAIN_LENGHT) + '...'
        : value,
    rotateXAxis: true,
  };
  return (
    <>
      <Card title="可放大" size="small">
        <CustomBar {...zoomBarProps} />
      </Card>
      <Card title="x轴倾斜" size="small" style={{ marginTop: '16px' }}>
        <CustomBar {...rotateXAxisBarProps} />
      </Card>
    </>
  );
};
