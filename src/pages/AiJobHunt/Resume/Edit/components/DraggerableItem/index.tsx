import type { FormInstance, FormListFieldData } from 'antd';
import { Form, Popconfirm, Row } from 'antd';
import { uniqueId } from 'lodash';
import React from 'react';
import {
  DragDropContext,
  Draggable,
  DropResult,
  Droppable,
} from 'react-beautiful-dnd';
import styles from './index.less';

type Props = {
  formName: string;
  children: (field: FormListFieldData) => React.ReactNode;
  formCName: string;
  form: FormInstance;
};

const doNotDeleteOnlyOne = [
  'educationalBackgroundList',
  'internshipExperienceList',
  'campusExperienceList',
];

const DraggableItem: React.FC<Props> = ({
  formName,
  form,
  children: RenderFunc,
}) => {
  const reorder = (startIndex: number, endIndex: number) => {
    const result = Array.from(form.getFieldValue(formName));
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    form.setFieldsValue({
      [formName]: result,
    });
  };

  const remove = (index: number) => {
    form.setFieldsValue({
      [formName]: form.getFieldValue(formName).filter((_, i) => i !== index),
    });
  };

  const onDragEnd = (rst: DropResult) => {
    if (rst.destination) {
      reorder(rst.source.index, rst.destination.index);
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable
        direction="vertical"
        droppableId={'droppableFor' + formName.toLocaleUpperCase()}
      >
        {(provided) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className={styles['container']}
          >
            <Form.List name={formName}>
              {(fields, { add }) => {
                return (
                  <>
                    {fields.map((field, index) => (
                      <Draggable
                        key={field.key}
                        draggableId={String(field.key)}
                        index={field.key}
                      >
                        {(provide) => (
                          <Row
                            ref={provide.innerRef}
                            {...provide.draggableProps}
                            {...provide.dragHandleProps}
                            className={styles['drag-content']}
                            style={provide.draggableProps.style}
                          >
                            <div className={styles['content-section-operate']}>
                              <span
                                title="添加"
                                onClick={() =>
                                  add({ key: uniqueId() }, index + 1)
                                }
                                className={styles['operate-icon-append']}
                              ></span>
                              {(!doNotDeleteOnlyOne.includes(formName) ||
                                (doNotDeleteOnlyOne.includes(formName) &&
                                  fields.length > 1)) && (
                                <Popconfirm
                                  title="删除项目"
                                  description="是否确认呢删除该条信息?"
                                  onConfirm={() => {
                                    remove(index);
                                  }}
                                  okText="确定"
                                  cancelText="取消"
                                >
                                  <span
                                    title="移除"
                                    className={styles['operate-icon-del']}
                                  ></span>
                                </Popconfirm>
                              )}

                              <span
                                title="下移"
                                onClick={() => {
                                  if (fields.length > index + 1) {
                                    reorder(index, index + 1);
                                  }
                                }}
                                className={styles['operate-icon-down']}
                              ></span>
                              <span
                                title="上移"
                                className={styles['operate-icon-up']}
                                onClick={() => {
                                  if (index > 0) {
                                    reorder(index, index - 1);
                                  }
                                }}
                              ></span>
                            </div>
                            {RenderFunc(field)}
                          </Row>
                        )}
                      </Draggable>
                    ))}
                  </>
                );
              }}
            </Form.List>
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default DraggableItem;
