import React, { useEffect, useLayoutEffect, useState }  from 'react';
import classNames from 'classnames';
import _ from 'lodash';
import {
  getAllLegend,
  getLegendStatusInSelected,
  getSelectedLegend,
  getLegendName,
  getLegendColor,
} from '../../utils';
import type {
  LegendInfo,
  Legend,
  LegendSelected,
  LegendDataItem,
  SelectedLegendInfo,
} from '../../interface';
import {
  DEFAULT_LEGEND_KEY,
  LegendDirections,
  LegendShapes,
  Models,
  MAC_COMMAND_KEY_CODE,
} from '../../constant';
import './index.less';

interface CustomLegendProps {
  chartRef: any;
  legend: Legend | undefined;
  isUseNative: boolean;
  legendSelected: LegendSelected;
  onChangeSelectedLegend: (selectedLegend: LegendSelected) => void;
}
function CustomLegend({
  chartRef,
  legend,
  isUseNative,
  legendSelected,
  onChangeSelectedLegend,
}: CustomLegendProps) {
  if (isUseNative || !legend?.legendData) return null;
  const [isMultipleSelect, setIsMultipleSelect] = useState(false);
  const [selectedLegendInfo, setSelectedLegendInfo] = useState<
    SelectedLegendInfo
  >({});

  // 初始化legend
  const initLegend = () => {
    if (isUseNative || !legend) return;

    const legendNameArray = getAllLegend(legend);

    let legendSelected;

    // dispatchAction 和 notMerge联用有问题，故废弃
    if ('selected' in legend) {
      legendSelected = getLegendStatusInSelected(
        legendNameArray,
        legend.selected as LegendSelected,
      );
    } else {
      // 初始化时给所有默认赋为true，使得数据和视图对应上，便于数据处理
      legendSelected = getSelectedLegend(legendNameArray);
    }

    onChangeSelectedLegend(legendSelected);
  };

  // shift, ctrl 多选
  const handleKeydown = (e: any) => {
    if (e.shiftKey || e.ctrlKey || e.keyCode === MAC_COMMAND_KEY_CODE) {
      setIsMultipleSelect(true);
    }
  };

  const handleKeyup = () => {
    setIsMultipleSelect(false);
  };

  useEffect(() => {
    initLegend();
    document.addEventListener('keydown', handleKeydown);
    document.addEventListener('keyup', handleKeyup);
    return () => {
      document.removeEventListener('keydown', handleKeydown);
      document.removeEventListener('keyup', handleKeyup);
    };
  }, []);

  useLayoutEffect(() => {
    if (!legend) return;
    const legendNameArray = getAllLegend(legend);

    let legendSelectedNew = legendSelected;
    if ('selected' in legend) {
      if (_.isEqual(legend.selected, legendSelected)) return;
      legendSelectedNew = getLegendStatusInSelected(
        legendNameArray,
        legend.selected as LegendSelected,
      );
    } else {
      // 取消选中单个，即全选
      const currentAllLegendName = Object.keys(legendSelected || {});
      if (
        legendNameArray?.length !== currentAllLegendName?.length ||
        _.difference(currentAllLegendName, legendNameArray).length
      ) {
        legendSelectedNew = getSelectedLegend(legendNameArray);
      }
    }
    onChangeSelectedLegend(legendSelectedNew);
  }, [legend]);

  // shift ctrl键多选
  const handleChangeMultipleLegend = async (
    legendDataItem: LegendDataItem,
    currentLegendInfo: LegendInfo,
  ) => {
    const { legendKey = DEFAULT_LEGEND_KEY } = legend;
    const legendName = getLegendName(legendDataItem, legendKey);
    const newLegendSelected = {
      ...legendSelected,
      [legendName]: !legendSelected[legendName],
    };

    await setSelectedLegendInfo(prevSelectedLegendInfo =>
      _.has(prevSelectedLegendInfo, legendName)
        ? _.omit(prevSelectedLegendInfo, legendName)
        : { ...prevSelectedLegendInfo, [legendName]: currentLegendInfo },
    );

    onChangeSelectedLegend(newLegendSelected);
    legend?.onLegendChange?.(
      legendDataItem,
      newLegendSelected,
      selectedLegendInfo,
    );
  };

  const handleChangeSingleLegend = (
    legendName: string,
    legendDataItem: LegendDataItem,
    currentLegendInfo: LegendInfo,
  ) => {
    const { model = Models[0] } = legend;
    const cloneLegendSelected = JSON.parse(JSON.stringify(legendSelected));

    let flag = 1;
    if (model !== Models[0]) {
      cloneLegendSelected[legendName] = !cloneLegendSelected[legendName];
    } else {
      // 单选模式
      // 该情模式下只会出现全选或者选中当前一个
      // 当前不是全部选中，即只选中了一个
      for (const lk in legendSelected) {
        if (!legendSelected[lk]) {
          flag = 0;
        }
      }
      Object.keys(legendSelected).forEach(key => {
        // 1 ^ 1 => 0, 0 ^ 0 => 0
        // 1.点击的已经选中，当前全部选中, 只需要选中当前点击的，其他不选中
        // 2.点击的未选中， 且当前已选中了一个，只需要选中当前， 其他不选中
        // 3.其他情况全部选中
        if (!(legendSelected[legendName] ^ flag)) {
          cloneLegendSelected[key] = false;
          cloneLegendSelected[legendName] = true;
        } else {
          cloneLegendSelected[key] = true;
        }
      });
    }

    onChangeSelectedLegend(cloneLegendSelected);
    legend?.onLegendChange?.(legendDataItem, cloneLegendSelected, {
      [legendName]: currentLegendInfo,
    });
  };

  const handleChangeLegend = (
    legendDataItem: LegendDataItem,
    currentLegendInfo: LegendInfo,
  ) => {
    const { legendKey = DEFAULT_LEGEND_KEY, multipleSelect = true } = legend;
    const legendName = getLegendName(legendDataItem, legendKey);
    if (multipleSelect) {
      if (isMultipleSelect) {
        handleChangeMultipleLegend(legendName, currentLegendInfo);
        return;
      }
    }
    handleChangeSingleLegend(legendName, legendDataItem, currentLegendInfo);
  };

  return (
    <ul
      className={classNames(
        'custom-legend',
        legend.direction
          ? legend.direction
          : LegendDirections[0]
      )}
      style={legend.legendStyle}
    >
      {legend?.legendData?.map(
        (legendDataItem: LegendDataItem, idx: number) => {
          const {
            legendKey = DEFAULT_LEGEND_KEY,
            width,
            height,
            fontSize,
            color,
            selectedColor,
            formatter,
            legendShape = LegendShapes[0],
          } = legend;

          const legendName = getLegendName(legendDataItem, legendKey);
          const legendColor = getLegendColor(chartRef, idx);
          return (
            <li
              key={legendName}
              title={legendName}
              style={{
                width,
                height,
                ...(legendDataItem?.itemStyle || {}),
              }}
              onClick={() =>
                handleChangeLegend(legendDataItem, { color: legendColor })
              }
            >
              <em
                className={legendShape}
                style={{ backgroundColor: legendColor }}
              />
              <a
                className={classNames({
                  'inactive': !legendSelected[legendName],
                })}
                style={{
                  fontSize,
                  color: !legendSelected[legendName] ? color : selectedColor,
                }}
              >
                {formatter ? formatter(legendDataItem) : legendName}
              </a>
            </li>
          );
        },
      )}
    </ul>
  );
}

export default CustomLegend;
