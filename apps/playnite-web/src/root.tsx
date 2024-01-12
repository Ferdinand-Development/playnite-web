import { Global, css } from '@emotion/react'
import { ThemeProvider } from '@mui/material'
import { configureStore } from '@reduxjs/toolkit'
import { LoaderFunctionArgs, json } from '@remix-run/node'
import {
  Links,
  LiveReload,
  Meta,
  MetaFunction,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from '@remix-run/react'
import { FC } from 'react'
import { Provider } from 'react-redux'
import { createHead } from 'remix-island'
import { authenticator } from './api/auth/auth.server'
import { reducer } from './api/client/state'
import { signedIn, signedOut } from './api/client/state/authSlice'
import muiTheme from './muiTheme'

const meta: MetaFunction = () => {
  return [
    { title: 'Playnite Web' },
    {
      property: 'og:title',
      content: 'Playnite Web',
    },
    {
      name: 'description',
      content: 'Share your Playnite library with your friends!',
    },
    {
      name: 'viewport',
      content: 'initial-scale=1, width=device-width',
    },
  ]
}

async function loader({ request }: LoaderFunctionArgs) {
  const user = await authenticator.isAuthenticated(request)

  return json({
    user,
  })
}

const Head = createHead(() => (
  <>
    <link rel="icon" href="data:image/x-icon;base64,AA" />
    <Meta />
    <Links />
  </>
))

const globalStyles = (
  <Global
    styles={css`
      body {
        background-color: rgb(17, 17, 17);
        box-sizing: border-box;
        color: rgb(255, 255, 255);
        font-size: 16px;
        line-height: 1;
        margin: 0;
        padding: 0;
        font-family: Lato, sans-serif;
      }
    `}
  />
)

const App: FC<{}> = () => {
  const { user } = useLoaderData<{
    user?: any
  }>()

  const store = configureStore({ reducer })
  if (!!user) {
    store.dispatch(signedIn({ payload: null }))
  } else {
    store.dispatch(signedOut({ payload: null }))
  }

  return (
    <>
      <Head />
      {globalStyles}
      <ThemeProvider theme={muiTheme()}>
        <Provider store={store}>
          <Outlet />
        </Provider>
      </ThemeProvider>
      <ScrollRestoration />
      <Scripts />
      <LiveReload />
    </>
  )
}

export default App
export { Head, loader, meta }
