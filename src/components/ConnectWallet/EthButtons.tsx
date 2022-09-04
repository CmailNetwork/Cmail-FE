import React, { useState } from 'react'
import MetamaskPng from '../../assets/images/metamask.png'
import detectEthereumProvider from '@metamask/detect-provider'
import { ConnectButton, generateIcon } from './ConnectButton'
import {
  generateMetamaskDeepLink,
  isRejectedMessage,
} from '../../utils/wallet'
import {useDialog} from "../../hooks/useDialog";
import {
  ConnectorName,
  metaMask,
  metaMaskStore,
  useAccount,
  useLastConectorName,
  useSetLastConnector,
} from "../../hooks/connectors";
import {useSetLoginInfo} from "../../hooks/useLoginInfo";
import {useDidMount} from "../../hooks/useDidMount";

export interface EthButtonsProps {
  onClose: () => void
}

export interface EthButtonProps {
  onClose: () => void
  isEthEnvironment: boolean
  icon: React.ReactNode
  href: string | undefined
  text: string
}

export const EthButton: React.FC<EthButtonProps> = ({
  onClose,
  isEthEnvironment,
  icon,
  href,
  text,
}) => {
  const [isConnectingMetamask, setIsConnectingMetamask] = useState(false)
  const dialog = useDialog()
  const setLastConnector = useSetLastConnector()
  const connectorName = useLastConectorName()
  const isConnected = !!useAccount()
  const setLoginInfo = useSetLoginInfo()
  const logout = () => setLoginInfo(null)

  return (
    <ConnectButton
      isDisabled={
        isConnectingMetamask ||
        (connectorName === ConnectorName.MetaMask && isConnected)
      }
      isLoading={isConnectingMetamask}
      text={text}
      icon={icon}
      href={href}
      isConnected={connectorName === ConnectorName.MetaMask && isConnected}
      onClick={async () => {
        if (!isEthEnvironment) {
          return
        }
        setIsConnectingMetamask(true)
        try {
          await metaMask.activate()
          const { error } = metaMaskStore.getState()
          if (error != null) {
            if (!isRejectedMessage(error)) {
              onClose?.()
              await dialog({
                type: 'warning',
                title: 'Notice',
                description:  error?.message,
              })
            }
          } else {
            logout()
            setLastConnector(ConnectorName.MetaMask)
            onClose?.()
          }
        } catch (error: any) {
          //
        } finally {
          setIsConnectingMetamask(false)
        }
      }}
    />
  )
}

export const EthButtons: React.FC<EthButtonsProps> = ({ onClose }) => {
  const [isEthEnvironment, setIsEthEnvironment] = useState(false)
  useDidMount(() => {
    detectEthereumProvider({ mustBeMetaMask: true }).then((res) => {
      if (res) {
        setIsEthEnvironment(true)
      }
    })
  })

  return (
    <>
      <EthButton
          isEthEnvironment={isEthEnvironment}
          icon={generateIcon(MetamaskPng)}
          href={isEthEnvironment ? undefined : generateMetamaskDeepLink()}
          text={'MetaMask'}
          onClose={onClose}
      />
    </>
  )
}
