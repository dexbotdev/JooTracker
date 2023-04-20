import React from 'react'
import { FormattedMessage } from 'react-intl'
import { connect } from 'react-redux'
import { UserOutlined } from '@ant-design/icons'
import { Menu, Dropdown, Avatar, Button } from 'antd'
import styles from './style.module.scss'
import { Link } from 'react-router-dom'

const mapStateToProps = ({ user, settings: { menuColor } }) => ({ user, menuColor })

const ProfileMenu = ({ dispatch, user, menuColor }) => {
  const logout = (e) => {
    e.preventDefault()
    dispatch({
      type: 'user/LOGOUT',
    })
  }

  const menu = (
    <Menu selectable={false}>
      <Menu.Item>
        <strong>
          <FormattedMessage id="topBar.profileMenu.hello" />, {user.name || 'Anonymous'}
        </strong>
        <div>
          <strong className="mr-1">
            <FormattedMessage id="topBar.profileMenu.billingPlan" />:{' '}
          </strong>
          LIFETIME / MONTHLY
        </div>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item>
        <Link to="/managewallets">
          <i className={`${styles.menuIcon} fe fe-user`} />
          My Wallets
        </Link>
      </Menu.Item>

      <Menu.Divider />
      <Menu.Item>
        <a href="#" onClick={logout}>
          <i className={`${styles.menuIcon} fe fe-log-out`} />
          <FormattedMessage id="topBar.profileMenu.logout" />
        </a>
      </Menu.Item>
    </Menu>
  )
  return (
    <Dropdown overlay={menu} trigger={['click']}>
      <div className={styles.dropdown}>
        <Avatar
          className={menuColor === 'dark' ? styles.avatarDark : styles.avatar}
          shape="square"
          size="large"
          icon={<UserOutlined />}
        />
      </div>
    </Dropdown>
  )
}

export default connect(mapStateToProps)(ProfileMenu)
