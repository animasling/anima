---
nav:
  title: 组件
  path: /components
  order: 3
  group:
    title: DATA_DISPLAY
    order: 3 
---

## 自定义 chart

CustomLine, CustomPie, CustomBar 是在 CustomChart 上的再次在封装。

## DEMO

<code src="../CustomChart/demo/basic.tsx" title="基本用法" description="直接使用 CustomChart。"></code>

<code src="../CustomChart/demo/customLine/index.tsx"  title="ChartLine" description="使用 CustomLine 做折线图。"></code>

<code src="../CustomChart/demo/customPie/index.tsx" title="ChartPie" description="使用 CustomPie 做饼图或是环形图。"></code>

<code src="../CustomChart/demo/customBar/index.tsx"  title="ChartBar" description="使用 CustomBar 做柱状图。"></code>
## API

### CustomChart

customChart, customLine, customPie, customBar 共同属性。

| 参数             | 说明                                                                                       | 类型                                                     | 默认值 | 版本  |
| ---------------- | ------------------------------------------------------------------------------------------ | -------------------------------------------------------- | ------ | ----- |
| customRef        | 非必传， echart ref                                                                        |                                                          | -      | 0.01 |
| title            | 非必传， echart 标题                                                                       | `string`                                                 | -      | 0.01 |
| chartStyle       | 非必传，echart 样式                                                                        | `React.CSSProperties`                                    | -      | 0.01 |
| isUseNative      | 非必传，是否使用原生 echart                                                                | `boolean`                                                | -      | 0.01 |
| tooltip          | 非必传，自定义 tooltip                                                                     | `ToolTip`                                                | -      | 0.01 |
| legend           | 非必传，自定义 legend                                                                      | `Legend`                                                 | -      | 0.01 |
| isLoading        | 非必传，是否正在 loading                                                                   | `boolean`                                                | -      | 0.01 |
| options          | 非必传，charts 自定义配置                                                                  | `EChartOption`                                           | -      | 0.01 |
| onChartReady     | 非必传，echarts 准备好回调                                                                 | `(chartInstance: EChartsInstance) => void`               | -      | 0.01 |
| customDom        | 非必传，charts 自定义元素                                                                  | `(() => React.ReactNode) \| React.ReactNode;`            | -      | 0.01 |
| containerStyle   | 非必传，外部容器样式                                                                       | `React.CSSProperties`                                    | -      | 0.01 |
| noDataStyle      | 非必传，空数据的样式                                                                       | `React.CSSProperties`                                    | -      | 0.01 |
| shouldSetOption  | 非必传，是否自己判断更新组件                                                               | `(prevProps: ChartProps, props: ChartProps) => boolean;` | -      | 0.01 |
| updateConditions | 非必传，配合 shouldSetOption 使用用于外部判断是否更新 chart 原生组件避免中途组件属性被污染 | `any[]`                                                  | -      | 0.01 |

### CustomLine

customLine 特有属性。

| 参数            | 说明                           | 类型                          | 默认值 | 版本  |
| --------------- | ------------------------------ | ----------------------------- | ------ | ----- |
| dataSource      | 必传，数据源                   | `any[]`                       | -      | 0.01 |
| option          | 非必传，chartOption            | `EChartOption`                | -      | 0.01 |
| styles          | 非必传，整个图标样式           | `React.CSSProperties`         | -      | 0.01 |
| markLine        | 非必传，markLine               | `number`                      | -      | 0.01 |
| sideBars        | 非必传，是否配置 sideBars      | `React.ReactNode`             | -      | 0.01 |
| showLegend      | 非必传，是否显示 legend        | `boolean`                     | -      | 0.01 |
| yAxisName       | 非必传，纵坐标名称             | `string`                      | -      | 0.01 |
| extraTitle      | 非必传，额外 title             | `React.ReactNode`             | -      | 0.01 |
| saveAsImage     | 非必传，保存为图片             | `Record<string, any>;`        | -      | 0.01 |
| customTools     | 非必传，自定义工具对象         | `Record<string, CustomTool>;` | -      | 0.01 |
| needHideLegends | 非必传，需要隐藏的 legends     | `string`                      | -      | 0.01 |
| selectedLegend  | 非必传，选中的 legend          | `Legend["selected"]`          | -      | 0.01 |
| customTooltip   | 非必传，自定义 line 的 tooltip | `CustomLineTooltip`           | -      | 0.01 |

