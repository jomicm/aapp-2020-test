import React, { useState, useEffect } from 'react';
import TableComponent from '../../Components/TableComponent';
import ModalAssetFinder from '../modals/ModalAssetFinder';

const assetsHeadRows = [
  { id: "name", numeric: false, disablePadding: false, label: "Name" },
  { id: "brand", numeric: true, disablePadding: false, label: "Brand" },
  { id: "model", numeric: true, disablePadding: false, label: "Model" },
  { id: "epc", numeric: true, disablePadding: false, label: "EPC" },
  { id: "sn", numeric: true, disablePadding: false, label: "Serial Number" },
  { id: "creator", numeric: false, disablePadding: false, label: "Creator" },
  { id: "creation_date", numeric: false, disablePadding: false, label: "Creation Date" }
];
const createAssetRow = (id, name, brand, model, epc, sn, creator, creation_date) => {
  return { id, name, brand, model, epc, sn, creator, creation_date };
};
const collections = {
  settingsLists: {
    id: 'idAsset',
    modal: 'openAssetModal',
    name: 'employees'
  }
};

const AssetTable = ({ onAssetFinderSubmit, onDeleteAssetAssigned, assetRows = [] }) => {
  const [control, setControl] = useState({
    idAsset: null,
    openAssetModal: false
  });

  const tableActions = (collectionName) => {
    const collection = collections[collectionName];
    return {
      onAdd() {
        setControl({ ...control, [collection.id]: null, [collection.modal]: true })
      },
      onDelete(id) {
        onDeleteAssetAssigned(...id);
      }
    }
  };

  return (
    <div style={{ width: '100%', marginTop: '-50px' }}>
      <ModalAssetFinder
        showModal={control.openAssetModal}
        setShowModal={(onOff) => setControl({ ...control, openAssetModal: onOff })}
        // reloadTable={() => loadInitData('settingsLists')}
        id={control.idAsset}
        onAssetFinderSubmit={onAssetFinderSubmit}
      />
      <TableComponent
        title={'Asset Children'}
        headRows={assetsHeadRows}
        rows={assetRows}
        // onEdit={tableActions('settingsLists').onEdit}
        onAdd={tableActions('settingsLists').onAdd}
        onDelete={tableActions('settingsLists').onDelete}
        // onSelect={tableActions('settingsLists').onSelect}
        noEdit={true}
      />
    </div>
  )
}

export default AssetTable;
