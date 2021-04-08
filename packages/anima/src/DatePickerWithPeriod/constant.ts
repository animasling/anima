import type { DatePeriodOptions } from './interface';

export const DATE_FORMAT = 'YYYY-MM-DD';
export const SelectDateType = {
  START: 'startTime',
  END: 'endTime',
};
export const AdjustDirection = {
  PREV: 'prev',
  NEXT: 'next',
};
export const DatePeriodType = {
  DAY: 'day',
  WEEK: 'week',
  MONTH: 'month',
};
export const DefaultDatePeriodOptions: DatePeriodOptions = [
  { value: 1, unit: DatePeriodType.DAY, label: '天' },
  { value: 1, unit: DatePeriodType.WEEK, label: '周' },
];

export const NaturalMonthOption = {
  value: 1,
  unit: DatePeriodType.MONTH,
  label: '月',
};
export const ThirtyDaysOption = {
  value: 30,
  unit: DatePeriodType.DAY,
  label: '月',
};

export const MONTH_OPTION_KEY = ['30day', '1month'];
