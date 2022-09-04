import { atomWithStorage, useAtomValue, useUpdateAtom } from 'jotai/utils'

export const COOKIE_KEY = '__CMAIL__'

export interface LoginInfo {
  address: string
  jwt: string
  expires: string
}

const loginInfoAtom = atomWithStorage<LoginInfo | null>(COOKIE_KEY, null)

export const useLoginInfo = () => useAtomValue(loginInfoAtom)

export const useSetLoginInfo = () => useUpdateAtom(loginInfoAtom)

export const useJWT = () => {
  const loginInfo = useLoginInfo()
  return loginInfo?.jwt
}

export const useLoginAccount = () => {
  const loginInfo = useLoginInfo()
  return loginInfo?.address
}
