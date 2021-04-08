// antv-theme-for-echarts
// 参考：https://github.com/antvis/G2/blob/3.5.13/src/theme/default.js
export const COLORS_8 = [
  '#1890FF',
  '#2FC25B',
  '#FACC14',
  '#223273',
  '#8543E0',
  '#13C2C2',
  '#3436C7',
  '#F04864',
];
export const COLORS_16 = [
  '#1890FF',
  '#41D9C7',
  '#2FC25B',
  '#FACC14',
  '#E6965C',
  '#223273',
  '#7564CC',
  '#8543E0',
  '#5C8EE6',
  '#13C2C2',
  '#5CA3E6',
  '#3436C7',
  '#B381E6',
  '#F04864',
  '#D598D9',
];
export const COLORS_24 = [
  '#1890FF',
  '#66B5FF',
  '#41D9C7',
  '#2FC25B',
  '#6EDB8F',
  '#9AE65C',
  '#FACC14',
  '#E6965C',
  '#57AD71',
  '#223273',
  '#738AE6',
  '#7564CC',
  '#8543E0',
  '#A877ED',
  '#5C8EE6',
  '#13C2C2',
  '#70E0E0',
  '#5CA3E6',
  '#3436C7',
  '#8082FF',
  '#DD81E6',
  '#F04864',
  '#FA7D92',
  '#D598D9',
];
const ANTV_THEME_COMMON = {
  color: COLORS_8,
  backgroundColor: 'rgba(255,255,255,0)',
  textStyle: {},
  title: {
    textStyle: { color: '#666666' },
    subtextStyle: { color: '#999999' },
  },
  line: {
    itemStyle: { normal: { borderWidth: '2' } },
    lineStyle: { normal: { width: '2' } },
    symbolSize: '6',
    symbol: 'emptyCircle',
    smooth: false,
  },
  radar: {
    itemStyle: { normal: { borderWidth: '2' } },
    lineStyle: { normal: { width: '2' } },
    symbolSize: '6',
    symbol: 'emptyCircle',
    smooth: false,
  },
  bar: {
    itemStyle: {
      normal: { barBorderWidth: 0, barBorderColor: '#ccc' },
      emphasis: { barBorderWidth: 0, barBorderColor: '#ccc' },
    },
  },
  pie: {
    itemStyle: {
      normal: { borderWidth: 0, borderColor: '#ccc' },
      emphasis: { borderWidth: 0, borderColor: '#ccc' },
    },
  },
  scatter: {
    itemStyle: {
      normal: { borderWidth: 0, borderColor: '#ccc' },
      emphasis: { borderWidth: 0, borderColor: '#ccc' },
    },
  },
  boxplot: {
    itemStyle: {
      normal: { borderWidth: 0, borderColor: '#ccc' },
      emphasis: { borderWidth: 0, borderColor: '#ccc' },
    },
  },
  parallel: {
    itemStyle: {
      normal: { borderWidth: 0, borderColor: '#ccc' },
      emphasis: { borderWidth: 0, borderColor: '#ccc' },
    },
  },
  sankey: {
    itemStyle: {
      normal: { borderWidth: 0, borderColor: '#ccc' },
      emphasis: { borderWidth: 0, borderColor: '#ccc' },
    },
  },
  funnel: {
    itemStyle: {
      normal: { borderWidth: 0, borderColor: '#ccc' },
      emphasis: { borderWidth: 0, borderColor: '#ccc' },
    },
  },
  gauge: {
    itemStyle: {
      normal: { borderWidth: 0, borderColor: '#ccc' },
      emphasis: { borderWidth: 0, borderColor: '#ccc' },
    },
  },
  candlestick: {
    itemStyle: {
      normal: {
        color: '#f04864',
        color0: 'transparent',
        borderColor: '#f04864',
        borderColor0: '#2fc25b',
        borderWidth: '2',
      },
    },
  },
  graph: {
    itemStyle: { normal: { borderWidth: 0, borderColor: '#ccc' } },
    lineStyle: { normal: { width: '1', color: '#cccccc' } },
    symbolSize: '6',
    symbol: 'emptyCircle',
    smooth: false,
    color: COLORS_8,
    label: { normal: { textStyle: { color: '#ffffff' } } },
  },
  map: {
    itemStyle: {
      normal: {
        areaColor: '#eeeeee',
        borderColor: '#ffffff',
        borderWidth: 0.5,
      },
      emphasis: {
        areaColor: '#cdddfd',
        borderColor: '#5b8ff9',
        borderWidth: 1,
      },
    },
    label: {
      normal: { textStyle: { color: '#ffffff' } },
      emphasis: { textStyle: { color: '#5b8ff9' } },
    },
  },
  geo: {
    itemStyle: {
      normal: {
        areaColor: '#eeeeee',
        borderColor: '#ffffff',
        borderWidth: 0.5,
      },
      emphasis: {
        areaColor: '#cdddfd',
        borderColor: '#5b8ff9',
        borderWidth: 1,
      },
    },
    label: {
      normal: { textStyle: { color: '#ffffff' } },
      emphasis: { textStyle: { color: '#5b8ff9' } },
    },
  },
  categoryAxis: {
    axisLine: { show: true, lineStyle: { color: '#bfbfbf' } },
    axisTick: { show: true, lineStyle: { color: '#bfbfbf' } },
    axisLabel: { show: true, textStyle: { color: '#595959' } },
    splitLine: { show: false, lineStyle: { color: ['#d9d9d9'] } },
    splitArea: {
      show: false,
      areaStyle: {
        color: ['rgba(250,250,250,0.05)', 'rgba(200,200,200,0.02)'],
      },
    },
  },
  valueAxis: {
    axisLine: { show: true, lineStyle: { color: '#bfbfbf' } },
    axisTick: { show: true, lineStyle: { color: '#bfbfbf' } },
    axisLabel: { show: true, textStyle: { color: '#595959' } },
    splitLine: {
      show: true,
      lineStyle: { type: 'dashed', color: ['#d9d9d9'] },
    },
    splitArea: {
      show: false,
      areaStyle: {
        color: ['rgba(250,250,250,0.05)', 'rgba(200,200,200,0.02)'],
      },
    },
  },
  logAxis: {
    axisLine: { show: true, lineStyle: { color: '#bfbfbf' } },
    axisTick: { show: true, lineStyle: { color: '#bfbfbf' } },
    axisLabel: { show: true, textStyle: { color: '#595959' } },
    splitLine: { show: false, lineStyle: { color: ['#d9d9d9'] } },
    splitArea: {
      show: false,
      areaStyle: {
        color: ['rgba(250,250,250,0.05)', 'rgba(200,200,200,0.02)'],
      },
    },
  },
  timeAxis: {
    axisLine: { show: true, lineStyle: { color: '#bfbfbf' } },
    axisTick: { show: true, lineStyle: { color: '#bfbfbf' } },
    axisLabel: { show: true, textStyle: { color: '#595959' } },
    splitLine: { show: false, lineStyle: { color: ['#d9d9d9'] } },
    splitArea: {
      show: false,
      areaStyle: {
        color: ['rgba(250,250,250,0.05)', 'rgba(200,200,200,0.02)'],
      },
    },
  },
  toolbox: {
    iconStyle: {
      normal: { borderColor: '#999999' },
      emphasis: { borderColor: '#666666' },
    },
  },
  legend: { textStyle: { color: '#8c8c8c' } },
  tooltip: {
    axisPointer: {
      lineStyle: { color: '#cccccc', width: 1 },
      crossStyle: { color: '#cccccc', width: 1 },
    },
  },
  timeline: {
    lineStyle: { color: '#626c91', width: 1 },
    itemStyle: {
      normal: { color: '#626c91', borderWidth: 1 },
      emphasis: { color: '#626c91' },
    },
    controlStyle: {
      normal: { color: '#626c91', borderColor: '#626c91', borderWidth: 0.5 },
      emphasis: { color: '#626c91', borderColor: '#626c91', borderWidth: 0.5 },
    },
    checkpointStyle: { color: '#5b8ff9', borderColor: 'rgba(63,177,227,0.15)' },
    label: {
      normal: { textStyle: { color: '#626c91' } },
      emphasis: { textStyle: { color: '#626c91' } },
    },
  },
  visualMap: {
    color: [
      '#063d8a',
      '#0b53b0',
      '#1770d6',
      '#2593fc',
      '#47abfc',
      '#6dc1fc',
      '#94d6fd',
      '#bbe7fe',
    ],
  },
  dataZoom: {
    backgroundColor: 'rgba(255,255,255,0)',
    dataBackgroundColor: 'rgba(47,69,84,0.3)',
    fillerColor: 'rgba(167,183,204,0.4)',
    handleColor: '#a7b7cc',
    handleSize: '100%',
    textStyle: { color: '#999999' },
  },
  markPoint: {
    label: {
      normal: { textStyle: { color: '#ffffff' } },
      emphasis: { textStyle: { color: '#ffffff' } },
    },
  },
};

