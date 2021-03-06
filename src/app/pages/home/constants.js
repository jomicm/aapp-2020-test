import React from 'react';
import { toAbsoluteUrl } from "../../../_metronic";
import {
  SingleLine,
  MultiLine,
  Date,
  DateTime,
  DropDown,
  RadioButtons,
  Checkboxes,
  FileUpload,
  Currency,
  Percentage,
  Email,
  Decimal,
  URL,
  Image,
  DecisionBox,
  RichText,
  Formula,
  DateFormula
} from './Components/CustomFields/CustomFieldsPreview';

export const modules = [
  { key: 'dashboard', name: 'Dashboard' },
  { key: 'assets', name: 'Assets' },
  { key: 'processes', name: 'Processes' },
  { key: 'users', name: 'Users' },
  { key: 'employees', name: 'Employees' },
  { key: 'locations', name: 'Locations' },
  { key: 'reports', name: 'Reports' },
  { key: 'settings', name: 'Settings' },
];

export const modulesCatalogues = {
  assets: {
    list: 'assets',
    references: 'references',
    categories: 'categories'
  },
  user: {
    list: 'userList',
    references: 'userReferences'
  },
  employees: {
    list: 'employees',
    references: 'employeeReferences'
  },
  locations: {
    list: 'locationsList',
    profiles: 'locations'
  }
}

export const collections = {
  messages: 'messages',
  notifications: 'notifications',
  processApprovals: 'processApprovals',
  assets:{
    module: 'assets',
    name: 'assets'
  },
  references:{
    module: 'assets',
    name: 'references',
  },
  categories: {
    module: 'assets',
    name: 'categories'
  },
  user: {
    module: 'users',
    name: 'user'
  },
  userProfiles: {
    module: 'users',
    name: 'userProfiles'
  },
  employees: {
    module: 'employees',
    name: 'employees'
  },
  employeeProfiles: {
    module: 'employees',
    name: 'employeeProfiles'
  },
  policies: {
    module: 'employees',
    name: 'employeeProfiles'
  },
  processes: {
    module: 'processes',
    name: 'processes'
  },
  processStages: {
    module: 'processes',
    name: 'processStages'
  },
  locations: {
    module: 'locations',
    name: 'locations'
  },
  reports: {
    module: 'reports',
    name: 'reports'
  }
};

export const CustomFieldsPreview = (props) => {
  const customFieldsPreviewObj = {
    singleLine: <SingleLine {...props} />,
    multiLine: <MultiLine {...props} />,
    date: <Date {...props} />,
    dateTime: <DateTime {...props} />,
    dropDown: <DropDown {...props} />,
    radioButtons: <RadioButtons {...props} />,
    checkboxes: <Checkboxes {...props} />,
    fileUpload: <FileUpload {...props} />,
    currency: <Currency {...props} />,
    percentage: <Percentage {...props} />,
    email: <Email{...props} />,
    decimal: <Decimal {...props} />,
    url: <URL {...props} />,
    imageUpload: <Image {...props} />,
    decisionBox: <DecisionBox {...props} />,
    richText:  <RichText {...props} />,
    formula:  <Formula {...props} />,
    dateFormula:  <DateFormula {...props} />,
  };
  return customFieldsPreviewObj[props.type];
};

