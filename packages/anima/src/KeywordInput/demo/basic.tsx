import React from 'react';
import { Form } from 'antd';
import { KeywordInput } from 'anima';

const FormItem = Form.Item;

const formItemLayout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
};

export const KEYWORD_MATCH_RULES = [
  {
    label: 'msg 或者 stack 匹配整个短语："hello world"',
    value: 'hello world',
  },
  {
    label: 'msg 匹配 hello 或者 world',
    value: 'msg:hello world',
  },
  {
    label: 'msg 或者 stack 包含 value1 和 value2',
    value: 'value1 AND value2',
  },
  {
    label: 'msg 或者 stack 包含 value1 或 value2',
    value: 'value1 OR value2',
  },
  {
    label: 'msg 或者 stack 不包含 value',
    value: 'NOT value',
  },
  {
    label: 'msg 或者 stack 必须包含 value1，以及 value2、value3 中的任一个',
    value: 'value1 AND (value2 OR value3)',
  },
  {
    label: '日志类名为：com.ymm.service.impl.*ServiceImpl 的日志',
    value: 'loc:com.ymm.service.impl.*ServiceImpl',
  },
  {
    label: '线程名称为：catalina-exec-21 的日志',
    value: 'thread:catalina-exec-21',
  },
  {
    label: '链路ID为：xxxxxx 的日志',
    value: 'sid:xxxxxx',
  },
  {
    label: '根链路ID为：xxxxxx 的日志',
    value: 'tid:xxxxxx',
  },
  {
    label: 'msg 匹配 "hello world" 并且链路ID为 xxxxxx 的日志',
    value: 'msg:"hello world" AND sid:"xxxxxx"',
  },
  {
    label: 'throwable为：xxxxxx的日志',
    value: 'throwable:xxxxxx',
  },
  {
    label: 'uid为：xxxxxx 的日志',
    value: 'uid:xxxxxx',
  },
  {
    label: 'oid为：xxxxxx 的日志',
    value: 'oid:xxxxxx',
  },
  {
    label: 'tel为：xxxxxx 的日志',
    value: 'tel:xxxxxx',
  },
];

const KeywordInputTest: React.FC<{}> = () => {
  const [form] = Form.useForm();

  const handleQueryChange = value => {
    console.log(value, 'handleQueryChange');
  };

  const handleQueryModalOK = value => {
    console.log(value, 'handleQueryModalOK');
  };

  return (
    <Form form={form}>
      <FormItem
        {...formItemLayout}
        name="query"
        label="关键字"
        validateStatus="success"
      >
        <KeywordInput
          showHelpTable
          showKeywordTip
          matchRules={KEYWORD_MATCH_RULES}
          onChange={handleQueryChange}
          onOk={handleQueryModalOK}
        />
      </FormItem>
    </Form>
  );
};

export default KeywordInputTest;
