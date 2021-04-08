import React from 'react';
import { CustomLine, ChartUtils, ChartConstants } from 'anima-zoey';
import { Card, message, Tooltip } from 'antd';
import { DeploymentUnitOutlined, ShareAltOutlined } from '@ant-design/icons';
import { dataSource } from './data';

const { countFormatter } = ChartUtils;
const { TooltipClickRoles } = ChartConstants;

export default () => {
  const commonLineProps = {
    dataSource,
    containerStyle: {
      padding: '10px 0',
    },
    showLegend: true,
    option: {
      tooltipValueFormatter: countFormatter,
    },
    chartStyle: {
      height: '190px',
      minHeight: '190px',
    },
    noDataStyle: {
      height: '100px',
    },
  };

  const tooltipCanClickLineProps = {
    ...commonLineProps,
    customTooltip: {
      tooltipClickCallBack: ({ role, value }: DOMStringMap) => {
        message.info(`${role}：${value}`);
      },
      tooltipClickRoles: [
        TooltipClickRoles.SERIES_NAME,
        TooltipClickRoles.SERIES_VALUE,
      ],
    },
  };

  const customToolsLineProps = {
    ...commonLineProps,
    customTools: {
      myCloudRefresh: {
        show: true,
        title: '云更新',
        icon: 'image://https://echarts.apache.org/zh/images/favicon.png',
        onclick: function () {
          message.info('云更新完成');
        },
      },
    },
  };

  const saveAsImageLineProps = {
    ...commonLineProps,
    saveAsImage: {
      name: '资源折线图',
    },
  };

  const sideBarsLineProps = {
    ...commonLineProps,
    sideBars: [
      <Tooltip title="百度" key="baidu">
        <a
          href="https://www.baidu.com/"
          target="_blank"
          rel="noreferrer"
        >
          <ShareAltOutlined />
        </a>
      </Tooltip>,
      <Tooltip title="知乎" key="知乎">
        <a
          href="https://www.zhihu.com/"
          target="_blank"
          rel="noreferrer"
        >
          <DeploymentUnitOutlined />
        </a>
      </Tooltip>,
    ],
  };

  return (
    <>
      <Card title="标准(ctrl+ 点击可多选legend)" size="small">
        <CustomLine {...commonLineProps} />
      </Card>
      <Card title="tooltip可点击" size="small" style={{ marginTop: '16px' }}>
        <CustomLine {...tooltipCanClickLineProps} />
      </Card>
      <Card title="保存为图片" size="small" style={{ marginTop: '16px' }}>
        <CustomLine {...saveAsImageLineProps} />
      </Card>
      <Card title="自定义工具" size="small" style={{ marginTop: '16px' }}>
        <CustomLine {...customToolsLineProps} />
      </Card>
      <Card title="侧边栏设置" size="small" style={{ marginTop: '16px' }}>
        <CustomLine {...sideBarsLineProps} />
      </Card>
    </>
  );
};
