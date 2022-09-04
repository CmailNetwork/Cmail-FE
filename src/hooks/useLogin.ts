import dayjs from 'dayjs'
import { useCallback, useEffect, useMemo } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { atom, useAtomValue } from 'jotai'
import { atomWithStorage, useUpdateAtom } from 'jotai/utils'
import { clear as clearIndexDBStore } from 'idb-keyval'
import { useAPI } from './useAPI'
import { RoutePath } from '../route/path'
import {useLoginAccount, useLoginInfo, useSetLoginInfo} from "./useLoginInfo";
import {
  ConnectorName,
  metaMaskStore, useAccount, useAccountIsActivating,
  useConnector, useConnectWalletDialog,
  useLastConectorName,
  useSetLastConnector,
} from "./connectors";
import {notificationLogsStore} from "../utils/notification";

export const useIsLoginExpired = () => {
  const loginInfo = useLoginInfo()
  return useMemo(
    () => (loginInfo ? dayjs(loginInfo?.expires).isAfter(dayjs()) : false),
    [loginInfo]
  )
}

export const useIsAuthenticated = () => {
  const loginInfo = useLoginInfo()
  const isLoginExpired = useIsLoginExpired()
  return useMemo(() => {
    if (loginInfo?.expires) {
      return isLoginExpired
    }
    return !!loginInfo?.jwt
  }, [loginInfo, isLoginExpired])
}

export const useLogin = () => {
  const api = useAPI()
  const setLoginInfo = useSetLoginInfo()
  return useCallback(
    async (message: string, sig: string) => {
      const data = await api.login(message, sig)
      const now = dayjs()
      const loginInfo = {
        address: api.getAddress(),
        jwt: data.token,
        expires: now.add(14, 'day').toISOString(),
      }
      setLoginInfo(loginInfo)
      return loginInfo
    },
    [api]
  )
}

export const isAuthModalOpenAtom = atom(false)

export const useOpenAuthModal = () => {
  const setAuthModalOpen = useUpdateAtom(isAuthModalOpenAtom)
  return () => setAuthModalOpen(true)
}

export const useCloseAuthModal = () => {
  const setAuthModalOpen = useUpdateAtom(isAuthModalOpenAtom)
  return () => setAuthModalOpen(false)
}

export const useIsAuthModalOpen = () => useAtomValue(isAuthModalOpenAtom)

export const allowWithoutAuthPaths = new Set<string>([
  RoutePath.Home,
  RoutePath.WhiteList,
  RoutePath.Testing,
])

export const useCurrentWalletStore = () => {
  const walletName = useLastConectorName()
  if (walletName === ConnectorName.MetaMask) {
    return metaMaskStore
  }
  return metaMaskStore
}

export const userPropertiesAtom = atomWithStorage<Record<string, any> | null>(
  'mail3_user_properties',
  null
)

export const getNotificationPermission = () =>
  // eslint-disable-next-line
  Notification?.permission || 'default'

export const getIsEnabledNotification = (
  permission: NotificationPermission = getNotificationPermission()
): { notification_state: 'enabled' | 'disabled' } => ({
  notification_state: permission === 'granted' ? 'enabled' : 'disabled',
})

export const useInitUserProperties = () => {
  const isAuth = useIsAuthenticated()
  const setUserProperties = useUpdateAtom(userPropertiesAtom)
  const setLoginInfo = useSetLoginInfo()

  useEffect(() => {
    if (!isAuth) {
      setUserProperties(null)
      setLoginInfo(null)
    }
  }, [isAuth])
}

export const useLogout = () => {
  const connector = useConnector()
  const setUserInfo = useSetLoginInfo()
  const setLastConnector = useSetLastConnector()
  return useCallback(async () => {
    await connector?.deactivate()
    await clearIndexDBStore(notificationLogsStore)
    setUserInfo(null)
    setLastConnector(undefined)
  }, [connector])
}

export const useWalletChange = () => {
  const closeAuthModal = useCloseAuthModal()
  const setLoginInfo = useSetLoginInfo()
  const { onOpen: openConnectWalletModal } = useConnectWalletDialog()
  const loginAccount = useLoginAccount()
  const isConnecting = useAccountIsActivating()
  const store = useCurrentWalletStore()
  const logout = useLogout()
  const handleAccountChanged = useCallback(
      // @ts-ignore
    ([acc]) => {
      const [account] = store.getState().accounts ?? []

      if (acc === undefined) {
        return
      }
      if (isConnecting || !account) {
        return
      }
      if (acc?.toLowerCase() === account?.toLowerCase()) {
        return
      }
      if (
        loginAccount &&
        account &&
        loginAccount.toLowerCase() !== account?.toLowerCase()
      ) {
        return
      }
    },
    [isConnecting, loginAccount]
  )
  const handleDisconnect = useCallback(() => {
    setLoginInfo(null)
    closeAuthModal()
    openConnectWalletModal()
  }, [])

  useEffect(() => {
    const w = window as any
    const { ethereum } = w

    if (ethereum && ethereum.on) {
      ethereum.on('disconnect', handleDisconnect)
      ethereum.on('accountsChanged', handleAccountChanged)
    }
    return () => {
      if (ethereum && ethereum.off) {
        ethereum.off('disconnect', handleDisconnect)
        ethereum.off('accountsChanged', handleAccountChanged)
      }
    }
  }, [])
}

export const useAuth = () => {
  const isAuth = useIsAuthenticated()
  const account = useAccount()
  const openAuthModal = useOpenAuthModal()
  const closeAuthModal = useCloseAuthModal()
  const location = useLocation()
  const navi = useNavigate()
  useEffect(() => {
    if (!isAuth && account) {
      openAuthModal()
    }
    if (!account) {
      closeAuthModal()
    }
  }, [isAuth, account])

  useEffect(() => {
    if (!isAuth && !allowWithoutAuthPaths.has(location.pathname)) {
      navi(RoutePath.Home, {
        replace: true,
      })
    }
  }, [isAuth, location.pathname])

  useInitUserProperties()
  useWalletChange()
}

export const useAuthModalOnBack = () => {
  const connector = useConnector()
  const { onOpen } = useConnectWalletDialog()
  const closeAuthModal = useCloseAuthModal()
  return useCallback(async () => {
    await connector?.deactivate()
    closeAuthModal()
    onOpen()
  }, [connector])
}
