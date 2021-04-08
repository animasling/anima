import { TableProps, FormInstance } from 'antd';
import { ColumnGroupType, ColumnType } from 'antd/lib/table/interface';
import { SummaryProps } from 'rc-table/lib/Footer/Summary';
import { Rule } from 'rc-field-form/lib/interface';

export type EditType = 'input' | 'select' | 'number' | 'date' | 'dateRange';

export type Editable = boolean | { type: EditType; [key: string]: any };
export type ColumnsTypes<T> = ((ColumnGroupType<T> | ColumnType<T>) & {
  dataIndex: string;
  editable?: Editable;
  addable?: Editable;
  children?: ((ColumnGroupType<T> | ColumnType<T>) & { editable?: Editable })[];
})[];

export type EditedCell<T> = Omit<Partial<T>, 'newAdd'>;
export type OnEditedRowParams<T> = {
  editedCell: EditedCell<T>;
  editedRow: T;
  editedData: T[];
};

// 删除配置
type RemoveConfigs<T> = {
  hasConfirm?: boolean; // 是否有再次确认
  onBeforeRemoveCallback?: (
    record: T,
    isAdd: boolean,
  ) => Promise<boolean | void>; //  删除之前的回调,是否可以删除,不返回默认可以删除
  onRemoveCallback?: ({
    editedCell,
    editedRow,
    editedData,
  }: OnEditedRowParams<T>) => void; // 删除之后的回调
};

// 添加配置
type AddConfigs<T> = {
  colSpan: number; // 添加按钮占几列
  position?: SummaryProps['fixed']; // 添加按钮是在上面还是下面
  text?: string; // 添加按钮文案
  onAddCallback?: (record: T) => void; // 添加回调
};

export interface EditableTableProps<T extends { newAdd?: boolean }>
  extends Omit<TableProps<T>, 'columns'> {
  columns: ColumnsTypes<T>;
  onEditedRow?: (
    { editedCell, editedRow, editedData }: OnEditedRowParams<T>,
    form?: FormInstance,
  ) => void;
  hasRemove?: boolean; // 是否有删除
  remove?: RemoveConfigs<T>;
  add?: AddConfigs<T>; // 是否有添加
  maxLength?: number; // 最多加多少行
  showEditedRow?: boolean; // 是否显示编辑过的行
}

export interface EditableCellProps<T> {
  rowKey: string;
  title: React.ReactNode;
  editable: boolean;
  addable: boolean;
  children: React.ReactNode;
  dataIndex: keyof T;
  record: T;
  onChangeRow: (record: Partial<T>, form: FormInstance) => void;
  editComType: EditType;
  editComProps: Record<string, unknown>;
  editComRequired: boolean; // 是否必填
  editComRules: Rule[];
  formatter: (value: any) => React.ReactNode;
}
