import { useMemo } from 'react'
import { API } from '../api'
import {useAccount} from "./connectors";
import {useJWT, useSetLoginInfo} from "./useLoginInfo";

export const useAPI = () => {
  const account = useAccount()
  const jwt = useJWT()
  const setLoginInfo = useSetLoginInfo()
  const clearCookie = () => {
    setLoginInfo(null)
  }
  return useMemo(() => new API(account, jwt, clearCookie), [account, jwt])
}
