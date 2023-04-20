import React from 'react'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'
import { Link } from 'react-router-dom'
import { Switch } from 'antd'
import { connect } from 'react-redux'

import BotManagement from './BotManagement'
import Actions from './Actions'
import UserMenu from './UserMenu'
import style from './style.module.scss'

const mapStateToProps = ({ settings }) => ({
  isSidebarOpen: settings.isSidebarOpen,
  isMenuCollapsed: settings.isMenuCollapsed,
  isMenuShadow: settings.isMenuShadow,
  isMenuUnfixed: settings.isMenuUnfixed,
  menuLayoutType: settings.menuLayoutType,
  menuColor: settings.menuColor,
  authPagesColor: settings.authPagesColor,
  isAuthTopbar: settings.isAuthTopbar,
  isTopbarFixed: settings.isTopbarFixed,
  isTopbarSeparated: settings.isTopbarSeparated,
  isContentMaxWidth: settings.isContentMaxWidth,
  isAppMaxWidth: settings.isAppMaxWidth,
  isGrayBackground: settings.isGrayBackground,
  isGrayTopbar: settings.isGrayTopbar,
  isCardShadow: settings.isCardShadow,
  isSquaredBorders: settings.isSquaredBorders,
  isBorderless: settings.isBorderless,
  routerAnimation: settings.routerAnimation,
  locale: settings.locale,
  theme: settings.theme,
  primaryColor: settings.primaryColor,
  leftMenuWidth: settings.leftMenuWidth,
  logo: settings.logo,
  layoutMenu: settings.layoutMenu,
  flyoutMenuColor: settings.flyoutMenuColor,
  layoutBreadcrumbs: settings.layoutBreadcrumbs,
  layoutFooter: settings.layoutFooter,
  layoutTopbar: settings.layoutTopbar,
  version: settings.version,
  flyoutMenuType: settings.flyoutMenuType,
  isPreselectedOpen: settings.isPreselectedOpen,
})
const TopBar = ({ dispatch, theme }) => {

  const changeSetting = (setting, value) => {
    dispatch({
      type: 'settings/CHANGE_SETTING',
      payload: {
        setting,
        value,
      },
    })
  }

  return (
    <div className={style.topbar}>
      <div className="mr-auto d-xl-block d-none">
        <BotManagement />
      </div>
      <div className={style.topbar}>
        <UserMenu />
      </div>
    </div>
  )
}

export default connect(mapStateToProps)(TopBar)
