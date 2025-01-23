import {
  mdiAccountCircle,
  mdiMonitor,
  mdiGithub,
  mdiLock,
  mdiAlertCircle,
  mdiSquareEditOutline,
  mdiTable,
  mdiViewList,
  mdiTelevisionGuide,
  mdiResponsive,
  mdiAccountStar,
  mdiLightbulbOn,
  mdiAccountGroup,
  mdiHelpBoxMultiple
} from '@mdi/js'

export default [
  {
    to: '/admin',
    icon: mdiMonitor,
    label: 'Админка'
  },
  {
    to: '/admin/actors',
    icon: mdiAccountStar,
    label: 'Актеры'
  },
  {
    to: '/admin/quiz',
    icon: mdiHelpBoxMultiple,
    label: 'Квиз'
  },
  {
    to: '/admin/intuition',
    icon: mdiLightbulbOn,
    label: 'КиноИнтуиция'
  },
  {
    to: '/admin/cast',
    icon: mdiAccountGroup,
    label: 'Каст'
  },
  {
    to: '/admin/Dashboard',
    icon: mdiMonitor,
    label: 'Dashboard'
  },
  {
    to: '/admin/TablesView',
    label: 'Tables',
    icon: mdiTable
  },
  {
    to: '/admin/FormsView',
    label: 'Forms',
    icon: mdiSquareEditOutline
  },
  {
    to: '/admin/UiView',
    label: 'UI',
    icon: mdiTelevisionGuide
  },
  {
    to: '/admin/ResponsiveView',
    label: 'Responsive',
    icon: mdiResponsive
  },
  {
    to: '/login',
    label: 'Login',
    icon: mdiLock
  },
  {
    to: '/admin/ErrorView',
    label: 'Error',
    icon: mdiAlertCircle
  },
  {
    label: 'Dropdown',
    icon: mdiViewList,
    menu: [
      {
        label: 'Item One'
      },
      {
        label: 'Item Two'
      }
    ]
  },
]
