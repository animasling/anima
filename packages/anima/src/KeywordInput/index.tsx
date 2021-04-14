/**
 * title: keywordInput
 * desc: 基于input封装的关键字输入框，可以配置提示table
 */

import React, { useState } from 'react';
import _ from 'lodash';
import { Input, Modal, Table, Popover, Button } from 'antd';
import {
  EllipsisOutlined,
  CloseOutlined,
  QuestionCircleOutlined,
} from '@ant-design/icons';
import { TableProps } from 'antd/lib/table';
import 'anima-styles/lib/KeywordInput';

const { TextArea } = Input;
const columns = [
  {
    title: '输入项',
    dataIndex: 'value',
    key: 'value',
  },
  {
    title: '匹配结果',
    dataIndex: 'label',
    key: 'label',
  },
];

interface KeywordInputProps {
  value?: string;
  onChange?: (value: string) => void;
  onOk: (value: string) => void;
  matchRules?: { label: string; value: string }[];
  showHelpTable?: boolean;
  showKeywordTip?: boolean;
  placeholder?: string;
}

const HelpTable: React.FC<Pick<KeywordInputProps, 'matchRules'>> = ({
  matchRules,
}) => {
  const tableProp: TableProps<typeof matchRules[0]> = {
    columns,
    dataSource: matchRules,
    pagination: false as false,
    size: 'small',
    rowKey: 'value',
  };
  return <Table {...tableProp} />;
};

const KeywordInput: React.FC<KeywordInputProps> = ({
  value,
  onChange,
  onOk,
  matchRules,
  showHelpTable = false,
  showKeywordTip = false,
  placeholder = '关键字',
}) => {
  const [visibleModal, setVisibleModal] = useState('');
  const [modalValue, setModalValue] = useState(value);

  return (
    <span className="keyword-input-wrapper">
      <Modal
        visible={visibleModal === 'modal'}
        title="关键字"
        width={800}
        centered
        footer={null}
        onCancel={() => setVisibleModal('')}
      >
        <TextArea
          className="mb10"
          value={modalValue}
          placeholder={placeholder}
          onChange={e => setModalValue(e.target.value)}
        />
        <div className="keyword-input-modal-btn-group">
          <Button onClick={() => setVisibleModal('')}>取消</Button>
          <Button
            type="primary"
            onClick={() => {
              setVisibleModal('');
              onChange && onChange(modalValue);
              onOk(modalValue);
            }}
          >
            确定
          </Button>
        </div>
        {showHelpTable && !_.isEmpty(matchRules) && (
          <HelpTable matchRules={matchRules} />
        )}
      </Modal>
      <span className="keyword-input-inner">
        <Input
          className="keyword-input"
          placeholder={placeholder}
          value={value}
          onChange={e => onChange && onChange(e.target.value)}
          addonAfter={
            <span
              className="input-addon-after"
              title="展开编辑"
              onClick={() => {
                setVisibleModal('modal');
                setModalValue(value);
              }}
            >
              <EllipsisOutlined />
            </span>
          }
        />
        {showKeywordTip && !_.isEmpty(matchRules) && (
          <Popover
            title={
              <span className="keyword-input-popover-title">
                <span>关键字提示</span>
                <CloseOutlined onClick={() => setVisibleModal('')} />
              </span>
            }
            visible={visibleModal === 'popover'}
            content={<HelpTable matchRules={matchRules} />}
            placement="bottom"
            overlayClassName="helpDoc"
            trigger="click"
            autoAdjustOverflow={false}
          >
            <QuestionCircleOutlined
              onClick={() => setVisibleModal('popover')}
              type="question-circle"
              style={{ color: '#2db7f5', marginLeft: 5 }}
            />
          </Popover>
        )}
      </span>
    </span>
  );
};

export default KeywordInput;
