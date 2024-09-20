import { BarChartOutlined } from '@ant-design/icons';
import { uuid } from '@antv/x6/lib/util/string/uuid';
import {
  useCreation,
  useDeepCompareEffect,
  useMount,
  useReactive,
} from 'ahooks';
import { Popover, Tooltip } from 'antd';
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
  });

  useDeepCompareEffect(() => {
    if (props) {
      const data = JSON.parse(props.children[0]);
      if (keys(ChartType).find((chart) => chart === data.type)) {
        state.type = data.type;
      } else {
        state.type = 'bar';
      }
    }
  }, [props]);

  const parsedOptions = useMemo(() => {
    // @ts-ignore
    return ChartOptions[state.type](JSON.parse(props.children[0]));
  }, [JSON.stringify(props), state.type]);

  useMount(() => {
    let myChart = echarts.init(document.getElementById(randomId));
    echartRef.current = myChart;
  });

  useEffect(() => {
    if (echartRef.current) {
      echartRef.current.clear();
      echartRef.current.setOption(parsedOptions);
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
      <div id={randomId} className={styles['chart']}></div>
      <div className={styles['toggleChart']}>
        <Popover placement="topRight" content={renderPopoverContent()}>
          <BarChartOutlined
            style={{ fontSize: 16, color: '#000', fontWeight: 'light' }}
          />
        </Popover>
      </div>
    </div>
  );
};

export default Charts;
