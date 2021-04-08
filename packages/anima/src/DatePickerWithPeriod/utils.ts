import moment, { Moment } from 'moment';
import _ from 'lodash';
import { DatePeriodType, MONTH_OPTION_KEY } from './constant';
import type {
  DatePeriod,
  DateRange,
  DatePeriodOptions,
  AdjustDateInfo,
  TransformedDatePeriodOptions,
  DatePickerWithPeriodValue,
} from './interface';

// 合并datePeriodOption中 value 和unit 作为datePeriod, 或是拆分成value 和unit
export function getDatePeriodValue<T, U>(datePeriod: T): U {
  if (_.isString(datePeriod)) {
    return {
      value: Number(datePeriod.replace(/\D/g, '')),
      unit: datePeriod.replace(/[0-9]/g, ''),
    } as U;
  }
  const { value, unit } = datePeriod as DatePeriod;
  return `${value}${unit}` as U;
}

// 获取真实的DatePeriod
export const getRealDatePeriod = (
  datePeriod: DatePickerWithPeriodValue['datePeriod'] | undefined,
  defaultDatePeriodOptions: DatePeriodOptions,
): DatePeriod => {
  if (
    _.isString(datePeriod) &&
    Object.values(DatePeriodType).includes(datePeriod)
  ) {
    return (
      defaultDatePeriodOptions.find(datePeriodOption => {
        if (datePeriod !== DatePeriodType.MONTH) {
          return datePeriodOption.unit === datePeriod;
        }
        return MONTH_OPTION_KEY.includes(getDatePeriodValue(datePeriodOption));
      }) || ({} as DatePeriod)
    );
  }
  return datePeriod as DatePeriod;
};

// 获取需要调节的时间值和单位
export function getAdjustDate(
  datePeriodValue: string,
  isNaturalMonth: boolean,
): AdjustDateInfo {
  const { value, unit } = getDatePeriodValue<string, DatePeriod>(
    datePeriodValue,
  );
  if (unit === DatePeriodType.MONTH && !isNaturalMonth) {
    return { count: value * 30, unit: DatePeriodType.DAY };
  }
  return { count: value, unit };
}

// 时间或是周期选择后，重新计算时间范围
export function calculateDateRange(
  selectDate: Moment,
  datePeriodValue: string,
  isNaturalMonth: boolean,
  selectDateIsEndTime: boolean,
): DateRange {
  const { count, unit } = getAdjustDate(datePeriodValue, isNaturalMonth);
  if (selectDateIsEndTime) {
    const endTime = moment(selectDate)?.endOf('day');
    const startTime = moment(selectDate)
      ?.subtract(count, unit)
      .startOf('day')
      .add(1, 'day');
    return [startTime, endTime];
  }
  const startTime = moment(selectDate).startOf('day');
  const endTime = moment(selectDate)
    .add(count, unit)
    .endOf('day')
    .subtract(1, 'day');
  return [startTime, endTime];
}

// 设置不可以选择的日期
export function isMoreThanDisableDate(
  selectDate: Moment,
  datePeriodValue: string,
  disableDate: Moment,
  isNaturalMonth: boolean,
): boolean {
  const { count, unit } = getAdjustDate(datePeriodValue, isNaturalMonth);
  return selectDate.diff(moment(disableDate).subtract(count, unit)) > 0;
}

// 获取周期名称
export function getDatePeriodLable(
  datePeriodValue: string,
  datePeriodOptions: TransformedDatePeriodOptions,
): React.ReactNode {
  const { value = '', label } =
    datePeriodOptions?.find(({ value }) => value === datePeriodValue) || {};
  return getDatePeriodValue<string, DatePeriod>(value).value === 1 ||
    value === '30day'
    ? `1${label}`
    : label;
}

// 转换datePeriodOptions， 将value和unit 合并，保证下拉值唯一
export function transformDatePeriodOptions(
  datePeriodOptions: DatePeriodOptions,
): TransformedDatePeriodOptions {
  return datePeriodOptions.map((item: DatePeriod) => ({
    value: getDatePeriodValue(item),
    label: item?.label || '',
  }));
}
