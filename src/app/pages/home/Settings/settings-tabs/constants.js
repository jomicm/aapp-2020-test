export const defaultValues = {
  languages: [{ id: 'none', name: 'None' }, { id: 'en', name: 'English' }, { id: 'es', name: 'Español' }],
  modules: [
    { index: 0, id: 'none', name: 'None' }, 
    { index: 1, id: 'user', name: 'Users' },
    { index: 2, id: 'employees', name: 'Employees' },
    { index: 3, id: 'locations', name: 'Locations' },
    { index: 4, id: 'categories', name: 'Categories' },
    { index: 5, id: 'references', name: 'References' },
    { index: 6, id: 'assets', name: 'Assets' },
    { index: 7, id: 'processes', name: 'Processes' },
  ],
  selectedLanguage: '',
  selectedModule: '',
  fields: {
    user: {
      userProfile: { id: 'userProfile', name: 'User Profile', caption: '', mandatory: false, regex: '' },
      name: { id: 'name', name: 'Name', caption: '', mandatory: false, regex: '' },
      lastName: { id: 'lastName', name: 'Last Name', caption: '', mandatory: false, regex: '' },
      email: { id: 'email', name: 'Email', caption: '', mandatory: false, regex: '' },
      password: { id: 'password', name: 'Password', caption: '', mandatory: false, regex: '' },
      boss: { id: 'boss', name: 'Boss', caption: '', mandatory: false, regex: '' },
      groups: { id: 'groups', name: 'Groups', caption: '', mandatory: false, regex: '' }
    },
    employees: {
      employeeProfile: { id: 'employeeProfile', name: 'Employee Profile', caption: '', mandatory: false, regex: '' },
      name: { id: 'name', name: 'Name', caption: '', mandatory: false, regex: '' },
      lastName: { id: 'lastName', name: 'Last Name', caption: '', mandatory: false, regex: '' },
      email: { id: 'email', name: 'Email', caption: '', mandatory: false, regex: '' },
      responsibilityLayout: { id: 'responsibilityLayout', name: 'Responsibility Layout', caption: '', mandatory: false, regex: '' }
    },
    locations: {
      selectedLevel: { id: 'selectedLevel', name: 'Selected Level', caption: '', mandatory: false, regex: '' },
      name: { id: 'name', name: 'Name', caption: '', mandatory: false, regex: '' }
    },
    categories: {
      name: { id: 'name', name: 'Name', caption: '', mandatory: false, regex: '' },
      depreciation: { id: 'depreciation', name: 'Depreciation', caption: '', mandatory: false, regex: '' }
    },
    references: {
      category: { id: 'category', name: 'Category', caption: '', mandatory: false, regex: '' },
      name: { id: 'name', name: 'Name', caption: '', mandatory: false, regex: '' },
      brand: { id: 'brand', name: 'Brand', caption: '', mandatory: false, regex: '' },
      model: { id: 'model', name: 'Model', caption: '', mandatory: false, regex: '' },
      price: { id: 'price', name: 'Price', caption: '', mandatory: false, regex: '' },
      depreciation: { id: 'depreciation', name: 'Depreciation', caption: '', mandatory: false, regex: '' }
    },
    assets: {
      name: { id: 'name', name: 'Name', caption: '', mandatory: false, regex: '' },
      brand: { id: 'brand', name: 'Brand', caption: '', mandatory: false, regex: '' },
      model: { id: 'model', name: 'Model', caption: '', mandatory: false, regex: '' },
      category: { id: 'category', name: 'Category', caption: '', mandatory: false, regex: '' },
      status: { id: 'status', name: 'Status', caption: '', mandatory: false, regex: '' },
      serialNumber: { id: 'serialNumber', name: 'Serial Number', caption: '', mandatory: false, regex: '' },
      responsible: { id: 'responsible', name: 'Responsible', caption: '', mandatory: false, regex: '' },
      notes: { id: 'notes', name: 'Notes', caption: '', mandatory: false, regex: '' },
      quantity: { id: 'quantity', name: 'Quantity', caption: '', mandatory: false, regex: '' },
      purchaseDate: { id: 'purchaseDate', name: 'Purchase Date', caption: '', mandatory: false, regex: '' },
      purchasePrice: { id: 'purchasePrice', name: 'Purchase Price', caption: '', mandatory: false, regex: '' },
      price: { id: 'price', name: 'Price', caption: '', mandatory: false, regex: '' },
      totalPrice: { id: 'totalPrice', name: 'Total Price', caption: '', mandatory: false, regex: '' },
      EPC: { id: 'EPC', name: 'EPC', caption: '', mandatory: false, regex: '' },
      locations: { id: 'locations', name: 'Locations', caption: '', mandatory: false, regex: '' },
      creator: { id: 'creator', name: 'Creator', caption: '', mandatory: false, regex: '' },
      creationDate: { id: 'creationDate', name: 'Creation Date', caption: '', mandatory: false, regex: '' },
      labelingUser: { id: 'labelingUser', name: 'Labeling User', caption: '', mandatory: false, regex: '' },
      labelingDate: { id: 'labelingDate', name: 'Labeling Date', caption: '', mandatory: false, regex: '' }
    },
    processes: {
      name: { id: 'name', name: 'Name', caption: '', mandatory: false, regex: '' },
      allStages: { id: 'allStages', name: 'All Stages', caption: '', mandatory: false, regex: '' },
      processFlow: { id: 'processFlow', name: 'Process Flow', caption: '', mandatory: false, regex: '' },
      goBack: { id: 'goBack', name: 'Go Back', caption: '', mandatory: false, regex: '' },
      toStage: { id: 'toStage', name: 'To Stage', caption: '', mandatory: false, regex: '' },
      notificationUsers: { id: 'notificationUsers', name: 'Notification Users', caption: '', mandatory: false, regex: '' }
    }
  }
};

export const settings = [
  { id: 'languages', name: 'Language', selected: 'selectedLanguage' },
  { id: 'modules', name: 'Modules', selected: 'selectedModule' }
];
