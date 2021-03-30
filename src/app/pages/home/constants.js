import { toAbsoluteUrl } from "../../../_metronic";

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

export const allBaseFields = {
  userList: {
    userProfile: {
      component: 'dropSelect',
      compLabel: 'Profile Selected',
      validationId: 'selectedUserProfile',
    },
    name: { validationId: 'name', component: 'textField', compLabel: 'Name' },
    lastName: { validationId: 'lastName', component: 'textField', compLabel: 'Last Name' },
    email: { validationId: 'email', component: 'textField', compLabel: 'Email' },
    password: { validationId: 'password', component: 'textField', compLabel: 'Password' },
    // Groups will be added in a future ticket
    // userGroups: {
    //   component: 'dropSelect',
    //   compLabel: 'Groups',
    //   style: { marginTop: '15px' },
    //   validationId: 'selectedUserGroups'
    // },
    boss: {
      component: 'dropSelect',
      compLabel: 'Boss',
      style: { marginTop: '15px' },
      validationId: 'selectedBoss'
    }
  },
  userReferences: {
    name: { validationId: 'name', component: 'textField', compLabel: 'Name' },
  },
  categories: {
    name: { validationId: 'name', component: 'textField', compLabel: 'Name' },
    depreciation: { validationId: 'depreciation', component: 'textField', compLabel: 'Depreciation' },
  },
  references: {
    category: { validationId: 'category', component: 'dropSelect', compLabel: 'Category' },
    name: { validationId: 'name', component: 'textField', compLabel: 'Name' },
    brand: { validationId: 'brand', component: 'textField', compLabel: 'Brand' },
    model: { validationId: 'model', component: 'textField', compLabel: 'Model' },
    price: { validationId: 'price', component: 'textField', compLabel: 'Price' },
    depreciation: { validationId: 'depreciation', component: 'textField', compLabel: 'Depreciation' },
  },
  employees: {
    employeeProfile: { validationId: 'employeeProfile', component: 'dropSelect', compLabel: 'Employee Profile' },
    name: { validationId: 'name', component: 'textField', compLabel: 'Name' },
    lastName: { validationId: 'lastName', component: 'textField', compLabel: 'Last Name' },
    email: { validationId: 'email', component: 'textField', compLabel: 'Email' },
    responsibilityLayout: { validationId: 'responsibilityLayout', component: 'dropSelect', compLabel: 'Responsability Layout' },
  },
  employeeReferences: {
    name: { validationId: 'name', component: 'textField', compLabel: 'Name' },
  },
  locations: {
    selectedLevel: { validationId: 'selectedLevel', component: 'textField', compLabel: 'Level' },
    name: { validationId: 'name', component: 'textField', compLabel: 'Name' },
  },
  assets1: {
    name: { validationId: 'name', component: 'textField', compLabel: 'Name' },
    brand: { validationId: 'brand', component: 'textField', compLabel: 'Brand' },
    model: { validationId: 'model', component: 'textField', compLabel: 'Model' },
    category: { validationId: 'category', component: 'dropSelect', compLabel: 'Category' },
    status: { validationId: 'status', component: 'textField', compLabel: 'Status' },
    serialNumber: { validationId: 'serialNumber', component: 'textField', compLabel: 'Serial Number' },
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
    creator: { validationId: 'creator', component: 'textField', compLabel: 'Creator' },
    creationDate: { validationId: 'creationDate', component: 'textField', compLabel: 'Creation Date' },
    labelingUser: { validationId: 'labelingUser', component: 'textField', compLabel: 'Labeling User' },
    labelingDate: { validationId: 'labelingDate', component: 'textField', compLabel: 'Labeling Date' },
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
