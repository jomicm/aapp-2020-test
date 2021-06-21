import React, { useState } from 'react';
import TableComponent from '../../Components/TableComponent';
import ModalAssetFinder from '../modals/ModalAssetFinder';

const assetsHeadRows = [
  { id: 'name', numeric: false, disablePadding: false, label: 'Name' },
  { id: 'brand', numeric: true, disablePadding: false, label: 'Brand' },
  { id: 'model', numeric: true, disablePadding: false, label: 'Model' },
  { id: 'EPC', numeric: true, disablePadding: false, label: 'EPC' },
  { id: 'serial', numeric: true, disablePadding: false, label: 'Serial Number' }
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

const AssetTable = ({ assetRows = [], onAssetFinderSubmit, onDeleteAssetAssigned, userLocations }) => {
  const [control, setControl] = useState({
    idAsset: null,
    openAssetModal: false
  });

  const tableActions = (collectionName) => {
    const collection = collections[collectionName];
    return {
      onAdd() {
        setControl({ ...control, [collection.id]: null, [collection.modal]: true });
      },
      onDelete(id) {
        onDeleteAssetAssigned([...id]);
      }
    };
  };

  return (
    <div style={{ width: '100%', marginTop: '-50px' }}>
      <ModalAssetFinder
        id={control.idAsset}
        onAssetFinderSubmit={onAssetFinderSubmit}
        setShowModal={(onOff) => setControl({ ...control, openAssetModal: onOff })}
        showModal={control.openAssetModal}
        userLocations={userLocations}
      />
      <TableComponent
        headRows={assetsHeadRows}
        noEdit={true}
        onAdd={tableActions('settingsLists').onAdd}
        onDelete={tableActions('settingsLists').onDelete}
        rows={assetRows}
        title={'Asset Children'}
      />
    </div>
  )
}

export default AssetTable;