### CustomPie

customPie 特有属性。

| 参数                 | 说明                                              | 类型                                                | 默认值 | 版本  |
| -------------------- | ------------------------------------------------- | --------------------------------------------------- | ------ | ----- |
| dataSource           | 必传，数据源                                      | `any[]`                                             | -      | 0.01 |
| option               | 非必传，chartOption                               | `EChartOption & CustomPieOption`                    | -      | 0.01 |
| legendValueFormatter | 非必传，legend 值的 formatter                     | `(value: number, name: string) => React.ReactNode;` | -      | 0.01 |
| needGoBack           | 非必传，是否需要回退（多层级图表使用）            | `boolean`                                           | -      | 0.01 |
| onGoBack             | 非必传，回退回调（needGoBack 设置为 true 时生效） | `() => void`                                        | -      | 0.01 |
| isMultiple           | 非必传，是否是多层级图表                          | `boolean`                                           | false  | 0.01 |

### CustomBar

customBar 特有属性。

| 参数           | 说明                       | 类型                                  | 默认值 | 版本  |
| -------------- | -------------------------- | ------------------------------------- | ------ | ----- |
| dataSource     | 必传，数据源               | `any[]`                               | -      | 0.01 |
| option         | 非必传，chartOption        | `EChartOption & CustomBarOption`      | -      | 0.01 |
| rotateXAxis    | 非必传，X 轴文案是否倾斜   | `boolean`                             | -      | 0.01 |
| xAxisFormatter | 非必传，X 轴文案 formatter | `(value: string) => React.ReactNode;` | -      | 0.01 |

### ChartUtils

`type FormatValue = number | string | null;`

##### timeFormatter

定义：`timeFormatter(value: FormatValue, format：Record<string,string>): string`

作用： 时间 formatter。

format 来自 ChartConstants 的 TimeFormat

##### countFormatter

定义：`countFormatter(value: FormatValue): number`

作用： 数字 formatter。

##### precisionPercentFormatter

定义：`precisionPercentFormatter(value: FormatValue): number`

作用：百分比 formatter。

##### getNumberUnit

定义：`getNumberUnit(value: number): { chartUnit: string; divisorUnit: number}`

作用：获取 number 折算单位(万，亿)。

##### fillTime

定义：`fillTime(value: FormatValue): number`

作用：填充时间戳到毫秒。

### ChartConstants

##### TimeFormat

时间格式对象。

```
{
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
}
```

##### TooltipClickRoles

内置 tooltip 点击角色。

```
{
  SERIES_NAME: 'seriesName',
  SERIES_VALUE: 'seriesValue',
}
```

### CustomPieHooks

##### useMultipleLevelPie

获取多层级环形图相关数据(仅多层级环形图使用)。

```
UseMultipleLevelPieProps {
  title: string; // 环形图标题
  dataSource: any[]; // 数据源
  isMultiple: boolean; // 是否是多层级
}

UseMultipleLevelPieReturn {
  pieData: any; // 当前层级数据
  pieTitle: string; // 当前层级标题
  pieStack: number; // 当前层级数量
  handleClickPie: () => void; // 点击环形图
  handleGoBack: () => void; // 返回到上一级
}

useMultipleLevelPie({
  title,
  dataSource,
  isMutilple
}: UseMultipleLevelPieProps): UseMultipleLevelPieReturn
```

## TS

### ToolTip

| 类型名称  | 定义               | 备注              |
| --------- | ------------------ | ----------------- |
| maxHeight | `number`           | 最大高度          |
| formatter | `TooltipFormatter` | tooltip 格式化    |
| color     | `string`           | 颜色              |
| offset    | `number`           | 距离鼠标 X 的距离 |
| offsetY   | `number`           | 距离鼠标 Y 的距离 |
| fontSize  | `number`           | 字号              |

