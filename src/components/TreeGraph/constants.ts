export const COLLAPSE_NAME = 'text-children-number';
export const FIRST_NODE_NAME = 'first-level-node';
export const SUB_NODE_NAME = 'sub-level-node';

export enum EdgeType {
  MIDDLE = 0,
  FIRST = 1,
  LAST = 2,
  ONLY = 3,
}

export enum NodeType {
  ROOT = 'dice-mind-map-root',
  SUB = 'dice-mind-map-sub',
  LEAF = 'dice-mind-map-leaf',
}

export enum OPERATE_TYPE_AND_CLASS {
  APPEND_SUB_NODE = 'append-sub-node',
  APPEND_PRE_NODE = 'append-pre-node',
  APPEND_SUF_NODE = 'append-suf-node',
  DELETE_NODE = 'delete-node',
  MODIFY_NODE_NAME = 'modify-node-name',
}
