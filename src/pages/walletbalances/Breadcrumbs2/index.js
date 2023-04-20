import React, { useState, useEffect } from 'react'
import { Link, withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { reduce } from 'lodash'
import styles from './style.module.scss'

const mapStateToProps = ({ menu }) => ({
  menuData: menu.menuData,
})

const Breadcrumbs2 = (props) => {
  const [breadcrumbs, setBreadcrumbs] = useState([])
  const { usdTotals } = props
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
      <div className={`${styles.amount} mr-3 ml-auto d-none d-sm-flex`}>
        <p className={styles.amountText}>
          Simulation Balance
          <span className={styles.amountValue}>100000 USDT</span>
        </p>
        <div className={styles.amountGraph}>
          <i className={styles.amountGraphItem} style={{ height: '80%' }} />
          <i className={styles.amountGraphItem} style={{ height: '50%' }} />
          <i className={styles.amountGraphItem} style={{ height: '70%' }} />
          <i className={styles.amountGraphItem} style={{ height: '60%' }} />
          <i className={styles.amountGraphItem} style={{ height: '50%' }} />
          <i className={styles.amountGraphItem} style={{ height: '65%' }} />
        </div>
      </div>
      <div className={`${styles.amount}`}>
        <p className={styles.amountText}>
          Balance in USDT
          <span className={styles.amountValue}>{usdTotals} USDT</span>
        </p>
        <div className={styles.amountGraph}>
          <i className={styles.amountGraphItem} style={{ height: '80%' }} />
          <i className={styles.amountGraphItem} style={{ height: '50%' }} />
          <i className={styles.amountGraphItem} style={{ height: '70%' }} />
          <i className={styles.amountGraphItem} style={{ height: '60%' }} />
          <i className={styles.amountGraphItem} style={{ height: '50%' }} />
          <i className={styles.amountGraphItem} style={{ height: '65%' }} />
        </div>
      </div>
    </div>
  )
}

export default withRouter(connect(mapStateToProps)(Breadcrumbs2))
