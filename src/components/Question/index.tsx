import React, { ReactNode, useMemo } from 'react';
import { Form, Radio } from 'antd';
import { Input, Select, ComboBox, Button } from 'SeenPc';
import styles from './index.less';
import { AntdFormUtils } from 'ahooks/lib/useAntdTable/types';
import { useMount } from 'ahooks';

type Question = {
    title: string;
    type: string;
    options?: any;
    isRequired: boolean;
    id: string;
    needValue?: any;
    display?: any;
}

type IProps = {
    dataSource: Question[];
    title?: string;
    description?: string;
    footerDescription?: string;
    footer?: ReactNode;
    submit: (values: any) => void;
    insertPosition?: number;
    insertContent?: ReactNode;
    ref?: any;
}

const QuestionNaire: React.FC<IProps> = ({ dataSource, title, description, footerDescription, footer, submit, insertPosition, insertContent }) => {
    const [form] = Form.useForm();
    const [value, setValue] = React.useState('');
    const [selectValues, setSelectValues] = React.useState<any>({});
    const [inputValues, setInputValues] = React.useState<any>({});

    const onFinish = (values: any) => {
        let arr: any = [];
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions, array-callback-return
        Object.keys(values) && Object.keys(values).map((item: any) => {
            let dataSources: any = dataSource.find((element: any) => element.id == item);
            if (dataSources !== void 0) {
                if (dataSources.displays !== 0) {
                    arr.push({
                        ...dataSources,
                        value: values[item],
                    })
                }
            }
        })
        // const formValues = Object.keys(values).reduce((acc: any, key) => {
        //     const questionId = parseInt(key.replace('question_', ''));
        //     acc[key] = selectValues[questionId] === '0' && inputValues[questionId] !== undefined
        //         ? inputValues[questionId]
        //         : values[key];
        //     return acc;
        // }, {});
        submit(arr);
        // form.resetFields();
        // setSelectValues({});
    };

    useMount(() => {

    })

    const handleRadioChange = (itemId: any, value: any) => {
        setSelectValues((prevValues: any) => ({
            ...prevValues,
            [itemId]: value,
        }));
    };

    const checkUsername = async (rule: any, value: any) => {
        // 这里可以是异步请求来验证用户名是否存在
        if (value.trim() == '') {
            console.log(value);
            throw new Error('不能为空');
        }
        if (value == void 0) {
            console.log(value);
            throw new Error('不能为空');
        }
        // 如果验证通过，返回Promise.resolve()
        return Promise.resolve();
    };

    const renderIndex = (item: any, index: any) => {
        if(item?.display == 0 && item?.displays == 1) {
            let math: any = 0;
            // eslint-disable-next-line @typescript-eslint/no-unused-expressions, array-callback-return
            dataSource && dataSource.map((element: any,index1: any)=> {
                if(index1 < index) {
                    if(element.display == 0 && element.displays == 0) {
                        math = math + 1;
                    }
                }
            })
            return index + 1 - math;
        }else {
            return index + 1;
        }
    }

    const handleInputChange = (itemId: any, e: any) => {
        const inputValue = e.slice(0, 10);
        setInputValues((prevValues: any) => ({
            ...prevValues,
            [itemId]: inputValue,
        }));
    };
    const getVisibleQuestions = useMemo(() => {
        const visibleQuestions = [...dataSource];
        const QuestionId = 2;
        const Value = selectValues[QuestionId];
        let filteredQuestions = [];
        switch (Value) {
            case '1':
                filteredQuestions = visibleQuestions.slice(2, 4);
                break;
            case '2':
                filteredQuestions = visibleQuestions.slice(4, 6);
                break;
            default:
                filteredQuestions = visibleQuestions.slice(2, 6)
                break;
        }
        const orderedQuestions = [visibleQuestions[0], visibleQuestions[1],
        ...filteredQuestions, ...visibleQuestions.slice(6)];

        return orderedQuestions.map((item, index) => ({
            ...item,
            title: `${renderIndex(item, index)}. ${item?.title}`,
        }));
    }, [dataSource, selectValues]);

    return (
        <div className={styles.questionnaire_container}>
            {/* <div className={styles.header}>
                {title && <div className={styles.title}>{title}</div>}
                {description && <div className={styles.description}>{description}</div>}
            </div> */}
            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                className={styles.form}
            >
                {getVisibleQuestions.map((item, index) => {
                    let formItemContent = null;
                    const isInsertIndex = index + 1 === insertPosition;
                    switch (item.type) {
                        case 'input':
                            formItemContent = <Input maxLength={30} value={value} onChange={(e: any) => setValue(e)} />;
                            break;
                        case 'select':
                            formItemContent = <Select option={item.options || []} value={value} onChange={(e: any) => setValue(e)} />;
                            break;
                        case 'radio':
                            if (item.type === 'radio' && item.options?.find((element: any) => element.needInput == 1)) {
                                formItemContent = <Radio.Group key={item.id} onChange={(e) => {
                                    let chooseRadio: any = item.options.find((element: any) => element.value == e.target.value);
                                    if (chooseRadio.relQuestionIds !== void 0) {
                                        // eslint-disable-next-line @typescript-eslint/no-unused-expressions, array-callback-return
                                        dataSource && dataSource.map((source: any) => {
                                            if (source.display == 0) {
                                                source.displays = 0;
                                            }
                                        })
                                        let connect: any = chooseRadio.relQuestionIds.split(',');
                                        // eslint-disable-next-line @typescript-eslint/no-unused-expressions, array-callback-return
                                        connect && connect.map((element: any) => {
                                            let source: any = dataSource.find((elements: any) => elements.id == element);
                                            source.displays = 1;
                                        })
                                        handleRadioChange(item.id, e.target.value);
                                    } else if (chooseRadio.needInput) {
                                        // eslint-disable-next-line @typescript-eslint/no-unused-expressions, array-callback-return
                                        dataSource && dataSource.map((source: any) => {
                                            if (source.display == 0) {
                                                source.displays = 0;
                                            }
                                        })
                                        handleRadioChange(item.id, e.target.value);
                                    }
                                }} value={selectValues[item.id]}>
                                    {item.options.map((option, optionIndex) => (
                                        <Radio key={optionIndex} value={option.value}>
                                            {String.fromCharCode(65 + optionIndex % 26) + '. ' + option.label}
                                            {
                                                option.needInput == 1 && <Input
                                                    style={{ width: 100, marginLeft: 10 }}
                                                    value={option.needValue}
                                                    onChange={(e) => {
                                                        option.needValue = e;
                                                    }}
                                                    maxLength={10}
                                                />
                                            }
                                            {/* {option.value === '0' && selectValues[item.id] === '0' && (
                                                <Input
                                                    style={{ width: 100, marginLeft: 10 }}
                                                    value={inputValues[item.id] || ''}
                                                    onChange={(e) => handleInputChange(item.id, e)}
                                                    maxLength={10}
                                                />
                                            )} */}
                                        </Radio>
                                    ))}
                                </Radio.Group>

                            } else {
                                formItemContent = <ComboBox onChange={(e: any) => {
                                    let chooseRadio: any = item.options.find((element: any) => element.value == e.target.value);
                                    console.log(chooseRadio);
                                }} options={item.options || []} type={item.type} />;
                            }
                            break;
                        case 'checkbox':
                            formItemContent = <ComboBox options={item.options || []} type={'checkbox'} />;
                            break;
                        case 'custom':
                            formItemContent = insertContent;
                            break;
                        default:
                            formItemContent = null;
                            break;
                    }

                    return (
                        // eslint-disable-next-line react/jsx-key
                        <div className={styles.form_item} style={{ display: item.displays == '1' ? 'flex' : 'none' }}>
                            <Form.Item
                                key={item.id}
                                label={item.title}
                                name={`${item.id}`}
                                rules={item.type == 'checkbox' ? [] : item.isRequired ? [
                                    // { required: item.isRequired, message: `${item.title}为必填` },
                                    {
                                        message: '不能为空',
                                        validator: checkUsername
                                    }
                                ] : []}

                            >
                                {formItemContent}
                            </Form.Item>
                            {isInsertIndex && (
                                <div className={styles.insertContent}>
                                    {insertContent}
                                </div>
                            )}
                        </div>
                    );
                })}

                <div className={styles.footer_desc}>{footerDescription}</div>
                {footer ? (
                    <Form.Item className={styles.footer}>
                        {footer}
                    </Form.Item>
                ) : (
                    <Form.Item className={styles.footer}>
                        <Button type="primary" htmlType="submit">生成画像</Button>
                    </Form.Item>
                )}
            </Form>
        </div>
    );
}

export default QuestionNaire;

