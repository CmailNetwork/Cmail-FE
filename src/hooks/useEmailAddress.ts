import { useMemo } from 'react'
import { MAIL_SERVER_URL } from '../constants'
import {useAccount} from "./connectors";
import {truncateMiddle} from "../utils";

export const useEmailAddress = () => {
  const account = useAccount()

  return useMemo(
    () =>
      account
        ? `${truncateMiddle(
            `${account}`,
            6,
            4
          ).toLowerCase()}@${MAIL_SERVER_URL}`
        : '',
    [account]
  )
}
