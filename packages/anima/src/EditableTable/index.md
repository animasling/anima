---
group:
  title: 数据录入
  order: 2  
nav:
  title: 组件
  path: /components
  order: 2  
---

## 可编辑表格

可编辑的表格,目前支持编辑类型：`Input`、`Select`、`InputNumber`、`Date`、`DateRange`， 后期可以添加其他类型。表格可以通过 `onEditedRow` 函数获取编辑后的单元格属性值(`editedCell`)，单元格所在行的所有属性值(`editedRow`)，或是整个表格的数据(`editedData`)，用户可以根据自己的需求选择需要的值。

## DEMO

<code src="../EditableTable/demo/basic.tsx" title="基本用法" description="基本用法"></code>

<code src="../EditableTable/demo/editableDateTable.tsx" title="可编辑时间" description="日期范围数据格式为 `number[]`;"></code>

<code src="../EditableTable/demo/editableTableWithRemoveAndAdd.tsx" title="可删除和添加" description="可删除和添加"></code>

<code src="../EditableTable/demo/useInModal.tsx" title="在弹框中使用" description="
当表格在弹框里使用的时候，设置`showEditedRow`, 可以显示编辑过的行，如果更改回原值，将不会显示。"></code>

## API

| 参数          | 说明                                           | 类型                                                | 默认值  | 版本  |
| ------------- | ---------------------------------------------- | --------------------------------------------------- | ------- | ----- |
| rowKey        | 必传,表格行 key 的取值，可以是字符串或一个函数 | `string \| ((record: T, index: number) => string);` | -       | 0.01 |
| columns       | 必传,表格列的配置描述                          | `ColumnsTypes<T>`                                   | -       | 0.01 |
| dataSource    | 必传，表格数据源                               | `Record<string, any>[]`                             | -       | 0.01 |
| onEditedRow   | 必传，编辑表格后的回调                         | `(value: OnEditedRowParams<T>) => void`             | -       | 0.01 |
| hasRemove     | 非必传，是否有删除                             | `boolean`                                           | `false` | 0.01 |
| remove        | 非必传，删除相关配置                           | `RemoveConfigs<T>`                                  | -       | 0.01 |
| add           | 非必传，添加相关配置, 配置了就有添加           | `AddConfigs<T>`                                     | -       | 0.01 |
| maxLength     | 非必传，表格最多能加到几行                     | `number`                                            | -       | 0.01 |
| showEditedRow | 非必传，是否显示编辑过的行(背景加蓝色)         | `boolean`                                           | `false` | 0.01 |

## TS

| 类型名称               | 定义                                                                                                                                                                                         | 备注                                                                                                                                             |
| ---------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| EditType               | `'input' \| 'select' \| 'number' \| 'date' \| 'dateRange';`                                                                                                                                  | 对应编辑类型 Input、Select、InputNumber、Date、DateRange                                                                                         |
| Editable               | `boolean \| { type: EditType; [key: string]: any };`                                                                                                                                         | 除 type 以外,其它为该编辑类型配置的属性                                                                                                          |
| ColumnsTypes\<T\>      | `((ColumnGroupType<T> \| ColumnType<T>) & {dataIndex: string;editable?: Editable;addable?: Editable;children?: ColumnGroupType<T>['children'] & { editable?: Editable };})[]`                | 如果子单元格需要编辑，则父单元格需配置 `editable` 为 <b>true</b>。                                                                               |
| OnEditedRowParams\<T\> | `{editedCell: Partial<T>; editedRow: T;editedData: T[];}`                                                                                                                                    | `editedCell`: 当前更改的单元格值, `editedRow`: 当前更改的单元格所在行值, `editedData`: 更改后的表格值                                            |
| RemoveConfigs\<T\>     | `hasConfirm: boolean;onBeforeRemoveCallback?: (record: T, isAdd: boolean) => Promise<boolean \| void>; onRemoveCallback?:({editedCell, editedRow,editedData}: OnEditedRowParams<T>) => void` | `hasConfirm`:是否有再次确认, 默认`true`, `onRemoveCallback`: 删除之前的回调,是否可以删除,不返回默认可以删除, `onRemoveCallback`: 删除之后的回调. |
| AddConfigs\<T\>        | `colSpan: number;position?: SummaryProps['fixed'];text?: string; onAddCallback?: (record: T) => void;`                                                                                       | `colSpan`: 添加按钮占几列, `position`: 添加按钮是在列表的上面还是下面, 默认`top`,`text`: 添加按钮文案, `onAddCallback`: 添加回调                 |

<a href="https://ant.design/components/table-cn/">其他配置请参考 antd Table</a>
