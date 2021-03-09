export const modules = [
  { key:'dashboard', name: 'Dashboard' },
  { key:'assets', name: 'Assets' },
  { key:'processes', name: 'Processes' },
  { key:'users', name: 'Users' },
  { key:'employees', name: 'Employees' },
  { key:'locations', name: 'Locations' },
  { key:'reports', name: 'Reports' },
  { key:'settings', name: 'Settings' },
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
  }
};
