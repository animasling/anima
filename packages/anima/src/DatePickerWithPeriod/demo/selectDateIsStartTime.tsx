import React, { useState, useMemo } from 'react';
import moment from 'moment';
import { DatePickerWithPeriod, DatePickerWithPeriodValue } from 'anima-zoey';

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
      defaultValue={{ dateRange: [moment('2022-07-19'), moment()] }}
      disableDate
      value={datePickerValue}
      onChange={handleDatePickerWithPeriodChange}
      style={{ marginTop: '20px' }}
      selectDateIsEndTime={false}
    />
  );
};
