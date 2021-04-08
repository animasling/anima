import React from 'react';
import ReactEchartsCore from 'echarts-for-react/lib/core';
import * as echarts from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import {
  LineChart,
  BarChart,
  PieChart,
  MapChart,
  TreeChart,
  GraphChart,
  CustomChart,
} from 'echarts/charts';

import {
  GridComponent,
  GeoComponent,
  GraphicComponent,
  ToolboxComponent,
  TooltipComponent,
  TitleComponent,
  MarkPointComponent,
  MarkLineComponent,
  LegendComponent,
  LegendScrollComponent,
  DataZoomComponent,
  VisualMapComponent,
  DatasetComponent,
} from 'echarts/components';
import { ANTV_THEME8, ANTV_THEME16, ANTV_THEME24 } from './echartConfigs';

echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LineChart,
  BarChart,
  PieChart,
  MapChart,
  TreeChart,
  GraphChart,
  CustomChart,
  GeoComponent,
  GraphicComponent,
  ToolboxComponent,
  MarkLineComponent,
  MarkPointComponent,
  DatasetComponent,
  LegendComponent,
  LegendScrollComponent,
  DataZoomComponent,
  VisualMapComponent,
  CanvasRenderer,
]);

echarts.registerTheme('antv-theme8', ANTV_THEME8);
echarts.registerTheme('antv-theme16', ANTV_THEME16);
echarts.registerTheme('antv-theme24', ANTV_THEME24);

const ReactEcharts = (props, ref) => (
  <ReactEchartsCore echarts={echarts} {...props} ref={ref} />
);

const ForwardReactEcharts = React.forwardRef(ReactEcharts);
ForwardReactEcharts.displayName = 'ReactEcharts';
export default ForwardReactEcharts;
