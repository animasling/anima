import React, { useState } from 'react';
import _ from 'lodash';
import { EditableTable, EditComType, OnEditedRowParams } from 'anima-zoey';
import {
  timeFormatter,
  TimeFormat,
  FormatValue,
} from './utils';
import { message } from 'antd';

const data = [
  {
    id: 9,
    businessTagCode: 'code1',
    businessTag: '测试标签1',
    operateTime: 1672993932000,
    operateUser: '清华',
  },
  {
    id: 8,
    businessTagCode: 'code2',
    businessTag: '测试标签2',
    operateTime: 1672993809000,
    operateUser: '丽雨',
  },
  {
    id: 7,
    businessTagCode: 'code3',
    businessTag: '测试标签3',
    operateTime: 1672993809000,
    operateUser: '龙玲',
  },
];

export default () => {
  const [editedData, setEditedData] = useState<OnEditedRowParams<any>>();

  const COLUMNS = [
    {
      title: '标签code',
      dataIndex: 'businessTagCode',
      addable: {
        type: EditComType.INPUT,
        style: { width: '100%' },
      },
    },
    {
      title: '标签名称',
      dataIndex: 'businessTag',
      addable: {
        type: EditComType.INPUT,
        style: { width: '100%' },
      },
      editable: {
        type: EditComType.INPUT,
        style: { width: '100%' },
      },
    },
    {
      title: '操作人',
      dataIndex: 'operateUser',
      width: 100,
    },
    {
      title: '操作时间',
      dataIndex: 'operateTime',
      width: 180,
      render: (value: FormatValue) =>
        _.isNumber(value) ? timeFormatter(value, TimeFormat.DATETIME) : value,
    },
  ];
  return (
    <>
      <EditableTable
        rowKey="id"
        size="small"
        hasRemove
        columns={COLUMNS}
        dataSource={data}
        onEditedRow={async (editedData, form) => {
          await form?.validateFields();
          setEditedData(editedData);
        }}
        pagination={false}
        scroll={{ y: 400 }}
        remove={{
          onBeforeRemoveCallback: async (record, isAdd) => {
            if (!isAdd && record.id === 8) {
              message.info('该条信息不可以删除哦~');
              return false;
            }
            return true;
          },
          onRemoveCallback: editedData => {
            setEditedData(editedData);
          },
        }}
        add={{
          text: '添加标签',
          colSpan: 5,
          position: 'bottom',
        }}
        maxLength={5}
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
