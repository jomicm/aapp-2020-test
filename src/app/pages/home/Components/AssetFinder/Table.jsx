import React from 'react';
import { DataGrid } from '@material-ui/data-grid';

const Table = ({ columns, rows, pageSize = 5, setTableRowsInner }) => {

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        checkboxSelection
        columns={columns}
        pageSize={pageSize}
        rows={rows}
        onSelectionChange={(newSelection) => setTableRowsInner(newSelection)}
      />
    </div>
  )
}

export default Table;
