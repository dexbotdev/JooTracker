import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Menu, Dropdown } from 'antd'
import { Link } from 'react-router-dom'
import styles from './style.module.scss'

const BotManagement = () => {
  const menu = (
    <Menu selectable={false}>
      <Menu.ItemGroup title="Main Settings">
        <Menu.Item>
          <Link to="/managewallets">Wallet Management</Link>
        </Menu.Item>
      </Menu.ItemGroup>
      <Menu.ItemGroup title="Learning">
        <Menu.Item>
          <Link to="/">Documentation</Link>
        </Menu.Item>
      </Menu.ItemGroup>
      <Menu.Divider />
      <Menu.Item>
        <Link to="/">
          <i className="fe fe-settings mr-2" /> License
        </Link>
      </Menu.Item>
    </Menu>
  )
  return (
    <Dropdown overlay={menu} trigger={['click']} placement="bottomLeft">
      <div className={styles.dropdown}>
        <i className={`${styles.icon} fe fe-database`} />
        <span className="d-none d-xl-inline">
          <FormattedMessage id="topBar.BotManagement" />
        </span>
      </div>
    </Dropdown>
  )
}

export default BotManagement
