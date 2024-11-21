import { CREATE_STATUS, EXTRACT_STATUS } from './constants';

export type AtlasInfo = {
  id: string;
  content: string;
  info: string;
  extractState: EXTRACT_STATUS;
  createState: CREATE_STATUS;
};

export type GraphDataType = {
  nodes: {
    id: string;
    label: string;
    level: number;
  }[];
  edges: {
    source: string;
    target: string;
    label: string;
  }[];
};

export type TableDataType = {
  entity1: string;
  entity2: string;
  rel: string;
};
