import React, { useState } from 'react';
import _ from 'lodash';
import { Modal, Popconfirm, Button, message } from 'antd';
import { EditableTable, EditComType } from 'anima-zoey';
import {
  timeFormatter,
  TimeFormat,
  FormatValue,
} from './utils';

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

export const BusinessTagHandleType = {
  ADD: 0,
  EDIT: 1,
  REMOVE: 2,
};

function isAdd(id: number | string | undefined): boolean {
  return String(id)?.indexOf('add') >= 0;
}

export type BusinessTagHandleInfoItem = {
  id?: number | string; // 业务id(修改，删除时传)
  businessTagCode?: string; // 业务code (新增时传)
  businessTag?: string; // 业务标签 (新增修改时传)
  handleType: number; // 业务标签操作类型
};

export default () => {
  const [handleInfo, setHandleInfo] = useState<BusinessTagHandleInfoItem[]>([]);
  const [visible, setVisible] = useState(false);
  const [dataList, setDataList] = useState<any[]>(data);

  const handleHandleInfo = (record: any, handleType: number) => {
    const editedRow =
      BusinessTagHandleType.REMOVE === handleType ? { id: record?.id } : record;
    const currentHandleInfo = {
      handleType,
      ...editedRow,
    };
    setHandleInfo(prevHandleInfo => {
      const otherHandleInfo = prevHandleInfo.filter(
        ({ id }) => currentHandleInfo.id !== id,
      );
      const isRemoveAddedHandleInfo =
        BusinessTagHandleType.REMOVE === currentHandleInfo.handleType &&
        isAdd(currentHandleInfo.id);
      const isNoChangeRow = _.isEqual(
        editedRow,
        dataList?.find(({ id }) => id === editedRow.id),
      );
      if (isRemoveAddedHandleInfo || isNoChangeRow) return otherHandleInfo;
      return [...otherHandleInfo, currentHandleInfo];
    });
  };

  const handleShowModal = (visible: boolean) => {
    setVisible(visible);
  };

  const handleCancel = () => {
    handleShowModal(false);
    setHandleInfo([]);
  };

  const handleSumbit = () => {
    handleInfo.forEach((item: BusinessTagHandleInfoItem) => {
      if (BusinessTagHandleType.REMOVE === item.handleType) {
        setDataList(prevData => prevData.filter(({ id }) => id !== item.id));
      }
      if (BusinessTagHandleType.EDIT === item.handleType) {
        setDataList(prevData =>
          prevData.map(data =>
            data.id === item.id
              ? { ...data, ..._.omit(item, 'handleType') }
              : data,
          ),
        );
      }
      if (BusinessTagHandleType.ADD === item.handleType) {
        const addItem = _.omit(
          { ...item, id: parseInt(String(Math.random() * 100), 10) },
          'handleType',
        );
        setDataList(prevData => [addItem, ...prevData]);
      }
    });
    handleCancel();
  };

  return (
    <>
      <Button type="primary" onClick={() => handleShowModal(true)}>
        标签维护
      </Button>
      {visible && (
        <Modal
          centered
          title="业务标签"
          visible={visible}
          onCancel={handleCancel}
          width={1000}
          footer={[
            <>
              <Popconfirm
                key="submit"
                title="确认提交改动？"
                onConfirm={handleSumbit}
                disabled={!handleInfo.length}
                okText="确定"
                cancelText="取消"
              >
                <Button type="primary" disabled={!handleInfo.length}>
                  确认修改
                </Button>
              </Popconfirm>
            </>,
          ]}
        >
          <EditableTable
            rowKey="id"
            size="small"
            hasRemove
            showEditedRow
            columns={COLUMNS}
            dataSource={dataList}
            onEditedRow={async ({ editedRow }, form) => {
              await form
                ?.validateFields()
                .then(() => {
                  handleHandleInfo(
                    editedRow,
                    isAdd(editedRow?.id)
                      ? BusinessTagHandleType.ADD
                      : BusinessTagHandleType.EDIT,
                  );
                })
                .catch(() => {
                  handleHandleInfo(editedRow, BusinessTagHandleType.REMOVE);
                });
            }}
            pagination={false}
            scroll={{ y: 400 }}
            remove={{
              onBeforeRemoveCallback: async (record, isAdd) => {
                if (!isAdd && record.id === 8) {
                  message.info('该条信息不可以删除哦~');
                  return false;
                }
                handleHandleInfo(record, BusinessTagHandleType.REMOVE);
                return true;
              },
            }}
            add={{
              text: '添加标签',
              colSpan: 5,
              position: 'top',
            }}
          />
        </Modal>
      )}
    </>
  );
};
