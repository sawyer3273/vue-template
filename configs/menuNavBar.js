import {
  mdiAccount,
  mdiAccountGroup,
  mdiLogout,
} from '@mdi/js'

export default [
  
  {
    style: 'min-w-40',
    isCurrentUser: true,
    menu: [
      {
        icon: mdiAccount,
        label: 'Моя карта',
        myMap: true
      },
      {
        isDivider: true
      },
    ]
  },
  {
    icon: mdiLogout,
    label: 'Выход',
    isDesktopNoLabel: true,
    isLogout: true
  }
]
