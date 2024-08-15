// ** React Imports
import { useState } from 'react'

// ** Type Import
import { HorizontalNavItemsType } from 'src/@core/layouts/types'

const ServerSideNavItems = () => {
  // ** State
  const [menuItems] = useState<HorizontalNavItemsType>([])

  return { menuItems }
}

export default ServerSideNavItems
