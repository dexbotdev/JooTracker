import React, { useState } from 'react'
import { connect } from 'react-redux'
import PerfectScrollbar from 'react-perfect-scrollbar'
import { Switch, Select, Tooltip, Slider, Input, Collapse, Radio } from 'antd'
import classNames from 'classnames'
import { debounce } from 'lodash'
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

const Sidebar = ({
  dispatch,
  isSidebarOpen,
  isMenuCollapsed,
  isMenuShadow,
  isMenuUnfixed,
  menuLayoutType,
  menuColor,
  authPagesColor,
  isAuthTopbar,
  isTopbarFixed,
  isTopbarSeparated,
  isContentMaxWidth,
  isAppMaxWidth,
  isGrayBackground,
  isGrayTopbar,
  isCardShadow,
  isSquaredBorders,
  isBorderless,
  routerAnimation,
  locale,
  theme,
  primaryColor,
  leftMenuWidth,
  logo,
  layoutMenu,
  flyoutMenuColor,
  layoutBreadcrumbs,
  layoutFooter,
  layoutTopbar,
  version,
  flyoutMenuType,
  isPreselectedOpen,
}) => {
  const [defaultColor] = useState('#4b7cf3')

  const changeSetting = (setting, value) => {
    dispatch({
      type: 'settings/CHANGE_SETTING',
      payload: {
        setting,
        value,
      },
    })
  }

  const toggleSettings = (e) => {
    e.preventDefault()
    dispatch({
      type: 'settings/CHANGE_SETTING',
      payload: {
        setting: 'isSidebarOpen',
        value: !isSidebarOpen,
      },
    })
  }

  const togglePreselectedThemes = (e) => {
    e.preventDefault()
    dispatch({
      type: 'settings/CHANGE_SETTING',
      payload: {
        setting: 'isPreselectedOpen',
        value: !isPreselectedOpen,
      },
    })
  }

  const selectColor = debounce((color) => {
    dispatch({
      type: 'settings/CHANGE_SETTING',
      payload: {
        setting: 'primaryColor',
        value: color,
      },
    })
  }, 200)

  const resetColor = () => {
    dispatch({
      type: 'settings/CHANGE_SETTING',
      payload: {
        setting: 'primaryColor',
        value: defaultColor,
      },
    })
  }

  const colorPickerHandler = (e, setting, value) => {
    e.preventDefault()
    dispatch({
      type: 'settings/CHANGE_SETTING',
      payload: {
        setting,
        value,
      },
    })
  }

  const ColorPicker = ({ colors, value, setting }) => {
    return (
      <div className="clearfix">
        {colors.map((item) => {
          return (
            <a
              href="#"
              key={item}
              onClick={(e) => colorPickerHandler(e, setting, item)}
              className={classNames(`${style.vb__sidebar__select__item}`, {
                [style.vb__sidebar__select__item__active]: value === item,
                [style.vb__sidebar__select__item__black]: item === 'dark',
                [style.vb__sidebar__select__item__white]: item === 'white',
                [style.vb__sidebar__select__item__gray]: item === 'gray',
                [style.vb__sidebar__select__item__blue]: item === 'blue',
                [style.vb__sidebar__select__item__img]: item === 'image',
              })}
            />
          )
        })}
      </div>
    )
  }

  return (
    <div>
      <div className="vb__utils__sidebar__buttons">
        <Tooltip title="Switch Dark / Light Theme" placement="left">
          <a
            role="button"
            tabIndex="0"
            onKeyPress={() => changeSetting('theme', theme === 'default' ? 'dark' : 'default')}
            onClick={() => changeSetting('theme', theme === 'default' ? 'dark' : 'default')}
            className="vb__utils__sidebar__button"
          >
            {theme === 'default' && <i className="fe fe-moon" />}
            {theme !== 'default' && <i className="fe fe-sun" />}
          </a>
        </Tooltip>
      </div>
    </div>
  )
}

export default connect(mapStateToProps)(Sidebar)
