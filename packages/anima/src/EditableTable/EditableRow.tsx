import React from 'react';
import { Form } from 'antd';

interface EditableRowProps extends Record<string, any> {
  index: number;
}
export default function EditableRow({
  index,
  ...props
}: EditableRowProps): JSX.Element {
  const [form] = Form.useForm();
  const record = props?.children?.[0]?.props.record;
  const rowKey = props?.['data-row-key'];
  const key = rowKey ? `key-${record?.[rowKey]}` : undefined;

  return (
    <Form form={form} component={false} key={key}>
      <tr {...props} />
    </Form>
  );
}
