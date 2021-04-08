import React, { useState, useMemo } from 'react';
import moment from 'moment';
import {
  DatePickerWithPeriod,
  DatePickerWithPeriodValue,
  DatePeriodType,
} from 'anima-zoey';

type DatePickerWithPeriodInfo = {
  datePeriod: DatePickerWithPeriodValue['datePeriod'];
  startTime: number;
  endTime: number;
};

export default () => {
  const [datePickerWithPeriodInfo, setDatePickerWithPeriodInfo] = useState<
    DatePickerWithPeriodInfo
  >({} as DatePickerWithPeriodInfo);

  const transformDatePickerValue = (
    datePickerValue: DatePickerWithPeriodValue,
  ) => {
    return {
      datePeriod: datePickerValue.datePeriod,
      startTime: datePickerValue.dateRange[0].valueOf(),
      endTime: datePickerValue.dateRange[1].valueOf(),
    };
  };

  const handleDatePickerWithPeriodChange = (
    values: DatePickerWithPeriodValue,
  ) => {
    const datePickerValue = transformDatePickerValue(values);
    setDatePickerWithPeriodInfo(datePickerValue);
  };

  const datePickerValue = useMemo(() => {
    return {
      datePeriod: datePickerWithPeriodInfo?.datePeriod,
      dateRange: [
        moment(datePickerWithPeriodInfo?.startTime),
        moment(datePickerWithPeriodInfo?.endTime),
      ],
    };
  }, [datePickerWithPeriodInfo]);

  return (
    <DatePickerWithPeriod
      defaultValue={{ datePeriod: { value: 3, unit: DatePeriodType.DAY } }}
      value={datePickerValue}
      datePeriodOptions={[
        { value: 3, unit: DatePeriodType.DAY, label: '3天' },
        { value: 2, unit: DatePeriodType.WEEK, label: '半月' },
        { value: 2, unit: DatePeriodType.MONTH, label: '2月' },
      ]}
      onChange={handleDatePickerWithPeriodChange}
      style={{ marginTop: '20px' }}
    />
  );
};
