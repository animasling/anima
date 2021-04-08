import React from 'react';
import { Empty } from 'antd';
import './index.less';

const ChartNoData =({
  title,
  style,
}: {
  title?: string;
  style?: React.CSSProperties;
}) => {
  return (
    <div className='no-data' style={style}>
      <h2 className='title'>{title}</h2>
      <div className='no-data' style={{
        padding: 0,
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
      </div>
    </div>
  );
}

export default ChartNoData;
