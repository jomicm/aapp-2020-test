import React from 'react';

const SimpleTable = ({ headRows, rows = [] }) => {
  return (
    <table style={{ width: '100%' }}>
      <tr style={{ color: 'white', backgroundColor: '#154360' }}>
        {headRows.map(({ id, label }) => <th key={id}>{label}</th>)}
      </tr>
      {rows.map((row, ix) => (
        <tr style={{ backgroundColor: ix % 2 === 0 ? 'white' : '#CCD1D1' }}>
          {Object.entries(row).map(([key, val], iy) => (
            <td key={`${key}_${ix}_${iy}`}>{val}</td>
          ))}
        </tr>
      ))}
    </table>
  );
};

export default SimpleTable;