export const allBaseFields = {
  userList: {
    id: { realId: '_id', validationId: 'id', compLabel: 'ID' },
    userProfile: {
      component: 'dropSelect',
      compLabel: 'Profile Selected',
      validationId: 'selectedUserProfile',
    },
    name: { validationId: 'name', component: 'textField', compLabel: 'Name' },
    lastName: { validationId: 'lastName', component: 'textField', compLabel: 'Last Name' },
    email: { validationId: 'email', component: 'textField', compLabel: 'Email' },
    password: { validationId: 'password', component: 'textField', compLabel: 'Password' },
    boss: {
      component: 'dropSelect',
      compLabel: 'Boss',
      style: { marginTop: '15px' },
      validationId: 'selectedBoss'
    },
    groups: {
      component: 'dropSelect',
      compLabel: 'Groups',
      style: { marginTop: '15px' },
      validationId: 'groups'
    },
  },
  userReferences: {
    id: { realId: '_id', validationId: 'id', compLabel: 'ID' },
    name: { validationId: 'name', component: 'textField', compLabel: 'Name' },
  },
  categories: {
    id: { realId: '_id', validationId: 'id', compLabel: 'ID' },
    name: { validationId: 'name', component: 'textField', compLabel: 'Name' },
    depreciation: { validationId: 'depreciation', component: 'textField', compLabel: 'Depreciation' },
  },
  references: {
    id: { realId: '_id', validationId: 'id', compLabel: 'ID' },
    category: { validationId: 'selectedProfile', component: 'dropSelect', compLabel: 'Category' },
    name: { validationId: 'name', component: 'textField', compLabel: 'Name' },
    brand: { validationId: 'brand', component: 'textField', compLabel: 'Brand' },
    model: { validationId: 'model', component: 'textField', compLabel: 'Model' },
    price: { validationId: 'price', component: 'textField', compLabel: 'Price' },
    depreciation: { validationId: 'depreciation', component: 'textField', compLabel: 'Depreciation' },
  },
  employees: {
    id: { realId: '_id', validationId: 'id', compLabel: 'ID' },
    employeeProfile: { validationId: 'employeeProfile', component: 'dropSelect', compLabel: 'Employee Profile' },
    name: { validationId: 'name', component: 'textField', compLabel: 'Name' },
    lastName: { validationId: 'lastName', component: 'textField', compLabel: 'Last Name' },
    email: { validationId: 'email', component: 'textField', compLabel: 'Email' },
    employee_id: { validationId: 'employee_id', component: 'textField', compLabel: 'Employee Id' },
    responsibilityLayout: { validationId: 'layoutSelected', component: 'dropSelect', compLabel: 'Responsibility Layout' },
  },
  employeeReferences: {
    id: { realId: '_id', validationId: 'id', compLabel: 'ID' },
    name: { validationId: 'name', component: 'textField', compLabel: 'Name' },
  },
  locations: {
    id: { realId: '_id', validationId: 'id', compLabel: 'ID' },
    selectedLevel: { validationId: 'selectedLevel', component: 'textField', compLabel: 'Level' },
    name: { validationId: 'name', component: 'textField', compLabel: 'Name' },
  },
  locationsList: {
    id: { realId: '_id', validationId: 'id', compLabel: 'ID' },
    name: { validationId: 'name', component: 'textField', compLabel: 'Name' },
    fileExt: { validationId: 'fileExt', compLabel: 'Layout' },
    imageInfo: { validationId: 'imageInfo', compLabel: 'Pin Layout' },
    mapInfo: { validationId: 'mapInfo', compLabel: 'Pin Map' },
  },
  assets1: {
    id: { realId: '_id', validationId: 'id', compLabel: 'ID' },
    name: { validationId: 'name', component: 'textField', compLabel: 'Name' },
    brand: { validationId: 'brand', component: 'textField', compLabel: 'Brand' },
    model: { validationId: 'model', component: 'textField', compLabel: 'Model' },
    category: { validationId: 'category', component: 'textField', compLabel: 'Category' },
    status: { validationId: 'status', component: 'textField', compLabel: 'Status' },
    serialNumber: { validationId: 'serialNumber', component: 'textField', compLabel: 'Serial Number' },
    parent: { validationId: 'parent', component: 'textField', compLabel: 'Parent' },
    responsible: { validationId: 'responsible', component: 'textField', compLabel: 'Responsible' },
    notes: { validationId: 'notes', component: 'textField', compLabel: 'Notes' },
    quantity: { validationId: 'quantity', component: 'textField', compLabel: 'Quantity' },
  },
  assets2: {
    purchaseDate: { validationId: 'purchaseDate', component: 'textField', compLabel: 'Purchase Date' },
    purchasePrice: { validationId: 'purchasePrice', component: 'textField', compLabel: 'Purchase Price' },
    price: { validationId: 'price', component: 'textField', compLabel: 'Price' },
    totalPrice: { validationId: 'totalPrice', component: 'textField', compLabel: 'Total Price' },
    EPC: { validationId: 'EPC', component: 'textField', compLabel: 'EPC' },
    location: { validationId: 'location', component: 'textField', compLabel: 'Location' },
    locationPath: { validationId: 'locationPath', component: 'textField', compLabel: 'Location Path' },
    creator: { validationId: 'creator', component: 'textField', compLabel: 'Creator' },
    creationDate: { validationId: 'creationDate', component: 'textField', compLabel: 'Creation Date' },
    labelingUser: { validationId: 'labelingUser', component: 'textField', compLabel: 'Labeling User' },
    labelingDate: { validationId: 'labelingDate', component: 'textField', compLabel: 'Labeling Date' },
  },
  assetEdition: {
    purchaseDate: { validationId: 'purchaseDate', component: 'textField', compLabel: 'Purchase Date' },
    purchasePrice: { validationId: 'purchasePrice', component: 'textField', compLabel: 'Purchase Price' },
    price: { validationId: 'price', component: 'textField', compLabel: 'Price' },
    serialNumber: { validationId: 'serialNumber', component: 'textField', compLabel: 'Serial Number' },
    notes: { validationId: 'notes', component: 'textField', compLabel: 'Notes' },
    quantity: { validationId: 'quantity', component: 'textField', compLabel: 'Quantity' },
  },
};

export const languages = [
  {
    lang: "en",
    name: "English",
    flag: toAbsoluteUrl("/media/flags/226-united-states.svg")
  },
  {
    lang: "es",
    name: "Spanish",
    flag: toAbsoluteUrl("/media/flags/252-mexico.svg")
  },
];
