/**
 * @author  zhangjn
 * @description 沟通
 */
import styles from './index.less';
import React, { useEffect } from 'react';
import { useMount, useReactive } from 'ahooks';
import { Button, Select, Table, Input, Tooltip, Pagination, Drawer, Radio } from 'antd';
import { EditOutlined, DeleteOutlined, DisconnectOutlined } from '@ant-design/icons';
import backs from '@/assets/imgs/bacs.png';
import box from '@/assets/imgs/box.png';
import boxs1 from '@/assets/imgs/boxs1.png';
import icon1 from '@/assets/imgs/icon1.png';
import icon2 from '@/assets/imgs/icon2.png';
import icon3 from '@/assets/imgs/icon3.png';
import icon4 from '@/assets/imgs/icon4.png';
import ReactECharts from 'echarts-for-react';
import axios from 'axios';
import * as echarts from 'echarts';
import chinaMap from '@/assets/china.json';
/* Class */
type IState = {
    open: any; // 资源库弹窗
};
type Iprops = Record<any, string>;
echarts.registerMap('china', chinaMap);
const SignIn: React.FC<any> = () => {
    const state = useReactive<any>({
        selectedRowKeys: [],
        maths: 2149853,
        data: [
            {
                key: '1',
                a1: '1201',
                a2: '管理员',
                a3: '12343232331',
                a4: '用户',
                a5: '670223233@qq.com',
                id: 1
            },
            {
                key: '1',
                a1: '1203',
                a2: '普通用户',
                a3: '12343232331',
                a4: '用户',
                a5: '670223233@qq.com',
                id: 2
            },
        ],
        open: false,
        value: {
            name: '',
            yonghu: '',
            phone: '',
            address: '',
            role: '',
            status: 1,
        },
        page: {
            limit: 10,
            pageNum: 1,
        },
        total: 2,
    });
    const column: any = [
        {
            title: '编号',
            render: (item: any, items: any, index: any) => {
                return <div>{index + 1}</div>
            }
        },
        {
            title: '角色编码',
            dataIndex: 'a1',
            key: 'a1',
        },
        {
            title: '角色名称',
            dataIndex: 'a2',
            key: 'a2',
        },
        {
            title: '操作',
            align: 'center',
            width: 150,
            render: (item: any) => {
                return <div style={{ display: 'flex', width: '100%', justifyContent: 'center' }}>
                    <Tooltip title='编辑'>
                        <EditOutlined onClick={() => {
                            state.open = true;
                        }} style={{ fontSize: 17, color: '#5a73ff', cursor: 'pointer' }} />
                    </Tooltip>
                    <Tooltip title='删除'>
                        <DeleteOutlined style={{ marginLeft: 17, fontSize: 17, color: '#5a73ff', cursor: 'pointer' }} />
                    </Tooltip>
                </div>
            }
        },
    ];

    const getOption = () => {
        return {
            series: [
                {
                    name: 'Access From',
                    type: 'pie',
                    radius: ['45%', '50%'],
                    avoidLabelOverlap: false,
                    padAngle: 2,
                    itemStyle: {
                        borderRadius: 10,
                        // 在这里设置饼图扇区的颜色
                        color: function (params: any) {
                            // params.dataIndex 是扇区的索引
                            // params.name 是扇区的名称
                            // 根据不同的条件返回不同的颜色
                            var colors = ['#00A2FF', '#B24EFA', '#B0EC52', '#EA8060'];
                            return colors[params.dataIndex];
                        }
                    },
                    labelLine: {
                        show: true
                    },
                    label: {
                        normal: {
                            formatter: '{b}  {d}% ',
                            textStyle: {
                                color: 'white', // 设置字体颜色
                                fontSize: 12 // 可选：设置字体大小
                            }
                        }
                    },
                    data: [
                        { value: 1048, name: '公园' },
                        { value: 735, name: '加油站' },
                        { value: 580, name: '单位A' },
                        { value: 484, name: '学校' },
                    ]
                }
            ]
        };
    };

    const getOption2 = () => {
        return {
            series: [
                {
                    type: 'map',
                    map: 'china', // 使用注册的地图名称
                    // 其他配置项，如数据、样式等
                    data: [
                        // 示例数据点（根据你的需求添加）
                        {
                            name: '北京市',
                            value: 21,
                        },
                        {
                            name: '天津市',
                            value: 12,
                        },
                        {
                            name: '上海市',
                            value: 99,
                        },
                        {
                            name: '重庆市',
                            value: 98,
                        },
                        {
                            name: '河北省',
                            value: 99,
                        },
                        {
                            name: '河南省',
                            value: 29,
                        },
                        {
                            name: '云南省',
                            value: 79,
                        },
                        {
                            name: '辽宁省',
                            value: 38,
                        },
                        {
                            name: '黑龙江省',
                            value: 4,
                        },
                        {
                            name: '湖南省',
                            value: 32,
                        },
                        {
                            name: '安徽省',
                            value: 84,
                        },
                        {
                            name: '山东省',
                            value: 72,
                        },
                        {
                            name: '新疆维吾尔自治区',
                            value: 99,
                        },
                        {
                            name: '江苏省',
                            value: 70,
                        },
                        {
                            name: '浙江省',
                            value: 85,
                        },
                        {
                            name: '江西省',
                            value: 11,
                        },
                        {
                            name: '湖北省',
                            value: 62,
                        },
                        {
                            name: '广西壮族自治区',
                            value: 13,
                        },
                        {
                            name: '甘肃省',
                            value: 74,
                        },
                        {
                            name: '山西省',
                            value: 78,
                        },
                        {
                            name: '内蒙古自治区',
                            value: 74,
                        },
                        {
                            name: '陕西省',
                            value: 40,
                        },
                        {
                            name: '吉林省',
                            value: 9,
                        },
                        {
                            name: '福建省',
                            value: 90,
                        },
                        {
                            name: '贵州省',
                            value: 57,
                        },
                        {
                            name: '广东省',
                            value: 6,
                        },
                        {
                            name: '青海省',
                            value: 52,
                        },
                        {
                            name: '西藏自治区',
                            value: 10,
                        },
                        {
                            name: '四川省',
                            value: 98,
                        },
                        {
                            name: '宁夏回族自治区',
                            value: 11,
                        },
                        {
                            name: '海南省',
                            value: 25,
                        },
                        {
                            name: '台湾省',
                            value: 86,
                        },
                        {
                            name: '香港特别行政区',
                            value: 8,
                        },
                        {
                            name: '澳门特别行政区',
                            value: 50,
                        },

                        // ... 其他数据点
                    ],
                    label: {
                        show: true, // 显示标签
                        color: '#FFFFFF' // 标签文字的颜色（可选）
                    },
                    itemStyle: {
                        normal: {
                            areaColor: '#130f48', // 设置所有区域的背景颜色为浅蓝色
                            borderColor: '#24C1F7' // 可选：设置区域边框的颜色
                        },
                        emphasis: { // 鼠标悬停时的样式
                            areaColor: '#aaddff' // 鼠标悬停时区域的颜色变为更深的蓝色
                        }
                    },
                },
            ],

        };
    };

    const getOption1 = () => {
        return {
            xAxis: {
                type: 'category',
                data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
                axisTick: {
                    show: false // 隐藏横坐标刻度线
                },
                axisLabel: {
                    color: '#C4CAF3' // 设置Y轴文字颜色为红色
                }
            },
            tooltip: {
                trigger: 'axis'
            },
            yAxis: {
                type: 'value',
                splitLine: {
                    show: false // 不显示x轴的网格线
                },
                axisLabel: {
                    color: '#C4CAF3' // 设置Y轴文字颜色为红色
                }
            },
            series: [
                {
                    data: [150, 230, 224, 218, 87, 92, 260, 240, 212, 432, 241, 176],
                    type: 'line',
                    areaStyle: {
                        color: 'rgba(12, 81, 149, 0.4)' // 设置填充区域的颜色和透明度
                    },
                    markPoint: {
                        data: [
                            {
                                type: 'max', name: 'Max', itemStyle: {
                                    color: '#57E6D0', // 设置标记点的背景颜色为半透明红色
                                    borderColor: '#57E6D0', // 可选：设置标记点边框颜色
                                    borderWidth: 2 // 可选：设置标记点边框宽度
                                }, label: {
                                    show: true, // 显示标签
                                    color: 'white', // 设置标签文字颜色为蓝色
                                },
                            },
                            {
                                type: 'min', name: 'Min', itemStyle: {
                                    color: '#57E6D0', // 设置标记点的背景颜色为半透明红色
                                    borderColor: '#57E6D0', // 可选：设置标记点边框颜色
                                    borderWidth: 2 // 可选：设置标记点边框宽度
                                }, label: {
                                    show: true, // 显示标签
                                    color: 'white', // 设置标签文字颜色为蓝色
                                },
                            }
                        ]
                    },
                    //   markLine: {
                    //     data: [{ type: 'average', name: 'Avg',
                    //     lineStyle: {
                    //             color: 'rgb(199,201,83)', // 将标记线颜色设置为红色
                    //             width: 2, // 可选：设置标记线宽度
                    //             type: 'solid' // 通常标记线是实线，但这里仅作为属性展示，默认情况下即为solid
                    //             // 注意：若要将标记线设置为虚线，应使用'dashed'而不是'solid'
                    //         }}]
                    //   },
                    symbol: 'none',
                    lineStyle: {
                        color: 'rgb(165,240,227)', // 设置为红色
                        width: 1, // 设置为2像素宽
                    }
                }
            ]
        };
    };

    const getOption3 = (index: any) => {
        return {
            series: [
                {
                  type: 'gauge',
                  pointer: {
                    show: false
                  },
                  itemStyle: {
                    color: index == 0 ?'rgb(0,204,255)' : index == 1 ? 'rgb(255,141,26)' : 'rgb(206,70,254)'
                  },
                  startAngle: 200,
                  endAngle: -20,
                  progress: {
                    show: true,
                    overlap: false,
                    roundCap: true,
                    clip: false,
                    itemStyle: {
                      borderWidth: 0,
                      borderColor: '#464646'
                    }
                  },
                  axisLine: {
                    lineStyle: {
                      width: 4,
                    }
                  },
                  splitLine: {
                    show: false,
                    distance: 0,
                    length: 10
                  },
                  axisTick: {
                    show: false,
                  },
                  axisLabel: {
                    show: false,
                    distance: 50
                  },
                  data: [
                    {
                value: index == 0 ? 78 : index == 1 ? 15 : 37,
                name: index == 0 ? '空气质量' : index == 1 ? '颗粒含量' : '污染达标',
              },],
                  title: {
                    fontSize: 15,
                    color: 'white',
                  },
                  detail: {
                    color: 'white',
                    formatter: '{value}%',
                    fontSize: 15,
                    offsetCenter: [0, '-15%'],
                  }
                }
              ]
        };
    };

    const getOption4 = () => {
        return {
            xAxis: {
                type: 'category',
                data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月','8月', '9月', '10月', '11月', '12月'],
                     axisTick: {
                        show: false // 去掉X轴刻度线
                    },
                    axisLabel: {
                        color: '#C4CAF3' // 设置Y轴文字颜色为红色
                    }
              },
              tooltip: {
                trigger: 'axis',
                axisPointer: {
                  type: 'shadow'
                }
              },
              yAxis: {
                type: 'value',
                splitLine: {
                    show: false // 隐藏Y轴的网格线
                },
                axisLabel: {
                    color: '#C4CAF3' // 设置Y轴文字颜色为红色
                }
              },
              series: [
                {
                  data: [120, 200, 150, 80, 70, 110, 130,230,90,32,132,43],
                  type: 'bar',
                  barWidth: 18, // 直接设置柱子宽度为20像素
                   itemStyle: {
                        // 或者分别设置四个角的圆角大小（顺时针：左上、右上、右下、左下）
                        color: new echarts.graphic.LinearGradient(
                            0, 0, 0, 1, // 渐变方向：从左上角到右下角
                            [
                                { offset: 0, color: 'rgb(124,88,232)' }, // 0%位置的颜色
                                { offset: 0.5, color: 'rgb(0,144,255)' }, // 50%位置的颜色
                                { offset: 1, color: 'rgb(124,88,232)' } // 100%位置的颜色，这里和50%相同以形成均匀渐变
                            ]
                        )
                    }
                }
              ]
        };
    };

    const getOption5 = () => {
        return {
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                  type: 'shadow'
                }
              },
              xAxis: {
                type: 'value',
                boundaryGap: [0, 0.01],
                splitLine: {
                    show: false // 隐藏Y轴的网格线
                },
                axisLabel: {
                    color: '#C4CAF3' // 设置Y轴文字颜色为红色
                }
              },
              yAxis: {
                type: 'category',
                data: ['北京', '上海', '广州', '重庆', '四川'],
                axisTick: {
                        show: false // 隐藏Y轴刻度线
                    },
                    axisLabel: {
                        color: '#C4CAF3' // 设置Y轴文字颜色为红色
                    }
              },
              series: [
                {
                  name: '2011',
                  type: 'bar',
                   data: [2431, 3219, 4522, 5481, 6254],
                  barWidth: 14, // 直接设置柱子宽度为20像素
                   itemStyle: {
                        // 设置所有角相同的圆角
                        // borderRadius: 10,
                        
                        // 或者分别设置四个角的圆角大小（顺时针：左上、右上、右下、左下）
                        borderRadius: [0, 13, 13, 0], // 左上角和右上角为圆角，右下角和左下角为直角
                        color: new echarts.graphic.LinearGradient(
                                        0, 0, 0, 1, // 渐变方向：从左上角到右下角
                                        [
                                            { offset: 0, color: 'rgb(24,219,253)' }, // 0%位置的颜色
                                            { offset: 0.5, color: 'rgb(24,219,253)' }, // 50%位置的颜色
                                            { offset: 1, color: 'rgb(24,219,253)' } // 100%位置的颜色，这里和50%相同以形成均匀渐变
                                        ]
                                    )
                    }
                },
              ]
        }
    };
    return (
        <div className={styles.board_container}>
            <img src={backs} style={{ width: '100%', height: '100%', position: 'absolute', zIndex: 0 }}></img>
            <div className={styles.title}>大气环境检测监控中心</div>
            <div className={styles.content}>
                <div className={styles.left}>
                    <div className={styles.boxs}>
                        <img src={box} style={{ width: '100%', height: "100%", position: 'absolute', zIndex: 0 }}></img>
                        <img src={boxs1} style={{ width: '100%', height: "83%", position: 'absolute', zIndex: -1, bottom: 0 }}></img>
                        <div className={styles.box_title}>实时统计</div>
                        <div className={styles.box_content}>
                            <div style={{ display: 'flex', justifyContent: 'center' }}>
                                <div style={{ display: 'flex', marginTop: 30, width: '45%', marginLeft: 50 }}>
                                    <img style={{ width: 62, height: 62 }} src={icon1}></img>
                                    <div className={styles.math}>
                                        <div>130</div>
                                        <div style={{ marginTop: 5, fontSize: 13 }}>安全运行天数</div>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', marginTop: 30, marginLeft: 10, width: '45%' }}>
                                    <img style={{ width: 62, height: 62, marginLeft: 20 }} src={icon2}></img>
                                    <div className={styles.math}>
                                        <div>20</div>
                                        <div style={{ marginTop: 5, fontSize: 13 }}>站点数</div>
                                    </div>
                                </div>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'center' }}>
                                <div style={{ display: 'flex', marginTop: 30, width: '45%', marginLeft: 50 }}>
                                    <img style={{ width: 62, height: 62 }} src={icon3}></img>
                                    <div className={styles.math}>
                                        <div>130</div>
                                        <div style={{ marginTop: 5, fontSize: 13 }}>安装总数</div>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', marginTop: 30, marginLeft: 10, width: '45%' }}>
                                    <img style={{ width: 62, height: 62, marginLeft: 20 }} src={icon4}></img>
                                    <div className={styles.math}>
                                        <div>20</div>
                                        <div style={{ marginTop: 5, fontSize: 13 }}>测点数</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={styles.boxs}>
                        <img src={box} style={{ width: '100%', height: "100%", position: 'absolute', zIndex: -1 }}></img>
                        <img src={boxs1} style={{ width: '100%', height: "83%", position: 'absolute', zIndex: -1, bottom: 0 }}></img>
                        <div className={styles.box_title}>挂片位置统计</div>
                        <div className={styles.box_content} style={{ height: 210 }}>
                            <ReactECharts option={getOption()} />
                        </div>
                    </div>
                    <div className={styles.boxs}>
                        <img src={box} style={{ width: '100%', height: "100%", position: 'absolute', zIndex: -1 }}></img>
                        <img src={boxs1} style={{ width: '100%', height: "83%", position: 'absolute', zIndex: -1, bottom: 0 }}></img>
                        <div className={styles.box_title}>挂片数量统计</div>
                        <div className={styles.box_content} style={{ height: 240 }}>
                            <ReactECharts option={getOption4()} style={{ marginTop: -30 }}/>
                        </div>
                    </div>
                </div>
                <div className={styles.mid}>
                    <div style={{ fontSize: 17, color: 'white' }}>累计放置挂片数量</div>
                    <div style={{ fontSize: 23, color: 'white', marginTop: 5 }}>{state.maths.toLocaleString()}<span style={{ fontSize: 14, marginLeft: 7 }}>个</span></div>
                    <div style={{ marginTop: -60, width: '100%' }}>
                        <ReactECharts style={{ height: 770, width: "100%", marginLeft: -10 }} option={getOption2()} />
                    </div>
                </div>
                <div className={styles.left}>
                    <div className={styles.boxs}>
                        <img src={box} style={{ width: '100%', height: "100%", position: 'absolute', zIndex: -1 }}></img>
                        <img src={boxs1} style={{ width: '100%', height: "83%", position: 'absolute', zIndex: -1, bottom: 0 }}></img>
                        <div className={styles.box_title}>挂片位置统计</div>
                        <div className={styles.box_content} style={{ height: 210,display:'flex',flexDirection:'row' }}>
                            <ReactECharts style={{ width:"38%",height: 240 }} option={getOption3(0)} />
                            <ReactECharts style={{ width:"36%",height: 240 }} option={getOption3(1)} />
                            <ReactECharts style={{ width:"36%",height: 240 }} option={getOption3(2)} />
                        </div>                      
                    </div>
                    <div className={styles.boxs}>
                        <img src={box} style={{ width: '100%', height: "100%", position: 'absolute', zIndex: -1 }}></img>
                        <img src={boxs1} style={{ width: '100%', height: "83%", position: 'absolute', zIndex: -1, bottom: 0 }}></img>
                        <div className={styles.box_title}>趋势统计</div>
                        <div className={styles.box_content} style={{ height: 238 }}>
                            <ReactECharts option={getOption1()} />
                        </div>
                    </div>
                    <div className={styles.boxs}>
                        <img src={box} style={{ width: '100%', height: "100%", position: 'absolute', zIndex: -1 }}></img>
                        <img src={boxs1} style={{ width: '100%', height: "83%", position: 'absolute', zIndex: -1, bottom: 0 }}></img>
                        <div className={styles.box_title}>挂片数量排行Top5</div>
                        <div className={styles.box_content} style={{ height: 240 }}>
                            <ReactECharts option={getOption5()} style={{ marginTop: -30 }}/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SignIn;
