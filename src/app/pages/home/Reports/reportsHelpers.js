import { isEmpty, difference } from 'lodash';

const _types = {
  simpleType: ['singleLine', 'multiLine', 'date', 'dateTime', 'currency', 'percentage', 'email', 'decimal', 'url', 'formula'],
  dropType: ['dropDown'],
  radioType: ['radioButtons'],
  checkType: ['checkboxes'],
  fileType: ['fileUpload'],
  imageType: ['imageUpload']
};

const _generalFields = {
  user: ['_id', 'name', 'lastName', 'email', 'boss', 'groups'],
  employees: ['_id', 'name', 'lastName', 'email'],
  locations: ['_id', 'name', 'level'],
  categories: ['_id', 'name', 'depreciation'],
  references: ['_id', 'name', 'brand', 'model', 'price'],
  assets: ['_id', 'name', 'brand', 'model', 'category', 'status', 'serial', 'responsible', 'notes', 'quantity', 'purchase_date', 'purchase_price', 'price', 'total_price', 'EPC', 'location', 'creator', 'labeling_user', 'labeling_date', 'creationDate', 'updateDate',],
  depreciation: [],
  processLive: ['folio', 'name', 'stages', 'type', 'dueDate', 'creator', 'creationDate']
};

export const baseFieldsPerModule = {
  assets: ['assets1', 'assets2'],
  references: 'references',
  categories: 'categories',
  user: 'userList',
  userProfiles: 'userReferences',
  employees: 'employees',
  employeeProfiles: 'employeeReferences',
  locations: 'locations',
  locationsReal: 'locationsList'
}

