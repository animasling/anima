import { useMemo, useState, useCallback, useEffect } from 'react';
import moment, { isMoment } from 'moment';
import { useAsyncEffect } from 'ahooks';
import _ from 'lodash';
import type { RangePickerProps } from 'antd/lib/date-picker';
import {
  AdjustDirection,
  DefaultDatePeriodOptions,
  NaturalMonthOption,
  ThirtyDaysOption,
  DatePeriodType,
  MONTH_OPTION_KEY,
} from './constant';
import {
  getAdjustDate,
  calculateDateRange,
  isMoreThanDisableDate,
  getDatePeriodValue,
  transformDatePeriodOptions,
  getRealDatePeriod,
} from './utils';
import type {
  DatePeriod,
  DateRange,
  DatePickerWithPeriodValue,
  useDatePickerWithPeriodProps,
} from './interface';

export function useDatePickerWithPeriod({
  value,
  onChange,
  isNaturalMonth,
  disableDate,
  defaultValue,
  datePeriodOptions,
  selectDateIsEndTime,
}: useDatePickerWithPeriodProps) {
  const isCustomDatePeriod = !_.isNil(datePeriodOptions);
  const defaultDatePeriodOptionsKey = isCustomDatePeriod ? 0 : 1;

  // 根据isNaturalMonth 设置默认datePeriodOptions
  const defaultDatePeriodOptions = useMemo(() => {
    const monthOption = isNaturalMonth ? NaturalMonthOption : ThirtyDaysOption;
    return datePeriodOptions || [...DefaultDatePeriodOptions, monthOption];
  }, [isNaturalMonth, datePeriodOptions]);

  const [datePeriod, setDatePeriod] = useState<DatePeriod>(
    defaultDatePeriodOptions[defaultDatePeriodOptionsKey],
  );
  const [dateRange, setDateRange] = useState<DateRange>([moment(), moment()]);

  const transformedDatePeriodOptions = transformDatePeriodOptions(
    defaultDatePeriodOptions,
  );
  const hasDisableDate = isMoment(disableDate) ? true : disableDate;
  const realDisableDate = isMoment(disableDate)
    ? disableDate.endOf('day')
    : moment().endOf('day');
  const datePeriodValue = getDatePeriodValue<DatePeriod, string>(datePeriod);

  const getDefaultDatePeriod = useCallback(
    (
      defaultDatePeriod: DatePickerWithPeriodValue['datePeriod'] | undefined,
    ): DatePeriod => {
      if (_.isNil(defaultDatePeriod)) {
        return defaultDatePeriodOptions[defaultDatePeriodOptionsKey];
      }

      return getRealDatePeriod(defaultDatePeriod, defaultDatePeriodOptions);
    },
    [defaultDatePeriodOptions, defaultDatePeriodOptionsKey],
  );

  const getDefaultDateRange = useCallback(
    (defaultDateRange: DateRange = [], defaultDatePeriod) => {
      const [startTime, endTime] = defaultDateRange;
      const defaultSelectDate = selectDateIsEndTime
        ? endTime ?? moment()
        : startTime ?? moment();
      const defaultDatePeriodValue: string = defaultDatePeriod
        ? getDatePeriodValue<DatePeriod, string>(defaultDatePeriod)
        : datePeriodValue;

      return calculateDateRange(
        defaultSelectDate,
        defaultDatePeriodValue,
        isNaturalMonth,
        selectDateIsEndTime,
      );
    },
    [isNaturalMonth, selectDateIsEndTime, datePeriodValue],
  );

  const handleDatePickerWithPeriodChange = (
    datePickerWithPeriodValue: DatePickerWithPeriodValue,
  ) => {
    const { datePeriod } = datePickerWithPeriodValue;
    const datePeriodValue: string = getDatePeriodValue(datePeriod);
    if (!isCustomDatePeriod) {
      datePickerWithPeriodValue.datePeriod = MONTH_OPTION_KEY.includes(
        datePeriodValue,
      )
        ? DatePeriodType.MONTH
        : (datePeriod as DatePeriod).unit;
    }
    onChange?.(datePickerWithPeriodValue);
  };

  useAsyncEffect(async () => {
    const defaultDatePeriod = await getDefaultDatePeriod(
      defaultValue?.datePeriod,
    );
    const defaultDateRange = getDefaultDateRange(
      defaultValue?.dateRange,
      defaultDatePeriod,
    );

    handleDatePickerWithPeriodChange({
      datePeriod: defaultDatePeriod,
      dateRange: defaultDateRange,
    });
  }, []);

  useEffect(() => {
    if (_.isNil(value?.datePeriod)) return;
    setDatePeriod(
      getRealDatePeriod(value?.datePeriod, defaultDatePeriodOptions),
    );
  }, [value?.datePeriod]);

  useEffect(() => {
    if (_.isNil(value?.dateRange)) return;
    setDateRange(value?.dateRange as DateRange);
  }, [value?.dateRange]);

  // 处理时间改变
  const handleDateChange = (
    dateRange: DateRange,
    selectDateIsEndTime: boolean,
    currentDatePeriodValue?: string,
  ) => {
    const realDatePeriodValue = currentDatePeriodValue ?? datePeriodValue;
    const [startTime, endTime] = dateRange;
    const selectDate = selectDateIsEndTime ? endTime : startTime;

    const calculatedDateRange = calculateDateRange(
      selectDate,
      realDatePeriodValue,
      isNaturalMonth,
      selectDateIsEndTime as boolean,
    );
    const datePeriod = getDatePeriodValue<string, DatePeriod>(
      realDatePeriodValue,
    );
    handleDatePickerWithPeriodChange({
      datePeriod,
      dateRange: calculatedDateRange,
    });
  };

  // 不能选择的日期，设置为true，默认为今天后不可选择
  const disabledDate: RangePickerProps['disabledDate'] = current => {
    if (!current || !hasDisableDate) return false;
    return current > realDisableDate;
  };

  // 调节日期
  const handleAdjustDate = useCallback(
    (prevDateRange: DateRange, datePeriodValue: string, direction: string) => {
      const { count, unit } = getAdjustDate(datePeriodValue, isNaturalMonth);
      const [startTime, endTime] = prevDateRange;

      if (direction === AdjustDirection.PREV) {
        if (selectDateIsEndTime) {
          endTime.subtract(count, unit);
        } else {
          startTime.subtract(count, unit);
        }

        handleDateChange([startTime, endTime], selectDateIsEndTime);
        return;
      }

      if (
        hasDisableDate &&
        isMoreThanDisableDate(
          selectDateIsEndTime ? endTime : startTime,
          datePeriodValue,
          realDisableDate,
          isNaturalMonth,
        )
      )
        return;
      if (selectDateIsEndTime) {
        endTime.add(count, unit);
      } else {
        startTime.add(count, unit);
      }

      handleDateChange([startTime, endTime], selectDateIsEndTime);
    },
    [realDisableDate, isNaturalMonth, selectDateIsEndTime],
  );

  // 调节箭头是否可点击样式
  const disableNext = useMemo(() => {
    if (_.isUndefined(dateRange)) return false;
    const [startTime, endTime] = dateRange || [];
    return (
      hasDisableDate &&
      isMoreThanDisableDate(
        selectDateIsEndTime ? endTime : startTime,
        datePeriodValue,
        realDisableDate,
        isNaturalMonth,
      )
    );
  }, [
    dateRange,
    datePeriodValue,
    realDisableDate,
    isNaturalMonth,
    selectDateIsEndTime,
  ]);

  // 处理周期改变
  const handleDatePeriodChange = async (datePeriod: string) => {
    const { value = '', label } =
      transformedDatePeriodOptions.find(({ value }) => value === datePeriod) ||
      {};
    const { value: count, unit } = getDatePeriodValue<String, DatePeriod>(
      value,
    );
    const currentDatePeriod = { value: count, unit, label };
    await setDatePeriod(currentDatePeriod);
    handleDateChange(dateRange, selectDateIsEndTime, value);
  };

  return {
    dateRange,
    datePeriodValue,
    transformedDatePeriodOptions,
    handleDateChange,
    disabledDate,
    handleAdjustDate,
    disableNext,
    handleDatePeriodChange,
  };
}
