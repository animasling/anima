import { tuple } from './utils';

export const NO_CONTENT = '-';

export const LegendDirections = tuple('bottom', 'right');
export const Models = tuple('single', 'multiple');
export const LegendShapes = tuple('rect', 'circle');

export const DEFAULT_LEGEND_KEY = 'name';
export const MAC_COMMAND_KEY_CODE = 91; // mac command keyCode
export const TOOLTIP_CLASS_NAME = 'custom-tooltip';

export const AntvThemes = {
  THEME8: 'antv-theme8',
  THEME16: 'antv-theme16',
  THEME24: 'antv-theme24',
};

export const TimeFormat = {
  DATE: 'YYYY-MM-DD',
  DATE_SIMPLE: 'YYYYMMDD',
  DATETIME: 'YYYY-MM-DD HH:mm:ss',
  TIME_WITHOUT_S: 'HH:mm',
  DATE_WIHTOUT_S: 'DD HH:mm',
  DATETIME_WITHOUT_S: 'YYYY-MM-DD HH:mm',
  DATETIME_WITH_SSS: 'YYYY-MM-DD HH:mm:ss.SSS',
  MONTH_DAY: 'MM-DD',
  MONTH_DAY_SIMPLE: 'MMDD',
  TIME_MONTH_DAY: 'HH:mm MM-DD',
  MONTH_DAY_TIME_WITHOUT_S: 'MM-DD HH:mm',
  MONTH_DAY_TIME: 'MM-DD HH:mm:ss',
  DAY_TIME_TEXT: 'DD日HH时',
};

export const TooltipClickRoles = {
  SERIES_NAME: 'seriesName',
  SERIES_VALUE: 'seriesValue',
};