export const ANTV_THEME8 = {
  ...ANTV_THEME_COMMON,
  graph: {
    ...ANTV_THEME_COMMON.graph,
    color: COLORS_8,
  },
  color: COLORS_8,
};

export const ANTV_THEME16 = {
  ...ANTV_THEME_COMMON,
  graph: {
    ...ANTV_THEME_COMMON.graph,
    color: COLORS_16,
  },
  color: COLORS_16,
};

export const ANTV_THEME24 = {
  ...ANTV_THEME_COMMON,
  graph: {
    ...ANTV_THEME_COMMON.graph,
    color: COLORS_24,
  },
  color: COLORS_24,
};

export const BASE_OPTION = {
  tooltip: {
    trigger: 'axis',
    padding: 10,
    backgroundColor: 'rgba(255,255,255,0.9)',
    textStyle: {
      color: '#595959',
      fontSize: 12,
      width: 140,
      height: 90,
    },
    extraCssText: 'box-shadow: 0 0 5px 0 rgba(0,0,0,0.5)',
  },
  yAxis: {
    scale: true,
    axisLine: { show: false },
  },
};

export const BASE_PIE_OPTION = {
  tooltip: {
    trigger: 'item',
    padding: 10,
    backgroundColor: 'rgba(255,255,255,0.9)',
    textStyle: {
      color: '#595959',
      fontSize: 12,
      width: 140,
      height: 90,
    },
    extraCssText: 'box-shadow: 0 0 5px 0 rgba(0,0,0,0.5)',
  },
};

export const BASE_MAP_OPTION = {
  tooltip: {
    ...BASE_OPTION.tooltip,
    trigger: 'item',
  },
};

export const BASE_BAR_OPTION = {
  tooltip: {
    ...BASE_OPTION.tooltip,
  },
};
