export const NAV_ITEMS_BY_ROLE = {
  SYSTEM_ADMIN: [
    { to: '/admin/dashboard', label: 'Dashboard', end: true },
    { to: '/admin/stores', label: 'Stores' },
    { to: '/admin/users', label: 'Users' },
    { to: '/admin/stores/new', label: 'Add Store' },
    { to: '/admin/users/new', label: 'Add User' },
    { to: '/change-password', label: 'Change Password' }
  ],
  NORMAL_USER: [
    { to: '/user/stores', label: 'Stores', end: true },
    { to: '/change-password', label: 'Change Password' }
  ],
  STORE_OWNER: [
    { to: '/owner/dashboard', label: 'Dashboard', end: true },
    { to: '/change-password', label: 'Change Password' }
  ]
};
