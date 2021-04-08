import { Moment } from 'moment';

export type DatePeriod = { value: number; unit: string; label?: string };
export type DateRange = Moment[];
export type DatePickerWithPeriodValue = {
  dateRange: DateRange;
  datePeriod: DatePeriod | string;
};
export type DatePeriodOptions = DatePeriod[];
export type TransformedDatePeriodOptions = { value: string; label: string }[];
export interface DatePickerWithPeriodProps {
  defaultValue?: Partial<DatePickerWithPeriodValue>;
  value?: DatePickerWithPeriodValue;
  onChange?: (value: DatePickerWithPeriodValue) => void;
  name?: string; // 在Form 中使用时的name
  isNaturalMonth?: boolean; // 是否是自然月
  disableDate?: boolean | Moment; // 不可选择时间
  style?: React.CSSProperties;
  datePeriodOptions?: DatePeriodOptions; // 配置周期下拉内容
  selectDateIsEndTime?: boolean; // 选择的时间是开始时间还是结束时间,默认为结束时间
}

export type AdjustDateInfo = { count: any; unit: string };

export interface useDatePickerWithPeriodProps
  extends Omit<
    DatePickerWithPeriodProps,
    'style' | 'isNaturalMonth' | 'selectDateIsEndTime' | 'name'
  > {
  isNaturalMonth: boolean;
  selectDateIsEndTime: boolean;
}
