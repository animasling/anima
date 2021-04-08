import React, { useState } from 'react';
import { EditableTable, EditComType, OnEditedRowParams } from 'anima-zoey';
import moment from 'moment';
import {
  timeFormatter,
  TimeFormat,
  NO_CONTENT,
  FormatValue,
  isValidTime,
} from './utils';

const data = [
  {
    id: 68127,
    source: 'cargo-core',
    createTime: 1663878765000,
    ignoreTimeRange: [1660226412000, 1663312812000],
    ignoreTimeRangeWeek: [1660226412000, 1663312812000],
    handleTime: 1663845830000,
    createTimeMonth: 1663845830000,
  },
  {
    id: 64752,
    source: 'cargo',
    createTime: 1660369152000,
    ignoreTimeRange: [1663316535000, 1663542754000],
    ignoreTimeRangeWeek: [1663316535000, 1663542754000],
    handleTime: 1663935621000,
    createTimeMonth: 1660369152000,
  },
  {
    id: 65739,
    source: 'cargo-publish',
    createTime: 1663226412000,
    ignoreTimeRange: [1623620730000, 1643845830000],
    ignoreTimeRangeWeek: [1623620730000, 1643845830000],
    handleTime: 1665289401000,
    createTimeMonth: 1663845830000,
  },
];

function buildDatePeriod(datePeriod: number): string | number {
  return datePeriod < 10 ? `0${datePeriod}` : datePeriod;
}

export function timeFormatterByPeriod(
  value: FormatValue,
  formatKey: string,
): string {
  if (!isValidTime(value)) return NO_CONTENT;
  const numberValue = Number(value);
  const year = moment(numberValue).year();
  let month: string | number = moment(numberValue).month() + 1;
  month = buildDatePeriod(month);
  let week: string | number = moment(numberValue).week();
  week = buildDatePeriod(week);

  const formattedValue =
    {
      year: `${year}年`,
      month: `${year}-${month}`,
      week: `${year}-${week}周`,
    }[formatKey] || '';
  return formattedValue;
}

export default () => {
  const [editedData, setEditedData] = useState<OnEditedRowParams<any>>();

  const COLUMNS = [
    {
      title: '集群名',
      dataIndex: 'source',
    },
    {
      title: '发生时间',
      dataIndex: 'createTime',
      editable: {
        type: EditComType.DATE,
      },
      render: (createTime: FormatValue) =>
        timeFormatter(createTime, TimeFormat.DATE),
    },
    {
      title: '发生时间月',
      dataIndex: 'createTimeMonth',
      editable: {
        type: EditComType.DATE,
        picker: 'month',
      },
      render: (createTime: FormatValue) =>
        timeFormatterByPeriod(createTime, 'month'),
    },
    {
      title: '忽略时间段',
      dataIndex: 'ignoreTimeRange',
      editable: {
        type: EditComType.DATE_RANGE,
        showTime: true,
        style: { width: 370 },
      },
      render: (ignoreTimeRange: number[]) => {
        return `${timeFormatter(ignoreTimeRange[0])} ~ ${timeFormatter(
          ignoreTimeRange[1],
        )}`;
      },
    },
    {
      title: '忽略时间段周',
      dataIndex: 'ignoreTimeRangeWeek',
      editable: {
        type: EditComType.DATE_RANGE,
        picker: 'week',
        style: { width: 370 },
      },
      render: (ignoreTimeRange: number[]) => {
        return `${timeFormatterByPeriod(
          ignoreTimeRange[0],
          'week',
        )} ~ ${timeFormatterByPeriod(ignoreTimeRange[1], 'week')}`;
      },
    },
    {
      title: '处理时间',
      dataIndex: 'handleTime',
      editable: {
        type: EditComType.DATE,
        showTime: true,
        style: { width: 185 },
      },
      render: (handleTime: FormatValue) => timeFormatter(handleTime),
    },
  ];

  const handleEditedTable = (editedData: OnEditedRowParams<any>) => {
    setEditedData(editedData);
  };

  return (
    <>
      <EditableTable
        bordered
        size="small"
        pagination={false}
        rowKey="id"
        dataSource={data}
        columns={COLUMNS}
        onEditedRow={handleEditedTable}
      />
      <div style={{ marginTop: '10px' }}>
        编辑的单元格: {JSON.stringify(editedData?.editedCell)}
        <br />
        编辑的行: {JSON.stringify(editedData?.editedRow)}
        <br />
        编辑的表格数据: {JSON.stringify(editedData?.editedData)}
        <br />
      </div>
    </>
  );
};
