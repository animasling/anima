import moment from 'moment';

export const TimeFormat = {
  DATE: 'YYYY-MM-DD',
  DATETIME: 'YYYY-MM-DD HH:mm:ss',
  YEAR_MONTH: 'YYYY-MM',
};

export const NO_CONTENT = '-';

export type FormatValue = number | string | null;
export const isValidTime = (date: FormatValue) =>
  Boolean(date) && (typeof date === 'number' || typeof date === 'string');

export function timeFormatter(
  value: FormatValue,
  format: string = TimeFormat.DATETIME,
) {
  return !isValidTime(value)
    ? NO_CONTENT
    : moment(Number(value)).format(format);
}
