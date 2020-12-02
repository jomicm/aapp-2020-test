import { isEmpty, difference } from 'lodash';

const _types = {
  simpleType: ['singleLine', 'multiLine', 'date', 'dateTime'],
  dropType: ['dropDown'],
  radioType: ['radioButtons'],
  checkType: ['checkboxes'],
  fileType: ['fileUpload']
};

const _generalFields = {
  user: ['name', 'lastName', 'email', 'boss', 'groups'],
  employees: [],
  locations: ['name'],
  categories: ['name', 'depreciation'],
  references: ['name', 'brand', 'model', 'price'],
  assets: ['name', 'brand', 'model', 'category', 'status', 'serial', 'responsible', 'notes', 'quantity', 'purchase_date', 'purchase_price', 'price', 'total_price','EPC', 'location', 'creator', 'creation_date', 'labeling_user', 'labeling_date'],
  depreciation: []
};

export const formatCollection = (collectionName, completeFields) => {
  let customFieldNames = {};
  const rowToObjects = completeFields.map(row => {
    // Extract General Fields
    const filteredGeneralFields =  extractGeneralField(collectionName, row);
    // Extract Custom Fields with formatting
    let filteredCustomFields = {};
    const { customFieldsTab } = row;
    Object.values(customFieldsTab).forEach(tab => {
      const allCustomFields = [ ...tab.left, ...tab.right ];
      allCustomFields.map(field => {
        filteredCustomFields = { ...filteredCustomFields, ...extractCustomField(field) };
      });
    });
    customFieldNames = { ...customFieldNames, ...filteredCustomFields };
    return { ...filteredGeneralFields, ...filteredCustomFields };
  });
  // Make all rows homogenous filling missing custom fields
  const normalizedRows = normalizeRows(rowToObjects, customFieldNames);
  // Convert rows to table presentation (Array for headers and every data row in an array)
  return convertRowsToDataTable(normalizedRows);
};

const extractGeneralField = (collectionName, row) => {
  let filteredGeneralFields = {};
  _generalFields[collectionName].map(field => {
    filteredGeneralFields = { ...filteredGeneralFields, [field]: row[field] || '' }
  });
  return filteredGeneralFields;
};

const extractCustomField = field => {
  const { content, values } = field;
  if (isEmpty(values)) {
    return { [content]: '' };
  } 
  console.log('values:', values)
  const { fieldName, initialValue, options, selectedItem } = values;
  if (_types['simpleType'].includes(content)) {
    return { [fieldName]: initialValue || '' };
  } else if(_types['dropType'].includes(content)) {
    return { [fieldName]: options[selectedItem] || '' };
  } else if(_types['radioType'].includes(content)) {
    if (!selectedItem) return { [fieldName]: '' };
    const selected = selectedItem.slice(-1);
    return { [fieldName]: options[Number(selected) - 1] || '' };
  } else if(_types['checkType'].includes(content)) {
    const res  = options.reduce((acu, cur, ix) => values[`check${ix}`] ? acu += `${cur}|` : acu, '');
    return { [fieldName]: res.length ? res.slice(0, -1) : '' };
  } else if(_types['fileType'].includes(content)) {
    return { [fieldName]: initialValue ? `path>${initialValue}` : '' };
  }
};

const normalizeRows = (rows, allCustomFields) => {
  return rows.map(row => {
    const missingCustomFields = difference(Object.keys(allCustomFields), Object.keys(row))
    let missingCustomFieldsFormatted =  {};
    missingCustomFields.forEach(field => missingCustomFieldsFormatted = { ...missingCustomFieldsFormatted, [field]: '' } );
    return { ...row, ...missingCustomFieldsFormatted };
  });
};

const convertRowsToDataTable = rows => {
  if (!rows || !Array.isArray(rows) || !rows.length)  return { header: [], tableRows: [] };
  const header = Object.keys(rows[0]);
  const tableRows = rows.map(row => header.map(head => row[head]));
  return { header, tableRows }
};
