import React, { lazy, Suspense } from 'react'
import { Route, Redirect, Switch } from 'react-router-dom'
import { ConnectedRouter } from 'connected-react-router'
import { CSSTransition, SwitchTransition } from 'react-transition-group'
import { connect } from 'react-redux'

import Layout from 'layouts'

const routes = [  
  {
    path: '/managetokens',
    Component: lazy(() => import('pages/tokenmanagement')),
    exact: true,
  },
  {
    path: '/managewallets',
    Component: lazy(() => import('pages/managewallet')),
    exact: true,
  },
  {
    path: '/managepairs',
    Component: lazy(() => import('pages/managepairs')),
    exact: true,
  },
  {
    path: '/addgrid',
    Component: lazy(() => import('pages/addgrid')),
    exact: true,
  },
  {
    path: '/rungrids',
    Component: lazy(() => import('pages/rungrids')),
    exact: true,
  },
  {
    path: '/archivedgrids',
    Component: lazy(() => import('pages/archivedgrids')),
    exact: true,
  },
  {
    path: '/myportfolio',
    Component: lazy(() => import('pages/walletbalances')),
    exact: true,
  },
  {
    path: '/license',
    Component: lazy(() => import('pages/license')),
    exact: true,
  },
  // VB:REPLACE-END:ROUTER-CONFIG myportfolio
  {
    path: '/auth/login',
    Component: lazy(() => import('pages/auth/login')),
    exact: true,
  },
  {
    path: '/auth/forgot-password',
    Component: lazy(() => import('pages/auth/forgot-password')),
    exact: true,
  },
  {
    path: '/auth/register',
    Component: lazy(() => import('pages/auth/register')),
    exact: true,
  },
  {
    path: '/auth/lockscreen',
    Component: lazy(() => import('pages/auth/lockscreen')),
    exact: true,
  },
  {
    path: '/auth/404',
    Component: lazy(() => import('pages/auth/404')),
    exact: true,
  },
  {
    path: '/auth/500',
    Component: lazy(() => import('pages/auth/500')),
    exact: true,
  },
]

const mapStateToProps = ({ settings }) => ({
  routerAnimation: settings.routerAnimation,
})

const Router = ({ history, routerAnimation }) => {

  
  return (
    <ConnectedRouter history={history}>
      <Layout>
        <Route
          render={(state) => {
            const { location } = state
            return (
              <SwitchTransition>
                <CSSTransition
                  key={location.pathname}
                  appear
                  classNames={routerAnimation}
                  timeout={routerAnimation === 'none' ? 0 : 300}
                >
                  <Switch location={location}>
                    {/* VB:REPLACE-NEXT-LINE:ROUTER-REDIRECT */}
                    <Route exact path="/" render={() => <Redirect to="/managetokens" />} />
                    {routes.map(({ path, Component, exact }) => (
                      <Route
                        path={path}
                        key={path}
                        exact={exact}
                        render={() => {
                          return (
                            <div className={routerAnimation}>
                              <Suspense fallback={null}>
                                <Component />
                              </Suspense>
                            </div>
                          )
                        }}
                      />
                    ))}
                    <Redirect to="/auth/404" />
                  </Switch>
                </CSSTransition>
              </SwitchTransition>
            )
          }}
        />
      </Layout>
    </ConnectedRouter>
  )
}

export default connect(mapStateToProps)(Router)
