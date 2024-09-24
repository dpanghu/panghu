import { DetailResponseType } from '@/pages/DataVisualization/type';
import { useMount, useReactive } from 'ahooks';
import { Empty } from 'antd';
import classNames from 'classnames';
import Handsontable from 'handsontable';
import 'handsontable/dist/handsontable.full.min.css';
import React, { useEffect, useRef } from 'react';
import { formatData } from '../../utils';
import styles from './index.less';

type Props = {
  fileData: DetailResponseType | null;
};

const ZOOM_SCALES = [50, 75, 100, 150, 200];
enum ZOOM_OPT_TYPE {
  PREV = 'prev',
  NEXT = 'next',
}

const DataTable: React.FC<Props> = ({ fileData }) => {
  const handsonTable = useRef<Handsontable | null>(null);
  const state = useReactive({
    zoomIndex: 2,
  });
  useMount(() => {
    const container = document.querySelector('#handsomTable');
    if (container) {
      const hot = new Handsontable(container, {
        data: [],
        height: '100%',
        width: '100%',
        colWidths: 140, // 默认单元格宽度
        rowHeights: 40, // 默认单元格高度
        readOnly: true,
        fixedRowsTop: 1,
        stretchH: 'all',
        manualColumnResize: true,
        manualRowResize: true,
        rowHeaders: true,
        colHeaders: true,
        licenseKey: 'non-commercial-and-evaluation', // for non-commercial use only
      });
      handsonTable.current = hot;
    }
  });

  useEffect(() => {
    if (fileData) {
      const rst = formatData(fileData);
      handsonTable.current!.loadData(rst);
    }
  }, [JSON.stringify(fileData)]);

  const getAllWidthsAndHeight = () => {
    const data = handsonTable.current!.getData();
    const heights = [];
    const widths = [];
    for (let i = 0; i < data.length; i++) {
      heights.push(handsonTable?.current!.getRowHeight(i));
    }
    for (let i = 0; i < data[0].length; i++) {
      widths.push(handsonTable?.current!.getColWidth(i));
    }
    return {
      heights,
      widths,
    };
  };

  const zoom = (type: ZOOM_OPT_TYPE) => {
    const size = getAllWidthsAndHeight();
    const originZoom = ZOOM_SCALES[state.zoomIndex];
    if (type === ZOOM_OPT_TYPE.NEXT) {
      if (state.zoomIndex < 4) {
        state.zoomIndex += 1;
      } else {
        return;
      }
    } else {
      if (state.zoomIndex > 0) {
        state.zoomIndex -= 1;
      } else {
        return;
      }
    }
    let allCells = document.querySelectorAll(
      '.htCore td, .htCore th, .htCore .rollHeader',
    );
    const ratio = ZOOM_SCALES[state.zoomIndex] / originZoom;
    handsonTable.current.updateSettings({
      colWidths: size.widths.map((width) => Math.round(width * ratio)),
      rowHeights: size.heights.map((height) => Math.round(height * ratio)),
    });
    allCells.forEach(function (cell) {
      cell.style.fontSize = (14 * ZOOM_SCALES[state.zoomIndex]) / 100 + 'px';
    });
  };

  return (
    <div className={styles['container']}>
      <div
        id="handsomTable"
        className={classNames(
          styles['table-container'],
          // 'zoom-' + state.zoomIndex,
        )}
      ></div>
      <div className={styles['zoom']}>
        <span onClick={() => zoom(ZOOM_OPT_TYPE.PREV)}>-</span>
        <span>{ZOOM_SCALES[state.zoomIndex]}%</span>
        <span onClick={() => zoom(ZOOM_OPT_TYPE.NEXT)}>+</span>
      </div>
      {!fileData?.columns && (
        <div className={styles['loading']}>
          <Empty description="暂无数据" />
        </div>
      )}
    </div>
  );
};

export default DataTable;