export const formatCollection = (collectionName, completeFields) => {
  let customFieldNames = {};
  const rowToObjects = completeFields.map(row => {
    // Extract General Fields
    const filteredGeneralFields = extractGeneralField(collectionName, row);
    // Extract Custom Fields with formatting
    let filteredCustomFields = {};
    const { customFieldsTab } = row;
    Object.values(customFieldsTab).forEach(tab => {
      const allCustomFields = [...tab.left, ...tab.right];
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

export const formatData = (collectionName, completeFields) => {
  let customFieldNames = {};
  const rowToObjects = completeFields.map(row => {
    // Extract General Fields
    const filteredGeneralFields = extractGeneralField(collectionName, row);
    // Extract Custom Fields with formatting
    let filteredCustomFields = {};
    const { customFieldsTab } = row;
    Object.values(customFieldsTab || {}).forEach(tab => {
      const allCustomFields = [...tab.left, ...tab.right];
      allCustomFields.map(field => {
        filteredCustomFields = { ...filteredCustomFields, ...extractCustomField(field) };
      });
    });
    customFieldNames = { ...customFieldNames, ...filteredCustomFields };
    return { ...filteredGeneralFields, ...filteredCustomFields };
  });
  // Make all rows homogenous filling missing custom field
  const normalizedRows = normalizeRows(rowToObjects, customFieldNames);
  // Convert rows to table presentation (Array for headers and every data row in an array)
  return convertRowsToDataTableObjects(normalizedRows);
};

export const extractGeneralField = (collectionName, row) => {
  let filteredGeneralFields = {};
  _generalFields[collectionName].map((field) => {
    let currentField = field;
    let objectValue;

    if (collectionName === 'assets' && field === 'category') {
      objectValue = row['category'] ? row['category'].label || '' : '';
    }

    if (collectionName === 'user' && (field === 'boss' || field === 'groups')) {
      if (field === 'boss') {
        objectValue = row['selectedBoss'] ? `${row['selectedBoss'].name} ${row['selectedBoss'].lastName}` : '';
      }

      if (field === 'groups') {
        objectValue = (row[field] || []).map(({ name }) => name).join(', ') || '';
      }
    }
    const label = typeof row[currentField] === 'object' ? '' : row[currentField] || '';
    filteredGeneralFields = { ...filteredGeneralFields, [currentField]: objectValue ? objectValue : label };
  });
  return filteredGeneralFields;
};

export const extractCustomFieldValues = field => {
  const { content, values, id } = field;
  if (isEmpty(values)) {
    return { [content]: '' };
  }
  const { fieldName, initialValue, options, selectedItem, fileName, selectedOptions } = values;
  if (_types['simpleType'].includes(content)) {
    return { [id]: initialValue || '' };
  } else if (_types['dropType'].includes(content)) {
    return { [id]: options[selectedItem] || '' };
  } else if (_types['radioType'].includes(content)) {
    if (!selectedItem) return { [fieldName]: '' };
    const selected = selectedItem.slice(-1);
    return { [id]: options[Number(selected) - 1] || '' };
  } else if (_types['checkType'].includes(content)) {
    return { [id]: selectedOptions ? selectedOptions.join(', ') : '' };
  } else if (_types['fileType'].includes(content)) {
    return { [id]: fileName ? `${fileName}` : '' };
  } else if (_types['imageType'].includes(content)) {
    return { [id]: fileName ? `${fileName}.${initialValue}` : '' };
  }
};

export const extractCustomField = field => {
  const { content, values } = field;
  if (isEmpty(values)) {
    return { [content]: '' };
  }
  const { fieldName, initialValue, options, selectedItem, fileName } = values;
  if (_types['simpleType'].includes(content)) {
    return { [fieldName]: initialValue || '' };
  } else if (_types['dropType'].includes(content)) {
    return { [fieldName]: options[selectedItem] || '' };
  } else if (_types['radioType'].includes(content)) {
    if (!selectedItem) return { [fieldName]: '' };
    const selected = selectedItem.slice(-1);
    return { [fieldName]: options[Number(selected) - 1] || '' };
  } else if (_types['checkType'].includes(content)) {
    const res = options.reduce((acu, cur, ix) => values[`check${ix}`] ? acu += `${cur}|` : acu, '');
    return { [fieldName]: res.length ? res.slice(0, -1) : '' };
  } else if (_types['fileType'].includes(content)) {
    return { [fieldName]: fileName ? `${fileName}` : '' };
  } else if (_types['imageType'].includes(content)) {
    return { [fieldName]: fileName ? `${fileName}.${initialValue}` : '' };
  }
};

export const extractCustomFieldId = (field) => {
  const { content, values, id } = field;
  const { fieldName } = values;
  let res;
  Object.entries(_types).forEach(([key, value]) => {
    if (value.includes(content)) {
      res = { [id]: fieldName || content };
    }
  });

  return res;
};

export const normalizeRows = (rows, allCustomFields) => {
  return rows.map(row => {
    const missingCustomFields = difference(Object.keys(allCustomFields), Object.keys(row))
    let missingCustomFieldsFormatted = {};
    missingCustomFields.forEach(field => missingCustomFieldsFormatted = { ...missingCustomFieldsFormatted, [field]: '' });
    return { ...row, ...missingCustomFieldsFormatted };
  });
};

const convertRowsToDataTable = rows => {
  if (!rows || !Array.isArray(rows) || !rows.length) return { header: [], tableRows: [] };
  const header = Object.keys(rows[0]);
  const tableRows = rows.map(row => header.map(head => row[head]));
  return { header, tableRows }
};

export const convertRowsToDataTableObjects = rows => {
  if (!rows || !Array.isArray(rows) || !rows.length) return { header: [], headerObject: [], tableRows: [] };
  const header = Object.keys(rows[0]);
  // eslint-disable-next-line no-labels
  const headerObject = header.map((e) => ({ id: e, label: e, }));
  const tableRows = rows.map(row => header.map(head => row[head]));
  return { header, tableRows, headerObject, rows }
};

export const getGeneralFieldsHeaders = collection => {
  if (!collection) return [];
  const headerObject = _generalFields[collection].map((e) => ({ id: e, label: e }))
  return headerObject;
}

export const getUserPermittedModules = (user) => {
  const modulePermissions = ['assets', 'users', 'employees', 'locations'];
  let modules = [];
  modulePermissions.forEach((permission) => {
    if (Object.keys(user.profilePermissions).includes(permission)) {
      if (permission === 'assets') {
        modules.push({ id: 'assets', label: 'Assets' }, { id: 'references', label: 'References' }, { id: 'categories', label: 'Categories' });
      }
      if (permission === 'users') {
        modules.push({ id: 'user', label: 'Users' }, { id: 'userProfiles', label: 'User Profiles' });
      }
      if (permission === 'employees') {
        modules.push({ id: 'employees', label: 'Employees' }, { id: 'employeeProfiles', label: 'Employee Profiles' });
      }
      if (permission === 'locations') {
        modules.push({ id: 'locationsReal', label: 'Locations' }, { id: 'locations', label: 'Location Profiles' });
      }
    }
  });

  return modules;
};
