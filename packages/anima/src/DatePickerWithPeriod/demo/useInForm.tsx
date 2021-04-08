import React from 'react';
import { Button, Form } from 'antd';
import {
  DatePickerWithPeriod,
  DatePickerWithPeriodValue,
  DatePeriodType,
} from 'anima-zoey';

const FormItem = Form.Item;

export default () => {
  const [form] = Form.useForm();

  const handleFinish = (values: DatePickerWithPeriodValue) => {
    console.log(values);
  };

  const initialValues = {
    datePickerWithPeriod: { datePeriod: DatePeriodType.MONTH },
  };

  return (
    <>
      <Form form={form} onFinish={handleFinish} initialValues={initialValues}>
        <FormItem name="datePickerWithPeriod" label="时间">
          <DatePickerWithPeriod name="datePickerWithPeriod" />
        </FormItem>
        <FormItem>
          <Button type="primary" htmlType="submit">
            提交
          </Button>
        </FormItem>
      </Form>
    </>
  );
};
