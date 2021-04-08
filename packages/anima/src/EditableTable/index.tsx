import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Table, Button, Popconfirm, message, FormInstance } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import _ from 'lodash';
import classNames from 'classnames';
import EditableRow from './EditableRow';
import EditableCell, { EditComType } from './EditableCell';
import type {
  EditableTableProps,
  Editable,
  ColumnsTypes,
  EditedCell,
} from './interface';
import './index.less';

const TableSummary = Table.Summary;
const TableSummaryRow = Table.Summary.Row;
const TableSummaryCell = Table.Summary.Cell;

const NO_CONTENT = '-';

function getIsEditable(editable: Editable | undefined) {
  return _.isObject(editable) ? true : editable;
}

export function getIsAdd(
  record: Record<string, any>,
  rowKey: React.Key,
): boolean {
  return String(record?.[rowKey]).indexOf('add') >= 0;
}

function isEqualRowKey(
  rowKey: string | number,
  compareRowKey: string | number,
): boolean {
  return String(rowKey) === String(compareRowKey);
}

function getIsEdited<T extends Record<string, string | number>>(
  editedRow: T,
  dataSource: T[] | undefined,
  rowKey: React.Key,
): boolean {
  const originalRow = dataSource?.find((data: any) =>
    isEqualRowKey(data[rowKey], editedRow[rowKey]),
  );
  return !_.isEqual(editedRow, originalRow);
}

function omitAddFlag<T>(data: Partial<T>) {
  return _.omit(data, 'newAdd');
}

export default function EditableTable<
  T extends Record<string, string | number>
