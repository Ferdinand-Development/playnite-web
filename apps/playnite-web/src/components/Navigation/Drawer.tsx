import { Box, useMediaQuery, useTheme } from '@mui/material'
import { useLocation } from '@remix-run/react'
import { motion } from 'framer-motion'
import { FC, PropsWithChildren, ReactNode } from 'react'
import MobileDrawerNavigation from './MobileDrawerNavigation'

const Drawer: FC<
  PropsWithChildren<{
    title?: ReactNode | undefined
    secondaryMenu?: ReactNode | undefined
  }>
> = ({ children, secondaryMenu, title }) => {
  const theme = useTheme()
  const location = useLocation()
  const shouldUseMobileDrawer = useMediaQuery(theme.breakpoints.down('lg'))

  return shouldUseMobileDrawer ? (
    <MobileDrawerNavigation
      title={
        <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
          {title}
          <Box sx={{ alignSelf: 'flex-end' }}>{secondaryMenu}</Box>
        </Box>
      }
    >
      <motion.div
        key={location.pathname}
        initial={{ x: '-10%', opacity: 0 }}
        animate={{ x: '0', opacity: 1 }}
        exit={{ y: '-10%', opacity: 0 }}
        transition={{ duration: 0.3 }}
        style={{}}
      >
        <Box
          component={'main'}
          sx={(theme) => ({
            flexGrow: 1,
            margin: '0 auto',
            [theme.breakpoints.up('xs')]: {
              padding: '0',
            },
            [theme.breakpoints.up('sm')]: {
              padding: '0',
            },
            [theme.breakpoints.up('md')]: {
              padding: '0',
            },
            [theme.breakpoints.up('lg')]: {
              padding: '48px 0 48px 88px',
            },
            [theme.breakpoints.up('xl')]: {
              padding: '48px 0 48px 88px',
            },
            [theme.breakpoints.down('xs')]: {
              padding: '0',
            },
          })}
        >
          {children}
        </Box>
      </motion.div>
    </MobileDrawerNavigation>
  ) : (
    <motion.div
      key={location.pathname}
      initial={{ x: '-10%', opacity: 0 }}
      animate={{ x: '0', opacity: 1 }}
      exit={{ y: '-10%', opacity: 0 }}
      transition={{ duration: 0.3 }}
      style={{}}
    >
      <Box
        component={'main'}
        sx={(theme) => ({
          flexGrow: 1,
          margin: '0 auto',
          [theme.breakpoints.up('xs')]: {
            padding: '0',
          },
          [theme.breakpoints.up('sm')]: {
            padding: '0',
          },
          [theme.breakpoints.up('md')]: {
            padding: '0',
          },
          [theme.breakpoints.up('lg')]: {
            padding: '48px 0 48px 88px',
          },
          [theme.breakpoints.up('xl')]: {
            padding: '48px 0 48px 88px',
          },
          [theme.breakpoints.down('xs')]: {
            padding: '0',
          },
        })}
      >
        <Box
          sx={{
            display: 'flex',
            position: 'absolute',
            top: '24px',
            right: '24px',
            zIndex: 1500,
          }}
        >
          {secondaryMenu}
        </Box>
        {children}
      </Box>
    </motion.div>
  )
}

export default Drawer
