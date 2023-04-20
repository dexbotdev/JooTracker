import React, { useState, useEffect } from 'react'
import { Link, withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { reduce } from 'lodash'
import styles from './style.module.scss'
import Status from 'layouts/Main/MenuSimply/Status'

const mapStateToProps = ({ menu }) => ({
  menuData: menu.menuData,
})

const Breadcrumbs2 = (props) => {
  const [breadcrumbs, setBreadcrumbs] = useState([])
  const {
    location: { pathname },
    menuData = [],
  } = props
  useEffect(() => {
    setBreadcrumbs(() => getBreadcrumbs())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, menuData])

  const getPath = (data, url, parents = []) => {
    const items = reduce(
      data,
      (result, entry) => {
        if (result.length) {
          return result
        }
        if (entry.url === url) {
          return [entry].concat(parents)
        }
        if (entry.children) {
          const nested = getPath(entry.children, url, [entry].concat(parents))
          return (result || []).concat(nested.filter((e) => !!e))
        }
        return result
      },
      [],
    )
    return items.length > 0 ? items : [false]
  }

  const toUpper = (str) => str.replace(/\b\w/g, (l) => l.toUpperCase())

  const getBreadcrumbs = () => {
    const [activeMenuItem] = getPath(menuData, pathname)
    const pathUrl = pathname.split('/')

    if (activeMenuItem && pathUrl.length > 1) {
      return pathUrl.map((item, index) => {
        if (index === 0) {
          return null
        }

        if (index === pathUrl.length - 1) {
          return (
            <li className={styles.breadcrumb} key={item}>
              <strong className={`${styles.breadcrumbLink} ${styles.breadcrumbLink__current}`}>
                {toUpper(activeMenuItem.title)}
              </strong>
            </li>
          )
        }
        return (
          <li className={styles.breadcrumb} key={item}>
            <span>{toUpper(item)}</span>
          </li>
        )
      })
    }

    return (
      <li className={styles.breadcrumb}>
        <strong className={styles.current}>{activeMenuItem.title}</strong>
      </li>
    )
  }

  return (
    <div className={styles.subbar}>
      <div className={`${styles.amount} mr-auto text-nowrap d-none d-md-block`}>
        <Status />
      </div>
      <Link
        type="button"
        className="btn btn-info  btn-sm btn-with-addon  mr-3 ml-auto d-none d-sm-flex"
        to="/addgrid"
      >
        <span className="btn-addon">
          <i className="btn-addon-icon fe fe-plus-square" />
        </span>
        New GRID
      </Link>

      <a className="btn btn-sm btn-light mr-2">
        <i className="fe fe-unlock" />
      </a>
    </div>
  )
}

export default withRouter(connect(mapStateToProps)(Breadcrumbs2))