>(props: EditableTableProps<T>): JSX.Element {
  const {
    dataSource,
    columns,
    onEditedRow,
    rowKey,
    hasRemove,
    remove,
    add,
    maxLength,
    showEditedRow = false,
    ...restProps
  } = props;
  const [editedDataSource, setEditedDataSource] = useState<T[]>(
    dataSource as T[],
  );
  const [addIndex, setAddIndex] = useState<number>(0);
  const [editedRowKeys, setEditedRowKeys] = useState<React.Key[]>([]);

  const hasAdd = !_.isNil(add);
  const addPosition = add?.position ?? 'bottom';
  const hasRemoveConfirm = remove?.hasConfirm ?? true;

  const getRowKey = useMemo(() => {
    if (typeof rowKey === 'function') return rowKey;
    return () => rowKey;
  }, [rowKey]);

  const components: EditableTableProps<T>['components'] = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };

  useEffect(() => {
    setEditedDataSource(dataSource as T[]);
  }, [dataSource]);

  const handleEditDataSource = useCallback(
    async (editedCell: Partial<T>, rowKey: React.Key, form: FormInstance) => {
      let editedRow = {} as any;
      const editedRowKey = editedCell[rowKey] as string;
      const editedData = editedDataSource?.map(data => {
        if (!isEqualRowKey(data[rowKey], editedRowKey)) return data;
        editedRow = omitAddFlag({ ...data, ...editedCell });

        setEditedRowKeys(prevEditedRowKeys => {
          if (getIsEdited<T>(editedRow, dataSource as T[], rowKey)) {
            if (!prevEditedRowKeys.includes(editedRowKey))
              return [...prevEditedRowKeys, editedRowKey];
            return prevEditedRowKeys;
          } else {
            if (!prevEditedRowKeys.includes(editedRowKey))
              return prevEditedRowKeys;
            return prevEditedRowKeys.filter(
              prevEidtedRowKey =>
                !isEqualRowKey(prevEidtedRowKey, editedRowKey),
            );
          }
        });

        return editedRow;
      });

      await setEditedDataSource(editedData);
      onEditedRow?.(
        { editedCell: omitAddFlag(editedCell), editedRow, editedData },
        form,
      );
    },
    [editedDataSource, onEditedRow],
  );

  const getCellProps = useCallback(
    (record, editable, addable, col, index) => {
      const rowKey = getRowKey(record, index);
      const editComConfig = col?.editable || col?.addable;
      const editComType = editComConfig.type || EditComType.INPUT;
      const editComProps = _.omit(editComConfig, 'type');
      const editComRequired = editComConfig?.required ?? true;
      const editComRules = editComConfig?.rules ?? [];

      return {
        rowKey,
        record,
        editable,
        addable,
        dataIndex: col?.dataIndex,
        title: col.title,
        formatter: col?.render,
        editComType,
        editComProps,
        editComRequired,
        editComRules,
        onChangeRow: (editedCell: Partial<T>, form: FormInstance) =>
          handleEditDataSource(editedCell, rowKey as React.Key, form),
      };
    },
    [getRowKey, handleEditDataSource],
  );

  const handleRemoveDataSource = useCallback(
    async (record: T, rowKey: React.Key) => {
      const removedRowKey = record[rowKey];
      const editedData = editedDataSource?.filter(
        data => !isEqualRowKey(data[rowKey], removedRowKey),
      );
      const removedRow =
        editedDataSource?.find(data =>
          isEqualRowKey(data[rowKey], removedRowKey),
        ) || ({} as T);

      // 删除的是否是才添加的
      const isAdd = getIsAdd(removedRow, rowKey);

      const canRemove = await remove?.onBeforeRemoveCallback?.(
        removedRow,
        isAdd,
      );
      const isRemoved = _.isBoolean(canRemove) ? canRemove : true;

      if (!isRemoved) return;
      await setEditedDataSource(editedData);
      setEditedRowKeys(prevEditedRowKeys =>
        prevEditedRowKeys.filter(rowKey => rowKey !== removedRowKey),
      );
      remove?.onRemoveCallback?.({
        editedCell: {} as EditedCell<T>,
        editedRow: removedRow,
        editedData,
      });
    },
    [editedDataSource, remove],
  );

  const realColumns: any = useMemo(() => {
    const editableColumns = columns?.map(col => {
      const editable = getIsEditable(col.editable);
      const addable = getIsEditable(col.addable);

      if (!editable && !addable) {
        return col;
      }

      if (col?.children) {
        (col as any).children = col.children.map(childrenCol => {
          const childrenEditable = getIsEditable(childrenCol?.editable);
          if (!childrenEditable) {
            return childrenCol;
          }
          return {
            ...childrenCol,
            onCell: (record: T, index: number) =>
              getCellProps(record, childrenEditable, false, childrenCol, index),
          };
        });
      }

      return {
        ...col,
        onCell: (record: T, index: number) =>
          getCellProps(record, editable, addable, col, index),
      };
    });

    const operate = {
      title: '操作',
      dataIndex: 'operate',
      width: 80,
      render: (__: any, record: T, index: number) => {
        const rowKey = getRowKey(record, index);
        const removeBtn = (
          <Button
            type="link"
            onClick={() => handleRemoveDataSource(record, rowKey as React.Key)}
          >
            删除
          </Button>
        );
        return hasRemoveConfirm ? (
          <Popconfirm
            title="确认删除"
            onConfirm={() =>
              handleRemoveDataSource(record, rowKey as React.Key)
            }
            okText="删除"
            cancelText="取消"
          >
            <Button type="link"> 删除 </Button>
          </Popconfirm>
        ) : (
          removeBtn
        );
      },
    };
    return hasRemove ? [...editableColumns, operate] : editableColumns;
  }, [columns, editedDataSource, hasRemove, getCellProps]);

  const handleShowAddedRow = (addedRow: T) => {
    const addRowNode = document
      .getElementsByClassName('editableTable')[0]
      .querySelector(
        `tr.row-${[addedRow?.[getRowKey({} as T, addIndex) as string]]}`,
      );
    setTimeout(() => {
      addRowNode?.scrollIntoView();
    }, 300);
  };

  const handleAddDataSource = useCallback(async () => {
    setAddIndex(prev => prev + 1);
    const isTopAdd = addPosition === 'top';
    const addedRow = (realColumns as ColumnsTypes<T>)
      .filter(({ dataIndex }) => dataIndex !== 'operate')
      .reduce(
        (data, col) => {
          const addable = getIsEditable(col?.addable);
          return {
            ...data,
            [col.dataIndex]: addable ? undefined : NO_CONTENT,
          };
        },
        ({
          [getRowKey({} as T, addIndex) as string]: `add${addIndex}`,
          newAdd: true,
        } as unknown) as T,
      );

    const realEditedDataSource = isTopAdd
      ? [addedRow, ...editedDataSource]
      : [...editedDataSource, addedRow];

    if (!_.isNil(maxLength) && realEditedDataSource.length > maxLength) {
      message.info(`最多只能添加${maxLength}行`);
      return;
    }

    await setEditedDataSource(realEditedDataSource);
    add?.onAddCallback?.(addedRow);
    handleShowAddedRow(addedRow);
  }, [
    editedDataSource,
    realColumns,
    addPosition,
    maxLength,
    addIndex,
    getRowKey,
  ]);

  const showEditedRowStyle = useCallback(
    (record: T, index: number) => {
      const rowKey = getRowKey(record, index);
      const isAdd = getIsAdd(record, rowKey as React.Key);
      return (
        showEditedRow &&
        !isAdd &&
        editedRowKeys.includes(record?.[rowKey as React.Key])
      );
    },
    [showEditedRow, editedRowKeys],
  );

  return (
    <Table
      className="editableTable"
      rowKey={getRowKey as EditableTableProps<T>['rowKey']}
      rowClassName={(record, index) =>
        classNames(
          `row-${record?.[getRowKey(record, index) as string]} ${
            'editable-row'
          }`,
          {
            'edited-row': showEditedRowStyle(record, index),
          },
        )
      }
      components={components}
      dataSource={editedDataSource}
      columns={realColumns}
      summary={() =>
        hasAdd ? (
          <TableSummary fixed={addPosition}>
            <TableSummaryRow>
              <TableSummaryCell index={0} colSpan={add?.colSpan}>
                <Button type="dashed" block onClick={handleAddDataSource}>
                  <PlusOutlined />
                  {add?.text ?? '添加'}
                </Button>
              </TableSummaryCell>
            </TableSummaryRow>
            <TableSummaryRow></TableSummaryRow>
          </TableSummary>
        ) : null
      }
      sticky={hasAdd}
      {...restProps}
    />
  );
}

export { EditComType } from './EditableCell';
export type { OnEditedRowParams } from './interface';