### Legend

| 类型名称       | 定义                                                                                                         | 备注                         |
| -------------- | ------------------------------------------------------------------------------------------------------------ | ---------------------------- |
| width          | `number \| string`                                                                                           | 单个图例宽度                 |
| height         | `number`                                                                                                     | 单个图例高度                 |
| color          | `string`                                                                                                     | 单个图例字体默认颜色         |
| selectedColor  | `string`                                                                                                     | 单个图例选中的字体颜色       |
| fontSize       | `number`                                                                                                     | 字体大小单位 px              |
| direction      | `LegendDirection（bottom\|top）`                                                                             | 图例位于右边还是下边         |
| legendData     | `LegendDataItem[]（string[]\|(EChartOptionLegendLegendDataObject & { itemStyle: React.CSSProperties })）`    | 图例数据                     |
| model          | `Model（single\|multiple）`                                                                                  | 单选还是多选                 |
| legendShape    | `LegendShape（rect\|circle）`                                                                                | 图形形状                     |
| legendKey      | `string`                                                                                                     | legend 的字段名，默认是 name |
| formatter      | `LegendFormatter（{(item: LegendDataItem) => React.ReactNode;}`                                              | 自定义图例的展示             |
| legendStyle    | `React.CSSProperties`                                                                                        | 整个 legend 包裹样式         |
| onLegendChange | `(item: LegendDataItem,selectedLegend: LegendSelected,legendInfo: LegendInfo \|SelectedLegendInfo) => void;` | 点击 legend 回调             |
| multipleSelect | `boolean`                                                                                                    | 是否多选, 默认支持           |
| selected       | `LegendComponentOption['selected']`                                                                          | legend 选中项                |

### CustomLineTooltip

| 类型名称               | 定义                                                                                         | 备注                                                                                                              |
| ---------------------- | -------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| toolTip                | `ToolTip`                                                                                    | 自定义 tooltip                                                                                                    |
| tooltipSort            | `(param: EChartOption.Tooltip.Format[]) => EChartOption.Tooltip.Format[];`                   | tooltip 的排序配置，默认是降序                                                                                    |
| tooltipValueFormatter  | `(value: string, series: EChartOption.Tooltip.Format) => React.ReactNode;`                   | tooltip 中值的 formatter                                                                                          |
| tooltipNameFormatter   | `Tool(name: string,series: EChartOption.Tooltip.Format）=> React.ReactNode;`                 | tooltip 中 name 的 formatter                                                                                      |
| tooltipClickCallBack   | `(params: DOMStringMap) => void;`                                                            | echart 自定义元素点击回调，元素上需定义 data-role,data-value。返回的参数键是 data-role 取值，值是 data-value 取值 |
| tooltipClickRoles      | `string[];`                                                                                  | 能点击的角色,即 data-role 值                                                                                      |
| omitTooltipSeriesNames | `string[];`                                                                                  | 排除显示在 tooltip 里的数据                                                                                       |
| getTooltipTimeRange    | `(params: EChartOption.Tooltip.Format[],dataSource:CustomLineProp['dataSource']) => string;` | 获取 tooltip 上时间范围                                                                                           |
| getTooltipValue        | `getTooltipValue?: (value: EChartOption.Tooltip.Format['value']) => any;`                    | 获取 tooltipValue                                                                                                 |

### CustomPieOption

| 类型名称   | 定义      | 备注                                |
| ---------- | --------- | ----------------------------------- |
| isRing     | `boolean` | 是否是环                            |
| type       | `boolean` | 是否是环                            |
| right      | `string`  | 图表距离右边的位置,为 legend 腾地方 |
| hasPercent | `boolean` | legend 中是否显示 percent           |

### CustomBarOption

| 类型名称   | 定义      | 备注             |
| ---------- | --------- | ---------------- |
| hasZoom    | `boolean` | 是否可以放大缩小 |
| showLegend | `boolean` | 是否显示 legend  |
