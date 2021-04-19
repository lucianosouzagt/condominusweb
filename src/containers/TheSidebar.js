import React from 'react'
import {
  CCreateElement,
  CSidebar,
  CSidebarNav,
  CSidebarNavTitle,
  CSidebarMinimizer,
  CSidebarNavItem,
  CRow,
  CImg,
} from '@coreui/react'

// sidebar nav config
import navigation from './_nav'

const TheSidebar = () => {

  return (
    <CSidebar>
      <CSidebarNav>
        <CRow className="m-3 bg-white rounded">
          <CImg src="homelogo-2.png" className="mt-2 mb-2 ml-auto mr-auto" width="80%"/>
        </CRow>
        <CCreateElement
          items={navigation}
          components={{
            CSidebarNavItem,
            CSidebarNavTitle
          }}
        />
      </CSidebarNav>
      <CSidebarMinimizer className="c-d-md-down-none"/>
    </CSidebar>
  )
}

export default React.memo(TheSidebar)
