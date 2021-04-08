import React, { useState, useRef, useEffect, useMemo } from 'react';
import classNames from 'classnames';
import {
  Form,
  Input,
  Select,
  InputNumber,
  DatePicker as TDatePicker,
} from 'antd';
import type { NamePath } from 'rc-field-form/lib/interface';
import _ from 'lodash';
import moment from 'moment';
import { getIsAdd } from '.';
import type { EditType, EditableCellProps } from './interface';
import './index.less';

const FormItem = Form.Item;
const DatePicker: any = TDatePicker;
const RangePicker: any = TDatePicker.RangePicker;

function transformValues(value: any, isDate: boolean) {
  if (!isDate) return value;
  return _.isArray(value)
    ? [moment(value[0]), moment(value[1])]
    : moment(value);
}

export const EditComType: Record<string, EditType> = {
  INPUT: 'input',
  SELECT: 'select',
  NUMBER: 'number',
  DATE: 'date',
  DATE_RANGE: 'dateRange',
};
const DateEditComTypeArr = [EditComType.DATE, EditComType.DATE_RANGE];

export default function EditableCell<T extends Record<string, any>>(
  props: EditableCellProps<T>,
): JSX.Element {
  const {
    title,
    editable,
    addable,
    editComType,
    editComProps,
    editComRequired,
    editComRules,
    children,
    dataIndex,
    rowKey,
    record,
    onChangeRow,
    formatter,
    ...restProps
  } = props;
  const [editing, setEditing] = useState(false);
  const [currentValue, setCurrentValue] = useState(record?.[dataIndex]);
  const editComRef = useRef(null);
  const form = Form.useFormInstance();
  const isDate = DateEditComTypeArr.includes(editComType);
  const isAdd = getIsAdd(record, rowKey);

  useEffect(() => {
    setCurrentValue(record?.[dataIndex]);
    let realValue = record?.[dataIndex];
    realValue = transformValues(realValue, isDate);

    form.setFieldsValue({ [dataIndex]: realValue });
    if (isAdd && editComRequired && !record?.newAdd) {
      form.validateFields([dataIndex as NamePath]);
    }
  }, [record, dataIndex, isAdd, editComRequired]);

  useEffect(() => {
    if (!editing) return;
    (editComRef?.current as any)?.focus();
  }, [editing, editComRef]);

  const toggleEdit = (value?: any) => {
    if (!isAdd) {
      setEditing(prevEditing => !prevEditing);
    }
    let realValue: any = value ?? currentValue;
    realValue = transformValues(realValue, isDate);
    form.setFieldsValue({ [dataIndex]: realValue });
  };

  const handleChangeRow = async () => {
    try {
      const values = await form?.validateFields([dataIndex as NamePath]);
      if (isDate) {
        let dateValue = values[dataIndex];
        dateValue = _.isArray(dateValue)
          ? [moment(dateValue[0]).valueOf(), moment(dateValue[1]).valueOf()]
          : moment(dateValue).valueOf();
        values[dataIndex] = dateValue;
      }
      await setCurrentValue(values[dataIndex]);
      if (!isDate) {
        toggleEdit(values[dataIndex]);
      }
      onChangeRow({ ...values, [rowKey]: record[rowKey], newAdd: false }, form);
    } catch (errInfo) {
      // 1.清空值 2.标识验证状态
      onChangeRow(
        ({
          [rowKey]: record[rowKey],
          [dataIndex]: undefined,
          newAdd: false,
        } as unknown) as Partial<T>,
        form,
      );
      form?.validateFields([dataIndex as NamePath]);
      console.log('验证失败:', errInfo);
    }
  };

  const defaultEditComProps = {
    className: 'editable-cell',
    onBlur: handleChangeRow,
  };

  const dateEditComProps = {
    className: 'editable-cell',
    onChange: handleChangeRow,
    onOpenChange: (open: boolean) => {
      setEditing(open);
    },
  };

  const message = useMemo(() => {
    const inputArr = [EditComType.INPUT, EditComType.NUMBER];
    return inputArr.includes(editComType) ? `请输入${title}` : `请选择${title}`;
  }, [editComType, title]);

  const editCompont = useMemo(
    () =>
    ({
      [EditComType.INPUT]: (
        <Input
          ref={editComRef}
          size="small"
          placeholder={message}
          {...defaultEditComProps}
          {...editComProps}
        />
      ),
      [EditComType.SELECT]: (
        <Select
          ref={editComRef}
          options={[]}
          size="small"
          placeholder={message}
          {...defaultEditComProps}
          {...editComProps}
        />
      ),
      [EditComType.NUMBER]: (
        <InputNumber
          ref={editComRef}
          size="small"
          placeholder={message}
          {...defaultEditComProps}
          {...editComProps}
        />
      ),
      [EditComType.DATE]: (
        <DatePicker
          ref={editComRef}
          size="small"
          placeholder={message}
          style={{ minWidth: 120 }}
          {...dateEditComProps}
          {...editComProps}
        />
      ),
      [EditComType.DATE_RANGE]: (
        <RangePicker
          ref={editComRef}
          size="small"
          placeholder={message}
          style={{ minWidth: 250 }}
          {...dateEditComProps}
          {...editComProps}
        />
      ),
    }[editComType]),
    [editComType, message, dateEditComProps, editComProps, editComRef],
  );

  const childNode = useMemo(() => {
    if (!editable && !addable) return <>{children}</>;
    return editing || isAdd ? (
      <FormItem
        style={{ margin: 0 }}
        name={dataIndex as NamePath}
        rules={[{ required: editComRequired, message }, ...editComRules]}
      >
        {editCompont}
      </FormItem>
    ) : (
      <div
        className={classNames({
          ['editable-cell-value-wrap']: editable,
        })}
        onClick={() => {
          if (!editable) return;
          toggleEdit();
        }}
      >
        {_.isNil(formatter) ? currentValue : formatter(currentValue)}
      </div>
    );
  }, [
    form,
    editCompont,
    editable,
    addable,
    editing,
    children,
    dataIndex,
    editComRequired,
    editComRules,
    currentValue,
    isAdd,
    message,
  ]);

  return <td {...restProps}>{childNode}</td>;
}
