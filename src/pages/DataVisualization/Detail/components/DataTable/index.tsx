import React from 'react';
import DataGrid from 'react-data-grid';

import 'react-data-grid/lib/styles.css';

type Props = {};
const columns = [
  { key: 'id', name: 'ID' },
  { key: 'title', name: 'Title' },
];

const rows = [
  { id: 0, title: 'Example' },
  { id: 1, title: 'Demo' },
];

const DataTable: React.FC<Props> = ({}) => {
  return (
    <div>
      <DataGrid columns={columns} rows={rows} />
    </div>
  );
};

export default DataTable;
