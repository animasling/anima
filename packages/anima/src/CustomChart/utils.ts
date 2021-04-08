import _ from 'lodash';
import moment from 'moment';
import numeral from 'numeral';
import {
  DEFAULT_LEGEND_KEY,
  AntvThemes,
  NO_CONTENT,
  TimeFormat,
} from './constant';
import type {
  Legend,
  LegendDataItem,
  LegendNames,
  LegendSelected,
  FormatValue,
} from './interface';

const NUM_FORMAT = '0,0';
const PERCENT_FORMAT = '0.0000%';

const isValidTime = (date: FormatValue) =>
  Boolean(date) && (typeof date === 'number' || typeof date === 'string');

export function timeFormatter(
  value: FormatValue,
  format: string = TimeFormat.DATETIME,
) {
  return !isValidTime(value)
    ? NO_CONTENT
    : moment(Number(value)).format(format);
}

export function countFormatter(value: FormatValue) {
  return _.isNil(value) ? NO_CONTENT : numeral(value).format(NUM_FORMAT);
}

export function precisionPercentFormatter(value: FormatValue) {
  return _.isNil(value) ? NO_CONTENT : numeral(value).format(PERCENT_FORMAT);
}

export function tuple<T extends string[]>(...arg: T) {
  return arg;
}

export function getNumberUnit(value: number) {
  let unit = '';

  let divisorUnit = 1;
  const TENTHOUSAND = 10000;
  const HUNDREDMILLION = 100000000;
  if (value / HUNDREDMILLION >= 1) {
    unit = '亿';
    divisorUnit = HUNDREDMILLION;
  } else if (value / TENTHOUSAND > 1) {
    unit = '万';
    divisorUnit = TENTHOUSAND;
  }

  return { chartUnit: unit, divisorUnit };
}

export function fillTime(value: FormatValue) {
  let time = String(value);

  time = `${time}${Array.from({ length: 13 - time.length }, () => 0).join('')}`;
  return Number(time);
}

export function getLegendName(
  item: LegendDataItem,
  legendKey: Legend['legendKey'],
) {
  return _.isPlainObject(item) ? item[legendKey] : item;
}

export function getAllLegend({
  legendData,
  legendKey = DEFAULT_LEGEND_KEY,
}: Pick<Legend, 'legendData' | 'legendKey'>): LegendNames {
  return (legendData || [])?.map((item: any) =>
    String(getLegendName(item, legendKey)),
  );
}

export function getLegendStatusInSelected(
  allLegend: LegendNames,
  selectedLegend: LegendSelected,
): LegendSelected {
  return {
    ...allLegend?.reduce(
      (legends, legendName) => ({
        ...legends,
        [legendName]: false,
      }),
      {},
    ),
    ...(selectedLegend || {}),
  };
}

export function getSelectedLegend(legends: LegendNames): LegendSelected {
  return legends?.reduce(
    (selectedLegends, legendName) => ({
      ...selectedLegends,
      [legendName]: true,
    }),
    {},
  );
}

const MAX_DAY = 6;
export function xAxisLabelTimeFormatter(dates: number[] = []) {
  const startTime = Number(dates[0]);
  const endTime = Number(dates[dates.length - 1]);

  const diffDays = moment(endTime).diff(startTime, 'days');

  return (dateTime: number) => {
    if (!diffDays) {
      // 同一天
      return timeFormatter(dateTime);
    }
    // 大于 1 小于 7 天
    if (diffDays < MAX_DAY) {
      return timeFormatter(dateTime, TimeFormat.DAY_TIME_TEXT);
    }

    // 大于 7 天
    return timeFormatter(dateTime, TimeFormat.MONTH_DAY);
  };
}

export function getChartTheme(chartData: any[]) {
  let theme = AntvThemes.THEME8;
  if (chartData?.length > 8) theme = AntvThemes.THEME16;
  if (chartData?.length > 16) theme = AntvThemes.THEME24;
  return theme;
}

export function getLegendColor(chartRef: any, index: number) {
  const colors =
    chartRef?.current?.getEchartsInstance()?._model.option.color || [];
  return colors.length ? colors[index % colors.length] : '#fff';
}
