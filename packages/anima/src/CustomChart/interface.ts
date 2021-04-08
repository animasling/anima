import { EChartOption, LegendComponentOption } from 'echarts';
import { EChartsReactProps } from 'echarts-for-react';
import { EChartsInstance } from 'echarts-for-react/lib/types';
import { LegendDirections, Models, LegendShapes } from './constant';

export type LegendDirection = typeof LegendDirections[number];
export type Model = typeof Models[number];
export type LegendShape = typeof LegendShapes[number];

export type LegendNames = string[];
export type LegendSelected = Record<string, boolean>;
export type LegendInfo = {
  color?: string;
};
export type LegendDataItem =
  | string[]
  | (EChartOption.Legend.LegendDataObject & { itemStyle: React.CSSProperties });
export type SelectedLegendInfo = Record<string, LegendInfo>;
export type LegendFormatter = {
  (item: LegendDataItem): React.ReactNode;
};

export type TooltipFormatter = {
  (data: EChartOption.Tooltip.Format[]): string;
};

export interface ChartReady {
  (chartInstance: EChartsInstance): void;
}

export type ToolTip = {
  maxHeight?: number; // 最大高度
  formatter?: TooltipFormatter; // 格式化
  color?: string; // 颜色
  offsetX?: number; // 距离鼠标X的距离
  offsetY?: number; // 距离鼠标Y的距离
  fontSize?: number; // 字号
};

export type Legend = {
  width?: number | string; // 单个图例宽度
  height?: number; // 单个图例高度
  color?: string; // 单个图例字体默认颜色
  selectedColor?: string; // 单个图例选中的字体颜色
  fontSize?: number; // 字体大小单位px
  direction?: LegendDirection; // 图例位于右边还是下边
  legendData?: LegendDataItem[]; // 图例数据
  model?: Model; // 选中项是消失还是显示
  legendShape?: LegendShape; // 图例形状
  legendKey?: string; // legend的字段名默认是name
  formatter?: LegendFormatter; // 自定义图例的展示
  legendStyle?: React.CSSProperties; // 整个legend包裹样式
  onLegendChange?: (
    item: LegendDataItem,
    selectedLegend: LegendSelected,
    legendInfo: LegendInfo | SelectedLegendInfo,
  ) => void;
  multipleSelect?: boolean; // 多选默认支持
  selected?: LegendComponentOption['selected'];
};

export interface ChartProps
  extends Partial<Pick<EChartsReactProps, 'onEvents'>> {
  customRef?: any;
  title?: string; // 标题
  chartStyle?: React.CSSProperties; // echarts样式
  isUseNative?: boolean; // 是否使用原生所有的echarts
  tooltip?: ToolTip;
  legend?: Legend;
  isLoading?: boolean;
  options: EChartOption; // charts自定义配置
  onChartReady?: ChartReady; //  echarts is ready
  customDom?: (() => React.ReactNode) | React.ReactNode; // 注入自定义元素
  containerStyle?: React.CSSProperties; // 外部容器样式
  noDataStyle?: React.CSSProperties; // 空数据的样式
  shouldSetOption?: (prevProps: ChartProps, props: ChartProps) => boolean; // 是否自己判断更新组件
  updateConditions?: any[]; // 配合shouldSetOption使用用于外部判断是否更新chart原生组件避免中途组件属性被污染
}

export type FormatValue = number | string | null;
