import { BarChartOutlined } from '@ant-design/icons';
import { uuid } from '@antv/x6/lib/util/string/uuid';
import {
  useCreation,
  useDeepCompareEffect,
  useMount,
  useReactive,
} from 'ahooks';
import { Popover, Tooltip, message } from 'antd';
import classNames from 'classnames';
import * as echarts from 'echarts';
import { keys, values } from 'lodash';
import React, { useEffect, useMemo, useRef } from 'react';
import { ChartOptions, ChartType } from './constants';
import styles from './index.less';

type Props = {
  props: any;
};
const Charts: React.FC<Props> = ({ props }) => {
  const echartRef = useRef<echarts.ECharts>();
  const randomId = useCreation(() => {
    return 'chart-' + uuid();
  }, []);
  const state = useReactive({
    type: 'bar',
    data: [],
    isError: false,
  });

  useDeepCompareEffect(() => {
    if (props) {
      let parsedData;
      try {
        parsedData = JSON.parse(props.children[0]);
        state.isError = false;
      } catch (err) {
        state.isError = true;
        return;
      }
      if (keys(ChartType).find((chart) => chart === parsedData.type)) {
        state.type = parsedData.type;
      } else {
        state.type = 'unknown';
        message.error('数据返回格式不正确');
      }
    }
  }, [props]);

  const parsedOptions = useMemo(() => {
    let parsedData;
    try {
      parsedData = JSON.parse(props.children[0]);
      state.isError = false;
    } catch (err) {
      state.isError = true;
    }
    if (state.type === 'unknown') {
      return 'unknown';
    }
    if (!keys(ChartType).find((chart) => chart === parsedData.type)) {
      return 'unknown';
    }
    // @ts-ignore
    return ChartOptions[state.type](parsedData);
  }, [JSON.stringify(props), state.type]);

  useMount(() => {
    if (document.getElementById(randomId)) {
      let myChart = echarts.init(document.getElementById(randomId));
      echartRef.current = myChart;
    }
  });

  useEffect(() => {
    if (echartRef.current) {
      echartRef.current.clear();
      if (parsedOptions !== 'unknown') {
        echartRef.current.setOption(parsedOptions);
      }
    }
  }, [parsedOptions]);

  const renderPopoverContent = () => (
    <div className={styles['popup-container']}>
      <header>智能图表</header>
      <section>
        {values(ChartType).map((item) => (
          <Tooltip key={item.name} title={item.cname}>
            <div
              onClick={() => {
                state.type = item.name;
              }}
              className={classNames(styles['chart-' + item.name], {
                [styles['active']]: state.type === item.name,
              })}
            ></div>
          </Tooltip>
        ))}
      </section>
    </div>
  );

  return (
    <div className={styles['container']}>
      {state.isError && (
        <div className={styles['error-message']}>
          提示：你选择的数据无法生成可视化图表，请重新选择数据！
        </div>
      )}
      {!state.isError && (
        <>
          <div id={randomId} className={styles['chart']}></div>
          <div className={styles['toggleChart']}>
            <Popover placement="topRight" content={renderPopoverContent()}>
              <BarChartOutlined
                style={{ fontSize: 16, color: '#000', fontWeight: 'light' }}
              />
            </Popover>
          </div>
        </>
      )}
    </div>
  );
};

export default Charts;
