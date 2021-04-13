import React from 'react';
import { Form } from 'antd';
import { KeywordInput } from 'anima';
import { formItemLayout, KEYWORD_MATCH_RULES } from './constants';
import Dep from './Dep';

const FormItem = Form.Item;

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
        <Dep />
      </FormItem>
    </Form>
  );
};

export default KeywordInputTest;
