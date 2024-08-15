// ** Type import
import { VerticalNavItemsType } from 'src/@core/layouts/types'

const navigation = (): VerticalNavItemsType => {
  return [
    {
      title: 'Home',
      path: '/home',
      icon: 'tabler:smart-home'
    },
    {
      title: 'Developers',
      path: '/Developers',
      icon: 'tabler:database'
    },
    {
      title: 'Create Developers',
      path: '/createTable',
      icon: 'tabler:database-plus'
    },
    {
      title: 'profile',
      path: '/profile',
      icon: 'tabler:user'
    },
    {
      path: '/acl',
      action: 'read',
      subject: 'acl-page',
      title: 'Access Control',
      icon: 'tabler:shield'
    }
  ]
}

export default navigation
