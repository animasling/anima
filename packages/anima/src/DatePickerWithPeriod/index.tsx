import React from 'react';
import {
  DatePicker as TDatePicker,
  Select,
  Tooltip,
  Popover,
  Input,
  Space,
  Form,
} from 'antd';
import { CaretLeftOutlined, CaretRightOutlined } from '@ant-design/icons';
import moment, { Moment } from 'moment';
import _ from 'lodash';
import classNames from 'classnames';
import { getDatePeriodLable } from './utils';
import { DATE_FORMAT, AdjustDirection } from './constant';
import type { DatePickerWithPeriodProps } from './interface';
import { useDatePickerWithPeriod } from './hooks';

import './index.less';

const InputGroup = Input.Group;
const DatePicker: any = TDatePicker;

const DatePickerWithPeriod: React.FC<DatePickerWithPeriodProps> = props => {
  const {
    value,
    onChange,
    name = 'datePickerWithPeriod',
    isNaturalMonth = false,
    disableDate = false,
    style,
    defaultValue,
    datePeriodOptions,
    selectDateIsEndTime = true,
  } = props;
  const form = Form.useFormInstance();

  const realDefaultValue = !_.isNil(form)
    ? form?.getFieldValue(name)
    : defaultValue;

  const {
    dateRange,
    datePeriodValue,
    transformedDatePeriodOptions,
    handleDateChange,
    disabledDate,
    handleAdjustDate,
    disableNext,
    handleDatePeriodChange,
  } = useDatePickerWithPeriod({
    value,
    onChange,
    isNaturalMonth,
    disableDate,
    defaultValue: realDefaultValue,
    datePeriodOptions,
    selectDateIsEndTime,
  });

  const [startTime, endTime] = dateRange;
  
  return (
    <div style={style} className='date-picker-with-period'>
      <Space align="center">
        <Tooltip
          title={`-${getDatePeriodLable(
            datePeriodValue,
            transformedDatePeriodOptions,
          )}`}
        >
          <CaretLeftOutlined
            onClick={() =>
              handleAdjustDate(dateRange, datePeriodValue, AdjustDirection.PREV)
            }
          />
        </Tooltip>
        <Popover
          open
          placement="topLeft"
          content={`${startTime.format(DATE_FORMAT)}~${endTime.format(
            DATE_FORMAT,
          )}`}
          getPopupContainer={triggerNode =>
            triggerNode.parentNode as HTMLElement
          }
        >
          <InputGroup>
            <DatePicker
              allowClear={false}
              value={selectDateIsEndTime ? moment(endTime) : moment(startTime)}
              onChange={(date: Moment) => {
                const dateRange = selectDateIsEndTime
                  ? [startTime, date]
                  : [date, endTime];
                handleDateChange(dateRange, selectDateIsEndTime);
              }}
              disabledDate={disabledDate}
            />
            <Select
              style={{ marginLeft: '-1px' }}
              value={datePeriodValue}
              options={transformedDatePeriodOptions}
              onChange={handleDatePeriodChange}
            />
          </InputGroup>
        </Popover>
        <Tooltip
          title={`+${getDatePeriodLable(
            datePeriodValue,
            transformedDatePeriodOptions,
          )}`}
        >
          <CaretRightOutlined
            className={classNames({ 'disable': disableNext })}
            onClick={() =>
              handleAdjustDate(dateRange, datePeriodValue, AdjustDirection.NEXT)
            }
          />
        </Tooltip>
      </Space>
    </div>
  );
};

export default DatePickerWithPeriod;

export { DatePeriodType } from './constant';
export type { DatePickerWithPeriodValue } from './interface';

