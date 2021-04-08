import React, { useState } from 'react';
import { EditableTable, EditComType, OnEditedRowParams } from 'anima-zoey';
import _ from 'lodash';
import numeral from 'numeral';

const NO_CONTENT = '-';

const data = [
  {
    resource: 'cargo_core-m1-read::CarryMapper:select(int,List)',
    qps: 947,
    time1: 5682,
    time10: 947,
    id: 68187,
    source: 'cargo-core',
    type: 'DB',
    clusterLevel: 1,
  },
  {
    resource:
      'cargo_core-m1-write::CargoExtMapper:selectCargo(QueryExtByIdRequest)',
    qps: 52,
    time1: 312,
    time10: 52,
    id: 63752,
    source: 'cargo',
    type: 'Catch',
    clusterLevel: 3,
  },
  {
    resource:
      'cargo_core-m1-write::CargoBaseMapper:selectCargo(QueryByIdRequest)',
    qps: 52,
    time1: 536,
    time10: 79,
    id: 69731,
    source: 'cargo',
    type: 'DB',
    clusterLevel: 2,
  },
];

const ClusterLevel = [
  { value: 1, label: 'P1' },
  { value: 2, label: 'P2' },
  { value: 3, label: 'P3' },
];

export default () => {
  const [editedData, setEditedData] = useState<OnEditedRowParams<any>>();

  const EditableInputNumberProps = {
    align: 'right',
    editable: {
      type: EditComType.NUMBER,
      min: 1,
      max: 9999999,
      precision: 0,
    },
    render: (value: number) =>
      _.isNil(value) ? NO_CONTENT : numeral(value).format('0,0'),
  };

  const COLUMNS = [
    {
      title: '类型',
      dataIndex: 'type',
    },
    {
      title: '集群名',
      dataIndex: 'source',
      editable: true,
    },
    {
      title: '集群等级',
      dataIndex: 'clusterLevel',
      render: (clusterLevel: number) =>
        ClusterLevel.find(({ value }) => value === clusterLevel)?.label,
      editable: {
        type: EditComType.SELECT,
        options: ClusterLevel,
      },
    },
    {
      title: '资源名',
      dataIndex: 'resource',
      editable: {
        type: EditComType.INPUT,
        style: { width: '100%' },
      },
    },
    {
      title: 'QPS窗口',
      editable: true,
      children: [
        {
          title: '1s',
          dataIndex: 'time1',
          ...EditableInputNumberProps,
        },
        {
          title: '10s',
          dataIndex: 'time10',
          ...EditableInputNumberProps,
        },
      ],
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
