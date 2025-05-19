import React from 'react';
import { OrganizationGraph } from '@ant-design/graphs';

const ChartOrganizationGraph = () => {
  const data = {
    id: 'root',
    value: {
      name: '股东会',
    },
    children: [
      {
        id: 'joel',
        value: {
          name: 'JoelAlan',
        },
        children: [
          {
            id: 'c1',
            value: {
              name: 'c1',
            },
            children: [
              {
                id: 'c1-1',
                value: {
                  name: 'c1-1',
                },
              },
              {
                id: 'c1-2',
                value: {
                  name: 'c1-2',
                },
                children: [
                  {
                    id: 'c1-2-1',
                    value: {
                      name: 'c1-2-1',
                    },
                  },
                  {
                    id: 'c1-2-2',
                    value: {
                      name: 'c1-2-2',
                    },
                  },
                ],
              },
            ],
          },
          {
            id: 'c2',
            value: {
              name: 'c2',
            },
          },
          {
            id: 'c3',
            value: {
              name: 'c3',
            },
            children: [
              {
                id: 'c3-1',
                value: {
                  name: 'c3-1',
                },
              },
              {
                id: 'c3-2',
                value: {
                  name: 'c3-2',
                },
                children: [
                  {
                    id: 'c3-2-1',
                    value: {
                      name: 'c3-2-1',
                    },
                  },
                  {
                    id: 'c3-2-2',
                    value: {
                      name: 'c3-2-2',
                    },
                  },
                  {
                    id: 'c3-2-3',
                    value: {
                      name: 'c3-2-3',
                    },
                  },
                ],
              },
              {
                id: 'c3-3',
                value: {
                  name: 'c3-3',
                },
              },
            ],
          },
        ],
      },
    ],
  };

  return <OrganizationGraph data={data} behaviors={[]} />;
};

export default ChartOrganizationGraph;
